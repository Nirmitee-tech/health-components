import { useColorMode } from '@docusaurus/theme-common';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export const THEMES = [
  { id: 'classic', name: 'Classic' },
  { id: 'sidebar', name: 'Clinical Sidebar' },
  { id: 'rail', name: 'Focus Rail' },
  { id: 'command', name: 'Command Bar' },
  { id: 'dark', name: 'Dark' },
] as const;

const KEY = 'careos-docs-preview-theme';
type Ctx = { theme: string; setTheme: (t: string) => void };
const PreviewThemeContext = createContext<Ctx | null>(null);

/** Shares the preview theme across every example on the site and remembers it per browser. */
export function PreviewThemeProvider({ children }: { children: ReactNode }) {
  const [chosen, setChosen] = useState<string | null>(null);
  useEffect(() => {
    try {
      setChosen(localStorage.getItem(KEY));
    } catch {
      /* storage unavailable */
    }
  }, []);
  const setTheme = (t: string) => {
    setChosen(t);
    try {
      localStorage.setItem(KEY, t);
    } catch {
      /* storage unavailable */
    }
  };
  return <PreviewThemeContext.Provider value={{ theme: chosen ?? '', setTheme }}>{children}</PreviewThemeContext.Provider>;
}

/** The preview theme: the reader's choice, else Dark when the site is in dark mode, else Classic. */
export function usePreviewTheme(): Ctx {
  const ctx = useContext(PreviewThemeContext);
  const { colorMode } = useColorMode();
  const fallback = colorMode === 'dark' ? 'dark' : 'classic';
  if (!ctx) return { theme: fallback, setTheme: () => {} };
  return { theme: ctx.theme || fallback, setTheme: ctx.setTheme };
}

export function ThemeSelect() {
  const { theme, setTheme } = usePreviewTheme();
  return (
    <label className="docs-theme-select">
      <span>Theme</span>
      <select value={theme} onChange={(e) => setTheme(e.target.value)} aria-label="Preview theme">
        {THEMES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
    </label>
  );
}
