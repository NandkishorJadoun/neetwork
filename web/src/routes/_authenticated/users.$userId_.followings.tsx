import { createFileRoute, useRouter } from '@tanstack/react-router'
import { MoveLeft } from 'lucide-react'
import type { Follow } from '../../types'
import { useAuth } from '../../context/auth'
import { FollowingCard } from '../../components/FollowingCard'

export const Route = createFileRoute('/_authenticated/users/$userId_/followings')({
  loader: async ({ context, params: { userId } }) => {
    const token = context.auth.user?.token
    const url = `${import.meta.env.VITE_API_URL}/users/${userId}/followings`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error("Failed to load user's followings")
    }

    return await res.json()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user: currentUser } = useAuth()
  const { userId } = Route.useParams();
  const { followings }: { followings: Follow[] } = Route.useLoaderData()
  const isCurrentUser = currentUser?.id === userId
  const router = useRouter()

  return (
    <main className="mx-auto w-full max-w-md pb-20">
      <div className="sticky top-12 z-10 flex h-12 items-center justify-between border-b border-(--app-border) bg-(--app-bg)/80 px-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => router.history.back()}
          className="text-sm text-(--app-muted) transition-colors hover:text-(--app-text)"
        >
          <MoveLeft />
        </button>

        <p className="text-sm font-medium text-(--app-text)">Following</p>

        <div className="w-5" />
      </div>

      <div>
        {followings.length === 0 ? (
          <p className="py-6 text-center text-xs text-(--app-muted)">
            Not following anyone yet
          </p>
        ) : (
          <>
            {followings.map(following => (
              <FollowingCard key={following.id}
                following={following}
                isCurrentUser={isCurrentUser} />
            ))}
            <p className="py-6 text-center text-xs text-(--app-muted)">
              End of list
            </p>
          </>
        )}
      </div>
    </main>
  )
}
