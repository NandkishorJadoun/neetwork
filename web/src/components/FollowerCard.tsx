import { useState } from "react";
import { useAuth } from "../context/auth";
import { Link, useRouter } from "@tanstack/react-router";
import type { Follow } from "../types";

type FollowerCardProp = {
  follower: Follow,
  isCurrentUser: boolean
}

export const FollowerCard = ({ follower, isCurrentUser }: FollowerCardProp) => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { sender } = follower;

  const removeFollower = async () => {
    setIsLoading(true)
    const url = `${import.meta.env.VITE_API_URL}/me/followers/${follower.fromId}`;
    const options = {
      method: "DELETE",
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

  return <div className='border'>
    <Link to="/users/$userId" params={{ userId: follower.fromId }}>
      <img src={sender.avatar} alt={`${sender.username}'s avatar`} width={25} />
      <div>
        <p>{sender.fullname}</p>
        <p>{sender.username}</p>
      </div>
    </Link>
    {isCurrentUser &&
      <button disabled={isLoading} onClick={removeFollower}>Remove</button>}
  </div>
}