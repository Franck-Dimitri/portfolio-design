// resources/js/Providers/ThemeProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react'

/* ═══════════════════════════════════════════════════════════════
   THEME CONTEXT
   ═══════════════════════════════════════════════════════════════ */
const ThemeContext = createContext({
    theme: 'light',
    toggleTheme: () => {},
    setTheme: () => {},
    isDark: false,
})

/* ═══════════════════════════════════════════════════════════════
   THEME PROVIDER
   ═══════════════════════════════════════════════════════════════ */
export function ThemeProvider({ children, defaultTheme = 'system' }) {
    const [theme, setThemeState] = useState(() => {
        // Lire depuis localStorage au premier rendu
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('portfolio-theme')
            if (stored === 'light' || stored === 'dark') return stored
        }
        return defaultTheme
    })

    // Appliquer la classe sur <html> + sauvegarder
    useEffect(() => {
        const root = document.documentElement

        const resolvedTheme = theme === 'system'
            ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
            : theme

        root.classList.remove('light', 'dark')
        root.classList.add(resolvedTheme)
        localStorage.setItem('portfolio-theme', theme)
    }, [theme])

    // Écouter les changements de préférence système
    useEffect(() => {
        if (theme !== 'system') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
            const root = document.documentElement
            root.classList.remove('light', 'dark')
            root.classList.add(mediaQuery.matches ? 'dark' : 'light')
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme])

    const setTheme = (newTheme) => {
        if (['light', 'dark', 'system'].includes(newTheme)) {
            setThemeState(newTheme)
        }
    }

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    const resolvedTheme = theme === 'system'
        ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark' : 'light')
        : theme

    return (
        <ThemeContext.Provider value={{
            theme,
            resolvedTheme,
            setTheme,
            toggleTheme,
            isDark: resolvedTheme === 'dark',
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

/* ═══════════════════════════════════════════════════════════════
   HOOK
   ═══════════════════════════════════════════════════════════════ */
export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

export default ThemeProvider