import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "../context/auth";
import type { User } from "../types";

export const ActionButton = ({ user }: { user: User }) => {
    const { user: currentUser } = useAuth()
    const { followers } = user;
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const sendFollowRequest = async () => {
        setIsLoading(true)
        const url = `${import.meta.env.VITE_API_URL}/users/${user.id}/follow-request`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentUser?.token}`
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

    const unfollowHandler = async (isFollowing: boolean) => {
        setIsLoading(true)
        const url = `${import.meta.env.VITE_API_URL}/users/${user.id}/${isFollowing ? "follow" : "follow-request"}`;
        const options = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${currentUser?.token}`
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

    if (currentUser && currentUser.id === user.id) {
        return <Link to='/edit-profile'>Edit Profile</Link>
    }

    if (followers.length === 0) {
        return <button disabled={isLoading} onClick={sendFollowRequest}>Follow</button>
    }

    const isFollowing = followers[0].status === "ACCEPTED";

    return <button
        disabled={isLoading} onClick={() => unfollowHandler(isFollowing)}
    >{isFollowing ? "Following" : "Requested"}</button>
}