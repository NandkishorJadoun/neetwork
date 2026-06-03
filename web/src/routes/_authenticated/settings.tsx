import { createFileRoute } from '@tanstack/react-router'
import { useThemeSettings } from "../../context/theme";

export const Route = createFileRoute('/_authenticated/settings')({
  component: RouteComponent,
})

const accents = ["blue", "red", "yellow", "green", "purple", "pink"] as const;
const backgrounds = ["slate", "gray", "zinc", "stone", "neutral"] as const;

function RouteComponent() {
  const { theme, setTheme, accent, setAccent, background, setBackground } =
    useThemeSettings();

  return (
    <div className="space-y-8 rounded-2xl border border-(--app-border) bg-(--app-surface) p-6">
      <section className="space-y-3">
        <h2 className="text-sm font-medium">Theme</h2>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="rounded-md border border-(--app-border) bg-transparent px-3 py-2"
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
              className={`h-8 w-8 rounded-full border-2 ${accent === color ? "border-white" : "border-transparent"
                }`}
              style={{
                backgroundColor:
                  color === "blue"
                    ? "#38bdf8"
                    : color === "red"
                      ? "#fb7185"
                      : color === "yellow"
                        ? "#fbbf24"
                        : color === "green"
                          ? "#34d399"
                          : color === "purple"
                            ? "#a78bfa"
                            : "#f472b6",
              }}
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
              className={`h-8 w-8 rounded-full border-2 ${background === bg ? "border-white" : "border-transparent"
                } bg-slate-500`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}