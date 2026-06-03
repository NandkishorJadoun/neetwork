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

    return <div className='border'>
        <Link to="/users/$userId" params={{ userId: followRequest.fromId }}>
            <img src={sender.avatar} alt={`${sender.username}'s avatar`} width={25} />
        </Link>
        <div>
            <Link to="/users/$userId" params={{ userId: followRequest.fromId }}>
                <p>{sender.fullname}</p>
                <p>{sender.username}</p>
            </Link>
            <div>
                <button disabled={isLoading} onClick={() => requestHandler("confirm")}>Confirm</button>
                <button disabled={isLoading} onClick={() => requestHandler("delete")}>Delete</button>
            </div>
        </div>
    </div>
}