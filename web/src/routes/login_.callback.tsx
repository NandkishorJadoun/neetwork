import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '../context/auth'
import { useEffect } from 'react'

export const Route = createFileRoute('/login_/callback')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      token: String(search.token ?? ''),
      id: String(search.id ?? ''),
    }
  }
})

function RouteComponent() {
  const { setUser } = useAuth()
  const { token, id } = Route.useSearch()

  useEffect(() => {
    setUser({ token, id })
  }, [id, setUser, token])

  return <Navigate to='/' replace />
}