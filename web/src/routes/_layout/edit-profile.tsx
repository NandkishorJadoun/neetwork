import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/edit-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/edit-profile"!</div>
}
