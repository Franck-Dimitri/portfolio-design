import { Link, usePage, Head } from '@inertiajs/react'
import { ThemeSelector } from '@/Components/ThemeToggle'
import {
    LayoutDashboard,
    Package,
    Download,
    UserCheck,
    LogOut,
    ExternalLink,
    Terminal,
    ChevronLeft,
    ChevronRight,
    MessageSquare,
    Sparkles,
    Shield
} from 'lucide-react'
import { useState } from 'react'

const CLIENT_NAV = [
    { label: 'MON TABLEAU DE BORD', href: '/client/dashboard', icon: LayoutDashboard },
    { label: 'MES COMMANDES', href: '/client/souscriptions', icon: Package },
    { label: 'MON PROFIL', href: '/profile', icon: UserCheck },
]

export default function ClientLayout({ children, title = 'Espace Client' }) {
    const { auth } = usePage().props
    const { url = '' } = usePage()
    const user = auth?.user
    const [open, setOpen] = useState(true)

    return (
        <div className="min-h-screen bg-[#080808] text-gray-200 flex font-sans selection:bg-primary-500 selection:text-black">
            <Head title={`${title} | Espace Client DCA`} />

            {/* ── CLIENT SIDEBAR ── */}
            <aside
                className={`min-h-screen bg-[#0A0A0A] border-r border-gray-800 transition-all duration-300 flex flex-col justify-between z-30 sticky top-0 ${
                    open ? 'w-64' : 'w-20'
                }`}
            >
                <div>
                    {/* Header Logo */}
                    <div className="h-16 px-4 border-b border-gray-800 flex items-center justify-between">
                        <Link href="/client/dashboard" className="flex items-center gap-3 group overflow-hidden">
                            <div className="w-9 h-9 border border-primary-500 bg-primary-500/10 text-primary-500 flex items-center justify-center font-mono font-bold text-xs shrink-0 group-hover:bg-primary-500 group-hover:text-black transition-colors">
                                DCA
                            </div>

                            {open && (
                                <div className="flex flex-col min-w-0">
                                    <span className="font-display font-bold text-sm tracking-wider uppercase text-white truncate">
                                        DIM'S <span className="text-primary-500 font-mono text-xs">// CLIENT</span>
                                    </span>
                                    <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase truncate">
                                        ESPACE PROJET
                                    </span>
                                </div>
                            )}
                        </Link>

                        <button
                            onClick={() => setOpen(!open)}
                            className="p-1.5 border border-gray-800 hover:border-primary-500 text-gray-400 hover:text-white transition-colors"
                            title={open ? "Réduire" : "Agrandir"}
                        >
                            {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="p-3 space-y-1">
                        {CLIENT_NAV.map((link) => {
                            const Icon = link.icon
                            const isActive = url.startsWith(link.href)

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`
                                        flex items-center gap-3 px-3 py-2.5 border transition-all text-xs font-mono font-bold tracking-wider uppercase group
                                        ${isActive
                                            ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                            : 'border-transparent text-gray-400 hover:text-white hover:bg-[#141414] hover:border-gray-800'
                                        }
                                    `}
                                    title={!open ? link.label : undefined}
                                >
                                    <Icon size={16} className={`shrink-0 ${isActive ? 'text-primary-500' : 'group-hover:text-primary-400'}`} />

                                    {open && (
                                        <span className="truncate flex-1">
                                            {link.label}
                                        </span>
                                    )}

                                    {open && isActive && (
                                        <span className="w-1.5 h-1.5 bg-primary-500 shrink-0" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Footer Sidebar */}
                <div className="p-3 border-t border-gray-800 bg-[#0c0c0c] space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 hover:text-primary-400 border border-gray-800 hover:border-primary-500/50 transition-colors w-full justify-center"
                    >
                        <ExternalLink size={12} />
                        {open && <span>CATALOGUE & SITE</span>}
                    </Link>
                </div>
            </aside>

            {/* ── MAIN CONTENT AREA ── */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-[#0A0A0A] border-b border-gray-800 flex items-center justify-between px-6 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                            ESPACE CLIENT // CONNECTÉ : <strong className="text-white">{user?.name}</strong>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeSelector />

                        <div className="h-4 w-px bg-gray-800"></div>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest px-3 py-1.5 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                        >
                            <LogOut size={12} />
                            <span className="hidden sm:inline">DÉCONNEXION</span>
                        </Link>
                    </div>
                </header>

                <main className="p-6 md:p-8 flex-1 w-full animate-fade-in-up">
                    {children}
                </main>
            </div>
        </div>
    )
}
