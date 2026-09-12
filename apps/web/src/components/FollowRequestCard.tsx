import { useRouter, Link } from "@tanstack/react-router";
import { useAuth } from "../context/auth";
import { useState } from "react";
import type { Follow } from "../types";

export const FollowRequestCard = ({ followRequest }: { followRequest: Follow }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()
    const router = useRouter()

    const { sender } = followRequest;
    const requestHandler = async (action: "confirm" | "delete") => {
        setIsLoading(true)
        const url = `${import.meta.env.VITE_API_URL}/me/follow-requests/${followRequest.fromId}`;
        const method = action === "confirm" ? "PATCH" : "DELETE"
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
        <div className="flex items-center justify-between gap-3 border-b border-(--app-border) px-4 py-3">
            <Link
                to="/users/$userId"
                params={{ userId: followRequest.fromId }}
                className="flex items-center gap-3 min-w-0"
            >
                <img
                    src={sender.avatar}
                    alt={`${sender.username}'s avatar`}
                    className="h-10 w-10 rounded-full object-cover"
                />

                <div className="min-w-0">
                    <p className="truncate font-medium text-(--app-text)">
                        {sender.fullname}
                    </p>

                    <p className="truncate text-sm text-(--app-muted)">
                        @{sender.username}
                    </p>
                </div>
            </Link>

            <div className="flex items-center gap-2">
                <button
                    disabled={isLoading}
                    onClick={() => requestHandler("confirm")}
                    className="shrink-0 rounded-md border border-(--app-accent) bg-(--app-accent) px-3 py-1.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? "Confirming..." : "Confirm"}
                </button>

                <button
                    disabled={isLoading}
                    onClick={() => requestHandler("delete")}
                    className="shrink-0 rounded-md border border-(--app-border) px-3 py-1.5 text-sm font-medium hover:bg-(--app-surface) disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    )
}