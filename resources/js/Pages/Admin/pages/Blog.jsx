import AdminLayout from '@/Layouts/AdminLayout'
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react'

export default function Blog() {
    const posts = [
        { id: 1, title: 'Design Trends 2026', status: 'published', date: '2026-01-12' },
        { id: 2, title: 'How to build UI systems', status: 'draft', date: '2026-01-09' },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">

                <div className="flex justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Blog</h1>
                        <p className="text-base-muted">Manage articles</p>
                    </div>

                    <button className="btn btn-primary">
                        <Plus size={18} />
                        New Article
                    </button>
                </div>

                <div className="space-y-4">
                    {posts.map((p) => (
                        <div key={p.id} className="card p-5 flex justify-between items-center">

                            <div className="flex items-center gap-4">
                                <BookOpen className="text-primary-500" />
                                <div>
                                    <h2 className="font-bold">{p.title}</h2>
                                    <p className="text-sm text-base-muted">{p.date}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className={`badge ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {p.status}
                                </span>

                                <button className="btn btn-ghost btn-sm"><Pencil size={16} /></button>
                                <button className="btn btn-ghost btn-sm text-red-500"><Trash2 size={16} /></button>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </AdminLayout>
    )
}