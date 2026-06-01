import { Link, useRouter } from "@tanstack/react-router"
import { useState } from "react";
import type { Post, ValidationError } from "../types";
import { useAuth } from "../auth";

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

  return (<div className='border'>
    <div>
      <form onSubmit={commentHandler}>
        <textarea ref={commentRef} name="content"
          placeholder="Post your comment"
          rows={3}
          required
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={280} />
        <button disabled={comment.length === 0 || isLoading} type='submit'>Submit</button>
      </form>
      {errors && <ul>
        {errors.map((error, id) => {
          return <li key={id}>{error.message}</li>
        })}
      </ul>}
    </div>
    <div >
      <p>Comments</p>
      <div>{post.comments.map(comment => {
        return (
          <div key={comment.id}>
            <Link to='/users/$userId' params={{ userId: comment.userId }}>
              <img src={comment.author.avatar} alt={comment.author.username} height={25} width={25} />
            </Link>
            <div>
              <Link to='/users/$userId' params={{ userId: comment.userId }}>
                <p>{comment.author.fullname}</p>
                <span>{comment.author.username}</span>
              </Link>
              <div>{comment.text}</div>
            </div>
          </div>)
      })}
      </div>
    </div>
  </div>)
}