import { createFileRoute } from '@tanstack/react-router'
import { FollowUserCard } from '../../components/FollowUserCard'
import type { User } from '../../types'

export const Route = createFileRoute('/_layout/follow-users')({
  loader: async ({ context }) => {
    const token = context.auth.user?.token
    const url = `${import.meta.env.VITE_API_URL}/users`
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
  const { users }: { users: User[] } = Route.useLoaderData();
  return <main>
    {users.map(user => {
      return <FollowUserCard key={user.id} user={user} />
    })}
  </main>
}

