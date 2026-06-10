import { createFileRoute, Link } from '@tanstack/react-router'
import type { Post } from '../../types'
import { PostCard } from '../../components/PostCard'

type PostSearch = {
  posts?: 'following'
}

export const Route = createFileRoute('/_authenticated/home')({
  validateSearch: (search: Record<string, unknown>): PostSearch => {
    return {
      posts: search.posts === 'following' ? 'following' : undefined,
    }
  },
  loaderDeps: ({ search }) => ({ posts: search.posts }),
  loader: async ({ context, deps }) => {
    const { posts } = deps
    const token = context.auth.user?.token
    const url = `${import.meta.env.VITE_API_URL}/posts${posts ? '/following' : ''}`

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return await res.json()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const activeTab = Route.useSearch().posts
  const { posts }: { posts: Post[] } = Route.useLoaderData()

  const tabBase =
    'px-4 py-2 text-sm font-medium text-(--app-muted) transition-colors'
  const tabActive = 'text-(--app-text) border-b-2 border-(--app-accent)'

  return (
    <div className="flex flex-col">
      <div className="sticky top-14 border-b border-(--app-border) bg-(--app-bg)/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-md justify-center gap-6">
          <Link
            to="/home"
            className={`${tabBase} ${!activeTab ? tabActive : ''}`}
          >
            All
          </Link>
          <Link
            to="/home"
            search={{ posts: 'following' }}
            className={`${tabBase} ${activeTab ? tabActive : ''}`}
          >
            Following
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}

        <p className="py-6 text-center text-xs text-(--app-muted)">
          End of list
        </p>
      </div>
    </div>
  )
}