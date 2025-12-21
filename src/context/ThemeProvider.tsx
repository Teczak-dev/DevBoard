import React, { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./ThemeContext";

/**
 * ThemeProvider
 *
 * Purpose
 * - Provide an application-level theme toggle ("light" | "dark" | "system")
 * - Persist user's choice to localStorage
 * - Apply the effective theme to the document root via `data-theme`
 *
 * Notes for contributors (concise)
 * - Visual colors are defined as CSS variables in `src/index.css`.
 *   The provider only sets `data-theme` on the document root; CSS consumes
 *   that attribute to switch colors (see `:root[data-theme="..."]`).
 * - We intentionally avoid coupling tightly to MUI's ThemeProvider here to keep
 *   styles driven by CSS variables. MUI-specific overrides live in `src/index.css`.
 * - Some libraries inject styles with high specificity. To remain robust, this
 *   provider applies a defensive inline-style fallback for MUI outlined input
 *   outlines after theme changes. Prefer adjusting CSS variables instead of
 *   relying on these inline patches.
 * - When adding new theme variables, update `src/index.css` and document the
 *   variable name here so contributors know where to modify appearance.
 *
 * Implementation details
 * - `system` mode follows the OS preference via `window.matchMedia`.
 * - We listen for `prefers-color-scheme` changes and re-apply the effective
 *   theme when the user has selected `system`.
 * - This file is intentionally compact and documented so external contributors
 *   can quickly understand how theme selection flows.
 */

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Returns "light" or "dark" based on the OS preference. Safe on SSR.
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined" || !window.matchMedia) return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  // Read persisted theme from localStorage with a safe fallback.
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

  // Keep in sync with OS preference when in `system` mode.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      // Only re-apply when user selected 'system'
      if (theme === "system") {
        const effective = mediaQuery.matches ? "dark" : "light";
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", effective);
        }
      }
    };

    // Use modern API if available, fallback to legacy listener for Safari.
    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handler);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handler);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(handler);
      }
    };
    // We intentionally don't include `theme` in dependencies here because the
    // handler re-reads `theme` when invoked; this keeps the listener registration stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply the selected theme to document root and persist the user's choice.
  useEffect(() => {
    const apply = (t: Theme) => {
      const effective = t === "system" ? getSystemTheme() : t;
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", effective);
      }
    };

    apply(theme);

    // Defensive inline application for some MUI outlines where CSS rules
    // might be overridden by other stronger styles. Inline styles are used
    // only as a fallback; prefer changing CSS variables in `src/index.css`.
    try {
      if (typeof window !== "undefined") {
        const rootStyle = getComputedStyle(document.documentElement);
        const border = (rootStyle.getPropertyValue("--border") || "").trim();
        const primary = (rootStyle.getPropertyValue("--primary") || "").trim();
        const primarySoft = (
          rootStyle.getPropertyValue("--primary-soft") || ""
        ).trim();
        const disabledBorder = (
          rootStyle.getPropertyValue("--disabled-border") || ""
        ).trim();

        // Helper to apply style with an important flag
        const setImportant = (el: HTMLElement, prop: string, value: string) => {
          try {
            el.style.setProperty(prop, value, "important");
          } catch {
            // ignore set failures
          }
        };

        // Apply to all notched outlines (fieldset or element with class)
        const outlines = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".MuiOutlinedInput-notchedOutline, fieldset.MuiOutlinedInput-notchedOutline",
          ),
        );
        outlines.forEach((el) => {
          if (border) {
            setImportant(el, "border-color", border);
            setImportant(el, "stroke", border); // covers SVG/fieldset stroke cases
          }
        });

        // Focused outlines: use primary + soft ring (if present)
        const focused = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-root.Mui-focused fieldset.MuiOutlinedInput-notchedOutline",
          ),
        );
        focused.forEach((el) => {
          if (primary) setImportant(el, "border-color", primary);
          if (primarySoft)
            setImportant(el, "box-shadow", `0 0 0 4px ${primarySoft}`);
        });

        // Disabled outlines
        const disabled = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-root.Mui-disabled fieldset.MuiOutlinedInput-notchedOutline",
          ),
        );
        disabled.forEach((el) => {
          if (disabledBorder) {
            setImportant(el, "border-color", disabledBorder);
            setImportant(el, "stroke", disabledBorder);
          }
        });
      }
    } catch {
      // inline fallback is best-effort; CSS remains the primary source of truth.
    }

    // Persist user choice
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("theme", theme);
      }
    } catch {
      // ignore storage errors (e.g. quota or disabled storage)
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
