import type { ViewerFollowStatus } from "@neetwork/contracts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useProfileFollowAction } from "../mutations";

type ProfileActionButtonProps = {
  profileUserId: string;
  followStatus: ViewerFollowStatus;
};

export const ProfileActionButton = ({ profileUserId, followStatus }: ProfileActionButtonProps) => {
  const { handleAction, isPending } = useProfileFollowAction(profileUserId);

  if (followStatus === "none") {
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

  const isFollowing = followStatus === "accepted";

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
