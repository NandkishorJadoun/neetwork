import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/features/posts/pages/home-page";
import { postsQueryOptions } from "@/features/posts/queries";

export const Route = createFileRoute("/_authenticated/home")({
  validateSearch:
    (search: Record<string, unknown>): { users?: "following" } => {
      return {
        users: search.users === "following" ? "following" : undefined,
      };
    },
  loaderDeps: ({ search }) => ({ users: search.users }),
  loader: async ({ context, deps }) => {
    const activeTab = deps.users ?? "all" as const;
    context.queryClient.infiniteQuery(postsQueryOptions(activeTab));

    return { activeTab };
  },
  component: () => <HomePage />,
});
