import { Link } from "@tanstack/react-router"
import { useAuth } from "../context/auth"
import { useState } from "react"
import type { User } from "../types"

export const FollowUserCard = ({ user }: { user: User }) => {
    const [isRequestSent, setIsRequestSent] = useState(false);
    const { user: currentUser } = useAuth()

    const sendFollowRequest = async () => {
        setIsRequestSent(true)
        const url = `${import.meta.env.VITE_API_URL}/users/${user.id}/follow-request`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentUser?.token}`
            },
        }

        try {
            const res = await fetch(url, options);

            if (!res.ok) {
                setIsRequestSent(false)
            }

        } catch (error) {
            console.error(error);
        }
    }

    if (isRequestSent) return null

    return (
        <div className="flex items-center justify-between gap-3 border-b border-(--app-border) px-4 py-3">
            <Link
                to="/users/$userId"
                params={{ userId: user.id }}
                className="flex items-center gap-3 min-w-0"
            >
                <img
                    src={user.avatar}
                    alt={`${user.username}'s avatar`}
                    className="h-10 w-10 rounded-full object-cover"
                />

                <div className="min-w-0">
                    <p className="truncate font-medium text-(--app-text)">
                        {user.fullname}
                    </p>

                    <p className="truncate text-sm text-(--app-muted)">
                        @{user.username}
                    </p>
                </div>
            </Link>

            <button
                onClick={sendFollowRequest}
                className="shrink-0 rounded-md border border-(--app-border) px-3 py-1.5 text-sm font-medium hover:bg-(--app-surface)"
            >
                Follow
            </button>
        </div>
    )
} 