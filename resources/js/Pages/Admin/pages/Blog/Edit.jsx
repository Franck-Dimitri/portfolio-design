import { Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    ArrowLeft, Save, Upload, Image as ImageIcon,
    Terminal, Crosshair, Sparkles, BookOpen, Eye, X, ExternalLink
} from 'lucide-react'
import { useState } from 'react'

export default function BlogEdit({ post: article }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        titre: article.titre || '',
        sous_titre: article.sous_titre || '',
        courte_description: article.courte_description || '',
        contenue: article.contenue || '',
        image: null,
        cathegorie: Array.isArray(article.cathegorie) ? article.cathegorie.join(', ') : (article.cathegorie || ''),
        temps_lecture: article.temps_lecture || 5,
        is_published: !!article.is_published,
    })

    const [imagePreview, setImagePreview] = useState(article.image ? `/storage/${article.image}` : null)
    const [tab, setTab] = useState('write') // 'write' | 'preview'

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setData('image', file)
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            setImagePreview(article.image ? `/storage/${article.image}` : null)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('admin.blogs.update', article.id))
    }

    return (
        <AdminLayout title={`Modifier: ${article.titre}`}>
            <div className="space-y-8 w-full">

                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.blogs.index')}
                            className="p-2 border border-gray-800 hover:border-primary-500 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-1">
                                <Terminal size={12} />
                                <span>ÉDITION D'ARTICLE // ID #{article.id}</span>
                            </div>
                            <h1 className="text-2xl font-display font-bold uppercase tracking-tight text-white">
                                {article.titre}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {article.slug && article.is_published && (
                            <a
                                href={`/blog/${article.slug}`}
                                target="_blank"
                                className="inline-flex items-center gap-1.5 border border-gray-800 text-gray-300 hover:text-white px-4 py-2.5 font-mono text-xs uppercase tracking-widest hover:border-primary-500 transition-colors"
                            >
                                <ExternalLink size={14} /> VOIR SUR LE SITE
                            </a>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="inline-flex items-center gap-2 bg-primary-500 text-black px-6 py-2.5 font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors disabled:opacity-50"
                        >
                            <Save size={14} />
                            {processing ? 'ENREGISTREMENT...' : 'METTRE À JOUR'}
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* BLOC PRINCIPAL */}
                    <div className="border border-gray-800 bg-[#0E0E0E] p-6 space-y-5">
                        <div>
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                                Titre principal de l'article *
                            </label>
                            <input
                                type="text"
                                required
                                value={data.titre}
                                onChange={(e) => setData('titre', e.target.value)}
                                className="w-full bg-[#141414] border border-gray-800 text-white px-4 py-2.5 text-sm font-display font-bold uppercase tracking-wider focus:border-primary-500 focus:outline-none"
                            />
                            {errors.titre && <p className="text-red-400 font-mono text-xs mt-1">{errors.titre}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                                    Sous-titre / En-tête secondaire
                                </label>
                                <input
                                    type="text"
                                    value={data.sous_titre}
                                    onChange={(e) => setData('sous_titre', e.target.value)}
                                    className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                                    Catégories (séparées par des virgules)
                                </label>
                                <input
                                    type="text"
                                    value={data.cathegorie}
                                    onChange={(e) => setData('cathegorie', e.target.value)}
                                    className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                                Résumé / Extrait d'accroche (affiché dans les listes)
                            </label>
                            <textarea
                                rows={2}
                                value={data.courte_description}
                                onChange={(e) => setData('courte_description', e.target.value)}
                                className="w-full bg-[#141414] border border-gray-800 text-white p-3 text-xs font-mono focus:border-primary-500 focus:outline-none"
                            />
                        </div>

                        {/* Image de Couverture */}
                        <div>
                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                                Image de Couverture
                            </label>
                            <div className="flex flex-col sm:flex-row gap-4 items-start">
                                <div className="border-2 border-dashed border-gray-800 p-6 text-center bg-[#141414] flex-1 w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="blog-cover-edit"
                                    />
                                    <label htmlFor="blog-cover-edit" className="cursor-pointer flex flex-col items-center gap-1">
                                        <Upload size={20} className="text-gray-500" />
                                        <span className="text-xs font-mono text-primary-500 uppercase font-bold">Remplacer la photo de couverture</span>
                                        <span className="text-[10px] font-mono text-gray-500">Formats PNG, JPG, WEBP (Max 5 Mo)</span>
                                    </label>
                                </div>

                                {imagePreview && (
                                    <div className="relative w-full sm:w-44 h-28 border border-gray-800 bg-gray-900 overflow-hidden shrink-0">
                                        <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setImagePreview(null)
                                                setData('image', null)
                                            }}
                                            className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 hover:text-red-300"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ÉDITEUR MARKDOWN */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                                    Corps de l'article (Markdown) *
                                </label>
                                <div className="flex gap-1 font-mono text-[10px]">
                                    <button
                                        type="button"
                                        onClick={() => setTab('write')}
                                        className={`px-3 py-1 uppercase tracking-wider transition-colors ${
                                            tab === 'write' ? 'bg-primary-500 text-black font-bold' : 'border border-gray-800 text-gray-400'
                                        }`}
                                    >
                                        ÉDITEUR
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setTab('preview')}
                                        className={`px-3 py-1 uppercase tracking-wider transition-colors ${
                                            tab === 'preview' ? 'bg-primary-500 text-black font-bold' : 'border border-gray-800 text-gray-400'
                                        }`}
                                    >
                                        APERÇU LIVE
                                    </button>
                                </div>
                            </div>

                            {tab === 'write' ? (
                                <textarea
                                    required
                                    rows={16}
                                    value={data.contenue}
                                    onChange={(e) => setData('contenue', e.target.value)}
                                    className="w-full bg-[#141414] border border-gray-800 text-white p-4 font-mono text-xs leading-relaxed focus:border-primary-500 focus:outline-none"
                                />
                            ) : (
                                <div className="p-6 bg-[#141414] border border-gray-800 min-h-[300px] text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {data.contenue || 'Aucun contenu.'}
                                </div>
                            )}
                            {errors.contenue && <p className="text-red-400 font-mono text-xs mt-1">{errors.contenue}</p>}
                        </div>

                        {/* PARAMÈTRES DE PUBLICATION */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-800 font-mono text-xs">
                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-gray-400 mb-1">
                                    Temps de lecture estimé (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={data.temps_lecture}
                                    onChange={(e) => setData('temps_lecture', e.target.value)}
                                    className="w-32 bg-[#141414] border border-gray-800 text-white px-3 py-1.5 focus:border-primary-500 focus:outline-none"
                                />
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_published}
                                        onChange={(e) => setData('is_published', e.target.checked)}
                                        className="accent-primary-500"
                                    />
                                    <span className="text-white font-bold">Publié en ligne</span>
                                </label>
                            </div>
                        </div>

                    </div>

                </form>

            </div>
        </AdminLayout>
    )
}
