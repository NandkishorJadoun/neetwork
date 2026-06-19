import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { infiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query'
import { useAuth } from '../../context/auth'
import { HomePageHeader } from '../../components/HomePageHeader'
import { useInView } from 'react-intersection-observer'
import { PostCard } from '../../components/PostCard'
import { fetchFeedPosts } from '../../services/posts'

const postsQueryOptions = (token: string | undefined, posts: "following" | undefined) =>
  infiniteQueryOptions({
    queryKey: ['feed-posts', { token, posts }],
    queryFn: ({ pageParam: nextCursor }) => fetchFeedPosts({ token, posts, nextCursor }),
    initialPageParam: "",
    getNextPageParam: ({ nextCursor }) => nextCursor
  })

export const Route = createFileRoute('/_authenticated/home')({
  validateSearch: (search: Record<string, unknown>): { posts?: "following" } => {
    return {
      posts: search.posts === 'following' ? 'following' : undefined,
    }
  },
  loaderDeps: ({ search }) => ({ posts: search.posts }),
  loader: async ({ context, deps }) => {
    const { posts } = deps
    const token = context.auth.user?.token
    const { queryClient } = context;

    await queryClient.ensureInfiniteQueryData(postsQueryOptions(token, posts))
  },
  component: RouteComponent,
})

function RouteComponent() {
  const activeTab = Route.useSearch().posts
  const { user } = useAuth()
  const { ref, inView } = useInView();
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery(postsQueryOptions(user?.token, activeTab))

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
            <p ref={ref} className="py-6 text-center text-xs text-(--app-muted)">
              Loading...
            </p>
            :
            <p className="py-6 text-center text-xs text-(--app-muted)">
              End of list
            </p>
        }
      </div>
    </div>
  )
}