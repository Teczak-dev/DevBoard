import React, { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

/**
 * ThemeProvider
 *
 * Responsibilities:
 * - Hold the user's theme choice ("light" | "dark" | "system")
 * - Persist the choice to localStorage
 * - Apply the effective theme to document.documentElement (via `data-theme`)
 * - Keep in sync with OS preference when choice is "system"
 *
 * Note: The ThemeContext file intentionally only exports the context and types
 * to satisfy fast refresh rules. This provider lives in a separate file.
 */

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined" || !window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const getInitialTheme = (): Theme => {
    try {
      if (typeof window === "undefined") return "system";
      const stored = localStorage.getItem("theme") as Theme | null;
      return stored ?? "system";
    } catch {
      return "system";
    }
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const apply = (t: Theme) => {
      const effective = t === "system" ? getSystemTheme() : t;
      // Using data-theme attribute so CSS can style based on it:
      // e.g. :root[data-theme="dark"] { --bg: #000; }
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", effective);
      }
    };

    apply(theme);

    // Listen for system theme changes if we're in 'system' mode
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => {
        // Re-apply only when following system
        if (theme === "system") apply("system");
      };

      // Modern browsers support addEventListener on MediaQueryList
      if (typeof mediaQuery.addEventListener === "function") {
        mediaQuery.addEventListener("change", handler);
      } else if (typeof mediaQuery.addListener === "function") {
        // Older browsers / Safari fallback
        mediaQuery.addListener(handler);
      }

      return () => {
        if (typeof mediaQuery.removeEventListener === "function") {
          mediaQuery.removeEventListener("change", handler);
        } else if (typeof mediaQuery.removeListener === "function") {
          mediaQuery.removeListener(handler);
        }
      };
    }

    return;
  }, [theme]);

  // Persist theme choice to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", theme);
      }
    } catch {
      // ignore storage errors (e.g. quota, disabled)
    }
  }, [theme]);

  const toggleTheme = (value: Theme) => {
    setTheme(value);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
