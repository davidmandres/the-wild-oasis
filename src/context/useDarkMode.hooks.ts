import { createContext, useContext } from "react";

interface DarkModeContextObj {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const DarkModeContext = createContext<DarkModeContextObj | null>(null);

export default function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context)
    throw new Error("DarkModeContext was used outside of DarkModeProvider");

  const { isDarkMode, toggleDarkMode } = context;
  return [isDarkMode, toggleDarkMode] as const;
}
