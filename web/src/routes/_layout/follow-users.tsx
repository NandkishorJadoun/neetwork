import { createFileRoute, Link } from '@tanstack/react-router'
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
      return <div key={user.id} className='border'>
        <Link to='/users/$userId' params={{ userId: user.id }}>
          <img src={user.avatar} alt={user.fullname} width={25} height={25} />
        </Link>
        <Link to='/users/$userId' params={{ userId: user.id }}>
          <p>{user.fullname}</p>
          <p>{user.username}</p>
        </Link>
        <button>Follow</button>
      </div>
    })}
  </main>
}
