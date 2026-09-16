import type { User } from "better-auth/client";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Home, Pencil, UserRound, UserRoundPlus, UserRoundSearch } from "lucide-react";
import { useScrollListener } from "../hooks/use-scroll-listener";

type BottomNavItem = {
  to: string;
  icon: LucideIcon;
};

export const MobileBottomNav = ({ user }: { user: User }) => {
  const scroll = useScrollListener();
  const opacity = scroll.y > 150 && scroll.y - scroll.lastY > 0 ? "opacity-50" : "opacity-100";

  const bottomNavItems: BottomNavItem[] = [
    { to: "/home", icon: Home },
    { to: "/follow-requests", icon: UserRoundPlus },
    { to: "/create-post", icon: Pencil },
    { to: "/follow-users", icon: UserRoundSearch },
    { to: `/users/${user.id}`, icon: UserRound },
  ];

  return (
    <div className={`md:hidden ${opacity} fixed bottom-0 left-0 right-0 flex py-3 items-center justify-around border-t border-(--app-border) bg-(--app-bg)/80 backdrop-blur-md transition-opacity duration-200`}>
      {bottomNavItems.map((item) => {
        const { to, icon: Icon } = item;
        return (
          <Link
            key={to}
            to={to}
            className="group flex items-center justify-center rounded-md p-2 transition"
            activeProps={{ className: "text-(--app-text)" }}
            inactiveProps={{ className: "text-(--app-muted)" }}
          >
            {({ isActive }) => (
              <Icon strokeWidth={isActive ? 2.5 : 2} />
            )}
          </Link>
        );
      })}
    </div>
  );
};
