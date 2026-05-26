import { createFileRoute } from '@tanstack/react-router'
import type { Follow } from '../../types'
import { FollowRequestCard } from '../../components/FollowRequestCard'

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
      return <FollowRequestCard key={fr.id} followRequest={fr} />
    })}
  </main>
}

