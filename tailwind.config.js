import defaultTheme from 'tailwindcss/defaultTheme'

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',

    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
        './resources/js/**/*.tsx',
        './resources/js/**/*.vue',
    ],

    theme: {
        extend: {
            // ─── POLICE PRINCIPALE ────────────────────────────────────────
            fontFamily: {
                sans: ['Outfit', ...defaultTheme.fontFamily.sans],
                display: ['Outfit', ...defaultTheme.fontFamily.sans],
                body: ['Outfit', ...defaultTheme.fontFamily.sans],
            },

            // ─── COULEURS PRINCIPALES ─────────────────────────────────────
            colors: {
                // Orange principal (100–900)
                primary: {
                    50:  '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                },
                // Gris moderne
                neutral: {
                    50:  '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                    950: '#0a0a0a',
                },
                // Surface pour dark/light mode
                surface: {
                    light: '#ffffff',
                    dark:  '#0f0f0f',
                },
            },

            // ─── ANIMATIONS ───────────────────────────────────────────────
            keyframes: {
                // Entrée fade + slide
                'fade-in': {
                    '0%':   { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-up': {
                    '0%':   { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in-down': {
                    '0%':   { opacity: '0', transform: 'translateY(-24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in-left': {
                    '0%':   { opacity: '0', transform: 'translateX(-24px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'fade-in-right': {
                    '0%':   { opacity: '0', transform: 'translateX(24px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                // Scale
                'scale-in': {
                    '0%':   { opacity: '0', transform: 'scale(0.92)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'scale-in-bounce': {
                    '0%':   { opacity: '0', transform: 'scale(0.8)' },
                    '70%':  { transform: 'scale(1.05)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                // Slide
                'slide-in-up': {
                    '0%':   { transform: 'translateY(100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                'slide-in-down': {
                    '0%':   { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(0)' },
                },
                // Float (hover effect)
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%':      { transform: 'translateY(-8px)' },
                },
                // Pulse orange
                'pulse-orange': {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(249, 115, 22, 0.4)' },
                    '50%':      { boxShadow: '0 0 0 12px rgba(249, 115, 22, 0)' },
                },
                // Shimmer (skeleton loader)
                shimmer: {
                    '0%':   { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                // Rotate continu
                'spin-slow': {
                    '0%':   { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                // Blob morphing
                blob: {
                    '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
                    '25%':      { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
                    '50%':      { borderRadius: '50% 60% 30% 60% / 30% 40% 70% 50%' },
                    '75%':      { borderRadius: '40% 60% 50% 40% / 60% 30% 50% 60%' },
                },
                // Typing cursor
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%':      { opacity: '0' },
                },
                // Gradient move
                'gradient-x': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%':      { backgroundPosition: '100% 50%' },
                },
                // Stagger reveal (utilisé avec delay)
                reveal: {
                    '0%':   { opacity: '0', clipPath: 'inset(0 100% 0 0)' },
                    '100%': { opacity: '1', clipPath: 'inset(0 0% 0 0)' },
                },
            },

            animation: {
                // Entrées
                'fade-in':       'fade-in 0.5s ease-out both',
                'fade-in-up':    'fade-in-up 0.6s ease-out both',
                'fade-in-down':  'fade-in-down 0.6s ease-out both',
                'fade-in-left':  'fade-in-left 0.6s ease-out both',
                'fade-in-right': 'fade-in-right 0.6s ease-out both',
                'scale-in':      'scale-in 0.5s ease-out both',
                'scale-in-bounce': 'scale-in-bounce 0.6s ease-out both',
                'slide-in-up':   'slide-in-up 0.5s ease-out both',
                'slide-in-down': 'slide-in-down 0.5s ease-out both',
                // Continus
                float:           'float 3s ease-in-out infinite',
                'pulse-orange':  'pulse-orange 2s ease-in-out infinite',
                shimmer:         'shimmer 2s linear infinite',
                'spin-slow':     'spin-slow 8s linear infinite',
                blob:            'blob 8s ease-in-out infinite',
                blink:           'blink 1s step-end infinite',
                'gradient-x':   'gradient-x 4s ease infinite',
                reveal:          'reveal 0.8s ease-out both',
            },

            // ─── DELAYS UTILITAIRES ───────────────────────────────────────
            transitionDelay: {
                0:    '0ms',
                75:   '75ms',
                100:  '100ms',
                150:  '150ms',
                200:  '200ms',
                300:  '300ms',
                400:  '400ms',
                500:  '500ms',
                700:  '700ms',
                1000: '1000ms',
            },

            // ─── DURATIONS ────────────────────────────────────────────────
            transitionDuration: {
                0:    '0ms',
                75:   '75ms',
                100:  '100ms',
                150:  '150ms',
                200:  '200ms',
                300:  '300ms',
                400:  '400ms',
                500:  '500ms',
                700:  '700ms',
                1000: '1000ms',
            },

            // ─── EASING CUSTOM ────────────────────────────────────────────
            transitionTimingFunction: {
                'bounce-in':  'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'smooth-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                'sharp':      'cubic-bezier(0.4, 0, 0.6, 1)',
                'spring':     'cubic-bezier(0.34, 1.56, 0.64, 1)',
            },

            // ─── OMBRES ───────────────────────────────────────────────────
            boxShadow: {
                'orange-sm':  '0 2px 8px rgba(249, 115, 22, 0.25)',
                'orange-md':  '0 4px 20px rgba(249, 115, 22, 0.35)',
                'orange-lg':  '0 8px 40px rgba(249, 115, 22, 0.45)',
                'orange-xl':  '0 16px 60px rgba(249, 115, 22, 0.5)',
                'dark-sm':    '0 2px 8px rgba(0, 0, 0, 0.4)',
                'dark-md':    '0 4px 20px rgba(0, 0, 0, 0.5)',
                'dark-lg':    '0 8px 40px rgba(0, 0, 0, 0.6)',
            },

            // ─── BORDER RADIUS ────────────────────────────────────────────
            borderRadius: {
                '4xl': '2rem',
                '5xl': '3rem',
            },

            // ─── SPACING ─────────────────────────────────────────────────
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '100': '25rem',
                '112': '28rem',
                '128': '32rem',
            },

            // ─── BACKGROUND SIZE ─────────────────────────────────────────
            backgroundSize: {
                '200%': '200%',
                '300%': '300%',
            },
        },
    },

    plugins: [],
}