import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../context/auth'

export const Route = createFileRoute('/login')({
    beforeLoad: ({ context }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({
                to: '/',
            })
        }
    },
    component: RouteComponent,
})

function RouteComponent() {
    const { setUser } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const guestLoginHandler = async () => {
        setIsLoading(true)
        const url = `${import.meta.env.VITE_API_URL}/auth/guest`
        try {
            const res = await fetch(url)

            if (!res.ok) {
                const error = await res.text();
                setError(error)
                return
            }

            const { token, id } = await res.json()
            setUser({ token, id })
            navigate({ to: "/home", replace: true })

        } catch (error) {
            console.error(error)
        }
        setIsLoading(false)
    }

    return <div className="">
        <a href={`${import.meta.env.VITE_API_URL}/auth/github`}>Signin with Github</a>
        <button disabled={isLoading} onClick={guestLoginHandler}
        >{isLoading ? "Logging in..." : "Guest"}</button>
        {error && <p>{error}</p>}
    </div>
}

