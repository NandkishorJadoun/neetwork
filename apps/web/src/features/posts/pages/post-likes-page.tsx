import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Route } from "@/routes/_authenticated/posts.$postId_.likes";
import { likesByPostIdQueryOptions } from "../queries";

export const PostLikesPage = () => {
  const { postId } = Route.useParams();

  const { data: { likes } } = useSuspenseQuery(likesByPostIdQueryOptions(postId));

  if (likes.length === 0) {
    return (
      <>
        <PageHeader>Likes</PageHeader>
        <div>
          <p className="py-6 text-center text-xs text-(--app-muted)">
            No likes yet
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader>Likes</PageHeader>
      <div>
        {
          likes.map((like) => {
            const { id, user } = like;
            return (
              <Link
                key={id}
                to="/users/$userId"
                params={{ userId: user.id }}
                className="flex items-center gap-3 border-b border-(--app-border) px-4 py-3"
              >
                <img
                  src={user.image ?? "/default-avatar.png"}
                  alt={`${user.name}'s avatar`}
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div className="min-w-0">
                  <p className="truncate font-medium text-(--app-text)">
                    {user.name}
                  </p>

                  <p className="truncate text-sm text-(--app-muted)">
                    @
                    {user.name}
                  </p>
                </div>
              </Link>
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
