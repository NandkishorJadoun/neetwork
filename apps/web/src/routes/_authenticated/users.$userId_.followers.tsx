import { createFileRoute } from "@tanstack/react-router";
import { UserFollowersPage } from "@/features/users/pages/user-followers-page";
import { followersByUserIdQueryOptions } from "@/features/users/queries";

export const Route = createFileRoute("/_authenticated/users/$userId_/followers")({
  loader: ({ context, params }) => {
    context.queryClient.query(followersByUserIdQueryOptions(params.userId));
  },
  component: UserFollowersPage,
});
