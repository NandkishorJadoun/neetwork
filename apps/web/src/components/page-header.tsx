import type { JSX } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileNav } from "../context/mobile-nav";

export const PageHeader = ({ children }: { children: JSX.Element | string }) => {
  const { setIsOpen } = useMobileNav();

  return (
    <div className="sticky top-0 border-b border-border bg-background/80 px-4 py-3 font-bold backdrop-blur-md">
      <div className="flex items-center justify-between md:justify-center">
        {children}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => { setIsOpen(true); }}>
          <Menu />
        </Button>
      </div>
    </div>
  );
};
