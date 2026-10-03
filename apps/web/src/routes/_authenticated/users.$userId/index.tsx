import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { PostCard } from "@/features/posts/components/post-card";
import { PostCardSkeleton } from "@/features/posts/components/post-skeleton";
import { postsByUserIdQueryOptions } from "@/features/users/queries";

export const Route = createFileRoute("/_authenticated/users/$userId/")({
  loader: async ({ context, params: { userId } }) => {
    await context.queryClient.query(postsByUserIdQueryOptions(userId));
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
    const { data: { posts } } = useSuspenseQuery(postsByUserIdQueryOptions(userId));

    if (posts.length === 0) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>No posts yet</EmptyTitle>
            <EmptyDescription>
              When this profile publishes posts, they'll show up here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    return (
      <>
        {posts.map((post) => {
          return <PostCard key={post.id} post={post} />;
        })}
      </>
    );
  },
});
