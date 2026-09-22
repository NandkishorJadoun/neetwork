import { createFileRoute } from "@tanstack/react-router";
import { FollowUsersPage } from "@/features/users/pages/follow-users-page";
import { nonFollowingUsersQueryOptions } from "@/features/users/queries";

export const Route = createFileRoute("/_authenticated/follow-users")({
  loader: ({ context }) => {
    context.queryClient.query(nonFollowingUsersQueryOptions());
  },
  component: FollowUsersPage,
});
