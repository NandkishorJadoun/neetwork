import { createFileRoute } from '@tanstack/react-router'
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

  return (<>
    <header>
      <button>back</button>
      <p>Followers</p>
    </header>
    <main>
      {followings.map(following => {
        return <FollowingCard key={following.id}
          following={following}
          isCurrentUser={isCurrentUser} />
      })}
    </main>
  </>)
}
