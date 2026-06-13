import { Link } from '@tanstack/react-router';
import { Home, Info, Pencil, UserRound, UserRoundCog, UserRoundPen, UserRoundPlus, UserRoundSearch, X } from 'lucide-react';
import { useEffect } from 'react';

type NavbarProp = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    userId: string
}

export function Navbar({ isOpen, setIsOpen, userId }: NavbarProp) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    const navData = [
        { to: "/home", name: "Home", icon: <Home size={20} /> },
        { to: `/users/${userId}`, name: "User", icon: <UserRound size={20} /> },
        { to: "/edit-profile", name: "Edit Profile", icon: <UserRoundPen size={20} /> },
        { to: "/create-post", name: "Create Post", icon: <Pencil size={20} /> },
        { to: "/follow-requests", name: "Follow Requests", icon: <UserRoundPlus size={20} /> },
        { to: "/follow-users", name: "Follow Users", icon: <UserRoundSearch size={20} /> },
        { to: "/settings", name: "Settings", icon: <UserRoundCog size={20} /> },
        { to: "/about", name: "About", icon: <Info size={20} /> },
    ]

    return (
        <div className='md:block'>
            <nav className={`fixed top-0 right-0 z-40 h-full w-64 bg-(--app-bg) border-l border-(--app-border) transition-transform duration-200 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className='flex justify-between border-b border-(--app-border) p-4'>
                    <p>Menu</p>
                    <button onClick={() => setIsOpen(false)}>
                        <X size={18} />
                    </button>
                </div>
                <ul className="flex flex-col gap-2 p-2">
                    {navData.map(nav => {
                        const { to, name, icon } = nav;
                        return (
                            <li onClick={() => setIsOpen(false)}>
                                <Link to={to}
                                    activeProps={{ className: 'text-(--app-text)' }}
                                    className='flex items-center gap-3 rounded-md p-2 text-(--app-muted) border border-(--app-bg) hover:border-(--app-border) hover:bg-(--app-surface)/70'>
                                    {icon}
                                    <p>{name}</p>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div
                className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-xs transition-opacity duration-200 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />
        </div>
    );
}

