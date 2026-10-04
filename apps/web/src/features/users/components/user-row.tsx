import type { UserPreview } from "@neetwork/contracts";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "../utils";

type UserRowProps = {
  user: UserPreview;
  action?: ReactNode;
};

export const UserRow = ({ user, action }: UserRowProps) => {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
      <Link
        to="/users/$userId"
        params={{ userId: user.id }}
        className="flex min-w-0 items-center gap-3"
      >
        <Avatar size="lg">
          <AvatarImage src={user.image ?? undefined} alt={`${user.name}'s avatar`} />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate font-medium text-foreground">
            {user.name}
          </p>

          <p className="truncate text-sm text-muted-foreground">
            @
            {user.name}
          </p>
        </div>
      </Link>

      {action}
    </div>
  );
};
