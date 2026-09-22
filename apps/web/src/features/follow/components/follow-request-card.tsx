import type { FollowRequestWithSenderPreview } from "@neetwork/contracts";
import { Link } from "@tanstack/react-router";
import { useFollowRequestAction } from "../mutations";

type FollowRequestCardProps = Pick<FollowRequestWithSenderPreview, "senderId" | "sender">;

export const FollowRequestCard = ({ senderId, sender }: FollowRequestCardProps) => {
  const { handleAction, isPending } = useFollowRequestAction(senderId);

  return (
    <div className="flex items-center justify-between gap-3 border-b border-(--app-border) px-4 py-3">
      <Link
        to="/users/$userId"
        params={{ userId: senderId }}
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

      <div className="flex items-center gap-2">
        <button
          disabled={isPending}
          onClick={() => handleAction("confirm")}
          className="shrink-0 rounded-md border border-(--app-accent) bg-(--app-accent) px-3 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Confirm
        </button>

        <button
          disabled={isPending}
          onClick={() => handleAction("delete")}
          className="shrink-0 rounded-md border border-(--app-border) px-3 py-1.5 text-sm font-medium hover:bg-(--app-surface) disabled:cursor-not-allowed disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
