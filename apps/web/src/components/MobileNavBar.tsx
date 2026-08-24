import { Link } from '@tanstack/react-router';
import { LogOut, X } from 'lucide-react';
import { useEffect, type JSX } from 'react';

type MobileNavbarProp = {
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    navItems: { to: string, name: string, icon: JSX.Element }[],
    handleLogout: () => void,
}

export function MobileNavbar({ isOpen, setIsOpen, navItems, handleLogout }: MobileNavbarProp) {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

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
                    {navItems.map(item => {
                        const { to, name, icon } = item;
                        return (
                            <li key={name} onClick={() => setIsOpen(false)}>
                                <Link to={to}
                                    activeProps={{ className: 'text-(--app-text)' }}
                                    className='flex items-center gap-3 rounded-md p-2 text-(--app-muted) border border-(--app-bg) hover:border-(--app-border) hover:bg-(--app-surface)/70'>
                                    {icon}
                                    <p>{name}</p>
                                </Link>
                            </li>
                        )
                    })}
                    <li>
                        <button onClick={handleLogout} className='w-full text-red-500 flex items-center gap-3 rounded-md py-2 pl-2 hover:bg-(--app-surface)/70'>
                            <LogOut />
                            <p>LogOut</p>
                        </button>
                    </li>
                </ul>
            </nav>

            <div
                className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-xs transition-opacity duration-200 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />
        </div>
    );
}

