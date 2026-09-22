import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { CommentCard } from "@/features/posts/components/comment-card";
import { PostCard } from "@/features/posts/components/post-card";
import { Route } from "@/routes/_authenticated/users.$userId";
import { ProfileActionButton } from "../components/profile-action-button";
import { commentsByUserIdQueryOptions, likedPostsByUserIdQueryOptions, postsByUserIdQueryOptions, userByIdQueryOptions } from "../queries";

const tabBase = "px-4 py-3 text-sm font-medium text-(--app-muted) transition-colors";
const tabActive = "text-(--app-text) border-b-2 border-(--app-accent)";

const ProfilePostsTab = ({ userId }: { userId: string }) => {
  const { data: { posts } } = useSuspenseQuery(postsByUserIdQueryOptions(userId));

  if (posts.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-(--app-muted)">
        No posts yet
      </p>
    );
  }

  return (
    <>
      {posts.map((post) => {
        return <PostCard key={post.id} post={post} />;
      })}
    </>
  );
};

const ProfileCommentsTab = ({ userId }: { userId: string }) => {
  const { data: { comments } } = useSuspenseQuery(commentsByUserIdQueryOptions(userId));

  if (comments.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-(--app-muted)">
        No comments yet
      </p>
    );
  }

  return (
    <>
      {comments.map((comment) => {
        const { id, text, author, post } = comment;
        return (
          <div key={id}>
            <PostCard post={post} comment={<CommentCard author={author} text={text} />} />
          </div>
        );
      })}
    </>
  );
};

const ProfileLikesTab = ({ userId }: { userId: string }) => {
  const { data: { likes } } = useSuspenseQuery(likedPostsByUserIdQueryOptions(userId));

  if (likes.length === 0) {
    return (
      <p className="py-6 text-center text-xs text-(--app-muted)">
        No likes yet
      </p>
    );
  }

  return (
    <>
      {likes.map((like) => {
        const { id, post } = like;
        return <PostCard key={id} post={post} />;
      })}
    </>
  );
};

export const UserProfilePage = () => {
  const { userId } = Route.useParams();
  const { tab } = Route.useSearch();
  const { user: currentUser } = Route.useRouteContext();

  const activeTab = tab ?? "posts";
  const isOwnProfile = currentUser.id === userId;

  const { data: { user } } = useSuspenseQuery(userByIdQueryOptions(userId));

  return (
    <>
      <section>
        <PageHeader>
          <p className="text-center">User Profile</p>
        </PageHeader>
        <div className="p-4 pb-0">
          <img
            src={user.image ?? "/default-avatar.png"}
            alt={`${user.name}'s avatar`}
            className="h-20 w-20 rounded-full object-cover"
          />

          <div className="mt-3">
            <h1 className="text-xl font-bold">
              {user.name}
            </h1>

            <p className="text-sm text-(--app-muted)">
              @
              {user.name}
            </p>
          </div>

          {user.about && (
            <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
              {user.about}
            </p>
          )}

          <div className="mt-4 flex gap-4 text-sm">
            <Link
              to="/users/$userId/followers"
              params={{ userId: user.id }}
            >
              <span className="font-semibold">
                {user._count.followers}
              </span>
              {" "}
              <span className="text-(--app-muted)">
                Followers
              </span>
            </Link>

            <Link
              to="/users/$userId/followings"
              params={{ userId: user.id }}
            >
              <span className="font-semibold">
                {user._count.followings}
              </span>
              {" "}
              <span className="text-(--app-muted)">
                Following
              </span>
            </Link>
          </div>

          <div className="mt-4">
            <ProfileActionButton
              profileUserId={user.id}
              followers={user.followers}
              isOwnProfile={isOwnProfile}
            />
          </div>
        </div>
      </section>

      <section>
        <div className="sticky top-0 z-10 mt-4 border-b border-(--app-border) bg-(--app-bg)/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-md justify-center gap-6 px-4">
            <Link
              to="/users/$userId"
              params={{ userId: user.id }}
              className={`${tabBase} ${activeTab === "posts" ? tabActive : ""}`}
            >
              Posts
            </Link>

            <Link
              to="/users/$userId"
              params={{ userId: user.id }}
              search={{ tab: "comments" }}
              className={`${tabBase} ${activeTab === "comments" ? tabActive : ""}`}
            >
              Comments
            </Link>

            <Link
              to="/users/$userId"
              params={{ userId: user.id }}
              search={{ tab: "likes" }}
              className={`${tabBase} ${activeTab === "likes" ? tabActive : ""}`}
            >
              Likes
            </Link>
          </div>
        </div>

        <div className="px-0">
          {activeTab === "posts" && <ProfilePostsTab userId={userId} />}
          {activeTab === "comments" && <ProfileCommentsTab userId={userId} />}
          {activeTab === "likes" && <ProfileLikesTab userId={userId} />}
        </div>
      </section>
    </>
  );
};
