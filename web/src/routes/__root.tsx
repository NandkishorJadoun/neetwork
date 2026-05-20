import { createRootRouteWithContext, Outlet, Link } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { AuthState } from '../auth'

interface MyRouterContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div>
      <Outlet />
      <div className='border'>
        <p>Mobile Navigation</p>
        <Link to="/">Home</Link>
        <Link to="/follow-requests">Follow Requests</Link>
        <Link to="/create-post">Create Post</Link>
        <Link to="/follow-users">Follows</Link>
        <Link to="/profile">Profile</Link>
      </div>
      <TanStackRouterDevtools />
    </div>
  ),
})