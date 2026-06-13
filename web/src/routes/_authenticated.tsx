import { useState } from 'react'
import { createFileRoute, redirect, Outlet, Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/auth'
import { Home, Info, LogOut, Pencil, UserRound, UserRoundCog, UserRoundPen, UserRoundPlus, UserRoundSearch } from 'lucide-react'
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
  const { user, logout } = useAuth();
  const navigate = useNavigate()
  const handleLogout = () => {
    logout()
    navigate({ to: '/login', replace: true })
  }
  if (!user) return

  const navData = [
    { to: "/home", icon: <Home /> },
    { to: "/follow-requests", icon: <UserRoundPlus /> },
    { to: "/create-post", icon: <Pencil /> },
    { to: "/follow-users", icon: <UserRoundSearch /> },
    { to: `/users/${user.id}`, icon: <UserRound /> },
  ]

  const laptopNavData = [
    { to: "/home", name: "Home", icon: <Home size={20} /> },
    { to: `/users/${user.id}`, name: "User", icon: <UserRound size={20} /> },
    { to: "/edit-profile", name: "Edit Profile", icon: <UserRoundPen size={20} /> },
    { to: "/create-post", name: "Create Post", icon: <Pencil size={20} /> },
    { to: "/follow-requests", name: "Follow Requests", icon: <UserRoundPlus size={20} /> },
    { to: "/follow-users", name: "Follow Users", icon: <UserRoundSearch size={20} /> },
    { to: "/settings", name: "Settings", icon: <UserRoundCog size={20} /> },
    { to: "/about", name: "About", icon: <Info size={20} /> },
  ]

  return (
    <>
      {/* <header className="fixed top-0 left-0 right-0 z-20">
        <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 backdrop-blur-md border-b border-(--app-border) bg-(--app-bg)/80'>
          <Link to='/home' className="text-lg font-bold">Neetwork</Link>
          <button>
            <Menu size={18} onClick={() => setIsOpen(true)} />
          </button>
        </div>
      </header> */}

      <div className='flex min-h-dvh'>
        <div className='hidden md:block w-56'>
          <div className='sticky top-0 flex flex-col'>
            <header>
              <Link to='/home' className="text-2xl block p-2 pl-4 font-bold">Neetwork</Link>
            </header>
            <aside className='flex-1'>
              <nav>
                <ul className="flex flex-col gap-2 mt-2 pr-2">
                  {laptopNavData.map(nav => {
                    const { to, name, icon } = nav;
                    return (
                      <li key={name}>
                        <Link to={to}
                          activeProps={{ className: 'text-(--app-text)' }}
                          className='flex items-center gap-3 rounded-md py-2 pl-4 text-(--app-muted) hover:bg-(--app-surface)/70'>
                          {icon}
                          <p>{name}</p>
                        </Link>
                      </li>
                    )
                  })}
                  <li>
                    <button onClick={handleLogout} className='w-full text-red-500 flex items-center gap-3 rounded-md py-2 pl-4 hover:bg-(--app-surface)/70'>
                      <LogOut />
                      <p>LogOut</p>
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>
          </div>
        </div>

        <main className="pb-12 flex-1 border border-(--app-border) border-y-0">
          <Outlet />
        </main>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 flex h-12 items-center justify-around border-t border-(--app-border) bg-(--app-bg)/80 backdrop-blur-md">
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