import AdminLayout from '@/Layouts/AdminLayout'
import { Plus, Star, Trash2 } from 'lucide-react'

export default function Packages() {
    const packages = [
        { id: 1, name: 'Starter', price: '50k FCFA', features: 3 },
        { id: 2, name: 'Pro', price: '120k FCFA', features: 8 },
    ]

    return (
        <AdminLayout>
            <div className="space-y-6">

                <div className="flex justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Packages</h1>
                        <p className="text-base-muted">Pricing plans</p>
                    </div>

                    <button className="btn btn-primary">
                        <Plus size={18} />
                        Add Package
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {packages.map((p) => (
                        <div key={p.id} className="card p-6 hover-lift">

                            <div className="flex justify-between">
                                <h2 className="text-xl font-bold">{p.name}</h2>
                                <Star className="text-primary-500" />
                            </div>

                            <p className="text-2xl font-bold mt-3">{p.price}</p>
                            <p className="text-base-muted mt-1">{p.features} features included</p>

                            <button className="btn btn-ghost btn-sm mt-4 text-red-500">
                                <Trash2 size={16} /> Delete
                            </button>

                        </div>
                    ))}
                </div>

            </div>
        </AdminLayout>
    )
}