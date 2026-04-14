//
// resources/js/app.jsx
import '../css/app.css'

import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { ThemeProvider } from './Providers/ThemeProvider'

/* ─── Résolution de nom d'appli ──────────────────────────────── */
const appName = import.meta.env.VITE_APP_NAME || 'Portfolio'

createInertiaApp({
    title: (title) => title ? `${title} – ${appName}` : appName,

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        ),

    setup({ el, App, props }) {
        const root = createRoot(el)

        root.render(
            <ThemeProvider defaultTheme="system">
                <App {...props} />
            </ThemeProvider>
        )
    },

    progress: {
        // Barre de progression Inertia en couleur orange
        color: '#f97316',
        showSpinner: false,
    },
})