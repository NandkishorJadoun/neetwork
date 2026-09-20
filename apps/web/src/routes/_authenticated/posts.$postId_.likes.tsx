import { createFileRoute } from "@tanstack/react-router";
import { PostLikesPage } from "@/features/posts/pages/post-likes-page";
import { likesByPostIdQueryOptions } from "@/features/posts/queries";

export const Route = createFileRoute("/_authenticated/posts/$postId_/likes")({
  loader: ({ context, params }) => {
    context.queryClient.query(likesByPostIdQueryOptions(params.postId));
  },
  component: PostLikesPage,
});
