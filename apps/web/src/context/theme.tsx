import type { Accent, Background, ThemeMode } from "./theme-context";
import { useEffect, useState } from "react";
import { ThemeContext } from "./theme-context";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(
    () => (localStorage.getItem("theme") as ThemeMode) || "system",
  );
  const [accent, setAccent] = useState<Accent>(
    () => (localStorage.getItem("accent") as Accent) || "blue",
  );
  const [background, setBackground] = useState<Background>(
    () => (localStorage.getItem("background") as Background) || "slate",
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
    <ThemeContext
      value={{ theme, accent, background, setTheme, setAccent, setBackground }}
    >
      {children}
    </ThemeContext>
  );
}
