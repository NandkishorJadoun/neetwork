import { createFileRoute, Link } from '@tanstack/react-router'
import type { Post } from '../../types'
import { PostCard } from '../../components/PostCard'


type PostSearch = {
  posts?: 'following'
}

export const Route = createFileRoute('/_layout/home')({
  validateSearch: (search: Record<string, unknown>): PostSearch => {
    return {
      posts: search.posts === 'following' ? 'following' : undefined,
    }
  },
  loaderDeps: ({ search }) => ({ posts: search.posts }),
  loader: async ({ context, deps }) => {
    const { posts } = deps;
    const token = context.auth.user?.token
    const url = `${import.meta.env.VITE_API_URL}/posts${posts ? '/following' : ""}`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return await res.json()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const activeTab = Route.useSearch().posts
  const { posts }: { posts: Post[] } = Route.useLoaderData()
  return (
    <>
      <header className="border">Header</header>
      <div className="border">
        <Link to="/home" className={`${!activeTab && "bg-blue-500"}`}> All</Link>
        <Link to="/home" search={{ posts: 'following' }} className={`${activeTab && "bg-blue-500"}`} >Following</Link>
      </div>
      <main>
        {posts.map(post => {
          return <PostCard key={post.id} post={post} />
        })}
      </main>
    </>
  )
}


