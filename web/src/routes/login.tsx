import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
    beforeLoad: ({ context }) => {
        if (context.auth.isAuthenticated) {
            throw redirect({
                to: '/',
            })
        }
    },
    component: () => {
        return <div className="">
            <a href={`${import.meta.env.VITE_API_URL}/auth/github`}>Signin with Github</a>
            <p>Guest</p>
        </div>
    },
})
