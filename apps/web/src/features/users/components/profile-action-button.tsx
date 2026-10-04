import type { FollowRecord } from "@neetwork/contracts";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useProfileFollowAction } from "../mutations";

type ProfileActionButtonProps = {
  profileUserId: string;
  followers: FollowRecord[];
  isOwnProfile: boolean;
};

export const ProfileActionButton = ({ profileUserId, followers, isOwnProfile }: ProfileActionButtonProps) => {
  const { handleAction, isPending } = useProfileFollowAction(profileUserId);

  if (isOwnProfile) {
    return (
      <Button
        variant="outline"
        size="sm"
        render={<Link to="/edit-profile" />}
      >
        Edit profile
      </Button>
    );
  }

  if (followers.length === 0) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={isPending}
        onClick={() => handleAction("follow")}
      >
        {isPending ? <Spinner /> : null}
        Follow
      </Button>
    );
  }

  const isFollowing = followers[0].status === "ACCEPTED";

  return (
    <Button
      variant={isFollowing ? "secondary" : "ghost"}
      size="sm"
      disabled={isPending}
      onClick={() => handleAction("unfollow")}
    >
      {isPending ? <Spinner /> : null}
      {isFollowing ? "Following" : "Requested"}
    </Button>
  );
};
