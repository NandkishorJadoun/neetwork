import { linkOptions } from "@tanstack/react-router";
import { Home, Info, UserRound, UserRoundCog, UserRoundPen, UserRoundPlus, UserRoundSearch } from "lucide-react";

export const getNavItems = (userId: string) =>
  linkOptions([
    { to: "/home", name: "Home", icon: Home },
    {
      to: "/users/$userId",
      params: { userId },
      name: "Profile",
      icon: UserRound,
    },
    { to: "/edit-profile", name: "Edit Profile", icon: UserRoundPen },
    { to: "/follow-requests", name: "Follow Requests", icon: UserRoundPlus },
    { to: "/follow-users", name: "Follow Users", icon: UserRoundSearch },
    { to: "/settings", name: "Settings", icon: UserRoundCog },
    { to: "/about", name: "About", icon: Info },
  ]);
