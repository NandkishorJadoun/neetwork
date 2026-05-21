import { createFileRoute, Link } from '@tanstack/react-router'
import type { Follow } from '../../types'
export const Route = createFileRoute('/_layout/follow-requests')({
  loader: async ({ context }) => {
    const token = context.auth.user?.token
    const url = `${import.meta.env.VITE_API_URL}/me/follow-requests`
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
  const { followRequests }: { followRequests: Follow[] } = Route.useLoaderData()
  return <main>
    {followRequests.map(fr => {
      return <div key={fr.id} className='border'>
        <Link to="/users/$userId" params={{ userId: fr.fromId }}>
          <img src={fr.sender.avatar} alt={fr.sender.fullname} height={25} width={25} />
        </Link>
        <div>
          <Link to="/users/$userId" params={{ userId: fr.fromId }}>
            <p>{fr.sender.fullname}</p>
            <p>{fr.sender.username}</p>
          </Link>
          <div>
            <button>Confirm</button>
            <button>Delete</button>
          </div>
        </div>
      </div>
    })}
  </main>
}
