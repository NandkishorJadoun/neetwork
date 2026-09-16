import { createFileRoute, Link, Outlet, redirect } from "@tanstack/react-router";
import { Home, Info, Pencil, UserRound, UserRoundCog, UserRoundPen, UserRoundPlus, UserRoundSearch } from "lucide-react";
import { useState } from "react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { MobileNavbar } from "@/components/mobile-nav-bar";
import { SideBar } from "@/components/side-bar";
import { MobileNavContext } from "@/context/mobile-nav";
import { getSession, signOut } from "@/libs/auth-client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const { data } = await getSession();
    if (!data) {
      throw redirect({
        to: "/signin",
      });
    }
    return {
      user: data.user,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = Route.useRouteContext();

  const handleLogout = () => {
    signOut();
    // navigate({ to: "/login", replace: true });
  };

  const navItems = [
    { to: "/home", name: "Home", icon: <Home size={20} /> },
    { to: `/users/${user.id}`, name: "User", icon: <UserRound size={20} /> },
    { to: "/edit-profile", name: "Edit Profile", icon: <UserRoundPen size={20} /> },
    { to: "/create-post", name: "Create Post", icon: <Pencil size={20} /> },
    { to: "/follow-requests", name: "Follow Requests", icon: <UserRoundPlus size={20} /> },
    { to: "/follow-users", name: "Follow Users", icon: <UserRoundSearch size={20} /> },
    { to: "/settings", name: "Settings", icon: <UserRoundCog size={20} /> },
    { to: "/about", name: "About", icon: <Info size={20} /> },
  ];

  return (
    <>
      <div className="flex min-h-dvh">
        <div className="hidden md:block w-56">
          <div className="sticky top-0 flex flex-col">
            <header>
              <Link to="/home" className="text-2xl block p-2 pl-4 font-bold">Neetwork</Link>
            </header>
            <SideBar navItems={navItems} handleLogout={handleLogout} />
          </div>
        </div>

        <MobileNavbar isOpen={isOpen} setIsOpen={setIsOpen} navItems={navItems} handleLogout={handleLogout} />
        <MobileNavContext value={{ isOpen, setIsOpen }}>
          <main className="md:pb-0 pb-16 flex-1 border border-(--app-border) border-y-0">
            <Outlet />
          </main>
        </MobileNavContext>
      </div>
      <MobileBottomNav user={user} />
    </>
  );
}
