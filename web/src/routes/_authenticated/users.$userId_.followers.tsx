import { createFileRoute } from '@tanstack/react-router'
import type { Follow } from '../../types'
import { useAuth } from '../../auth'
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
  
  return (<>
    <header>
      <button>back</button>
      <p>Followers</p>
    </header>
    <main>
      {followers.map(follower => {
        return <FollowerCard key={follower.id}
          follower={follower}
          isCurrentUser={isCurrentUser} />
      })}
    </main>
  </>)
}

