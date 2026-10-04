import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useLocation } from "@tanstack/react-router";
import { Heart, MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { PageHeader } from "@/components/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CommentSection } from "@/features/posts/components/comment-section";
import { useLikePost } from "@/features/posts/mutations";
import { postByIdQueryOptions } from "@/features/posts/queries";
import { getInitials } from "@/features/users/utils";

export const Route = createFileRoute("/_authenticated/posts/$postId")({
  loader: ({ context, params }) => {
    context.queryClient.query(postByIdQueryOptions(params.postId));
  },
  component: function RouteComponent() {
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
              <Avatar size="lg">
                <AvatarImage src={post.author.image ?? undefined} alt={`${post.author.name}'s avatar`} />
                <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
              </Avatar>
            </Link>

            <div className="min-w-0 flex-1">
              <Link
                to="/users/$userId"
                params={{ userId: post.userId }}
                className="flex items-center gap-2"
              >
                <p className="truncate font-medium text-foreground">
                  {post.author.name}
                </p>
                <span className="truncate text-sm text-muted-foreground">
                  @
                  {post.author.name}
                </span>
              </Link>

              <p className="mt-3 whitespace-pre-wrap wrap-break-word text-[15px] leading-relaxed text-foreground">
                {post.text}
              </p>

              <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={isPending}
                    onClick={() => mutate()}
                    className={post.is_liked_by_user ? "text-pink-600 hover:text-pink-600" : undefined}
                  >
                    {isPending
                      ? (
                          <Spinner />
                        )
                      : (
                          <Heart
                            size={16}
                            fill={post.is_liked_by_user ? "currentColor" : "none"}
                          />
                        )}
                  </Button>

                  <Link
                    to="/posts/$postId/likes"
                    params={{ postId: post.id }}
                    className="transition-colors hover:text-foreground"
                  >
                    {post._count.likes}
                  </Link>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={<a href="#comment" />}
                  >
                    <MessageCircle size={16} />
                  </Button>

                  <span>{post._count.comments}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CommentSection postId={post.id} comments={post.comments} commentRef={commentRef} />
      </>
    );
  },
});
