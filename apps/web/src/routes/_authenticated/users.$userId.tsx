import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";
import { UserProfilePage } from "@/features/users/pages/user-profile-page";
import { commentsByUserIdQueryOptions, likedPostsByUserIdQueryOptions, postsByUserIdQueryOptions, userByIdQueryOptions } from "@/features/users/queries";

const userProfileSearchSchema = z.object({
  tab: z.enum(["comments", "likes"]).optional(),
});

export const Route = createFileRoute("/_authenticated/users/$userId")({
  validateSearch: search => userProfileSearchSchema.catch({}).parse(search),
  loaderDeps: ({ search }) => ({ tab: search.tab ?? "posts" }),
  loader: ({ context, params: { userId }, deps }) => {
    context.queryClient.query(userByIdQueryOptions(userId));

    if (deps.tab === "comments") {
      context.queryClient.query(commentsByUserIdQueryOptions(userId));
    }
    else if (deps.tab === "likes") {
      context.queryClient.query(likedPostsByUserIdQueryOptions(userId));
    }
    else {
      context.queryClient.query(postsByUserIdQueryOptions(userId));
    }
  },
  component: UserProfilePage,
});
