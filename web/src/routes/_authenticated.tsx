import { createFileRoute, redirect, Outlet, Link } from '@tanstack/react-router'
import { useAuth } from '../auth'

export const Route = createFileRoute('/_layout')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: "/login"
      })
    }
  },
  component: RouteComponent,
})


function RouteComponent() {
  const style = "font-bold border-b-2 border-blue-500"
  const { user } = useAuth();
  if (!user) return null

  return <>
    <div className='border'>
      <p>Mobile Navigation</p>
      <Link to="/home" activeProps={{ className: style }}>Home</Link>
      <Link to="/follow-requests" activeProps={{ className: style }}>Follow Requests</Link>
      <Link to="/create-post" activeProps={{ className: style }}>Create Post</Link>
      <Link to="/follow-users" activeProps={{ className: style }}>Follows</Link>
      <Link to="/users/$userId" params={{ userId: user.id }} activeProps={{ className: style }}>Profile</Link>
    </div>
    <Outlet />
  </>

}
