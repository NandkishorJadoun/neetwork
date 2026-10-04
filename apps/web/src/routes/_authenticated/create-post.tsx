import type { FieldError } from "@neetwork/contracts";
import { CreatePostInputSchema, toFieldErrors } from "@neetwork/contracts";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { useCreatePost } from "../../features/posts/mutations";
import { ApiValidationError } from "../../libs/api-error";

export const Route = createFileRoute("/_authenticated/create-post")({
  component: RouteComponent,
});

function RouteComponent() {
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<FieldError[] | null>(null);
  const navigate = useNavigate();
  const { mutate, isPending } = useCreatePost();

  const submitPostHandler = (e: React.SubmitEvent) => {
    e.preventDefault();
    setErrors(null);

    const parsed = CreatePostInputSchema.safeParse({ content });

    if (!parsed.success) {
      setErrors(toFieldErrors(parsed.error.issues));
      return;
    }

    mutate(parsed.data, {
      onSuccess: () => {
        navigate({ to: "/home" });
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
      <PageHeader>Create post</PageHeader>
      <form className="md:w-md mx-auto w-full p-4" onSubmit={submitPostHandler}>
        <textarea
          name="content"
          placeholder="What's happening?"
          value={content}
          onChange={(e) => { setContent(e.target.value); }}
          maxLength={280}
          rows={10}
          required
          className="w-full resize-none text-base text-(--app-text) outline-none border border-(--app-border) placeholder:text-(--app-muted) focus:border-(--app-accent) px-3 py-2 rounded-md"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-(--app-muted)">
            {content.length}
            /280
          </span>

          <button
            disabled={content.trim().length === 0 || isPending}
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
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>

        {errors
          && (
            <ul className="mt-4 border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
              {errors.map(error => (
                <li key={`${error.fieldName}-${error.message}`}>{error.message}</li>
              ))}
            </ul>
          )}
      </form>
    </>
  );
}
