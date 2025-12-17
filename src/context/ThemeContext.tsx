import { createContext } from "react";

export type Theme = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: (value: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);
