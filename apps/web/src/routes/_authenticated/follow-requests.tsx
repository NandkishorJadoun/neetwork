import { createFileRoute } from "@tanstack/react-router";
import { FollowRequestsPage } from "@/features/follow/pages/follow-requests-page";
import { followRequestsQueryOptions } from "@/features/follow/queries";

export const Route = createFileRoute("/_authenticated/follow-requests")({
  loader: ({ context }) => {
    context.queryClient.query(followRequestsQueryOptions());
  },
  component: FollowRequestsPage,
});
