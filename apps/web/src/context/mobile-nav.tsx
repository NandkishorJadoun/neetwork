import type { Dispatch } from "react";
import { createContext, use } from "react";

export const MobileNavContext = createContext<{
  isOpen: boolean;
  setIsOpen: Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const useMobileNav = () => {
  const context = use(MobileNavContext);
  if (!context) {
    throw new Error("useMobileNav must be used within an MobileNavProvider");
  }
  return context;
};
