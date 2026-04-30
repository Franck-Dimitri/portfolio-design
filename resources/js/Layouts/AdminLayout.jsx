import { Link } from '@inertiajs/react'
import { useState } from 'react'
import { Sidebar } from '@/Pages/Admin/Sidebar'
import { Topbar } from '@/Pages/Admin/Topbar'

import { ThemeSelector } from '@/Components/ThemeToggle'




export default function AdminLayout({ children }) {
    const [open, setOpen] = useState(true)

    return (
        <div className="min-h-screen bg-base flex">
            <Sidebar />

            {/* MAIN */}
            <div className="flex-1 flex flex-col">

                <Topbar />

                {/* CONTENT */}
                <main className="p-6 animate-fade-in-up">
                    {children}
                </main>

            </div>
        </div>
    )
}