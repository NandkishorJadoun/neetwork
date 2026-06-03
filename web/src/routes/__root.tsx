import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { AuthState } from '../context/auth'

interface MyRouterContext {
  auth: AuthState
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <div>
      <Outlet />
    </div>
  ),
})