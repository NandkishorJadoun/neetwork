import { createFileRoute, Link, useRouter, useLocation } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/auth'
import type { Post } from '../../types'
import { CommentSection } from '../../components/CommentSection'
import { Heart, MessageCircle } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/posts/$postId')({
  loader: async ({ context, params: { postId } }) => {
    const token = context.auth.user?.token
    const options = { headers: { Authorization: `Bearer ${token}` } }
    const baseUrl = `${import.meta.env.VITE_API_URL}/posts/${postId}`

    const res = await fetch(baseUrl, options)

    if (!res.ok) {
      throw new Error('Failed to load post')
    }

    return await res.json()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { post }: { post: Post } = Route.useLoaderData()
  const { user } = useAuth()
  const router = useRouter()
  const { hash } = useLocation()

  const [isLoading, setIsLoading] = useState(false)
  const commentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (hash !== 'comment') return

    commentRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })

    commentRef.current?.focus()
  }, [hash])

  const isLiked = post.likes.length > 0

  const likeHandler = async () => {
    setIsLoading(true)

    const url = `${import.meta.env.VITE_API_URL}/posts/${post.id}/like`
    const method = isLiked ? 'DELETE' : 'POST'
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user?.token}`,
      },
    }

    try {
      await fetch(url, options)
      router.invalidate()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md pb-20">
      <section className="border-b border-(--app-border) ">
        <div className="sticky top-12 z-10 border-b border-(--app-border) bg-(--app-bg)/80 px-4 py-3 backdrop-blur-md">
          <p className="text-sm font-medium text-(--app-text)">Post</p>
        </div>
        <div className="flex items-start gap-3 px-4 py-4">
          <Link
            to="/users/$userId"
            params={{ userId: post.userId }}
            className="shrink-0"
          >
            <img
              src={post.author.avatar}
              alt={`${post.author.username}'s avatar`}
              className="h-10 w-10 rounded-full object-cover"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              to="/users/$userId"
              params={{ userId: post.userId }}
              className="flex items-center gap-2"
            >
              <p className="truncate font-medium text-(--app-text)">
                {post.author.fullname}
              </p>
              <span className="truncate text-sm text-(--app-muted)">
                @{post.author.username}
              </span>
            </Link>

            <p className="mt-3 whitespace-pre-wrap wrap-break-word text-[15px] leading-relaxed text-(--app-text)">
              {post.text}
            </p>

            <div className="mt-4 flex items-center gap-6 text-sm text-(--app-muted)">
              <div className="flex items-center gap-1">
                <button
                  disabled={isLoading}
                  onClick={likeHandler}
                  className={`
                    rounded-full p-1.5 transition-colors
                    hover:bg-pink-600/10 hover:text-pink-600
                    disabled:cursor-not-allowed disabled:opacity-50
                    ${isLiked ? 'text-pink-600' : ''}
                  `}
                >
                  <Heart
                    size={16}
                    fill={isLiked ? 'currentColor' : 'none'}
                  />
                </button>

                <Link
                  to="/posts/$postId/likes"
                  params={{ postId: post.id }}
                  className="transition-colors hover:text-(--app-text)"
                >
                  {post._count.likes}
                </Link>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href="#comment"
                  className="rounded-full p-1.5 transition-colors hover:bg-emerald-500/10 hover:text-emerald-500"
                >
                  <MessageCircle size={16} />
                </a>

                <span>{post._count.comments}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CommentSection post={post} commentRef={commentRef} />
    </div>
  )
}