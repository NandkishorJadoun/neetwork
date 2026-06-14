import { createFileRoute } from '@tanstack/react-router'
import { useThemeSettings } from "../../context/theme";
import { PageHeader } from '../../components/PageHeader';

export const Route = createFileRoute('/_authenticated/settings')({
  component: RouteComponent,
})

const accents = ["blue", "red", "yellow", "green", "purple", "pink"] as const;
const backgrounds = ["slate", "gray", "zinc", "stone", "neutral"] as const;

const accentClasses = {
  blue: "bg-sky-400",
  red: "bg-rose-400",
  yellow: "bg-amber-400",
  green: "bg-emerald-400",
  purple: "bg-violet-400",
  pink: "bg-pink-400",
};

const bgClasses = {
  slate: "bg-slate-600",
  gray: "bg-gray-600",
  zinc: "bg-zinc-600",
  stone: "bg-stone-600",
  neutral: "bg-neutral-600"
}

function RouteComponent() {
  const { theme, setTheme, accent, setAccent, background, setBackground } =
    useThemeSettings();

  return (
    <>
      <PageHeader>Settings</PageHeader>
      <div className="flex flex-col gap-8 p-4">
        <section className="space-y-3">
          <h2 className="text-sm font-medium">Theme</h2>
          <select
            value={theme}
            onChange={(e) => {
              const value = e.target.value;
              if (value === "dark" || value === "light" || value === "system") {
                setTheme(value)
              }
            }}
            className="rounded-md border border-(--app-border) bg-(--app-surface)/50 px-3 py-2 outline-(--app-accent)"
          >
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium">Accent colors</h2>
          <div className="flex gap-3">
            {accents.map((color) => (
              <button
                key={color}
                onClick={() => setAccent(color)}
                className={`size-8 rounded-full border-2 ${accentClasses[color]} ${accent === color ? "border-(--app-text)" : "border-transparent"}`}
              />
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-medium">Background shade</h2>
          <div className="flex gap-3">
            {backgrounds.map((bg) => (
              <button
                key={bg}
                onClick={() => setBackground(bg)}
                className={`size-8 rounded-full border-2 ${bgClasses[bg]} ${background === bg ? "border-(--app-text)" : "border-transparent"}`}
              />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}