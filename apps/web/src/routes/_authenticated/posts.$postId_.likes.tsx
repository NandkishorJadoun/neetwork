import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { likesByPostIdQueryOptions } from "@/features/posts/queries";
import { getInitials } from "@/features/users/utils";

export const Route = createFileRoute("/_authenticated/posts/$postId_/likes")({
  loader: ({ context, params }) => {
    context.queryClient.query(likesByPostIdQueryOptions(params.postId));
  },
  component: function RouteComponent() {
    const { postId } = Route.useParams();

    const { data: { likes } } = useSuspenseQuery(likesByPostIdQueryOptions(postId));

    if (likes.length === 0) {
      return (
        <>
          <PageHeader>Likes</PageHeader>
          <div>
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Heart />
                </EmptyMedia>
                <EmptyTitle>No likes yet</EmptyTitle>
                <EmptyDescription>
                  When someone likes this post, they'll show up here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        </>
      );
    }

    return (
      <>
        <PageHeader>Likes</PageHeader>
        <div>
          {
            likes.map((like) => {
              const { id, user } = like;
              return (
                <Link
                  key={id}
                  to="/users/$userId"
                  params={{ userId: user.id }}
                  className="flex items-center gap-3 border-b border-border px-4 py-3"
                >
                  <Avatar size="lg">
                    <AvatarImage src={user.image ?? undefined} alt={`${user.name}'s avatar`} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      {user.name}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                      @
                      {user.name}
                    </p>
                  </div>
                </Link>
              );
            })
          }
        </div>
      </>
    );
  },
});
