import { Link, useRouter } from "@tanstack/react-router";
import { useAuth } from "../context/auth";
import { useState } from "react";
import type { Post } from "../types";
import { Heart, MessageCircle } from "lucide-react";

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
    <div className='border-y border-(--app-border) bg-(--app-surface) flex gap-2 p-2'>
      <Link className="block shrink-0" to='/users/$userId' params={{ userId: post.userId }}>
        <img className="rounded-full aspect-square" src={post.author.avatar} alt={`${post.author.username}'s avatar`} width={35} />
      </Link>
      <div className="flex flex-col">
        <Link className="flex gap-1"
          to='/users/$userId' params={{ userId: post.userId }}>
          <p className="font-bold">{post.author.fullname}</p>
          <p className="text-(--app-muted)/80">@{post.author.username}</p>
        </Link>
        <Link
          to='/posts/$postId'
          params={{ postId: post.id }}
        >{post.text}</Link>
        <div className="pt-1 flex items-center gap-5">
          <div className="flex items-center">
            <button
              disabled={isLoading}
              onClick={likeHandler}
              className={`${isLiked ? "text-pink-600" : "inherit"} rounded-full p-1 transition-colors hover:bg-pink-600/20 hover:text-pink-600 disabled:`}>
              <Heart fill={`${isLiked ? "#db2777" : "var(--app-surface)"}`} size={16} />
            </button>
            <Link to='/posts/$postId/likes' params={{ postId: post.id }}>{post._count.likes}</Link>
          </div>
          <div className="flex items-center ">
            <Link
              to='/posts/$postId'
              params={{ postId: post.id }}
              hash="comment"
              className="rounded-full p-1 transition-colors hover:bg-emerald-500/20 hover:text-emerald-500">
              <MessageCircle size={16} />
            </Link>
            <p> {post._count.comments}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 