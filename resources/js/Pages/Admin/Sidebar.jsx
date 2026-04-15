import { ThemeSelector } from '@/Components/ThemeToggle'
import { Link, usePage } from '@inertiajs/react'
import {
    LayoutDashboard,
    FolderKanban,
    Settings,
    Package,
    FileText,
    PenTool,
    Menu
} from "lucide-react"
import { useState } from 'react'


const NAV_LINKS = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Projets', href: '/admin/projects', icon: FolderKanban },
    { label: 'Services', href: '/admin/services', icon: PenTool },
    { label: 'Packages', href: '/admin/packages', icon: Package },
    { label: 'Blog', href: '/admin/blogs', icon: FileText },
    { label: 'Paramètres', href: '/admin/parametres', icon: Settings },

]

export function Sidebar() {
    const { url } = usePage()
    const [open, setOpen] = useState(true)

    return (
        <aside
            className={`h-screen 
            bg-elevated border-r border-base
            transition-all duration-300
            ${open ? 'w-64' : 'w-20'}`}
        >

            {/* HEADER */}
            <div className="flex items-center justify-between p-4 border-b border-base">

                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-primary-500 text-white font-bold">
                        D
                    </div>

                    {open && (
                        <span className="font-bold text-base-primary">
                            Dim's <span className="text-gradient">Design</span>
                        </span>
                    )}
                </Link>

                <button
                    onClick={() => setOpen(!open)}
                    className="p-2 rounded-lg hover:bg-muted transition"
                >
                    <Menu size={18} />
                </button>
            </div>

            {/* NAVIGATION */}
            <nav className="flex flex-col gap-3 p-3">

                {NAV_LINKS.map((link) => {
                    const Icon = link.icon
                    const isActive = url.startsWith(link.href)

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`
                                flex items-center gap-3 px-3 py-2 rounded-lg border-t  border-primary-500/10
                                transition-all duration-200
                                ${isActive
                                    ? 'bg-primary-500/10 text-primary-400 shadow-orange-xs'
                                    : 'text-base-secondary hover:bg-muted hover:text-base-primary'
                                }
                            `}
                        >
                            <Icon size={18} />

                            {open && (
                                <span className="text-sm font-medium">
                                    {link.label}
                                </span>
                            )}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}