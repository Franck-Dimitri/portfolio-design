import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        cors: true,
        // ⚠️ IMPORTANT : Commentez ou supprimez cette partie HMR
        // car l'URL ngrok change à chaque session
        /*
        hmr: {
            host: '5278-165-210-39-154.ngrok-free.app',
            protocol: 'wss',
        },
        */
    },
    // ⚠️ Ajoutez ceci pour forcer le build en développement
    build: {
        sourcemap: true,
    },
})