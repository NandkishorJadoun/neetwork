import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FollowerCard } from "@/features/users/components/user-follower-card";
import { followersByUserIdQueryOptions } from "@/features/users/queries";

export const Route = createFileRoute("/_authenticated/users/$userId_/followers")({
  loader: ({ context, params }) => {
    context.queryClient.query(followersByUserIdQueryOptions(params.userId));
  },
  component: function RouteComponent() {
    const { userId } = Route.useParams();
    const { user: currentUser } = Route.useRouteContext();

    const isCurrentUser = currentUser.id === userId;

    const { data: { followers } } = useSuspenseQuery(followersByUserIdQueryOptions(userId));

    return (
      <>
        <PageHeader>Followers</PageHeader>
        <div>
          {
            followers.length === 0
              ? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Users />
                      </EmptyMedia>
                      <EmptyTitle>No followers yet</EmptyTitle>
                      <EmptyDescription>
                        When someone follows this profile, they'll show up here.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )
              : (
                  <>
                    {
                      followers.map((follower) => {
                        const { id, sender } = follower;
                        return (
                          <FollowerCard
                            key={id}
                            listUserId={userId}
                            sender={sender}
                            showAction={isCurrentUser}
                          />
                        );
                      })
                    }
                  </>
                )
          }
        </div>
      </>
    );
  },
});
