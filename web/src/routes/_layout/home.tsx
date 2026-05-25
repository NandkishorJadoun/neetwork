import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import type { Post } from '../../types'
import { useAuth } from '../../auth'
import { useState } from 'react'

type PostSearch = {
  posts?: 'following'
}

export const Route = createFileRoute('/_layout/home')({
  validateSearch: (search: Record<string, unknown>): PostSearch => {
    return {
      posts: search.posts === 'following' ? 'following' : undefined,
    }
  },
  loaderDeps: ({ search }) => ({ posts: search.posts }),
  loader: async ({ context, deps }) => {
    const { posts } = deps;
    const token = context.auth.user?.token
    const url = `${import.meta.env.VITE_API_URL}/posts${posts ? '/following' : ""}`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return await res.json()
  },
  component: RouteComponent,
})

function RouteComponent() {
  const activeTab = Route.useSearch().posts
  const { posts }: { posts: Post[] } = Route.useLoaderData()
  return (
    <>
      <header className="border">Header</header>
      <div className="border">
        <Link to="/home" className={`${!activeTab && "bg-blue-500"}`}> All</Link>
        <Link to="/home" search={{ posts: 'following' }} className={`${activeTab && "bg-blue-500"}`} >Following</Link>
      </div>
      <main>
        {posts.map(post => {
          return <PostCard key={post.id} post={post} />
        })}
      </main>
    </>
  )
}

export const PostCard = ({ post }: { post: Post }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
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
    <div key={post.id} className='border'>
      <Link to='/users/$userId' params={{ userId: post.userId }}>
        <img src={post.author.avatar} alt={post.author.username} height={25} width={25} />
      </Link>
      <div>
        <Link to='/users/$userId' params={{ userId: post.userId }}>
          <p>{post.author.fullname}</p>
          <span>{post.author.username}</span>
        </Link>
        <Link
          to='/posts/$postId'
          params={{ postId: post.id }}
        >{post.text}</Link>
        <div>
          <div>
            <button disabled={isLoading} onClick={likeHandler}>{isLiked ? "Unlike" : "Like"}</button><span>{post._count.likes}</span>
            <button>Comments</button><span>{post._count.comments}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 
