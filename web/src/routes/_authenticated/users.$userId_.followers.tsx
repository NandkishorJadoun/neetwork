import { createFileRoute, useRouter } from '@tanstack/react-router'
import { MoveLeft } from 'lucide-react'
import type { Follow } from '../../types'
import { useAuth } from '../../context/auth'
import { FollowerCard } from '../../components/FollowerCard'

export const Route = createFileRoute('/_authenticated/users/$userId_/followers')({
  loader: async ({ context, params: { userId } }) => {
    const token = context.auth.user?.token
    const url = `${import.meta.env.VITE_API_URL}/users/${userId}/followers`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    if (!res.ok) {
      throw new Error("Failed to load user's followers")
    }

    return await res.json()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { user: currentUser } = useAuth()
  const { userId } = Route.useParams();
  const { followers }: { followers: Follow[] } = Route.useLoaderData()
  const isCurrentUser = currentUser?.id === userId
  const router = useRouter()

  return (
    <div className="mx-auto w-full max-w-md pb-20">
      <div className="sticky top-12 z-10 flex h-12 items-center justify-between border-b border-(--app-border) bg-(--app-bg)/80 px-4 backdrop-blur-md">
        <button
          type="button"
          onClick={() => router.history.back()}
          className="text-sm text-(--app-muted) transition-colors hover:text-(--app-text)"
        >
          <MoveLeft />
        </button>

        <p className="text-sm font-medium text-(--app-text)">Followers</p>

        <div className="w-5" />
      </div>

      <div>
        {followers.length === 0 ? (
          <p className="py-6 text-center text-xs text-(--app-muted)">
            No followers yet
          </p>
        ) : (
          <>
            {followers.map(follower => (
              <FollowerCard key={follower.id}
                follower={follower}
                isCurrentUser={isCurrentUser} />
            ))}
            <p className="py-6 text-center text-xs text-(--app-muted)">
              End of list
            </p>
          </>
        )}
      </div>
    </div>
  )
}

