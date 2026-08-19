import { Head } from '@inertiajs/react'
import { Sidebar } from '@/Pages/Admin/Sidebar'
import { Topbar } from '@/Pages/Admin/Topbar'

export default function AdminLayout({ children, title = 'Administration' }) {
    return (
        <div className="min-h-screen bg-[#080808] text-gray-200 flex font-sans selection:bg-primary-500 selection:text-black">
            <Head title={`${title} | Admin DCA`} />
            
            {/* SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                <Topbar />

                <main className="p-6 md:p-8 flex-1 max-w-7xl w-full mx-auto animate-fade-in-up">
                    {children}
                </main>
            </div>
        </div>
    )
}