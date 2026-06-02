import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../auth";
import type { Follow } from "../types";

type FollowingCardProp = {
    following: Follow,
    isCurrentUser: boolean
}

export const FollowingCard = ({ following, isCurrentUser }: FollowingCardProp) => {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { receiver } = following;

    const unfollowHandler = async () => {
        setIsLoading(true)
        const url = `${import.meta.env.VITE_API_URL}/users/${following.toId}/follow`;
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
        <Link to="/users/$userId" params={{ userId: following.toId }}>
            <img src={receiver.avatar} alt={`${receiver.username}'s avatar`} width={25} />
            <div>
                <p>{receiver.fullname}</p>
                <p>{receiver.username}</p>
            </div>
        </Link>
        {isCurrentUser &&
            <button disabled={isLoading} onClick={unfollowHandler}>Unfollow</button>}

    </div>
}