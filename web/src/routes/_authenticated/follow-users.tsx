import { createFileRoute } from '@tanstack/react-router'
import { FollowUserCard } from '../../components/FollowUserCard'
import type { User } from '../../types'
import { PageHeader } from '../../components/PageHeader'

export const Route = createFileRoute('/_authenticated/follow-users')({
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
  return (
    <>
      <PageHeader>
        <p className='text-center'>Follow Users</p>
      </PageHeader>
      <div>
        {users.length === 0 ? (
          <p className="py-6 text-center text-sm text-(--app-muted)">
            No user to follow
          </p>
        ) :
          (<>
            {
              users.map(user => {
                return <FollowUserCard key={user.id} user={user} />
              })
            }
          </>)
        }
        < p className="py-6 text-center text-xs text-(--app-muted)">
          End of list
        </p>
      </div>
    </>
  )
}

