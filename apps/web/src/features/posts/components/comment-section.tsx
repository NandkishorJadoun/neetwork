import type { CommentAuthor } from "@neetwork/contracts";
import { CreateCommentInputSchema, toValidationMessage } from "@neetwork/contracts";
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldError as FieldErrorMessage } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment } from "../mutations";
import { CommentCard } from "./comment-card";

type CommentItem = {
  id: string;
  text: string;
  author: CommentAuthor;
};

type CommentSectionProp = {
  postId: string;
  comments: CommentItem[];
  commentRef: React.RefObject<HTMLTextAreaElement | null>;
};

export const CommentSection = ({ postId, comments, commentRef }: CommentSectionProp) => {
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const { mutate, isPending } = useCreateComment(postId);

  const commentHandler = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = CreateCommentInputSchema.safeParse({ content: comment });

    if (!parsed.success) {
      setError(toValidationMessage(parsed.error.issues));
      return;
    }

    mutate(parsed.data, {
      onSuccess: () => {
        setComment("");
        setError(null);
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };

  return (
    <>
      <div className="px-4 py-4 border-b border-border">
        <form onSubmit={commentHandler} className="space-y-3">
          <Field data-invalid={Boolean(error)}>
            <Textarea
              ref={commentRef}
              name="content"
              placeholder="Write a comment..."
              rows={3}
              required
              value={comment}
              onChange={(e) => { setComment(e.target.value); }}
              maxLength={280}
              aria-invalid={Boolean(error)}
            />

            {error && <FieldErrorMessage>{error}</FieldErrorMessage>}
          </Field>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {comment.length}
              /280
            </span>

            <Button
              size="sm"
              disabled={comment.trim().length === 0 || isPending}
              type="submit"
            >
              {isPending ? <Spinner /> : null}
              {isPending ? "Posting..." : "Comment"}
            </Button>
          </div>
        </form>
      </div>

      <div>

        <div className="sticky top-0 text-start md:text-center border-b border-border bg-background/80 px-4 py-3 font-bold backdrop-blur-md">
          Comments
        </div>

        <div className="divide-y divide-border px-4">
          {comments.length === 0
            ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageCircle />
                    </EmptyMedia>
                    <EmptyTitle>No comments yet</EmptyTitle>
                    <EmptyDescription>
                      Be the first to share your thoughts on this post.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )
            : (
                <>
                  {comments.map((comment) => {
                    const { id, text, author } = comment;
                    return <CommentCard key={id} text={text} author={author} />;
                  })}
                </>
              )}
        </div>
      </div>
    </>
  );
};
