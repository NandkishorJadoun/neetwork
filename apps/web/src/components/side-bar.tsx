import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

type SideBarProp = {
  navItems: readonly { to: string; params?: Record<string, string>; name: string; icon: LucideIcon }[];
  handleLogout: () => void;
  isLoggingOut: boolean;
  logoutError: string | null;
};

export const SideBar = ({ navItems, handleLogout, isLoggingOut, logoutError }: SideBarProp) => {
  return (
    <aside className="flex-1">
      <nav>
        <ul className="flex flex-col gap-2 mt-2 pr-2">
          {navItems.map((item) => {
            const { name, icon: Icon, ...link } = item;
            return (
              <li key={name}>
                <Link
                  {...link}
                  activeProps={{ className: "text-foreground" }}
                  className="flex items-center gap-3 rounded-md py-2 pl-4 text-muted-foreground hover:bg-muted"
                >
                  <Icon size={20} />
                  <p>{name}</p>
                </Link>
              </li>
            );
          })}
          <li>
            <Button variant="ghost" disabled={isLoggingOut} onClick={handleLogout} className="w-full justify-start gap-3 py-2 pl-4 text-destructive hover:bg-muted hover:text-destructive">
              {isLoggingOut ? <Spinner /> : <LogOut size={20} />}
              <p>LogOut</p>
            </Button>
          </li>
          {logoutError && (
            <li>
              <p role="alert" className="px-4 text-xs text-destructive">
                {logoutError}
              </p>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};
