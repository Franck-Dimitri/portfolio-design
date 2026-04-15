import AdminLayout from '@/Layouts/AdminLayout'
import { Link } from '@inertiajs/react'
import {
    PenTool,
    Plus,
    Pencil,
    Trash2,
    Eye,
    BadgeCheck,
    Clock,
    Banknote,
} from 'lucide-react'

export default function Index({ services = [] }) {

    return (
        <AdminLayout>

            <div className="space-y-6">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>
                        <h1 className="text-3xl font-bold text-base-primary flex items-center gap-2">
                            <PenTool size={26} />
                            Services
                        </h1>
                        <p className="text-base-muted mt-1">
                            Manage your design services & pricing
                        </p>
                    </div>

                    <Link
                        href="/admin/services/create"
                        className="btn btn-primary btn-lg"
                    >
                        <Plus size={18} />
                        New Service
                    </Link>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                    {services.length === 0 && (
                        <div className="card p-10 text-center col-span-full">
                            <PenTool className="mx-auto text-base-muted" size={40} />
                            <p className="mt-3 text-base-muted">
                                No services yet. Create your first service.
                            </p>
                        </div>
                    )}

                    {services.map((service) => (
                        <div key={service.id} className="card p-5 hover-lift space-y-4">

                            {/* TITLE */}
                            <div className="flex items-start justify-between">

                                <h2 className="font-bold text-base-primary text-lg">
                                    {service.titre}
                                </h2>

                                {service.is_featured && (
                                    <span className="badge bg-primary-500 text-white">
                                        Featured
                                    </span>
                                )}

                            </div>

                            {/* DESCRIPTION */}
                            <p className="text-sm text-base-muted line-clamp-3">
                                {service.description}
                            </p>

                            {/* INFO */}
                            <div className="space-y-2 text-sm">

                                <div className="flex items-center justify-between">
                                    <span className="text-base-muted flex items-center gap-2">
                                        <Banknote size={14} /> Prix
                                    </span>
                                    <span className="font-semibold text-primary-500">
                                        {service.prix} FCFA
                                    </span>
                                </div>

                                {service.starting_price && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-base-muted">
                                            Starting
                                        </span>
                                        <span>
                                            {service.starting_price} FCFA
                                        </span>
                                    </div>
                                )}

                                {service.delaie_livraison && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-base-muted flex items-center gap-2">
                                            <Clock size={14} /> Delivery
                                        </span>
                                        <span>
                                            {service.delaie_livraison} days
                                        </span>
                                    </div>
                                )}

                            </div>

                            {/* FEATURES */}
                            {service.features?.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {service.features.slice(0, 3).map((f, i) => (
                                        <span
                                            key={i}
                                            className="badge bg-base-muted text-base-secondary"
                                        >
                                            <BadgeCheck size={12} />
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* ACTIONS */}
                            <div className="flex items-center justify-between pt-4 border-t border-base">

                                <Link
                                    href={`/admin/services/${service.id}`}
                                    className="btn btn-ghost btn-sm"
                                >
                                    <Eye size={14} />
                                    View
                                </Link>

                                <div className="flex gap-2">

                                    <Link
                                        href={`/admin/services/${service.id}/edit`}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        <Pencil size={14} />
                                    </Link>

                                    <button
                                        onClick={() => confirm('Delete service?')}
                                        className="btn btn-ghost btn-sm text-red-500"
                                    >
                                        <Trash2 size={14} />
                                    </button>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>
            </div>

        </AdminLayout>
    )
}