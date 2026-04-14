// resources/js/Components/ThemeToggle.jsx
import { Sun, Moon, Monitor } from 'lucide-react'
import { useTheme } from '@/Providers/ThemeProvider'

/* ═══════════════════════════════════════════════════════════════
   THEME TOGGLE – Simple bouton soleil / lune
   ═══════════════════════════════════════════════════════════════ */
export function ThemeToggle({ className = '' }) {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Activer le mode clair' : 'Activer le mode sombre'}
            className={`
                relative w-10 h-10 rounded-xl
                flex items-center justify-center
                border border-[var(--border-base)]
                bg-[var(--bg-muted)]
                text-[var(--text-secondary)]
                hover:border-primary-500 hover:text-primary-500
                hover:bg-[var(--color-accent-subtle)]
                transition-all duration-200
                cursor-pointer
                ${className}
            `}
        >
            {/* Sun – visible en mode clair */}
            <Sun
                size={18}
                className={`
                    absolute transition-all duration-300
                    ${isDark
                        ? 'opacity-100 rotate-0 scale-100'
                        : 'opacity-0 rotate-90 scale-50'
                    }
                `}
            />
            {/* Moon – visible en mode sombre */}
            <Moon
                size={18}
                className={`
                    absolute transition-all duration-300
                    ${isDark
                        ? 'opacity-0 -rotate-90 scale-50'
                        : 'opacity-100 rotate-0 scale-100'
                    }
                `}
            />
        </button>
    )
}

/* ═══════════════════════════════════════════════════════════════
   THEME SELECTOR – 3 options : Light / Dark / System
   ═══════════════════════════════════════════════════════════════ */
export function ThemeSelector({ className = '' }) {
    const { theme, setTheme } = useTheme()

    const options = [
        { value: 'light',  label: 'Clair',   Icon: Sun },
        { value: 'dark',   label: 'Sombre',  Icon: Moon },
        { value: 'system', label: 'Système', Icon: Monitor },
    ]

    return (
        <div className={`flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-base)] ${className}`}>
            {options.map(({ value, label, Icon }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    title={label}
                    aria-label={label}
                    className={`
                        relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                        transition-all duration-200 cursor-pointer
                        ${theme === value
                            ? 'bg-primary-500 text-white shadow-orange-sm'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                        }
                    `}
                >
                    <Icon size={13} />
                    <span className="hidden sm:inline">{label}</span>
                </button>
            ))}
        </div>
    )
}

export default ThemeToggle