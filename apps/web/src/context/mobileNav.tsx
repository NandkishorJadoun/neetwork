import React, { createContext } from "react";

export const MobileNavContext = createContext<{
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export const useMobileNav = () => {
    const context = React.useContext(MobileNavContext)
    if (!context) {
        throw new Error('useMobileNav must be used within an MobileNavProvider')
    }
    return context
} 
