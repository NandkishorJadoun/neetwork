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

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-(--app-bg) px-4">
            <div className="w-full max-w-sm rounded-xl border border-(--app-border) bg-(--app-surface) p-8">
                <h1 className="mb-6 text-center text-xl font-bold text-(--app-text)">
                    Sign in to Neetwork
                </h1>

                {error && (
                    <div className="mb-4 border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-500">
                        {error}
                    </div>
                )}

                <a
                    href={`${import.meta.env.VITE_API_URL}/auth/github`}
                    className="flex w-full items-center justify-center gap-2 rounded-md border border-(--app-border) px-4 py-2 text-sm font-medium text-(--app-text) transition-colors hover:bg-(--app-surface)"
                >
                    Sign in with GitHub
                </a>

                <div className="relative my-6">
                    <div className="border-t border-(--app-border)" />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-(--app-surface) px-2 text-xs text-(--app-muted)">
                        or
                    </span>
                </div>

                <button
                    disabled={isLoading}
                    onClick={guestLoginHandler}
                    className="w-full rounded-md border border-(--app-accent) bg-(--app-accent) px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {isLoading ? "Logging in..." : "Continue as Guest"}
                </button>
            </div>
        </div>
    )
}

