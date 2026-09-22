import type { CommentAuthor, FieldError } from "@neetwork/contracts";
import { CreateCommentInputSchema, toFieldErrors } from "@neetwork/contracts";
import { useState } from "react";
import { ApiValidationError } from "@/libs/api-error";
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
  const [errors, setErrors] = useState<FieldError[] | null>(null);
  const [comment, setComment] = useState("");
  const { mutate, isPending } = useCreateComment(postId);

  const commentHandler = (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrors(null);

    const parsed = CreateCommentInputSchema.safeParse({ content: comment });

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error.issues));
      return;
    }

    mutate(parsed.data, {
      onSuccess: () => {
        setComment("");
        setErrors(null);
      },
      onError: (error) => {
        if (error instanceof ApiValidationError) {
          setErrors(error.errors);
        }
      },
    });
  };

  return (
    <>
      <div className="px-4 py-4 border-b border-(--app-border)">
        <form onSubmit={commentHandler} className="space-y-3">
          <textarea
            ref={commentRef}
            name="content"
            placeholder="Write a comment..."
            rows={3}
            required
            value={comment}
            onChange={(e) => { setComment(e.target.value); }}
            maxLength={280}
            className="
              w-full resize-none rounded-xl
              border border-(--app-border)
              bg-transparent px-3 py-2
              text-sm leading-relaxed text-(--app-text)
              outline-none
              placeholder:text-(--app-muted)
              focus:border-(--app-accent)
            "
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-(--app-muted)">
              {comment.length}
              /280
            </span>

            <button
              disabled={comment.trim().length === 0 || isPending}
              type="submit"
              className="
                rounded-md border border-(--app-border)
                px-4 py-2 text-sm font-medium
                text-(--app-text)
                transition-colors
                hover:bg-(--app-surface)
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isPending ? "Posting..." : "Comment"}
            </button>
          </div>
        </form>

        {errors && (
          <ul className="mt-3 rounded-md border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
            {errors.map(error => (
              <li key={`${error.fieldName}-${error.message}`}>{error.message}</li>
            ))}
          </ul>
        )}
      </div>

      <div>

        <div className="sticky top-0 text-start md:text-center border-b border-(--app-border) bg-(--app-bg)/80 px-4 py-3 font-bold backdrop-blur-md">
          Comments
        </div>

        <div className="divide-y divide-(--app-border) px-4">
          {comments.length === 0
            ? (
                <p className="py-6 text-center text-sm text-(--app-muted)">
                  No comments yet
                </p>
              )
            : (
                <>
                  {comments.map((comment) => {
                    const { id, text, author } = comment;
                    return <CommentCard key={id} text={text} author={author} />;
                  })}
                  <p className="py-6 text-center text-xs text-(--app-muted)">
                    End of list
                  </p>
                </>
              )}
        </div>
      </div>
    </>
  );
};
