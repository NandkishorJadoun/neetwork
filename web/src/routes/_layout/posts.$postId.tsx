import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../../auth'
import type { Post, ValidationError } from '../../types'

export const Route = createFileRoute('/_layout/posts/$postId')({
  loader: async ({ context, params: { postId } }) => {
    const token = context.auth.user?.token
    const options = { headers: { Authorization: `Bearer ${token}` } }
    const baseUrl = `${import.meta.env.VITE_API_URL}/posts/${postId}`

    const res = await fetch(baseUrl, options)

    if (!res.ok) {
      throw new Error("Failed to load post")
    }

    return await res.json();
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { post }: { post: Post } = Route.useLoaderData()
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[] | null>(null)
  const [comment, setComment] = useState("")
  const { comments, likes } = post;
  const isLiked = likes.length > 0;

  const likeHandler = async () => {
    setIsLoading(true)
    const url = `${import.meta.env.VITE_API_URL}/posts/${post.id}/like`;
    const method = isLiked ? "DELETE" : "POST";
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user?.token}`
      },
    }

    try {
      await fetch(url, options);
      router.invalidate();
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false)
  }

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
      router.invalidate();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <header>Post</header>
      <main >
        <div className='border'>
          <Link to='/users/$userId' params={{ userId: post.userId }}>
            <img src={post.author.avatar} alt={post.author.username} height={25} width={25} />
            <p>{post.author.fullname}</p>
            <span>{post.author.username}</span>
          </Link>
          <div>
            <p>{post.text}</p>
            <div>
              <button disabled={isLoading} onClick={likeHandler}>{isLiked ? "Unlike" : "Like"}</button><span>{post._count.likes}</span>
              <button>Comments</button><span>{post._count.comments}</span>
            </div>
          </div>
        </div>
        <div className='border'>
          <div key={comments.length}>
            <form onSubmit={commentHandler}>
              <textarea name="content"
                placeholder="Post your comment"
                rows={3}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={280} />
              <button disabled={comment.length === 0} type='submit'>Submit</button>
            </form>
            {errors && <ul>
              {errors.map((error, id) => {
                return <li key={id}>{error.message}</li>
              })}
            </ul>}
          </div>
          <div>
            <p>Comments</p>
            <div>{post.comments.map(comment => {
              return (
                <div>
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
        </div>
      </main>
    </>
  )
}
