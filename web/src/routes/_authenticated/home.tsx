import { createFileRoute, Link } from '@tanstack/react-router'
import type { Post } from '../../types'
import { PostCard } from '../../components/PostCard'
import { Menu } from 'lucide-react'
import { useMobileNav } from '../../context/mobileNav'
import { useScrollListener } from '../../hooks/useScrollListener'

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
  const { setIsOpen } = useMobileNav()
  const scroll = useScrollListener();

  const scrollStyles = scroll.y > 150 && scroll.y - scroll.lastY > 0 ? "invisible -translate-y-full" : "visible ";

  const { posts }: { posts: Post[] } = Route.useLoaderData()
  const tabBase =
    'px-4 py-2 text-sm font-medium text-(--app-muted) transition-colors'
  const tabActive = 'text-(--app-text) border-b-2 border-(--app-accent)'

  return (
    <div className="flex flex-col">

      <div className={`${scrollStyles} transition-all duration-200 sticky top-0 border-b border-(--app-border) bg-(--app-bg)/80 px-4 font-bold backdrop-blur-md`}>
        <div className='md:hidden flex items-center justify-between pt-3'>
          <Link to='/home' className="text-lg font-bold">Neetwork</Link>
          <button>
            <Menu size={18} onClick={() => setIsOpen(true)} />
          </button>
        </div>
        <div className="mx-auto flex justify-center gap-6">
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

      <div>
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