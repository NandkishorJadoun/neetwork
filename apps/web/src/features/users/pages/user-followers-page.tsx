import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/page-header";
import { Route } from "@/routes/_authenticated/users.$userId_.followers";
import { FollowerCard } from "../components/user-follower-card";
import { followersByUserIdQueryOptions } from "../queries";

export const UserFollowersPage = () => {
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
                <p className="py-6 text-center text-xs text-(--app-muted)">
                  No followers yet
                </p>
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
