import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { UserRoundSearch } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { FollowUserCard } from "@/features/users/components/follow-user-card";
import { nonFollowingUsersQueryOptions } from "@/features/users/queries";

export const Route = createFileRoute("/_authenticated/follow-users")({
  loader: ({ context }) => {
    context.queryClient.query(nonFollowingUsersQueryOptions());
  },
  component: function RouteComponent() {
    const { data: { users } } = useSuspenseQuery(nonFollowingUsersQueryOptions());

    return (
      <>
        <PageHeader>Follow Users</PageHeader>
        <div>
          {users.length === 0
            ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <UserRoundSearch />
                    </EmptyMedia>
                    <EmptyTitle>No user to follow</EmptyTitle>
                    <EmptyDescription>
                      You're all caught up. Check back later for new people to follow.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )
            : (
                <>
                  {users.map((user) => {
                    return <FollowUserCard key={user.id} user={user} />;
                  })}
                </>
              )}
        </div>
      </>
    );
  },
});
