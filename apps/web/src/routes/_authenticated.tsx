import { createFileRoute, Link, Outlet, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { MobileNavbar } from "@/components/mobile-nav-bar";
import { SideBar } from "@/components/side-bar";
import { MobileNavContext } from "@/context/mobile-nav";
import { getSession, signOut } from "@/libs/auth-client";
import { getNavItems } from "@/utils/get-nav-items";

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
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    setLogoutError(null);

    try {
      const { error } = await signOut();
      if (error) {
        setLogoutError(error.message ?? "Failed to log out. Please try again.");
        setIsLoggingOut(false);
        return;
      }
    }
    catch {
      setLogoutError("Failed to log out. Please try again.");
      setIsLoggingOut(false);
      return;
    }

    navigate({ to: "/signin", replace: true });
  };

  const navItems = getNavItems(user.id);

  return (
    <>
      <div className="flex min-h-dvh">
        <div className="hidden md:block w-56">
          <div className="sticky top-0 flex flex-col">
            <header>
              <Link to="/home" className="text-2xl block p-2 pl-4 font-bold">Neetwork</Link>
            </header>
            <SideBar navItems={navItems} handleLogout={handleLogout} isLoggingOut={isLoggingOut} logoutError={logoutError} />
          </div>
        </div>

        <MobileNavbar isOpen={isOpen} setIsOpen={setIsOpen} navItems={navItems} handleLogout={handleLogout} isLoggingOut={isLoggingOut} logoutError={logoutError} />
        <MobileNavContext value={{ isOpen, setIsOpen }}>
          <main className="md:pb-0 pb-16 flex-1 border border-border border-y-0">
            <Outlet />
          </main>
        </MobileNavContext>
      </div>
      <MobileBottomNav user={user} />
    </>
  );
}
