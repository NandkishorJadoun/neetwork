import type { ActiveTab } from "@/features/posts/queries";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMobileNav } from "../context/mobile-nav";
import { useScrollListener } from "../hooks/use-scroll-listener";

export const HomePageHeader = ({ tab }: { tab: ActiveTab }) => {
  const { setIsOpen } = useMobileNav();
  const scroll = useScrollListener();

  return (
    <div className={`${scroll.y > 150 && scroll.y - scroll.lastY > 0 ? "invisible -translate-y-full" : "visible"} transition-all duration-200 sticky top-0 border-b border-border bg-background/80 px-4 font-bold backdrop-blur-md`}>
      <div className="md:hidden flex items-center justify-between pt-3">
        <Link to="/home" className="text-lg font-bold">Neetwork</Link>
        <Button variant="ghost" size="icon-sm" onClick={() => { setIsOpen(true); }}>
          <Menu size={18} />
        </Button>
      </div>
      <Tabs value={tab}>
        <TabsList variant="line" className="mx-auto flex justify-center gap-6">
          <TabsTrigger
            nativeButton={false}
            value="all"
            render={<Link to="/home" />}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            nativeButton={false}
            value="following"
            render={<Link to="/home" search={{ users: "following" }} />}
          >
            Following
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
