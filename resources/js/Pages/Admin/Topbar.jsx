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

                      
                        <ThemeSelector />
                    </header>
        </>
    );
}