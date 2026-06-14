import { createFileRoute } from '@tanstack/react-router'
import type { Follow } from '../../types'
import { useAuth } from '../../context/auth'
import { FollowerCard } from '../../components/FollowerCard'
import { PageHeader } from '../../components/PageHeader'

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

  return (
    <>
      <PageHeader>Followers</PageHeader>

      <div>
        {followers.length === 0 ? (
          <p className="py-6 text-center text-xs text-(--app-muted)">
            No followers yet
          </p>
        ) : (<>
          {
            followers.map(follower => (
              <FollowerCard key={follower.id}
                follower={follower}
                isCurrentUser={isCurrentUser} />
            ))
          }
          <p className="py-6 text-center text-xs text-(--app-muted)">
            End of list
          </p>
        </>)}
      </div>
    </>
  )
}

