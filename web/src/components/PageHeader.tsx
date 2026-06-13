import type { JSX } from "react";

export const PageHeader = ({ children }: { children: JSX.Element | string }) => {
    return (
        <div className="sticky top-0 border-b border-(--app-border) bg-(--app-bg)/80 px-4 py-3 font-bold backdrop-blur-md">
            {children}
        </div>
    );
}