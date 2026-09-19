import { createFileRoute } from "@tanstack/react-router";
import { UserFollowingsPage } from "@/features/users/pages/user-followings-page";
import { followingsByUserIdQueryOptions } from "@/features/users/queries";

export const Route = createFileRoute("/_authenticated/users/$userId_/followings")({
  loader: ({ context, params }) => {
    context.queryClient.query(followingsByUserIdQueryOptions(params.userId));
  },
  component: UserFollowingsPage,
});
