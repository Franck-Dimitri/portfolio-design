import { useState, useRef, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import {
    ArrowRight, Search, Calendar, User, Clock, BookOpen,
    Tag, ChevronRight, Sparkles, TrendingUp, Heart,
    Share2, Bookmark, Eye, MessageCircle, Filter, X
} from 'lucide-react'
import MainLayout from '@/Layouts/MainLayout'
import SEOHead from '@/Components/SEOHead'

function useInView(options = {}) {
    const ref = useRef(null)
    const [inView, setInView] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
            { threshold: 0.12, ...options }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    return [ref, inView]
}

const CATEGORIES = [
    "Tous", "Inspiration", "Branding", "Motion Design", 
    "Packaging", "UI/UX", "Tech & Design"
]

function ArticleCard({ article, index }) {
    const [ref, inView] = useInView()
    const [isBookmarked, setIsBookmarked] = useState(false)
    
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    return (
        <article
            ref={ref}
            className={`group relative overflow-hidden bg-elevated border border-base
                        transition-all duration-500 hover:border-primary-500
                        ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Blueprint decorative corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary-500/50 pointer-events-none z-20"></div>
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary-500/50 pointer-events-none z-20"></div>
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary-500/50 pointer-events-none z-20"></div>
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary-500/50 pointer-events-none z-20"></div>

            <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <Link href={`/blog/${article.slug}`} className="block relative md:w-2/5 shrink-0 bg-subtle overflow-hidden border-b md:border-b-0 md:border-r border-base border-dashed group-hover:border-primary-500/30 transition-colors">
                    {/* Architectural grid overlay */}
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none z-10"></div>
                    
                    {article.image ? (
                        <img 
                            src={`/storage/${article.image}`} 
                            alt={article.titre}
                            className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center font-mono opacity-20">
                                <BookOpen size={40} className="mx-auto mb-2" />
                                <p className="text-xs tracking-widest uppercase">NO_IMAGE</p>
                            </div>
                        </div>
                    )}
                    
                    {/* Category Label */}
                    {article.cathegorie && article.cathegorie.length > 0 && (
                        <span className="absolute top-4 left-4 bg-primary-500/90 text-white text-[10px] uppercase font-mono tracking-widest px-2 py-1 z-20 shadow-sm border border-primary-400">
                            {article.cathegorie[0]}
                        </span>
                    )}
                </Link>

                {/* Content Section */}
                <div className="p-6 md:p-8 flex-1 flex flex-col relative bg-elevated group-hover:bg-subtle/30 transition-colors">
                    {/* Watermark ID */}
                    <div className="absolute right-4 top-4 font-mono text-6xl font-bold text-base-muted opacity-5 pointer-events-none select-none">
                        {article.id.toString().padStart(3, '0')}
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono uppercase tracking-wider text-base-muted mb-4">
                        <span className="flex items-center gap-1.5 border border-base/50 px-2 py-1 bg-subtle">
                            <Calendar size={12} className="text-primary-500" />
                            {formatDate(article.published_at)}
                        </span>
                        <span className="flex items-center gap-1.5 border border-base/50 px-2 py-1 bg-subtle">
                            <Clock size={12} className="text-primary-500" />
                            {article.temps_lecture} MIN
                        </span>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${article.slug}`} className="mb-3 relative z-10">
                        <h3 className="font-display font-bold text-base-primary text-2xl group-hover:text-primary-500 transition-colors leading-tight">
                            {article.titre}
                        </h3>
                    </Link>

                    {/* Subtitle / Description */}
                    <p className="text-sm text-base-muted line-clamp-2 mb-6 font-medium leading-relaxed relative z-10">
                        {article.courte_description || article.sous_titre}
                    </p>

                    {/* Technical Specs Footer */}
                    <div className="mt-auto pt-4 border-t border-base border-dashed flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-base border border-primary-500/20 flex items-center justify-center text-primary-500 text-xs font-mono font-bold shadow-inner">
                                DD
                            </div>
                            <div>
                                <p className="text-xs font-bold text-base-primary font-display uppercase tracking-wider">Dims Design</p>
                                <p className="text-[10px] font-mono text-base-muted uppercase">Auteur</p>
                            </div>
                        </div>
                        
                        <Link href={`/blog/${article.slug}`} className="text-xs font-mono font-bold uppercase tracking-widest text-primary-500 flex items-center gap-2 group/link">
                            LIRE_DOC
                            <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}

function FeaturedArticle({ article }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }

    return (
        <div className="group relative overflow-hidden bg-subtle border border-base p-8 md:p-12 mb-16">
            {/* Blueprint Background Grid */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>
            
            {/* Technical corners */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-primary-500 pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-primary-500 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-primary-500 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-primary-500 pointer-events-none"></div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                
                {/* Content */}
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-primary-500 text-white text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 shadow-sm">
                            DOCUMENT_MAÎTRE
                        </span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display text-base-primary mb-4 leading-tight">
                        {article.titre}
                    </h2>
                    
                    <p className="text-xl font-medium text-primary-600 mb-4">
                        {article.sous_titre}
                    </p>
                    
                    <p className="text-base-muted text-lg mb-8 leading-relaxed max-w-xl">
                        {article.courte_description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-base-muted uppercase tracking-wider mb-8">
                        <span className="flex items-center gap-2 border border-base px-3 py-1.5 bg-elevated shadow-sm">
                            <Calendar size={14} className="text-primary-500" />
                            {formatDate(article.published_at)}
                        </span>
                        <span className="flex items-center gap-2 border border-base px-3 py-1.5 bg-elevated shadow-sm">
                            <Clock size={14} className="text-primary-500" />
                            {article.temps_lecture} MIN LECTURE
                        </span>
                    </div>
                    
                    <Link 
                        href={`/blog/${article.slug}`}
                        className="inline-flex items-center gap-3 bg-base-primary text-base-base px-8 py-4 text-sm font-mono font-bold uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all group/btn"
                    >
                        ACCÉDER AU DOSSIER
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Featured Image */}
                <div className="relative h-full min-h-[300px]">
                    <div className="absolute inset-0 border-2 border-base border-dashed translate-x-4 translate-y-4 pointer-events-none z-0 hidden lg:block"></div>
                    <div className="relative z-10 aspect-[4/3] bg-muted border border-base overflow-hidden">
                        {article.image ? (
                            <img 
                                src={`/storage/${article.image}`} 
                                alt={article.titre}
                                className="w-full h-full object-cover filter saturate-50 group-hover:saturate-100 transition-all duration-700"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full bg-subtle">
                                <span className="font-mono text-sm text-base-muted">NO_PREVIEW</span>
                            </div>
                        )}
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm border border-base/20 text-black font-mono text-xs px-3 py-1 shadow-lg">
                            FIG.{article.id}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function Blog({ articles = [], categories = [] }) {
    const [filterCategory, setFilterCategory] = useState('Tous')
    const [searchTerm, setSearchTerm] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    
    // Utiliser les articles de la base de données
    const displayArticles = articles || []
    const publishedArticles = displayArticles
    
    // Article à la une (le plus récent ou le plus vu)
    const featuredArticle = publishedArticles.length > 0 
        ? publishedArticles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))[0]
        : null
    
    // Autres articles (sans l'article à la une)
    const otherArticles = publishedArticles.filter(a => a.id !== featuredArticle?.id)
    
    // Filtrage des articles
    const filteredArticles = otherArticles.filter(article => {
        const matchCategory = filterCategory === 'Tous' || (article.cathegorie && article.cathegorie.includes(filterCategory))
        const matchSearch = article.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.sous_titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.courte_description?.toLowerCase().includes(searchTerm.toLowerCase())
        return matchCategory && matchSearch
    })

    // Catégories disponibles
    const availableCategories = categories.length > 0 
        ? ['Tous', ...categories] 
        : CATEGORIES

    // Articles populaires (top 3 par vues)
    const popularArticles = [...publishedArticles]
        .sort((a, b) => b.views - a.views)
        .slice(0, 3)

    return (
        <MainLayout>
            <SEOHead 
                title="Blog"
                description="Articles et inspirations sur le design graphique, le branding, la direction artistique et les tendances créatives."
                url="/blog"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 border-b border-base overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none -z-10"></div>
                <div className="container-main px-4">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-12 h-px bg-primary-500" />
                            <span className="font-mono text-sm font-bold text-primary-500 uppercase tracking-widest">ARCHIVES_PUBLIQUES</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-none mb-6 text-base-primary">
                            Notes & <span className="text-primary-500 font-light italic">Analyses</span>
                        </h1>
                        <p className="text-xl text-base-muted font-light max-w-2xl leading-relaxed">
                            Exploration technique et conceptuelle du design graphique, du branding et de l'architecture visuelle moderne.
                        </p>
                        
                        <div className="mt-8 flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-base-muted">
                            <span className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                SYSTÈME ACTIF
                            </span>
                            <span>/</span>
                            <span>{publishedArticles.length} DOCUMENTS INDEXÉS</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            {featuredArticle && (
                <section className="section pt-0">
                    <div className="container-main px-4">
                        <FeaturedArticle article={featuredArticle} />
                    </div>
                </section>
            )}

            {/* Search & Filters Bar */}
            <section className="py-8 sticky top-16 bg-base/95 backdrop-blur-sm z-30 border-b border-base">
                <div className="container-main px-4">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" />
                            <input
                                type="text"
                                placeholder="Rechercher un article..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-full border border-base bg-muted text-sm focus:border-primary-500 focus:outline-none"
                            />
                        </div>

                        {/* Category Filters - Desktop */}
                        <div className="hidden lg:flex flex-wrap gap-2 justify-center">
                            {availableCategories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                        ${filterCategory === cat 
                                            ? 'bg-primary-500 text-white shadow-orange-sm' 
                                            : 'bg-muted text-base-muted hover:bg-primary-100 dark:hover:bg-primary-900/30'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Mobile Filter Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-base hover:border-primary-500 transition-colors"
                        >
                            <Filter size={16} />
                            Filtrer
                            {filterCategory !== 'Tous' && (
                                <span className="w-2 h-2 rounded-full bg-primary-500" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Filters Dropdown */}
                    {showFilters && (
                        <div className="lg:hidden mt-4 p-4 rounded-xl border border-base bg-elevated">
                            <div className="flex flex-wrap gap-2">
                                {availableCategories.map((cat, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setFilterCategory(cat)
                                            setShowFilters(false)
                                        }}
                                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                                            ${filterCategory === cat 
                                                ? 'bg-primary-500 text-white' 
                                                : 'bg-muted text-base-muted'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content */}
            <section className="section">
                <div className="container-main px-4">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Articles Grid */}
                        <div className="lg:col-span-2">
                            {filteredArticles.length === 0 ? (
                                <div className="p-12 border-2 border-dashed border-base text-center bg-subtle">
                                    <BookOpen className="mx-auto text-base-muted mb-4 opacity-50" size={48} />
                                    <h3 className="text-xl font-display font-semibold mb-2">Aucun document trouvé</h3>
                                    <p className="text-base-muted font-mono text-sm mb-6">MODIFIEZ VOS CRITÈRES DE RECHERCHE_</p>
                                    <p className="text-sm border-t border-base pt-4">
                                        <em>NB : Si vous venez de lancer le site, aucun article n'a encore été rédigé. Rendez-vous dans le <Link href="/admin/dashboard" className="text-primary-500 hover:underline">Panel Admin</Link> pour créer votre premier document et le publier.</em>
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {filteredArticles.map((article, index) => (
                                        <ArticleCard key={article.id} article={article} index={index} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-8">
                            {/* Popular Posts */}
                            <div className="card p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <TrendingUp size={18} className="text-primary-500" />
                                    <h3 className="font-semibold text-base-primary">Articles populaires</h3>
                                </div>
                                <div className="space-y-4">
                                    {popularArticles.map((article, idx) => (
                                        <Link 
                                            key={idx}
                                            href={`/blog/${article.slug}`}
                                            className="flex gap-3 group hover:bg-muted p-2 rounded-lg transition-colors"
                                        >
                                            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary-500/20 to-primary-700/20 flex-shrink-0 flex items-center justify-center">
                                                <BookOpen size={24} className="text-primary-500/50" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-medium text-base-primary group-hover:text-primary-500 transition-colors line-clamp-2">
                                                    {article.titre}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-1 text-xs text-base-muted">
                                                    <span>{article.temps_lecture} min</span>
                                                    <span>•</span>
                                                    <span>{article.views} vues</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Categories Cloud */}
                            <div className="card p-6">
                                <h3 className="font-semibold text-base-primary mb-4">Catégories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {availableCategories.filter(c => c !== 'Tous').map((cat, idx) => {
                                        const count = publishedArticles.filter(a => a.cathegorie && a.cathegorie.includes(cat)).length
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setFilterCategory(cat)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                                                    ${filterCategory === cat 
                                                        ? 'bg-primary-500 text-white' 
                                                        : 'bg-muted text-base-muted hover:bg-primary-100 dark:hover:bg-primary-900/30'}`}
                                            >
                                                {cat} ({count})
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Newsletter */}
                            <div className="card p-6 bg-gradient-to-br from-primary-500/10 to-primary-700/10 border-primary-500/20">
                                <div className="text-center">
                                    <Sparkles size={32} className="text-primary-500 mx-auto mb-3" />
                                    <h3 className="font-semibold text-base-primary mb-2">Newsletter</h3>
                                    <p className="text-sm text-base-muted mb-4">
                                        Recevez mes nouveaux articles directement dans votre boîte mail.
                                    </p>
                                    <form className="space-y-3">
                                        <input
                                            type="email"
                                            placeholder="Votre email"
                                            className="input text-sm"
                                        />
                                        <button className="btn-primary w-full text-sm">
                                            S'abonner
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="card p-6">
                                <h3 className="font-semibold text-base-primary mb-4">Tags populaires</h3>
                                <div className="flex flex-wrap gap-2">
                                    {[...new Set(publishedArticles.flatMap(a => a.cathegorie || []))].slice(0, 12).map((tag, idx) => (
                                        <span 
                                            key={idx}
                                            className="text-xs px-2 py-1 rounded-full bg-muted text-base-muted cursor-pointer hover:bg-primary-500 hover:text-white transition-all duration-200"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section bg-subtle">
                <div className="container-main px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-500 p-12 text-center">
                        <div className="relative z-10">
                            <h2 className="text-white mb-4">Vous avez aimé ces articles ?</h2>
                            <p className="text-primary-100 max-w-md mx-auto mb-8">
                                Partagez-les autour de vous ou contactez-moi pour discuter de vos projets créatifs.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold hover:bg-primary-50 transition-all group">
                                    Me contacter
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/projets" className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
                                    Voir mes projets
                                    <ChevronRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}