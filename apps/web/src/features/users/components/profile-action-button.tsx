import type { FollowRecord } from "@neetwork/contracts";
import { Link } from "@tanstack/react-router";
import { useProfileFollowAction } from "../mutations";

type ProfileActionButtonProps = {
  profileUserId: string;
  followers: FollowRecord[];
  isOwnProfile: boolean;
};

const baseClass = "inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50";

export const ProfileActionButton = ({ profileUserId, followers, isOwnProfile }: ProfileActionButtonProps) => {
  const { handleAction, isPending } = useProfileFollowAction(profileUserId);

  if (isOwnProfile) {
    return (
      <Link
        to="/edit-profile"
        className={`${baseClass} border-(--app-border) bg-transparent text-(--app-text) hover:bg-(--app-surface)`}
      >
        Edit profile
      </Link>
    );
  }

  if (followers.length === 0) {
    return (
      <button
        disabled={isPending}
        onClick={() => handleAction("follow")}
        className={`${baseClass} border-(--app-border) bg-transparent text-(--app-text) hover:bg-(--app-surface)`}
      >
        Follow
      </button>
    );
  }

  const isFollowing = followers[0].status === "ACCEPTED";

  return (
    <button
      disabled={isPending}
      onClick={() => handleAction("unfollow")}
      className={`${baseClass} ${isFollowing
        ? "border-(--app-border) bg-(--app-surface) text-(--app-text)"
        : "border-(--app-border) bg-transparent text-(--app-text) hover:bg-(--app-surface)"
      }`}
    >
      {isFollowing ? "Following" : "Requested"}
    </button>
  );
};
