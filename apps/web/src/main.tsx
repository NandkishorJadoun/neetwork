import { StrictMode } from "react";
import "./styles/index.css";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/theme";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { authClient, type AuthState } from "./libs/auth-client";
import { queryClient } from "./libs/query";

const router = createRouter({
  routeTree,
  context: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    auth: undefined!,
    queryClient,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const InnerApp = () => {
  const { data } = authClient.useSession();

  const auth: AuthState = Boolean(data)
    ? { user: data.user }
    : { user: null };

  return <RouterProvider router={router} context={{ auth }} />;
};

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

ReactDOM.createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <InnerApp />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
