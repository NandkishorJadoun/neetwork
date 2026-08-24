import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import type { JSX } from "react";

type SideBarProp = {
    navItems: { to: string, name: string, icon: JSX.Element }[],
    handleLogout: () => void
}

export const SideBar = ({ navItems, handleLogout }: SideBarProp) => {

    return (
        <aside className='flex-1'>
            <nav>
                <ul className="flex flex-col gap-2 mt-2 pr-2">
                    {navItems.map(item => {
                        const { to, name, icon } = item;
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
    )
}