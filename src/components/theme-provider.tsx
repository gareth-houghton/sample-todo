"use client"

import * as React from "react"
import { useEffect, useState, ReactNode, createContext, useContext, useMemo } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

/**
 * Provides theme context to its children, managing and persisting the UI theme ("dark", "light", or "system") across the application.
 *
 * Applies the selected theme to the document root by updating CSS classes and persists the preference in localStorage. Supports automatic system theme detection if enabled.
 *
 * @param children - React nodes to receive the theme context.
 * @param defaultTheme - The initial theme if no preference is stored.
 * @param storageKey - The localStorage key used to persist the theme.
 * @param enableSystem - Whether to allow automatic system theme detection.
 *
 * @remark
 * The theme is only initialized from localStorage on the client side. If used in a server-rendered environment, the default theme is applied until hydration.
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (typeof window !== "undefined" ? 
      (localStorage.getItem(storageKey) as Theme) || defaultTheme : 
      defaultTheme)
  )

  useEffect(() => {
    const root = window.document.documentElement
    let systemThemeMediaQuery: MediaQueryList | undefined;

    root.classList.remove("light", "dark")

    if (theme === "system" && enableSystem) {
      systemThemeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const systemTheme = systemThemeMediaQuery.matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)

    return () => {
      if (systemThemeMediaQuery?.removeEventListener) {
        systemThemeMediaQuery.removeEventListener("change", () => {});
      }
    }
  }, [theme, enableSystem])

  const value = useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(storageKey, theme)
        setTheme(theme)
      },
    }),
    [theme, storageKey]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}