import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Route } from "@/routes/_authenticated/users.$userId_.followings";
import { FollowingCard } from "../components/user-following-card";
import { followingsByUserIdQueryOptions } from "../queries";

export const UserFollowingsPage = () => {
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
                <p className="py-6 text-center text-xs text-(--app-muted)">
                  No followings yet
                </p>
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
