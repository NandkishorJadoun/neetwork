import { createContext, use } from "react";

export type ThemeMode = "light" | "dark" | "system";
export type Accent = "blue" | "red" | "yellow" | "green" | "purple" | "pink";
export type Background = "slate" | "gray" | "zinc" | "stone" | "neutral";

type ThemeSettings = {
  theme: ThemeMode;
  accent: Accent;
  background: Background;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: Accent) => void;
  setBackground: (bg: Background) => void;
};

export const ThemeContext = createContext<ThemeSettings | null>(null);

export function useThemeSettings() {
  const context = use(ThemeContext);

  if (!context) {
    throw new Error("useThemeSettings must be used inside ThemeProvider");
  }

  return context;
}
