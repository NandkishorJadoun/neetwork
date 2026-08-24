import { Link } from "@tanstack/react-router";
import type { Like } from "../types";

export const LikeUserCard = ({ like }: { like: Like }) => {
  const { user } = like;

  return (
    <Link className="flex items-center gap-3 border-b border-(--app-border) px-4 py-3" to='/users/$userId' params={{ userId: user.id }}>
      <img src={user.avatar} alt={`${user.username}'s avatar`} className="h-10 w-10 rounded-full object-cover" />
      <div className="min-w-0">
        <p className="truncate font-medium text-(--app-text)">
          {user.fullname}
        </p>

        <p className="truncate text-sm text-(--app-muted)">
          @{user.username}
        </p>
      </div>
    </Link>
  )
}