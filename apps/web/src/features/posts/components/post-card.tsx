import type { Post } from "@neetwork/contracts";
import type { JSX } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle } from "lucide-react";
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
    <div className="border-b border-(--app-border) px-4 py-3">
      <div className="flex gap-3">
        <Link
          to="/users/$userId"
          params={{ userId }}
          className="shrink-0"
        >
          <img
            src={image ?? "/default-avatar.png"}
            alt={`${name}'s avatar`}
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to="/users/$userId"
            params={{ userId }}
            className="flex items-center gap-2"
          >
            <p className="truncate font-medium">
              {name}
            </p>

            <p className="truncate text-sm text-(--app-muted)">
              @
              {name}
            </p>
          </Link>

          <Link
            to="/posts/$postId"
            params={{ postId }}
            className="mt-1 block whitespace-pre-wrap wrap-break-word leading-relaxed"
          >
            {text}
          </Link>

          <div className="mt-3 flex items-center gap-6 text-sm text-(--app-muted)">
            <div className="flex items-center gap-1">
              <button
                disabled={isPending}
                onClick={() => mutate()}
                className={`
              rounded-full p-1.5 transition-colors
              hover:bg-pink-600/10
              hover:text-pink-600
                  ${isLikedByUser ? "text-pink-600" : ""}
            `}
              >
                <Heart
                  size={16}
                  fill={isLikedByUser ? "currentColor" : "none"}
                />
              </button>

              <Link
                to="/posts/$postId/likes"
                params={{ postId }}
              >
                {likes}
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <Link
                to="/posts/$postId"
                params={{ postId }}
                hash="comment"
                className="
              rounded-full p-1.5 transition-colors
              hover:bg-emerald-500/10
              hover:text-emerald-500
            "
              >
                <MessageCircle size={16} />
              </Link>

              <span>{comments}</span>
            </div>
          </div>
        </div>
      </div>

      {comment && (
        <div className="mt-1 flex gap-3 items-start">
          <div className="w-10 h-10 shrink-0 flex justify-end relative">
            <div className="w-1/2 h-[150%] absolute -top-7.5 right-0 border-l-2 border-b-2 border-(--app-border) rounded-bl-xl" />
          </div>
          <div className="min-w-0 flex-1 text-xs rounded-xl px-2.5">
            {comment}
          </div>
        </div>
      )}
    </div>
  );
};
