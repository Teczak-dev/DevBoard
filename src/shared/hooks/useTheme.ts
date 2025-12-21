import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";

// Custom hook to access the current theme from context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
