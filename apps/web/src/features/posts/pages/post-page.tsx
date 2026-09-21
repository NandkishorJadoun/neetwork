import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { Heart, MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { CommentSection } from "@/features/posts/components/comment-section";
import { Route } from "@/routes/_authenticated/posts.$postId";
import { useLikePost } from "../mutations";
import { postByIdQueryOptions } from "../queries";

export const PostPage = () => {
  const { hash } = useLocation();
  const { postId } = Route.useParams();
  const { data: { post } } = useSuspenseQuery(postByIdQueryOptions(postId));
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const { mutate, isPending } = useLikePost({
    postId,
    isLiked: post.is_liked_by_user,
  });

  useEffect(() => {
    if (hash !== "comment")
      return;

    commentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    commentRef.current?.focus();
  }, [hash]);

  return (
    <>
      <section>
        <PageHeader>Post</PageHeader>
        <div className="flex items-start gap-3 px-4 py-4">
          <Link
            to="/users/$userId"
            params={{ userId: post.userId }}
            className="shrink-0"
          >
            <img
              src={post.author.image ?? "/default-avatar.png"}
              alt={`${post.author.name}'s avatar`}
              className="h-10 w-10 rounded-full object-cover"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              to="/users/$userId"
              params={{ userId: post.userId }}
              className="flex items-center gap-2"
            >
              <p className="truncate font-medium text-(--app-text)">
                {post.author.name}
              </p>
              <span className="truncate text-sm text-(--app-muted)">
                @
                {post.author.name}
              </span>
            </Link>

            <p className="mt-3 whitespace-pre-wrap wrap-break-word text-[15px] leading-relaxed text-(--app-text)">
              {post.text}
            </p>

            <div className="mt-4 flex items-center gap-6 text-sm text-(--app-muted)">
              <div className="flex items-center gap-1">
                <button
                  disabled={isPending}
                  onClick={() => mutate()}
                  className={`
                    rounded-full p-1.5 transition-colors
                    hover:bg-pink-600/10 hover:text-pink-600
                    disabled:cursor-not-allowed disabled:opacity-50
                    ${post.is_liked_by_user ? "text-pink-600" : ""}
                  `}
                >
                  <Heart
                    size={16}
                    fill={post.is_liked_by_user ? "currentColor" : "none"}
                  />
                </button>

                <Link
                  to="/posts/$postId/likes"
                  params={{ postId: post.id }}
                  className="transition-colors hover:text-(--app-text)"
                >
                  {post._count.likes}
                </Link>
              </div>

              <div className="flex items-center gap-1">
                <a
                  href="#comment"
                  className="rounded-full p-1.5 transition-colors hover:bg-emerald-500/10 hover:text-emerald-500"
                >
                  <MessageCircle size={16} />
                </a>

                <span>{post._count.comments}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CommentSection post={post} commentRef={commentRef} />
    </>
  );
};
