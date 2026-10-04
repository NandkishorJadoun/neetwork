import type { Post } from "@neetwork/contracts";
import type { JSX } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getInitials } from "@/features/users/utils";
import { useLikePost } from "../mutations";

export const PostCard = ({ post, comment }: { post: Post; comment?: JSX.Element }) => {
  const {
    text,
    userId,
    id: postId,
    _count: { likes, comments },
    author: { name, image },
    is_liked_by_user: isLikedByUser,
  } = post;

  const { mutate, isPending } = useLikePost({
    postId,
    isLiked: isLikedByUser,
  });

  return (
    <div className="border-b border-border px-4 py-3">
      <div className="flex gap-3">
        <Link
          to="/users/$userId"
          params={{ userId }}
          className="shrink-0"
        >
          <Avatar size="lg">
            <AvatarImage src={image ?? undefined} alt={`${name}'s avatar`} />
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to="/users/$userId"
            params={{ userId }}
            className="flex items-center gap-2"
          >
            <p className="truncate font-medium text-foreground">
              {name}
            </p>

            <p className="truncate text-sm text-muted-foreground">
              @
              {name}
            </p>
          </Link>

          <Link
            to="/posts/$postId"
            params={{ postId }}
            className="mt-1 block whitespace-pre-wrap wrap-break-word leading-relaxed text-foreground"
          >
            {text}
          </Link>

          <div className="mt-3 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={isPending}
                onClick={() => mutate()}
                className={isLikedByUser ? "text-pink-600 hover:text-pink-600" : undefined}
              >
                {isPending
                  ? (
                      <Spinner />
                    )
                  : (
                      <Heart
                        size={16}
                        fill={isLikedByUser ? "currentColor" : "none"}
                      />
                    )}
              </Button>

              <Link
                to="/posts/$postId/likes"
                params={{ postId }}
                className="transition-colors hover:text-foreground"
              >
                {likes}
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-sm"
                render={(
                  <Link
                    to="/posts/$postId"
                    params={{ postId }}
                    hash="comment"
                  />
                )}
              >
                <MessageCircle size={16} />
              </Button>

              <span>{comments}</span>
            </div>
          </div>
        </div>
      </div>

      {comment && (
        <div className="mt-1 flex gap-3 items-start">
          <div className="w-10 h-10 shrink-0 flex justify-end relative">
            <div className="w-1/2 h-[150%] absolute -top-7.5 right-0 border-l-2 border-b-2 border-border rounded-bl-xl" />
          </div>
          <div className="min-w-0 flex-1 text-xs rounded-xl px-2.5">
            {comment}
          </div>
        </div>
      )}
    </div>
  );
};
