// resources/js/Pages/Admin/Sidebar.jsx
import { Link, usePage } from '@inertiajs/react'
import {
    LayoutDashboard,
    CheckSquare,
    Users,
    CreditCard,
    FolderKanban,
    PenTool,
    Package,
    FileText,
    Mail,
    Terminal,
    Settings,
    UserCheck,
    ChevronLeft,
    ChevronRight,
    ExternalLink
} from "lucide-react"
import { useState } from 'react'

const NAV_LINKS = [
    { label: 'DASHBOARD', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'COMMANDES', href: '/admin/commandes', icon: CheckSquare },
    { label: 'CLIENTS (CRM)', href: '/admin/clients', icon: Users },
    { label: 'SOUSCRIPTIONS', href: '/admin/souscriptions', icon: CreditCard },
    { label: 'PROJETS', href: '/admin/projects', icon: FolderKanban },
    { label: 'SERVICES', href: '/admin/services', icon: PenTool },
    { label: 'PACKS & TARIFS', href: '/admin/packages', icon: Package },
    { label: 'BLOG', href: '/admin/blogs', icon: FileText },
    { label: 'MESSAGES', href: '/admin/contacts', icon: Mail },
    { label: 'LOGS SYSTÈME', href: '/admin/logs', icon: Terminal },
    { label: 'PARAMÈTRES', href: '/admin/settings', icon: Settings },
    { label: 'PROFIL', href: '/profile', icon: UserCheck },
]

export function Sidebar() {
    const { url } = usePage()
    const [open, setOpen] = useState(true)

    return (
        <aside
            className={`min-h-screen bg-[#0A0A0A] border-r border-gray-800 transition-all duration-300 flex flex-col justify-between z-30 sticky top-0 ${
                open ? 'w-64' : 'w-20'
            }`}
        >
            <div>
                {/* ── HEADER LOGO ── */}
                <div className="h-16 px-4 border-b border-gray-800 flex items-center justify-between">
                    <Link href="/admin/dashboard" className="flex items-center gap-3 group overflow-hidden">
                        <div className="w-9 h-9 border border-primary-500 bg-primary-500/10 text-primary-500 flex items-center justify-center font-mono font-bold text-xs shrink-0 group-hover:bg-primary-500 group-hover:text-black transition-colors">
                            DCA
                        </div>

                        {open && (
                            <div className="flex flex-col min-w-0">
                                <span className="font-display font-bold text-sm tracking-wider uppercase text-white truncate">
                                    DIM'S <span className="text-primary-500 font-mono text-xs">// ADMIN</span>
                                </span>
                                <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase truncate">
                                    SYS_CONSOLE v2.0
                                </span>
                            </div>
                        )}
                    </Link>

                    <button
                        onClick={() => setOpen(!open)}
                        className="p-1.5 border border-gray-800 hover:border-primary-500 text-gray-400 hover:text-white transition-colors"
                        title={open ? "Réduire le menu" : "Agrandir le menu"}
                    >
                        {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                    </button>
                </div>

                {/* ── NAVIGATION ── */}
                <nav className="p-3 space-y-1">
                    {NAV_LINKS.map((link) => {
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

            {/* ── FOOTER SIDEBAR ── */}
            <div className="p-3 border-t border-gray-800 bg-[#0c0c0c]">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 hover:text-primary-400 border border-gray-800 hover:border-primary-500/50 transition-colors w-full justify-center"
                >
                    <ExternalLink size={12} />
                    {open && <span>VOIR LE SITE</span>}
                </Link>
            </div>
        </aside>
    )
}