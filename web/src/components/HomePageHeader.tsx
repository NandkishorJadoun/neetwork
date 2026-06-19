import { Menu } from "lucide-react"
import { useMobileNav } from "../context/mobileNav";
import { useScrollListener } from "../hooks/useScrollListener";
import { Link } from "@tanstack/react-router";

export const HomePageHeader = ({ tab }: { tab?: "following" }) => {
    const { setIsOpen } = useMobileNav()
    const scroll = useScrollListener();

    const tabBase = 'px-4 py-2 text-sm font-medium text-(--app-muted) transition-colors'
    const tabActive = 'text-(--app-text) border-b-2 border-(--app-accent)'

    return <div className={`${scroll.y > 150 && scroll.y - scroll.lastY > 0 ? "invisible -translate-y-full" : "visible"} transition-all duration-200 sticky top-0 border-b border-(--app-border) bg-(--app-bg)/80 px-4 font-bold backdrop-blur-md`}>
        <div className='md:hidden flex items-center justify-between pt-3'>
            <Link to='/home' className="text-lg font-bold">Neetwork</Link>
            <button>
                <Menu size={18} onClick={() => setIsOpen(true)} />
            </button>
        </div>
        <div className="mx-auto flex justify-center gap-6">
            <Link
                to="/home"
                className={`${tabBase} ${!tab ? tabActive : ''}`}
            >
                All
            </Link>
            <Link
                to="/home"
                search={{ posts: 'following' }}
                className={`${tabBase} ${tab ? tabActive : ''}`}
            >
                Following
            </Link>
        </div>
    </div>
}