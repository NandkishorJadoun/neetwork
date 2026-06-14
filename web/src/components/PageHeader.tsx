import { Menu } from "lucide-react";
import type { JSX } from "react";
import { useMobileNav } from "../context/mobileNav";

export const PageHeader = ({ children }: { children: JSX.Element | string }) => {

    const { setIsOpen } = useMobileNav()

    return (
        <div className="sticky top-0 border-b border-(--app-border) bg-(--app-bg)/80 px-4 py-3 font-bold backdrop-blur-md">
            <div className='flex items-center justify-between md:justify-center'>
                {children}
                <button className='md:hidden'>
                    <Menu size={18} onClick={() => setIsOpen(true)} />
                </button>
            </div>
        </div>
    );
}