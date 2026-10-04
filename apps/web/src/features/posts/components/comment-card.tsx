import type { CommentAuthor } from "@neetwork/contracts";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/features/users/utils";

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
        <Avatar>
          <AvatarImage src={author.image ?? undefined} alt={`${author.name}'s avatar`} />
          <AvatarFallback>{getInitials(author.name)}</AvatarFallback>
        </Avatar>
      </Link>

      <div className="min-w-0 flex-1">
        <Link
          to="/users/$userId"
          params={{ userId: author.id }}
          className="flex items-center gap-2"
        >
          <p className="truncate text-sm font-medium text-foreground">
            {author.name}
          </p>
          <span className="truncate text-sm text-muted-foreground">
            @
            {author.name}
          </span>
        </Link>

        <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-foreground">
          {text}
        </p>
      </div>
    </div>
  );
};
