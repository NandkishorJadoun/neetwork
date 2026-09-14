import type { QueryClient } from "@tanstack/react-query";
import type { AuthState } from "../context/auth";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

type MyRouterContext = {
  auth: AuthState;
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => <Outlet />,
});
