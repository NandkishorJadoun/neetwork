import type { Like } from "../../types";
import { createFileRoute } from "@tanstack/react-router";
import { LikeUserCard } from "../../components/like-user-card";
import { PageHeader } from "../../components/page-header";

export const Route = createFileRoute("/_authenticated/posts/$postId_/likes")({
  loader: async ({ context, params: { postId } }) => {
    const token = context.auth.user?.token;
    const options = { headers: { Authorization: `Bearer ${token}` } };
    const Url = `${import.meta.env.VITE_API_URL}/posts/${postId}/likes`;

    const res = await fetch(Url, options);

    if (!res.ok) {
      throw new Error("Failed to load post's likes");
    }

    return await res.json();
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { likes }: { likes: Like[] } = Route.useLoaderData();
  return (
    <>
      <PageHeader>Likes</PageHeader>
      <div>
        {likes.length === 0
          ? (
              <p className="py-6 text-center text-xs text-(--app-muted)">
                No likes yet
              </p>
            )
          : (
              <>
                {likes.map(like => (
                  <LikeUserCard key={like.id} like={like} />
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
