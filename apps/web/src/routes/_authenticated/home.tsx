import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'
import { HomePageHeader } from '../../components/HomePageHeader'
import { useInView } from 'react-intersection-observer'
import { PostCard } from '../../components/PostCard'
import { fetchFeedPosts } from '../../services/posts'
import { PostCardSkeleton } from '../../components/PostSkeleton'

export type ActiveTab = "all" | "following"

const postsQueryOptions = (token: string, activeTab: ActiveTab) =>
  infiniteQueryOptions({
    queryKey: ['feed-posts', { token, activeTab }],
    queryFn: ({ pageParam: nextCursor }) => fetchFeedPosts({ token, activeTab, nextCursor }),
    initialPageParam: "",
    getNextPageParam: ({ nextCursor }) => nextCursor
  })

export const Route = createFileRoute('/_authenticated/home')({
  validateSearch: (search: Record<string, unknown>): { users?: "following" } => {
    return {
      users: search.users === 'following' ? 'following' : undefined,
    }
  },
  loaderDeps: ({ search }) => ({ users: search.users }),
  loader: async ({ context, deps }) => {
    const activeTab = deps.users ?? "all"
    const { queryClient, user } = context;
    const { token } = user;
    await queryClient.ensureInfiniteQueryData(postsQueryOptions(token, activeTab))
    return { token }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const activeTab = Route.useSearch().users ?? "all"
  const { token } = Route.useLoaderData()
  const { ref, inView } = useInView();
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(postsQueryOptions(token, activeTab))

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <div className="flex flex-col">
      <HomePageHeader tab={activeTab} />
      <div>
        {
          data?.pages.flatMap(page => page.posts).map(post => (
            <PostCard key={post.id} post={post} />
          ))
        }
        {
          hasNextPage ?
            <>
              <PostCardSkeleton ref={ref} />
              <PostCardSkeleton />
              <PostCardSkeleton />
            </>
            :
            <p className="py-6 text-center text-xs text-(--app-muted)">
              End of list
            </p>
        }
      </div>
    </div>
  )
}