import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/edit-profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/edit-profile"!</div>
}
