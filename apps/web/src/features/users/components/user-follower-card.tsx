import type { UserPreview } from "@neetwork/contracts";
import { Link } from "@tanstack/react-router";
import { useRemoveFollower } from "../mutations";

type FollowerCardProps = {
  sender: UserPreview;
  listUserId: string;
  showAction: boolean;
};

export const FollowerCard = ({ listUserId, sender, showAction }: FollowerCardProps) => {
  const { mutate, isPending } = useRemoveFollower(listUserId, sender.id);

  return (
    <div className="flex items-center justify-between gap-3 border-b border-(--app-border) px-4 py-3">
      <Link
        to="/users/$userId"
        params={{ userId: sender.id }}
        className="flex items-center gap-3 min-w-0"
      >
        <img
          src={sender.image ?? "/default-avatar.png"}
          alt={`${sender.name}'s avatar`}
          className="h-10 w-10 rounded-full object-cover"
        />

        <div className="min-w-0">
          <p className="truncate font-medium text-(--app-text)">
            {sender.name}
          </p>

          <p className="truncate text-sm text-(--app-muted)">
            @
            {sender.name}
          </p>
        </div>
      </Link>

      {showAction
        && (
          <button
            disabled={isPending}
            onClick={() => mutate()}
            className="shrink-0 rounded-md border border-(--app-border) px-3 py-1.5 text-sm font-medium hover:bg-(--app-surface) disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>
        )}
    </div>
  );
};
