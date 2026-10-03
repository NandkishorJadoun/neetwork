import type { FollowRequestWithSenderPreview } from "@neetwork/contracts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { UserRow } from "@/features/users/components/user-row";
import { useFollowRequestAction } from "../mutations";

type FollowRequestCardProps = Pick<FollowRequestWithSenderPreview, "senderId" | "sender">;

export const FollowRequestCard = ({ senderId, sender }: FollowRequestCardProps) => {
  const { handleAction, isPending } = useFollowRequestAction(senderId);

  return (
    <UserRow
      user={sender}
      action={(
        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="default"
            size="sm"
            disabled={isPending}
            onClick={() => handleAction("confirm")}
          >
            {isPending ? <Spinner /> : null}
            Confirm
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() => handleAction("delete")}
          >
            {isPending ? <Spinner /> : null}
            Delete
          </Button>
        </div>
      )}
    />
  );
};
