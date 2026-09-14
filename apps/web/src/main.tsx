import type { AuthState } from "./libs/auth-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "./context/theme";
import { authClient } from "./libs/auth-client";
import { queryClient } from "./libs/query";
import { routeTree } from "./routeTree.gen";
import "./styles/index.css";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  type Register = {
    router: typeof router;
  };
}

const InnerApp = () => {
  const { data } = authClient.useSession();

  const auth: AuthState = data
    ? { user: data.user }
    : { user: null };

  return <RouterProvider router={router} context={{ auth }} />;
};

const root = document.getElementById("root");
if (!root)
  throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <InnerApp />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
