import { useState } from 'react'
import { createFileRoute, redirect, Outlet, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/auth'
import { Home, Info, Pencil, UserRound, UserRoundCog, UserRoundPen, UserRoundPlus, UserRoundSearch } from 'lucide-react'
import { MobileNavbar } from '../components/MobileNavBar'
import { SideBar } from '../components/SideBar'
import { MobileNavContext } from "../context/mobileNav"
import { MobileBottomNav } from '../components/MobileBottomNav'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated || !context.auth.user) {
      throw redirect({
        to: '/login',
      })
    }
    return {
      user: context.auth.user
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate({ to: '/login', replace: true })
  }

  const navItems = [
    { to: "/home", name: "Home", icon: <Home size={20} /> },
    { to: `/users/${user?.id}`, name: "User", icon: <UserRound size={20} /> },
    { to: "/edit-profile", name: "Edit Profile", icon: <UserRoundPen size={20} /> },
    { to: "/create-post", name: "Create Post", icon: <Pencil size={20} /> },
    { to: "/follow-requests", name: "Follow Requests", icon: <UserRoundPlus size={20} /> },
    { to: "/follow-users", name: "Follow Users", icon: <UserRoundSearch size={20} /> },
    { to: "/settings", name: "Settings", icon: <UserRoundCog size={20} /> },
    { to: "/about", name: "About", icon: <Info size={20} /> },
  ]

  return (
    <>
      <div className='flex min-h-dvh'>
        <div className='hidden md:block w-56'>
          <div className='sticky top-0 flex flex-col'>
            <header>
              <Link to='/home' className="text-2xl block p-2 pl-4 font-bold">Neetwork</Link>
            </header>
            <SideBar navItems={navItems} handleLogout={handleLogout} />
          </div>
        </div>

        <MobileNavbar isOpen={isOpen} setIsOpen={setIsOpen} navItems={navItems} handleLogout={handleLogout} />
        <MobileNavContext.Provider value={{ isOpen, setIsOpen }} >
          <main className="md:pb-0 pb-16 flex-1 border border-(--app-border) border-y-0">
            <Outlet />
          </main>
        </MobileNavContext.Provider>
      </div>
      <MobileBottomNav />
    </>
  )
}