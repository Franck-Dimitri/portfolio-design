import { Link, usePage } from '@inertiajs/react'
import {
    LayoutDashboard,
    ShoppingBag,
    DownloadCloud,
    MessageSquare,
    Receipt,
    User,
    LogOut,
    ExternalLink,
    Menu,
    X,
    Sparkles,
    ShieldCheck
} from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from '@/Components/ThemeToggle'

export default function ClientLayout({ children, title }) {
    const { auth, flash } = usePage().props
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const user = auth?.user

    const navItems = [
        {
            name: 'Tableau de bord',
            href: '/client/dashboard',
            icon: LayoutDashboard,
            active: route().current('client.dashboard'),
        },
        {
            name: 'Mes Commandes',
            href: '/client/souscriptions',
            icon: ShoppingBag,
            active: route().current('client.souscriptions.*'),
        },
        {
            name: 'Mes Livrables',
            href: '/client/livrables',
            icon: DownloadCloud,
            active: route().current('client.livrables.*'),
        },
        {
            name: 'Messagerie Studio',
            href: '/client/messages',
            icon: MessageSquare,
            active: route().current('client.messages.*'),
        },
        {
            name: 'Mes Factures',
            href: '/client/factures',
            icon: Receipt,
            active: route().current('client.factures.*'),
        },
        {
            name: 'Mon Profil',
            href: '/client/profil',
            icon: User,
            active: route().current('client.profil.*'),
        },
    ]

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-[#0a0a0a] text-neutral-900 dark:text-white flex font-sans transition-colors duration-200">

            {/* ══════════════════════════════════════════════════
                § 1 – SIDEBAR DESKTOP
            ══════════════════════════════════════════════════ */}
            <aside className="hidden lg:flex flex-col w-64 border-r border-neutral-200 dark:border-neutral-800/80 bg-white dark:bg-[#111111] shrink-0 sticky top-0 h-screen transition-colors duration-200">
                {/* Logo DCA */}
                <div className="p-6 border-b border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center text-white font-black text-lg shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                            D
                        </div>
                        <div>
                            <span className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-white block">
                                DIMS CREATIVE
                            </span>
                            <span className="text-[10px] text-primary-500 font-semibold tracking-wider block">
                                ESPACE CLIENT
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation (6 Onglets Fonctionnels) */}
                <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
                    <p className="px-3 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-3">
                        Menu Principal
                    </p>

                    {navItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all
                                    ${item.active
                                        ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
                                    }
                                `}
                            >
                                <Icon size={18} className={item.active ? 'text-white' : 'text-neutral-400 dark:text-neutral-500'} />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </div>

                {/* Footer Sidebar & WhatsApp */}
                <div className="p-4 border-t border-neutral-200 dark:border-neutral-800/80 space-y-3 bg-neutral-50/50 dark:bg-neutral-900/30">
                    <a
                        href="/#packages"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-neutral-800 hover:bg-primary-500 dark:hover:bg-primary-500 text-white font-bold text-xs transition-all shadow-sm"
                    >
                        <Sparkles size={14} className="text-primary-400" />
                        <span>Commander un Pack</span>
                    </a>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800/80 text-xs">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-primary-500/10 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xs shrink-0">
                                {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{user?.name}</p>
                                <p className="text-[10px] text-neutral-500 truncate">Client DCA</p>
                            </div>
                        </div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="text-neutral-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                            title="Se déconnecter"
                        >
                            <LogOut size={16} />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ══════════════════════════════════════════════════
                § 2 – DRAWER MOBILE
            ══════════════════════════════════════════════════ */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSidebarOpen(false)} />

                    <div className="relative flex flex-col w-72 max-w-[80vw] bg-white dark:bg-[#111111] border-r border-neutral-200 dark:border-neutral-800 p-6 z-10 h-full">
                        <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary-500 flex items-center justify-center text-white font-black text-base">
                                    D
                                </div>
                                <span className="font-extrabold text-xs tracking-tight text-neutral-900 dark:text-white">
                                    ESPACE CLIENT
                                </span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 py-6 space-y-1.5 overflow-y-auto">
                            {navItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all
                                            ${item.active
                                                ? 'bg-primary-500 text-white shadow-md'
                                                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                            }
                                        `}
                                    >
                                        <Icon size={18} />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </div>

                        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                            <ThemeToggle />
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="flex items-center gap-2 px-3 py-2 text-xs text-red-500 font-bold"
                            >
                                <LogOut size={16} />
                                <span>Déconnexion</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════════
                § 3 – CONTENU PRINCIPAL PLEINE LARGEUR (FULL WIDTH)
            ══════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                {/* Topbar */}
                <header className="h-16 border-b border-neutral-200 dark:border-neutral-800/80 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-md sticky top-0 z-30 px-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 hidden sm:block">
                            {title || 'Espace Client'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />

                        <Link
                            href="/"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors"
                        >
                            <ExternalLink size={13} />
                            <span className="hidden md:inline">Voir le Studio</span>
                        </Link>
                    </div>
                </header>

                {/* Notifications Flash */}
                {flash?.success && (
                    <div className="m-6 mb-0 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-3">
                        <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="m-6 mb-0 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center gap-3">
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Contenu Page (Full width w-full sans max-w artificiel) */}
                <main className="flex-1 w-full p-6 md:p-8">
                    {children}
                </main>
            </div>

        </div>
    )
}
