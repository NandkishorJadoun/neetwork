import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LogOut, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type MobileNavbarProp = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navItems: readonly { to: string; params?: Record<string, string>; name: string; icon: LucideIcon }[];
  handleLogout: () => void;
  isLoggingOut: boolean;
  logoutError: string | null;
};

export function MobileNavbar({ isOpen, setIsOpen, navItems, handleLogout, isLoggingOut, logoutError }: MobileNavbarProp) {
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
            const { name, icon: Icon, ...link } = item;
            return (
              <li key={name} onClick={() => { setIsOpen(false); }}>
                <Link
                  {...link}
                  activeProps={{ className: "text-foreground" }}
                  className="flex items-center gap-3 rounded-md p-2 text-muted-foreground border border-transparent hover:border-border hover:bg-muted"
                >
                  <Icon size={20} />
                  <p>{name}</p>
                </Link>
              </li>
            );
          })}
          <li>
            <Button variant="ghost" disabled={isLoggingOut} onClick={handleLogout} className="w-full justify-start gap-3 py-2 pl-2 text-destructive hover:bg-muted hover:text-destructive">
              {isLoggingOut ? <Spinner /> : <LogOut size={20} />}
              <p>LogOut</p>
            </Button>
          </li>
          {logoutError && (
            <li>
              <p role="alert" className="px-2 text-xs text-destructive">
                {logoutError}
              </p>
            </li>
          )}
        </ul>
      </nav>

      <div
        className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-xs transition-opacity duration-200 md:hidden ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => { setIsOpen(false); }}
      />
    </div>
  );
}
