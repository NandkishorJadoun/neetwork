import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../context/auth";
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

    return (
        <div className="flex items-center justify-between gap-3 border-b border-(--app-border) px-4 py-3">
            <Link
                to="/users/$userId"
                params={{ userId: following.toId }}
                className="flex items-center gap-3 min-w-0"
            >
                <img
                    src={receiver.avatar}
                    alt={`${receiver.username}'s avatar`}
                    className="h-10 w-10 rounded-full object-cover"
                />

                <div className="min-w-0">
                    <p className="truncate font-medium text-(--app-text)">
                        {receiver.fullname}
                    </p>

                    <p className="truncate text-sm text-(--app-muted)">
                        @{receiver.username}
                    </p>
                </div>
            </Link>

            {isCurrentUser &&
                <button
                    disabled={isLoading}
                    onClick={unfollowHandler}
                    className="shrink-0 rounded-md border border-(--app-border) px-3 py-1.5 text-sm font-medium hover:bg-(--app-surface) disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? "Unfollowing..." : "Unfollow"}
                </button>}
        </div>
    )
}