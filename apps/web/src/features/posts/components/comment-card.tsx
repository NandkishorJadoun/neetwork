import type { CommentAuthor } from "@neetwork/contracts";
import { Link } from "@tanstack/react-router";

type CommentCardProp = {
  text: string;
  author: CommentAuthor;
};

export const CommentCard = ({ text, author }: CommentCardProp) => {
  return (
    <div className="flex gap-3 py-3">
      <Link
        to="/users/$userId"
        params={{ userId: author.id }}
        className="shrink-0"
      >
        <img
          src={author.image ?? "/default-avatar.png"}
          alt={`${author.name}'s avatar`}
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
            {author.name}
          </p>
          <span className="truncate text-sm text-(--app-muted)">
            @
            {author.name}
          </span>
        </Link>

        <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-(--app-text)">
          {text}
        </p>
      </div>
    </div>
  );
};
