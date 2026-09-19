import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Route } from "@/routes/_authenticated/users.$userId_.followers";
import { useRemoveFollower } from "../mutations";
import { followersByUserIdQueryOptions } from "../queries";

export const UserFollowersPage = () => {
  const { userId } = Route.useParams();
  const { user: currentUser } = Route.useRouteContext();

  const isCurrentUser = currentUser.id === userId;

  const { data: { followers } } = useSuspenseQuery(followersByUserIdQueryOptions(userId));
  const { mutate, isPending } = useRemoveFollower(userId);

  if (followers.length === 0) {
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
          followers.map((follower) => {
            const { id, sender } = follower;
            return (
              <div key={id} className="flex items-center justify-between gap-3 border-b border-(--app-border) px-4 py-3">
                <Link
                  to="/users/$userId"
                  params={{ userId: sender.id }}
                  className="flex items-center gap-3 min-w-0"
                >
                  <img
                    src={sender.image ?? "/default-avatar.png"}
                    alt={`${sender.name}'s avatar`}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate font-medium text-(--app-text)">
                      {sender.name}
                    </p>

                    <p className="truncate text-sm text-(--app-muted)">
                      @
                      {sender.name}
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
                      {isPending ? "Removing..." : "Remove"}
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
