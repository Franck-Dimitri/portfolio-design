import { Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { Plus, Pencil, Trash2, BookOpen, ExternalLink, Calendar, Eye, Heart, MessageSquare } from 'lucide-react'

export default function BlogIndex({ posts }) {
    const { delete: destroy } = useForm()

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
            destroy(route('admin.blogs.destroy', id))
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Non défini'
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    return (
        <AdminLayout>
            <div className="space-y-6">

                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Blog</h1>
                        <p className="text-base-muted">Gérer les articles de votre blog</p>
                    </div>

                    <Link href={route('admin.blogs.create')} className="btn btn-primary flex items-center gap-2">
                        <Plus size={18} />
                        Nouvel Article
                    </Link>
                </div>

                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <div className="card p-10 text-center flex flex-col items-center">
                            <BookOpen size={48} className="text-primary-500/50 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Aucun article</h3>
                            <p className="text-base-muted mb-4">Commencez par créer votre premier article.</p>
                            <Link href={route('admin.blogs.create')} className="btn btn-primary">Créer un article</Link>
                        </div>
                    ) : (
                        posts.map((p) => (
                            <div key={p.id} className="card p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                                        {p.image ? (
                                            <img src={`/storage/${p.image}`} alt={p.titre} className="w-full h-full object-cover rounded-lg" />
                                        ) : (
                                            <BookOpen className="text-primary-500" />
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-lg leading-tight line-clamp-1">{p.titre}</h2>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-base-muted">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={12} />
                                                Créé le {formatDate(p.created_at)}
                                            </span>
                                            {p.temps_lecture && (
                                                <span>• {p.temps_lecture} min de lecture</span>
                                            )}
                                            <div className="flex items-center gap-3 ml-2 border-l border-base pl-3">
                                                <span className="flex items-center gap-1" title="Vues">
                                                    <Eye size={12} /> {p.views || 0}
                                                </span>
                                                <span className="flex items-center gap-1" title="Likes">
                                                    <Heart size={12} /> {p.likes || 0}
                                                </span>
                                                <span className="flex items-center gap-1" title="Commentaires">
                                                    <MessageSquare size={12} /> {p.comments_count || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-base">
                                    <span className={`badge ${p.is_published ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                        {p.is_published ? 'Publié' : 'Brouillon'}
                                    </span>

                                    <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                                        {p.is_published && (
                                            <a 
                                                href={route('blog.show', p.slug)} 
                                                target="_blank" 
                                                className="btn btn-ghost btn-sm px-2 text-base-muted hover:text-primary-500"
                                                title="Voir l'article"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                        )}
                                        <Link href={route('admin.blogs.edit', p.id)} className="btn btn-ghost btn-sm px-2 text-base-muted hover:text-blue-500">
                                            <Pencil size={16} />
                                        </Link>
                                        <button onClick={() => handleDelete(p.id)} className="btn btn-ghost btn-sm px-2 text-base-muted hover:text-red-500">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                            </div>
                        ))
                    )}
                </div>

            </div>
        </AdminLayout>
    )
}
