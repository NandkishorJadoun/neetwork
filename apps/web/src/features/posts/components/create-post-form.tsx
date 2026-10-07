import { CreatePostInputSchema, toValidationMessage } from "@neetwork/contracts";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError as FieldErrorMessage } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePost } from "../mutations";

export const CreatePostForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState("");
  const { mutate, isPending } = useCreatePost();

  const submitPostHandler = (e: React.SubmitEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = CreatePostInputSchema.safeParse({ content });

    if (!parsed.success) {
      setError(toValidationMessage(parsed.error.issues));
      return;
    }

    mutate(parsed.data, {
      onSuccess: () => {
        setContent("");
        setError(null);
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };

  return (
    <form onSubmit={submitPostHandler} className="space-y-3">
      <Field data-invalid={Boolean(error)}>
        <Textarea
          name="content"
          placeholder="What's happening?"
          rows={3}
          required
          value={content}
          onChange={(e) => { setContent(e.target.value); }}
          maxLength={280}
          aria-invalid={Boolean(error)}
        />

        {error && <FieldErrorMessage>{error}</FieldErrorMessage>}
      </Field>

      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {content.length}
          /280
        </span>

        <Button
          size="sm"
          disabled={content.trim().length === 0 || isPending}
          type="submit"
        >
          {isPending ? <Spinner /> : null}
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
};
