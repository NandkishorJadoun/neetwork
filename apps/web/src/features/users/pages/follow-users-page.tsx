import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { FollowUserCard } from "../components/follow-user-card";
import { nonFollowingUsersQueryOptions } from "../queries";

export const FollowUsersPage = () => {
  const { data: { users } } = useSuspenseQuery(nonFollowingUsersQueryOptions());

  if (users.length === 0) {
    return (
      <>
        <PageHeader>Follow Users</PageHeader>
        <div>
          <p className="py-6 text-center text-xs text-(--app-muted)">
            No user to follow
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader>Follow Users</PageHeader>
      <div>
        {
          users.length === 0
            ? (
                <p className="py-6 text-center text-xs text-(--app-muted)">
                  No user to follow
                </p>
              )
            : (
                <>
                  {users.map((user) => {
                    return <FollowUserCard key={user.id} user={user} />;
                  })}
                  <p className="py-6 text-center text-xs text-(--app-muted)">
                    End of list
                  </p>
                </>
              )
        }
      </div>
    </>
  );
};
