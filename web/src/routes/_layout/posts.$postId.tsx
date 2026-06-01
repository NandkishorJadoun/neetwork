import { createFileRoute, Link, useRouter, useLocation } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../auth'
import type { Post } from '../../types'
import { CommentSection } from '../../components/CommentSection'

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
  const { hash } = useLocation();

  const [isLoading, setIsLoading] = useState(false);

  const commentRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (hash !== "comment") return

    commentRef.current?.scrollIntoView({ behavior: "smooth" })
    commentRef.current?.focus()

  }, [hash])

  const isLiked = post.likes.length > 0;

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
              <a href='#comment'>Comments</a><span>{post._count.comments}</span>
            </div>
          </div>
        </div>
        <CommentSection post={post} commentRef={commentRef} />
      </main>
    </>
  )
}
