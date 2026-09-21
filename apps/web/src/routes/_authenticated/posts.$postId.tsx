import { createFileRoute } from "@tanstack/react-router";
import { PostPage } from "@/features/posts/pages/post-page";
import { postByIdQueryOptions } from "@/features/posts/queries";

export const Route = createFileRoute("/_authenticated/posts/$postId")({
  loader: ({ context, params }) => {
    context.queryClient.query(postByIdQueryOptions(params.postId));
  },
  component: PostPage,
});
