import type { JSX } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

type SideBarProp = {
  navItems: { to: string; name: string; icon: JSX.Element }[];
  handleLogout: () => void;
};

export const SideBar = ({ navItems, handleLogout }: SideBarProp) => {
  return (
    <aside className="flex-1">
      <nav>
        <ul className="flex flex-col gap-2 mt-2 pr-2">
          {navItems.map((item) => {
            const { to, name, icon } = item;
            return (
              <li key={name}>
                <Link
                  to={to}
                  activeProps={{ className: "text-foreground" }}
                  className="flex items-center gap-3 rounded-md py-2 pl-4 text-muted-foreground hover:bg-muted"
                >
                  {icon}
                  <p>{name}</p>
                </Link>
              </li>
            );
          })}
          <li>
            <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 py-2 pl-4 text-destructive hover:bg-muted hover:text-destructive">
              <LogOut size={20} />
              <p>LogOut</p>
            </Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};
