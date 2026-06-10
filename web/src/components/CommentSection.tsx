import { useRouter } from "@tanstack/react-router"
import { useState } from "react";
import type { Post, ValidationError } from "../types";
import { useAuth } from "../context/auth";
import { CommentCard } from "./CommentCard";

interface CommentSection {
  post: Post
  commentRef: React.RefObject<HTMLTextAreaElement | null>,
}

export const CommentSection = ({ post, commentRef }: CommentSection) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[] | null>(null)
  const [comment, setComment] = useState("")

  const { user } = useAuth();
  const router = useRouter();

  const commentHandler = async (e: React.SubmitEvent) => {

    e.preventDefault()
    setIsLoading(true)
    const url = `${import.meta.env.VITE_API_URL}/posts/${post.id}`;
    const method = "POST";
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user?.token}`
      },
      body: JSON.stringify({ content: comment })
    }

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const { errors } = await res.json()
        setErrors(errors)
        setIsLoading(false)
        return
      }
      setComment("")
      setErrors(null)
      setIsLoading(false)
      router.invalidate()

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <section>
      <div className="px-4 py-4 border-b border-(--app-border)">
        <form onSubmit={commentHandler} className="space-y-3">
          <textarea
            ref={commentRef}
            name="content"
            placeholder="Write a comment..."
            rows={3}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
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
              {comment.length}/280
            </span>

            <button
              disabled={comment.trim().length === 0 || isLoading}
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
              {isLoading ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </form>

        {errors && (
          <ul className="mt-3 rounded-md border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
            {errors.map((error, id) => (
              <li key={id}>{error.message}</li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="border-b border-(--app-border) sticky top-14 z-10 bg-(--app-bg)/80 px-4 py-2 backdrop-blur-md">
          <p className="text-sm font-medium">Comments</p>
        </div>

        <div className="divide-y divide-(--app-border) px-4">
          {post.comments.map((comment) => {
            const { id, text, author } = comment
            return <CommentCard key={id} text={text} author={author} />
          })}
        </div>
      </div>
    </section>
  )
}

