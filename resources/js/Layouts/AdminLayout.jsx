import { Link } from '@inertiajs/react'
import { useState } from 'react'
import { Sidebar } from '@/Pages/Admin/Sidebar'
import { ThemeSelector } from '@/Components/ThemeToggle'




export default function AdminLayout({ children }) {
    const [open, setOpen] = useState(true)

    return (
        <div className="min-h-screen bg-base flex">
            <Sidebar />

            {/* MAIN */}
            <div className="flex-1 flex flex-col">

                {/* TOPBAR */}
                <header className="h-16 bg-elevated border-b border-base flex items-center justify-between px-6">

                    <button
                        onClick={() => setOpen(!open)}
                        className="btn-ghost"
                    >
                        ☰
                    </button>

                    <div className="text-sm text-base-muted">
                        Admin Panel
                    </div>

                    <button className="btn-primary">
                        Logout
                    </button>
                    <ThemeSelector />

                </header>

                {/* CONTENT */}
                <main className="p-6 animate-fade-in-up">
                    {children}
                </main>

            </div>
        </div>
    )
}