import { createFileRoute, redirect, Outlet, Link } from '@tanstack/react-router'
import { useAuth } from '../context/auth'
import { Home, Menu, Pencil, UserRound, UserRoundPlus, UserRoundSearch } from 'lucide-react'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const style = 'font-bold border-b-2 border-(--app-accent)'
  const { user } = useAuth()
  if (!user) return null

  return (
    <>
      <header className="fixed top-0 left-0 right-0  h-12 border-b border-(--app-border) bg-(--app-bg)/80 px-2.5 flex items-center justify-between backdrop-blur-md">
        <h1 className="text-lg font-bold">Neetwork</h1>
        <button>
          <Menu size={16} />
        </button>
      </header>

      <main className="py-12">
        <Outlet />
      </main>

      <div className="fixed bottom-0 left-0 right-0 flex h-12 items-center justify-around border-t border-(--app-border) bg-(--app-bg)/80 backdrop-blur-md">
        <Link to="/home" activeProps={{ className: style }}>
          <Home />
        </Link>
        <Link to="/follow-requests" activeProps={{ className: style }}>
          <UserRoundPlus />
        </Link>
        <Link to="/create-post" activeProps={{ className: style }}>
          <Pencil />
        </Link>
        <Link to="/follow-users" activeProps={{ className: style }}>
          <UserRoundSearch />
        </Link>
        <Link
          to="/users/$userId"
          params={{ userId: user.id }}
          activeProps={{ className: style }}
        >
          <UserRound />
        </Link>
      </div>
    </>
  )
}