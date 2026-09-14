import type { Follow } from "../../types";
import { createFileRoute } from "@tanstack/react-router";
import { FollowingCard } from "../../components/following-card";
import { PageHeader } from "../../components/page-header";
import { useAuth } from "../../context/auth";

export const Route = createFileRoute("/_authenticated/users/$userId_/followings")({
  loader: async ({ context, params: { userId } }) => {
    const token = context.auth.user?.token;
    const url = `${import.meta.env.VITE_API_URL}/users/${userId}/followings`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to load user's followings");
    }

    return await res.json();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user: currentUser } = useAuth();
  const { userId } = Route.useParams();
  const { followings }: { followings: Follow[] } = Route.useLoaderData();
  const isCurrentUser = currentUser?.id === userId;

  return (
    <>
      <PageHeader>Followings</PageHeader>

      <div>
        {followings.length === 0
          ? (
              <p className="py-6 text-center text-xs text-(--app-muted)">
                Not following anyone yet
              </p>
            )
          : (
              <>
                {followings.map(following => (
                  <FollowingCard
                    key={following.id}
                    following={following}
                    isCurrentUser={isCurrentUser}
                  />
                ))}
                <p className="py-6 text-center text-xs text-(--app-muted)">
                  End of list
                </p>
              </>
            )}
      </div>
    </>
  );
}
