import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/create-post')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/create-post"!</div>
}
