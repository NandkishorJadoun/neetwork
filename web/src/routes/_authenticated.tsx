import { createFileRoute, redirect, Outlet, Link } from '@tanstack/react-router'
import { useAuth } from '../context/auth'
import { Home, Menu, Pencil, UserRound, UserRoundPlus, UserRoundSearch } from 'lucide-react'
import { useState } from 'react'
import { Navbar } from '../components/MobileNavBar'

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
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth()
  if (!user) return

  const navData = [
    { to: "/home", icon: <Home /> },
    { to: "/follow-requests", icon: <UserRoundPlus /> },
    { to: "/create-post", icon: <Pencil /> },
    { to: "/follow-users", icon: <UserRoundSearch /> },
    { to: `/users/${user.id}`, icon: <UserRound /> },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-20 h-14 border-b border-(--app-border) bg-(--app-bg)/80 px-4 flex items-center justify-between backdrop-blur-md">
        <Link to='/home' className="text-lg font-bold">Neetwork</Link>
        <button>
          <Menu size={18} onClick={() => setIsOpen(true)} />
        </button>
      </header>

      <main className="pt-14 pb-12">
        <Outlet />
      </main>

      <div className="fixed bottom-0 left-0 right-0 flex h-12 items-center justify-around border-t border-(--app-border) bg-(--app-bg)/80 backdrop-blur-md">
        {navData.map(nav => {
          const { to, icon } = nav
          return <Link
            to={to}
            className='border-b-2 border-transparent'
            activeProps={{ className: "border-(--app-accent)!" }}
          >{icon}</Link>
        })}
      </div>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} userId={user.id} />
    </>
  )
}