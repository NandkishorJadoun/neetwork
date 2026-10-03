import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FollowingCard } from "@/features/users/components/user-following-card";
import { followingsByUserIdQueryOptions } from "@/features/users/queries";

export const Route = createFileRoute("/_authenticated/users/$userId_/followings")({
  loader: ({ context, params }) => {
    context.queryClient.query(followingsByUserIdQueryOptions(params.userId));
  },
  component: function RouteComponent() {
    const { userId } = Route.useParams();
    const { user: currentUser } = Route.useRouteContext();

    const isCurrentUser = currentUser.id === userId;

    const { data: { followings } } = useSuspenseQuery(followingsByUserIdQueryOptions(userId));

    return (
      <>
        <PageHeader>Followings</PageHeader>
        <div>
          {
            followings.length === 0
              ? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Users />
                      </EmptyMedia>
                      <EmptyTitle>No followings yet</EmptyTitle>
                      <EmptyDescription>
                        Accounts this profile follows will show up here.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )
              : (
                  <>
                    {
                      followings.map((following) => {
                        const { id, receiver } = following;
                        return (
                          <FollowingCard
                            key={id}
                            listUserId={userId}
                            receiver={receiver}
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
