import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { PostCard } from "@/features/posts/components/post-card";
import { PostCardSkeleton } from "@/features/posts/components/post-skeleton";
import { likedPostsByUserIdQueryOptions } from "@/features/users/queries";

export const Route = createFileRoute("/_authenticated/users/$userId/likes")({
  loader: ({ context, params: { userId } }) => {
    context.queryClient.query(likedPostsByUserIdQueryOptions(userId));
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
    const { data: { likes } } = useSuspenseQuery(likedPostsByUserIdQueryOptions(userId));

    if (likes.length === 0) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Heart />
            </EmptyMedia>
            <EmptyTitle>No likes yet</EmptyTitle>
            <EmptyDescription>
              Posts liked by this profile will show up here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    return (
      <>
        {likes.map((like) => {
          const { id, post } = like;
          return <PostCard key={id} post={post} />;
        })}
      </>
    );
  },
});
