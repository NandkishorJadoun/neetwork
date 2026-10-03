import type { JSX } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type MobileNavbarProp = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navItems: { to: string; name: string; icon: JSX.Element }[];
  handleLogout: () => void;
};

export function MobileNavbar({ isOpen, setIsOpen, navItems, handleLogout }: MobileNavbarProp) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div className="md:block">
      <nav className={`fixed top-0 right-0 z-40 h-full w-64 bg-background border-l border-border transition-transform duration-200 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex justify-between border-b border-border p-4">
          <p>Menu</p>
          <Button variant="ghost" size="icon" onClick={() => { setIsOpen(false); }}>
            <X />
          </Button>
        </div>
        <ul className="flex flex-col gap-2 p-2">
          {navItems.map((item) => {
            const { to, name, icon } = item;
            return (
              <li key={name} onClick={() => { setIsOpen(false); }}>
                <Link
                  to={to}
                  activeProps={{ className: "text-foreground" }}
                  className="flex items-center gap-3 rounded-md p-2 text-muted-foreground border border-transparent hover:border-border hover:bg-muted"
                >
                  {icon}
                  <p>{name}</p>
                </Link>
              </li>
            );
          })}
          <li>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 py-2 pl-2 text-destructive hover:bg-muted hover:text-destructive">
              <LogOut size={20} />
              <p>LogOut</p>
            </Button>
          </li>
        </ul>
      </nav>

      <div
        className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-xs transition-opacity duration-200 md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => { setIsOpen(false); }}
      />
    </div>
  );
}
