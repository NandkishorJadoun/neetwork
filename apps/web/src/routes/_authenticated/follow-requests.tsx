import { createFileRoute } from '@tanstack/react-router'
import type { Follow } from '../../types'
import { FollowRequestCard } from '../../components/FollowRequestCard'
import { PageHeader } from '../../components/PageHeader'

export const Route = createFileRoute('/_authenticated/follow-requests')({
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

  return (
    <>
      <PageHeader>Follow Requests</PageHeader>
      <div>
        {followRequests.length === 0 ? (
          <p className="py-6 text-center text-sm text-(--app-muted)">
            No follow requests
          </p>
        ) : (
          <>
            {followRequests.map(fr => (
              <FollowRequestCard key={fr.id} followRequest={fr} />
            ))}

            <p className="py-6 text-center text-xs text-(--app-muted)">
              End of list
            </p>
          </>
        )}
      </div>
    </>
  )
}

