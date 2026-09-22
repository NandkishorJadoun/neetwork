import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";
import { HomePage } from "@/features/posts/pages/home-page";
import { postsQueryOptions } from "@/features/posts/queries";

const homeSearchSchema = z.object({
  users: z.enum(["following"]).optional(),
});

export const Route = createFileRoute("/_authenticated/home")({
  validateSearch: search => homeSearchSchema.catch({}).parse(search),
  loaderDeps: ({ search }) => ({ users: search.users }),
  loader: ({ context, deps }) => {
    const activeTab = deps.users ?? "all" as const;
    context.queryClient.infiniteQuery(postsQueryOptions(activeTab));

    return { activeTab };
  },
  component: () => <HomePage />,
});
