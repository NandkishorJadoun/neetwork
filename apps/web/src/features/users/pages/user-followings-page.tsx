import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Route } from "@/routes/_authenticated/users.$userId_.followers";
import { useUnfollowUser } from "../mutations";
import { followingsByUserIdQueryOptions } from "../queries";

export const UserFollowingsPage = () => {
  const { userId } = Route.useParams();
  const { user: currentUser } = Route.useRouteContext();

  const isCurrentUser = currentUser.id === userId;

  const { data: { followings } } = useSuspenseQuery(followingsByUserIdQueryOptions(userId));
  const { isPending, mutate } = useUnfollowUser(userId);

  if (followings.length === 0) {
    return (
      <>
        <PageHeader>Followers</PageHeader>
        <div>
          <p className="py-6 text-center text-xs text-(--app-muted)">
            No followers yet
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader>Followers</PageHeader>
      <div>
        {
          followings.map((following) => {
            const { id, receiver } = following;

            return (
              <div key={id} className="flex items-center justify-between gap-3 border-b border-(--app-border) px-4 py-3">
                <Link
                  to="/users/$userId"
                  params={{ userId: receiver.id }}
                  className="flex items-center gap-3 min-w-0"
                >
                  <img
                    src={receiver.image ?? "/default-avatar.png"}
                    alt={`${receiver.name}'s avatar`}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate font-medium text-(--app-text)">
                      {receiver.name}
                    </p>

                    <p className="truncate text-sm text-(--app-muted)">
                      @
                      {receiver.name}
                    </p>
                  </div>
                </Link>

                {isCurrentUser
                  && (
                    <button
                      disabled={isPending}
                      onClick={() => mutate()}
                      className="shrink-0 rounded-md border border-(--app-border) px-3 py-1.5 text-sm font-medium hover:bg-(--app-surface) disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isPending ? "Unfollowing..." : "Unfollow"}
                    </button>
                  )}
              </div>
            );
          })
        }
        <p className="py-6 text-center text-xs text-(--app-muted)">
          End of list
        </p>
      </div>
    </>
  );
};
