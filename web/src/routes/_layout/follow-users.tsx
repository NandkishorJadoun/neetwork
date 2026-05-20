import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/follow-users')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/follow-user"!</div>
}
