import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "../auth";
import { useState } from "react";
import type { Post } from "../types";

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
    <div className='border'>
      <Link to='/users/$userId' params={{ userId: post.userId }}>
        <img src={post.author.avatar} alt={`${post.author.username}'s avatar`} width={25} />
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
            <button disabled={isLoading} onClick={likeHandler}>{isLiked ? "Unlike" : "Like"}</button>
            <Link to='/posts/$postId/likes' params={{ postId: post.id }}>{post._count.likes}</Link>
            <Link
              to='/posts/$postId'
              params={{ postId: post.id }}
              hash="comment"
            >Comments</Link>
            <span> {post._count.comments}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 