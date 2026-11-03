// The theme button: auto (the setting of the system), light and dark, in turn. The choice stays in this browser.

import { useCallback, useState } from "react";

export const THEMES = ["auto", "light", "dark"] as const;
export type Theme = (typeof THEMES)[number];

/** The key of the theme in the storage of the browser. The script in index.html reads it before the first paint. */
export const THEME_KEY = "splay-react-theme";

function current(): Theme {
  const theme = document.documentElement.dataset["theme"];
  return theme === "light" || theme === "dark" ? theme : "auto";
}

/** This hook gives the theme and a function that changes it to the next theme. */
export function useTheme(): readonly [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(current);
  const next = useCallback(() => {
    const value = THEMES[(THEMES.indexOf(current()) + 1) % THEMES.length] ?? "auto";
    if (value === "auto") delete document.documentElement.dataset["theme"];
    else document.documentElement.dataset["theme"] = value;
    try {
      if (value === "auto") localStorage.removeItem(THEME_KEY);
      else localStorage.setItem(THEME_KEY, value);
    } catch {
      // A browser with no storage keeps the theme until the page closes.
    }
    setTheme(value);
  }, []);
  return [theme, next] as const;
}
