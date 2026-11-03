// The theme button: auto (the setting of the system), light and dark, in turn. The choice stays in this browser.

import { useCallback, useState } from "react";
import { currentTheme, nextTheme, type Theme } from "@mark1russell7/site-pages/chrome";

/** The key of the theme in the storage of the browser. The script in index.html reads it before the first paint. */
export const THEME_KEY = "splay-react-theme";

/** This hook gives the theme and a function that changes it to the next theme. */
export function useTheme(): readonly [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const next = useCallback(() => setTheme(nextTheme(THEME_KEY)), []);
  return [theme, next] as const;
}
