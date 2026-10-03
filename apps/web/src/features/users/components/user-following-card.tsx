import type { UserPreview } from "@neetwork/contracts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUnfollowUser } from "../mutations";
import { UserRow } from "./user-row";

type FollowingCardProps = {
  receiver: UserPreview;
  listUserId: string;
  showAction: boolean;
};

export const FollowingCard = ({ listUserId, receiver, showAction }: FollowingCardProps) => {
  const { mutate, isPending } = useUnfollowUser(listUserId, receiver.id);

  return (
    <UserRow
      user={receiver}
      action={showAction
        ? (
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => mutate()}
            >
              {isPending ? <Spinner /> : null}
              Unfollow
            </Button>
          )
        : undefined}
    />
  );
};
