// src/context/ThemeContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type ThemeMode = "light" | "dark" | "system";
type Accent = "blue" | "red" | "yellow" | "green" | "purple" | "pink";
type Background = "slate" | "gray" | "zinc" | "stone" | "neutral";

type ThemeSettings = {
  theme: ThemeMode;
  accent: Accent;
  background: Background;
  setTheme: (theme: ThemeMode) => void;
  setAccent: (accent: Accent) => void;
  setBackground: (bg: Background) => void;
};

const ThemeContext = createContext<ThemeSettings | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(
    () => (localStorage.getItem("theme") as ThemeMode) || "system"
  );
  const [accent, setAccent] = useState<Accent>(
    () => (localStorage.getItem("accent") as Accent) || "blue"
  );
  const [background, setBackground] = useState<Background>(
    () => (localStorage.getItem("background") as Background) || "slate"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("accent", accent);
    localStorage.setItem("background", background);

    const root = document.documentElement;

    root.dataset.theme = theme;
    root.dataset.accent = accent;
    root.dataset.background = background;
  }, [theme, accent, background]);

  return (
    <ThemeContext.Provider
      value={{ theme, accent, background, setTheme, setAccent, setBackground }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeSettings() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeSettings must be used inside ThemeProvider");
  return ctx;
}