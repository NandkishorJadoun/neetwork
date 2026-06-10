import { createFileRoute, useRouter } from '@tanstack/react-router'
import type { Like } from '../../types'
import { MoveLeft } from 'lucide-react'
import { LikeUserCard } from '../../components/LikeUserCard'

export const Route = createFileRoute('/_authenticated/posts/$postId_/likes')({
  loader: async ({ context, params: { postId } }) => {
    const token = context.auth.user?.token
    const options = { headers: { Authorization: `Bearer ${token}` } }
    const Url = `${import.meta.env.VITE_API_URL}/posts/${postId}/likes`

    const res = await fetch(Url, options)

    if (!res.ok) {
      throw new Error("Failed to load post's likes")
    }

    return await res.json();
  },
  component: RouteComponent
})

function RouteComponent() {
  const { likes }: { likes: Like[] } = Route.useLoaderData();
  const router = useRouter()


  return <div className="mx-auto w-full max-w-md pb-20">
    <div className="sticky top-12 z-10 flex h-12 items-center justify-between border-b border-(--app-border) bg-(--app-bg)/80 px-4 backdrop-blur-md">
      <button
        type="button"
        onClick={() => router.history.back()}
        className="text-sm text-(--app-muted) transition-colors hover:text-(--app-text)"
      >
        <MoveLeft />
      </button>
      <p className="text-sm font-medium text-(--app-text)">Likes</p>
      <div className="w-5" />
    </div>

    <div>
      {likes.length === 0 ? (
        <p className="py-6 text-center text-xs text-(--app-muted)">
          No likes yet
        </p>
      ) : (
        <>
          {likes.map(like => (
            <LikeUserCard key={like.id}
              like={like} />
          ))}
          <p className="py-6 text-center text-xs text-(--app-muted)">
            End of list
          </p>
        </>
      )}
    </div>
  </div>
}

