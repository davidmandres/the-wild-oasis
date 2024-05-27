import { PropsWithChildren, useEffect } from "react";
import { useLocalStorageState } from "../hooks/useLocalStorageState.hooks";
import { DarkModeContext } from "./useDarkMode.hooks";

export function DarkModeProvider({ children }: PropsWithChildren) {
  const [isDarkMode, setIsDarkMode] = useLocalStorageState(
    window.matchMedia("(prefers-color-scheme: dark)").matches,
    "isDarkMode"
  );

  useEffect(
    function () {
      if (isDarkMode) {
        document.documentElement.classList.add("dark-mode");
        document.documentElement.classList.remove("light-mode");
      } else {
        document.documentElement.classList.remove("dark-mode");
        document.documentElement.classList.add("light-mode");
      }
    },
    [isDarkMode]
  );

  const toggleDarkMode = () => setIsDarkMode((dark) => !dark);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}
