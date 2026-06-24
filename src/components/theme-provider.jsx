"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "vertics-theme";
const RESOLVED_STORAGE_KEY = "vertics-resolved-theme";
const ThemeContext = createContext(null);

function isTheme(theme) {
  return theme === "light" || theme === "dark" || theme === "system";
}

function isResolvedTheme(theme) {
  return theme === "light" || theme === "dark";
}

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setThemeCookie(name, value) {
  document.cookie = `${name}=${value}; path=/; max-age=31536000; samesite=lax`;
}

function applyTheme(resolvedTheme) {
  document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
  document.documentElement.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({
  children,
  initialTheme = "system",
  initialResolvedTheme = "light",
}) {
  const [theme, setTheme] = useState(() => isTheme(initialTheme) ? initialTheme : "system");
  const [systemTheme, setSystemTheme] = useState(() =>
    isResolvedTheme(initialResolvedTheme) ? initialResolvedTheme : "light",
  );
  const resolvedTheme = theme === "system" ? systemTheme : theme;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme);
    window.localStorage.setItem(RESOLVED_STORAGE_KEY, resolvedTheme);
    setThemeCookie(STORAGE_KEY, theme);
    setThemeCookie(RESOLVED_STORAGE_KEY, resolvedTheme);
    applyTheme(resolvedTheme);
  }, [theme, resolvedTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => setSystemTheme(getSystemTheme());

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme: () => setTheme((currentTheme) => {
        const activeTheme = currentTheme === "system" ? getSystemTheme() : currentTheme;
        return activeTheme === "dark" ? "light" : "dark";
      }),
    }),
    [theme, resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
