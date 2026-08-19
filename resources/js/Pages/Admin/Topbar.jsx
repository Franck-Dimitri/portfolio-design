// resources/js/Pages/Admin/Topbar.jsx
import { Link, usePage } from '@inertiajs/react'
import { ThemeSelector } from '@/Components/ThemeToggle'
import { LogOut, Terminal, User, ExternalLink, Shield } from 'lucide-react'

export function Topbar() {
    const { auth } = usePage().props
    const user = auth?.user

    return (
        <header className="h-16 bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-20">
            {/* GAUCHE : INDICATEUR SYSTÈME */}
            <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                    <Terminal size={12} className="text-primary-500" />
                    CONSOLE ADMIN // CONNECTÉ EN TANT QUE <strong className="text-gray-900 dark:text-white">{user?.name || 'ADMINISTRATEUR'}</strong>
                </span>
            </div>

            {/* DROITE : ACTIONS & PROFIL */}
            <div className="flex items-center gap-4">
                <Link
                    href="/"
                    target="_blank"
                    className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 border border-gray-200 dark:border-gray-800 hover:border-primary-500 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                    <ExternalLink size={12} />
                    VITRINE PUBLIQUE
                </Link>

                <ThemeSelector />

                <div className="h-4 w-px bg-gray-200 dark:bg-gray-800"></div>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    title="Se déconnecter"
                >
                    <LogOut size={12} />
                    <span className="hidden md:inline">DÉCONNEXION</span>
                </Link>
            </div>
        </header>
    );
}