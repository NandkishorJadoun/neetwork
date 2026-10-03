import type { UserPreview } from "@neetwork/contracts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRemoveFollower } from "../mutations";
import { UserRow } from "./user-row";

type FollowerCardProps = {
  sender: UserPreview;
  listUserId: string;
  showAction: boolean;
};

export const FollowerCard = ({ listUserId, sender, showAction }: FollowerCardProps) => {
  const { mutate, isPending } = useRemoveFollower(listUserId, sender.id);

  return (
    <UserRow
      user={sender}
      action={showAction
        ? (
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => mutate()}
            >
              {isPending ? <Spinner /> : null}
              Remove
            </Button>
          )
        : undefined}
    />
  );
};
