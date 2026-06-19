import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import type { AuthState } from '../context/auth'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  auth: AuthState
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Outlet />,
})
