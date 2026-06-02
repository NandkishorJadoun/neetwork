import { Link, useRouter } from "@tanstack/react-router"
import { useAuth } from "../auth"
import { useState } from "react"
import type { User } from "../types"

export const FollowUserCard = ({ user }: { user: User }) => {
    const [isLoading, setIsLoading] = useState(false)
    const { user: currentUser } = useAuth()
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

    return (
        <div className='border'>
            <Link to='/users/$userId' params={{ userId: user.id }}>
                <img src={user.avatar} alt={`${user.username}'s avatar`} width={25} />
            </Link>
            <Link to='/users/$userId' params={{ userId: user.id }}>
                <p>{user.fullname}</p>
                <p>{user.username}</p>
            </Link>
            <button
                disabled={isLoading}
                onClick={sendFollowRequest}>{isLoading ? "Sending Request" : "Follow"}</button>
        </div>
    )
} 