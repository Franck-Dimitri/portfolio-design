import { Link, usePage, Head } from '@inertiajs/react'
import {
    LayoutDashboard,
    ShoppingBag,
    FolderDown,
    MessageSquareText,
    Receipt,
    User,
    LogOut,
    ExternalLink,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    PlusCircle,
    ArrowUpRight
} from 'lucide-react'
import { useState } from 'react'

const CLIENT_NAV = [
    { label: 'Tableau de bord', href: '/client/dashboard', icon: LayoutDashboard, badge: null },
    { label: 'Mes Commandes', href: '/client/souscriptions', icon: ShoppingBag, badge: null },
    { label: 'Mes Livrables', href: '/client/livrables', icon: FolderDown, badge: 'Fichiers' },
    { label: 'Messagerie Studio', href: '/client/messages', icon: MessageSquareText, badge: null },
    { label: 'Mes Factures', href: '/client/factures', icon: Receipt, badge: null },
    { label: 'Mon Profil', href: '/client/profil', icon: User, badge: null },
]

export default function ClientLayout({ children, title = 'Espace Client' }) {
    const { auth, flash = {} } = usePage().props
    const { url = '' } = usePage()
    const user = auth?.user
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Numéro WhatsApp officiel pour le support direct
    const whatsappNumber = "237690112233"

    return (
        <div className="min-h-screen bg-[#0E1015] text-slate-100 flex font-sans antialiased selection:bg-amber-400 selection:text-black">
            <Head title={`${title} — Espace Client DCA`} />

            {/* ══════════════════════════════════════════════════════
                § 1 – SIDEBAR DESKTOP
            ══════════════════════════════════════════════════════ */}
            <aside
                className={`hidden md:flex flex-col justify-between bg-[#14171F] border-r border-slate-800/80 transition-all duration-300 z-30 sticky top-0 h-screen ${
                    sidebarCollapsed ? 'w-20' : 'w-64'
                }`}
            >
                <div>
                    {/* Brand Header */}
                    <div className="h-18 px-5 border-b border-slate-800/80 flex items-center justify-between">
                        <Link href="/client/dashboard" className="flex items-center gap-3 group overflow-hidden">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-black font-bold flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 group-hover:scale-105 transition-transform">
                                <span className="font-extrabold text-sm tracking-tighter">DCA</span>
                            </div>

                            {!sidebarCollapsed && (
                                <div className="flex flex-col min-w-0">
                                    <span className="font-bold text-sm text-white truncate tracking-tight">
                                        Dims Creative
                                    </span>
                                    <span className="text-[11px] text-amber-400/90 font-medium">
                                        Espace Client
                                    </span>
                                </div>
                            )}
                        </Link>

                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                            title={sidebarCollapsed ? "Agrandir" : "Réduire"}
                        >
                            {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>
                    </div>

                    {/* Navigation 6 Onglets */}
                    <div className="p-3">
                        {!sidebarCollapsed && (
                            <p className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                Menu Principal
                            </p>
                        )}

                        <nav className="space-y-1">
                            {CLIENT_NAV.map((item) => {
                                const Icon = item.icon
                                const isActive = url === item.href || (item.href !== '/client/dashboard' && url.startsWith(item.href))

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`
                                            flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all group
                                            ${isActive
                                                ? 'bg-amber-400/10 text-amber-300 font-semibold border border-amber-400/20 shadow-xs'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                                            }
                                        `}
                                        title={sidebarCollapsed ? item.label : undefined}
                                    >
                                        <Icon
                                            size={20}
                                            className={`shrink-0 transition-colors ${
                                                isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-amber-300'
                                            }`}
                                        />

                                        {!sidebarCollapsed && (
                                            <span className="truncate flex-1">
                                                {item.label}
                                            </span>
                                        )}

                                        {!sidebarCollapsed && item.badge && !isActive && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-800 text-slate-300">
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                )
                            })}
                        </nav>
                    </div>
                </div>

                {/* Sidebar Footer Cards */}
                <div className="p-3 space-y-3 border-t border-slate-800/80 bg-[#10131A]">
                    {!sidebarCollapsed && (
                        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900 border border-slate-700/60 text-left">
                            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold mb-1">
                                <Sparkles size={14} />
                                <span>Besoin d'un design ?</span>
                            </div>
                            <p className="text-xs text-slate-300 mb-2.5 leading-relaxed">
                                Lancez un nouveau projet ou abonnez-vous à un pack.
                            </p>
                            <Link
                                href="/packages"
                                className="inline-flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-colors"
                            >
                                <PlusCircle size={13} />
                                <span>Commander</span>
                            </Link>
                        </div>
                    )}

                    <div className="flex items-center justify-between gap-2 px-1">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
                            title="Voir le site public"
                        >
                            <ExternalLink size={15} />
                            {!sidebarCollapsed && <span>Voir le site</span>}
                        </Link>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                            title="Se déconnecter"
                        >
                            <LogOut size={15} />
                            {!sidebarCollapsed && <span>Déconnexion</span>}
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ══════════════════════════════════════════════════════
                § 2 – MAIN BODY
            ══════════════════════════════════════════════════════ */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">

                {/* Topbar */}
                <header className="h-18 bg-[#14171F]/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        <div>
                            <h2 className="text-base md:text-lg font-bold text-white tracking-tight">
                                {title}
                            </h2>
                            <p className="text-xs text-slate-400 hidden sm:block">
                                Bienvenue, <span className="text-amber-400 font-medium">{user?.name}</span>
                            </p>
                        </div>
                    </div>

                    {/* Actions Topbar */}
                    <div className="flex items-center gap-3">
                        {/* WhatsApp Direct Designer */}
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=Bonjour%20Franck,%20je%20suis%20connect%C3%A9%20sur%20mon%20espace%20client%20DCA.`}
                            target="_blank"
                            rel="noreferrer"
                            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black font-semibold text-xs transition-all shadow-xs"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Assistance WhatsApp</span>
                        </a>

                        <Link
                            href="/packages"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold text-xs shadow-md transition-all"
                        >
                            <PlusCircle size={14} />
                            <span className="hidden sm:inline">Nouveau Projet</span>
                            <span className="sm:hidden">+</span>
                        </Link>

                        {/* Profil Avatar */}
                        <Link
                            href="/client/profil"
                            className="flex items-center gap-2.5 pl-2 group"
                            title="Mon compte"
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-500 text-slate-950 font-bold text-sm flex items-center justify-center ring-2 ring-slate-700 group-hover:ring-amber-400 transition-all">
                                {user?.name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Mobile Drawer Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-[#14171F] border-b border-slate-800 p-4 space-y-2 animate-fade-in">
                        <nav className="space-y-1">
                            {CLIENT_NAV.map((item) => {
                                const Icon = item.icon
                                const isActive = url === item.href || (item.href !== '/client/dashboard' && url.startsWith(item.href))

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`
                                            flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all
                                            ${isActive
                                                ? 'bg-amber-400 text-slate-950 font-bold'
                                                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                                            }
                                        `}
                                    >
                                        <Icon size={18} />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                            <a
                                href={`https://wa.me/${whatsappNumber}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                WhatsApp Studio
                            </a>
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-xs font-semibold text-red-400 flex items-center gap-1"
                            >
                                <LogOut size={13} />
                                Déconnexion
                            </Link>
                        </div>
                    </div>
                )}

                {/* Alert Messages Flash */}
                {flash?.success && (
                    <div className="mx-4 md:mx-8 mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
                        <span>✓</span>
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div className="mx-4 md:mx-8 mt-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Main Viewport */}
                <main className="p-4 md:p-8 flex-1 max-w-7xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
