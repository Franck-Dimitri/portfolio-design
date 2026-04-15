import AdminLayout from '@/Layouts/AdminLayout'
import { Link } from '@inertiajs/react'
import {
    FolderGit2,
    Plus,
    Eye,
    Pencil,
    Trash2,
    Image as ImageIcon,
} from 'lucide-react'

export default function Index({ projects = [] }) {

    return (
        <AdminLayout>

            <div className="space-y-6">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div>
                        <h1 className="text-3xl font-bold text-base-primary flex items-center gap-2">
                            <FolderGit2 size={26} />
                            Projects
                        </h1>
                        <p className="text-base-muted mt-1">
                            Manage your design portfolio projects
                        </p>
                    </div>

                    <Link href="/admin/projects/create" className="btn btn-primary btn-lg">
                        <Plus size={18} />
                        New Project
                    </Link>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                    {projects.length === 0 && (
                        <div className="card p-10 text-center col-span-full">
                            <ImageIcon className="mx-auto text-base-muted" size={40} />
                            <p className="mt-3 text-base-muted">
                                No projects yet. Create your first project.
                            </p>
                        </div>
                    )}

                    {projects.map((project) => (
                        <div key={project.id} className="card overflow-hidden hover-lift">

                            {/* IMAGE */}
                            <div className="h-40 bg-base-muted relative overflow-hidden">

                                {project.image ? (
                                    <img
                                        src={project.image}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <ImageIcon className="text-base-muted" size={30} />
                                    </div>
                                )}

                                {/* CATEGORY BADGE */}
                                <span className="absolute top-3 left-3 badge bg-primary-500 text-white">
                                    {project.cathegorie}
                                </span>
                            </div>

                            {/* CONTENT */}
                            <div className="p-5 space-y-3">

                                <h2 className="font-bold text-base-primary">
                                    {project.titre}
                                </h2>

                                <p className="text-sm text-base-muted line-clamp-2">
                                    {project.description}
                                </p>

                                {/* META */}
                                <div className="flex justify-between text-xs text-base-muted">
                                    <span>💰 {project.prix ?? 0} FCFA</span>
                                    <span>⭐ {project.is_featured ? 'Featured' : 'Normal'}</span>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex items-center justify-between pt-3">

                                    <Link
                                        href={`/admin/projects/${project.id}`}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <Eye size={14} />
                                        View
                                    </Link>

                                    <div className="flex gap-2">

                                        <Link
                                            href={`/admin/projects/${project.id}/edit`}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <Pencil size={14} />
                                        </Link>

                                        <button
                                            onClick={() => confirm('Delete project?')}
                                            className="btn btn-ghost btn-sm text-red-500"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}

                </div>
            </div>

        </AdminLayout>
    )
}