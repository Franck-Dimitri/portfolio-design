import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router } from '@inertiajs/react';
import ProjectModal from '@/Components/ProjectModal';
import {
    FolderGit2,
    Eye,
    Pencil,
    Trash2,
    Image as ImageIcon,
    Users,
    TrendingUp,
    BarChart3,
    Plus,
    Settings,
} from 'lucide-react';

export default function Index({ projects = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(route('admin.projects.destroy', id));
        }
    };

    const handleEdit = (project) => {
        setEditingProject(project);
        setShowModal(true);
    };

    const handleCreate = () => {
        setEditingProject(null);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingProject(null);
    };

    const handleSuccess = () => {
        router.reload(); // Recharge la page pour voir les modifications
    };

    // Calcul des statistiques
    const totalProjects = projects.length;
    const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
    const featuredProjects = projects.filter(p => p.is_featured).length;

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

                    <button onClick={handleCreate} className="btn btn-primary btn-lg">
                        <Plus size={18} />
                        New Project
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        {
                            label: 'Total Projects',
                            value: totalProjects,
                            icon: FolderGit2,
                            trend: `${featuredProjects} featured`,
                            color: 'text-primary-500'
                        },
                        {
                            label: 'Total Views',
                            value: totalViews.toLocaleString(),
                            icon: Eye,
                            trend: '+12% increase',
                            color: 'text-green-500'
                        },
                        {
                            label: 'Visitors',
                            value: '3,847',
                            icon: Users,
                            trend: '+8% weekly',
                            color: 'text-blue-500'
                        },
                        {
                            label: 'Growth',
                            value: '4.2%',
                            icon: TrendingUp,
                            trend: '+0.5% boost',
                            color: 'text-emerald-500'
                        },
                    ].map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <div key={i} className="card p-5 hover-lift">
                                <div className="flex items-center justify-between">
                                    <Icon className={stat.color} size={22} />
                                    <span className="text-xs px-2 py-1 rounded-full bg-base-muted text-base-secondary">
                                        {stat.trend}
                                    </span>
                                </div>
                                <p className="text-base-muted text-sm mt-4">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold text-base-primary mt-1">
                                    {stat.value}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {projects.length === 0 && (
                        <div className="card p-10 text-center col-span-full">
                            <ImageIcon className="mx-auto text-base-muted" size={40} />
                            <p className="mt-3 text-base-muted">
                                No projects yet. Create your first project.
                            </p>
                            <button onClick={handleCreate} className="btn btn-primary mt-4">
                                <Plus size={16} />
                                Create Project
                            </button>
                        </div>
                    )}

                    {projects.map((project) => (
                        <div key={project.id} className="card overflow-hidden hover-lift">
                            {/* IMAGE */}
                            <div className="h-40 bg-base-muted relative overflow-hidden">
                                {project.image ? (
                                    <img
                                        src={`/storage/${project.image}`}
                                        className="w-full h-full object-cover"
                                        alt={project.titre}
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

                                {/* FEATURED BADGE */}
                                {project.is_featured && (
                                    <span className="absolute top-3 right-3 badge bg-yellow-500 text-white">
                                        Featured
                                    </span>
                                )}
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
                                    <span>💰 {project.prix ? `${project.prix} FCFA` : 'Price on request'}</span>
                                    <span>🛠️ {project.outils?.length || 0} tools</span>
                                    <span className={project.is_published ? 'text-green-500' : 'text-red-500'}>
                                        {project.is_published ? 'Published' : 'Draft'}
                                    </span>
                                </div>

                                {/* ACTIONS */}
                                <div className="flex items-center justify-between pt-3">
                                    <Link
                                        href={route('admin.projects.show', project.id)}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <Eye size={14} />
                                        View
                                    </Link>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(project)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <Pencil size={14} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(project.id)}
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

            {/* MODAL */}
            <ProjectModal
                show={showModal}
                onClose={handleModalClose}
                project={editingProject}
                onSuccess={handleSuccess}
            />
        </AdminLayout>
    );
}