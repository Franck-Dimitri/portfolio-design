import { Link, usePage } from '@inertiajs/react'
import { ThemeSelector } from '@/Components/ThemeToggle'


export function Topbar(){

    return (
        <>

                    {/* TOPBAR */}
                    <header className="h-16 bg-elevated border-b border-base flex items-center justify-between px-6">
                        <div className="text-sm text-base-muted">
                            Admin Panel
                        </div>

                        <button className="bg-primary-500/10 text-primary-500 px-4 py-1">
                            Dim's Creative Academy
                        </button>
                        <ThemeSelector />
                    </header>
        </>
    );
}