import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { CommentCard } from "@/features/posts/components/comment-card";
import { PostCard } from "@/features/posts/components/post-card";
import { PostCardSkeleton } from "@/features/posts/components/post-skeleton";
import { commentsByUserIdQueryOptions } from "@/features/users/queries";

export const Route = createFileRoute("/_authenticated/users/$userId/comments")({
  loader: ({ context, params: { userId } }) => {
    context.queryClient.query(commentsByUserIdQueryOptions(userId));
  },
  pendingComponent: () => (
    <>
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </>
  ),
  component: function RouteComponent() {
    const { userId } = Route.useParams();
    const { data: { comments } } = useSuspenseQuery(commentsByUserIdQueryOptions(userId));

    if (comments.length === 0) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MessageCircle />
            </EmptyMedia>
            <EmptyTitle>No comments yet</EmptyTitle>
            <EmptyDescription>
              When this profile comments on posts, they'll show up here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    return (
      <>
        {comments.map((comment) => {
          const { id, text, author, post } = comment;
          return (
            <div key={id}>
              <PostCard post={post} comment={<CommentCard author={author} text={text} />} />
            </div>
          );
        })}
      </>
    );
  },
});
