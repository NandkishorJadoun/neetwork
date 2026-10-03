import type { UserPreview } from "@neetwork/contracts";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useSendFollowRequest } from "../mutations";
import { UserRow } from "./user-row";

type FollowUserCardProps = {
  user: UserPreview;
};

export const FollowUserCard = ({ user }: FollowUserCardProps) => {
  const { mutate, isPending } = useSendFollowRequest(user.id);

  return (
    <UserRow
      user={user}
      action={(
        <Button
          variant="outline"
          size="sm"
          disabled={isPending}
          onClick={() => mutate()}
        >
          {isPending ? <Spinner /> : null}
          Follow
        </Button>
      )}
    />
  );
};
