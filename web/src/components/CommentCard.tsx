import { Link } from "@tanstack/react-router"
import type { User } from "../types"

type CommentCardProp = {
  text: string,
  author: User,
}

export const CommentCard = ({ text, author }: CommentCardProp) => {
  return (
    <div className="flex gap-3 py-3">
      <Link
        to="/users/$userId"
        params={{ userId: author.id }}
        className="shrink-0"
      >
        <img
          src={author.avatar}
          alt={`${author.username}'s avatar`}
          className="h-8 w-8 rounded-full object-cover"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to="/users/$userId"
          params={{ userId: author.id }}
          className="flex items-center gap-2"
        >
          <p className="truncate text-sm font-medium text-(--app-text)">
            {author.fullname}
          </p>
          <span className="truncate text-sm text-(--app-muted)">
            @{author.username}
          </span>
        </Link>

        <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-(--app-text)">
          {text}
        </p>
      </div>
    </div>
  )
}