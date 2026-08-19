import { Link, useForm, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    Plus, Pencil, Trash2, BookOpen, ExternalLink, Calendar,
    Eye, Heart, MessageSquare, Terminal, Crosshair, Sparkles, Search
} from 'lucide-react'
import { useState } from 'react'

export default function BlogIndex({ posts = [] }) {
    const { delete: destroy } = useForm()
    const [searchTerm, setSearchTerm] = useState('')

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer définitivement cet article ?')) {
            destroy(route('admin.blogs.destroy', id))
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Non défini'
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    }

    const filteredPosts = posts.filter(p =>
        !searchTerm ||
        p.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.courte_description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const totalPosts = posts.length
    const publishedPosts = posts.filter(p => p.is_published).length
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0)
    const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0)

    return (
        <AdminLayout title="Gestion du Blog">
            <div className="space-y-8">

                {/* ── HEADER ── */}
                <div className="relative border border-gray-800 bg-[#0E0E0E] p-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary-500"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary-500"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary-500"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary-500"></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-1">
                                <Terminal size={12} />
                                <span>MODULE : ÉDITION ÉDITORIALE & ARTICLES</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                                GESTION DU <span className="text-primary-500">BLOG & PUBLICATIONS</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-1">
                                Rédigez en Markdown, publiez vos réflexions sur le design et suivez l'engagement de vos lecteurs.
                            </p>
                        </div>

                        <Link
                            href={route('admin.blogs.create')}
                            className="inline-flex items-center gap-2 bg-primary-500 text-black px-5 py-2.5 font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors shrink-0"
                        >
                            <Plus size={14} /> NOUVEL ARTICLE
                        </Link>
                    </div>
                </div>

                {/* ── STATS BAR ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">TOTAL ARTICLES</span>
                        <div className="text-2xl font-bold font-display text-white">{totalPosts}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">PUBLIÉS EN LIGNE</span>
                        <div className="text-2xl font-bold font-display text-green-400">{publishedPosts}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">LECTURES & VUES</span>
                        <div className="text-2xl font-bold font-display text-primary-500">{totalViews.toLocaleString()}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">MENTIONS J'AIME</span>
                        <div className="text-2xl font-bold font-display text-red-400">{totalLikes.toLocaleString()}</div>
                    </div>
                </div>

                {/* ── RECHERCHE ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-4 flex gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher par titre ou extrait d'article..."
                            className="w-full bg-[#141414] border border-gray-800 text-white pl-9 pr-4 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none placeholder:text-gray-600"
                        />
                    </div>
                </div>

                {/* ── LISTE DES ARTICLES ── */}
                <div className="space-y-4">
                    {filteredPosts.length === 0 ? (
                        <div className="border border-dashed border-gray-800 p-12 text-center bg-[#0E0E0E]">
                            <BookOpen size={32} className="mx-auto text-gray-600 mb-3" />
                            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4">
                                AUCUN ARTICLE TROUVÉ
                            </p>
                            <Link
                                href={route('admin.blogs.create')}
                                className="inline-block px-4 py-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400"
                            >
                                CRÉER UN ARTICLE
                            </Link>
                        </div>
                    ) : (
                        filteredPosts.map((post) => (
                            <article
                                key={post.id}
                                className="border border-gray-800 bg-[#0E0E0E] p-5 flex flex-col md:flex-row md:items-center justify-between gap-5 hover:border-primary-500/50 transition-colors"
                            >
                                {/* Left Content */}
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    <div className="w-14 h-14 border border-gray-800 bg-gray-900 flex items-center justify-center shrink-0 overflow-hidden">
                                        {post.image ? (
                                            <img
                                                src={`/storage/${post.image}`}
                                                alt={post.titre}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <BookOpen className="text-gray-600" size={20} />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-white uppercase text-base tracking-wider truncate">
                                                {post.titre}
                                            </h3>
                                            <span className={`px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest border shrink-0 ${
                                                post.is_published
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                                            }`}>
                                                {post.is_published ? 'PUBLIÉ' : 'BROUILLON'}
                                            </span>
                                        </div>

                                        <p className="text-xs font-mono text-gray-400 line-clamp-1 mb-2">
                                            {post.sous_titre || post.courte_description || 'Pas de résumé'}
                                        </p>

                                        {/* Metrics & Meta */}
                                        <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={11} /> {formatDate(post.created_at)}
                                            </span>
                                            {post.temps_lecture && (
                                                <span>• {post.temps_lecture} MIN DE LECTURE</span>
                                            )}
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <Eye size={11} className="text-primary-500" /> {post.views || 0}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <Heart size={11} className="text-red-400" /> {post.likes || 0}
                                            </span>
                                            <span className="flex items-center gap-1 text-gray-400">
                                                <MessageSquare size={11} className="text-blue-400" /> {post.comments_count || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Actions */}
                                <div className="flex items-center gap-2 self-end md:self-center border-t md:border-t-0 pt-3 md:pt-0 border-gray-800 w-full md:w-auto justify-end">
                                    {post.is_published && post.slug && (
                                        <a
                                            href={`/blog/${post.slug}`}
                                            target="_blank"
                                            className="p-2 border border-gray-800 hover:border-primary-500 text-gray-400 hover:text-white transition-colors"
                                            title="Voir l'article public"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    )}

                                    <Link
                                        href={route('admin.blogs.edit', post.id)}
                                        className="p-2 border border-gray-800 hover:border-blue-500 text-gray-400 hover:text-blue-400 transition-colors"
                                        title="Éditer l'article"
                                    >
                                        <Pencil size={14} />
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="p-2 border border-gray-800 hover:border-red-500 text-gray-400 hover:text-red-400 transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </div>

            </div>
        </AdminLayout>
    )
}
