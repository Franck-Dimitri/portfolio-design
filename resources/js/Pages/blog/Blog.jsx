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

// Données factices pour les articles (en attendant la base de données)
const MOCK_ARTICLES = [
    {
        id: 1,
        titre: "Les tendances design 2024 : entre minimalisme et maximalisme",
        slug: "tendances-design-2024",
        sous_titre: "Découvrez les courants qui façonnent le design graphique cette année",
        courte_description: "Le design graphique évolue constamment. Entre le retour du maximalisme assumé et la persistance du minimalisme fonctionnel, voici ce qui marquera 2024.",
        contenu: "Lorem ipsum...",
        image: null,
        temps_lecture: 5,
        is_published: true,
        published_at: "2024-01-15",
        category: "Inspiration",
        tags: ["Design", "Tendances", "2024"],
        author: "Franck Dimitri",
        views: 1247,
        likes: 89
    },
    {
        id: 2,
        titre: "Comment créer une identité de marque mémorable",
        slug: "creer-identite-marque-memorables",
        sous_titre: "Les clés pour une marque qui marque les esprits",
        courte_description: "Une identité visuelle forte est essentielle pour se démarquer. Découvrez les étapes pour créer une marque authentique et durable.",
        contenu: "Lorem ipsum...",
        image: null,
        temps_lecture: 8,
        is_published: true,
        published_at: "2024-01-28",
        category: "Branding",
        tags: ["Branding", "Identité", "Marketing"],
        author: "Franck Dimitri",
        views: 2341,
        likes: 156
    },
    {
        id: 3,
        titre: "L'importance du motion design dans le marketing digital",
        slug: "importance-motion-design-marketing-digital",
        sous_titre: "Pourquoi l'animation est devenue incontournable",
        courte_description: "Le motion design captive l'attention et améliore la mémorisation. Analyse de son impact sur les stratégies marketing actuelles.",
        contenu: "Lorem ipsum...",
        image: null,
        temps_lecture: 6,
        is_published: true,
        published_at: "2024-02-10",
        category: "Motion Design",
        tags: ["Motion", "Animation", "Marketing"],
        author: "Franck Dimitri",
        views: 982,
        likes: 67
    },
    {
        id: 4,
        titre: "Guide complet du packaging éco-responsable",
        slug: "guide-packaging-eco-responsable",
        sous_titre: "Allier esthétique et engagement environnemental",
        courte_description: "Le packaging durable n'est plus une option mais une nécessité. Comment concilier design premium et respect de l'environnement.",
        contenu: "Lorem ipsum...",
        image: null,
        temps_lecture: 7,
        is_published: true,
        published_at: "2024-02-22",
        category: "Packaging",
        tags: ["Packaging", "Éco-design", "Durable"],
        author: "Franck Dimitri",
        views: 1563,
        likes: 112
    },
    {
        id: 5,
        titre: "UI/UX Design : les erreurs à éviter en 2024",
        slug: "ui-ux-erreurs-eviter-2024",
        sous_titre: "Améliorez l'expérience utilisateur de vos interfaces",
        courte_description: "Les utilisateurs sont de plus en plus exigeants. Évitez ces pièges courants en UI/UX design pour offrir une expérience optimale.",
        contenu: "Lorem ipsum...",
        image: null,
        temps_lecture: 9,
        is_published: true,
        published_at: "2024-03-05",
        category: "UI/UX",
        tags: ["UI", "UX", "Web Design"],
        author: "Franck Dimitri",
        views: 2876,
        likes: 203
    },
    {
        id: 6,
        titre: "L'intelligence artificielle dans le design : menace ou opportunité ?",
        slug: "ia-design-menace-opportunite",
        sous_titre: "Comment les designers peuvent tirer parti de l'IA",
        courte_description: "L'IA transforme le monde du design. Découvrez comment l'utiliser comme un allié créatif plutôt qu'un concurrent.",
        contenu: "Lorem ipsum...",
        image: null,
        temps_lecture: 10,
        is_published: true,
        published_at: "2024-03-18",
        category: "Tech & Design",
        tags: ["IA", "Innovation", "Futur"],
        author: "Franck Dimitri",
        views: 3421,
        likes: 278
    }
]

const CATEGORIES = [
    "Tous", "Inspiration", "Branding", "Motion Design", 
    "Packaging", "UI/UX", "Tech & Design"
]

function ArticleCard({ article, index }) {
    const [ref, inView] = useInView()
    const [isBookmarked, setIsBookmarked] = useState(false)
    
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    return (
        <article
            ref={ref}
            className={`group relative overflow-hidden rounded-2xl bg-elevated border border-base
                        transition-all duration-500 hover:shadow-orange-md hover:-translate-y-1
                        ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Image */}
            <Link href={`/blog/${article.slug}`} className="block relative h-56 bg-gradient-to-br from-primary-500/20 to-primary-700/20 overflow-hidden">
                {article.image ? (
                    <img 
                        src={`/storage/${article.image}`} 
                        alt={article.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <BookOpen size={40} className="text-primary-500/50 mx-auto mb-2" />
                            <p className="text-xs text-primary-500/50">Article</p>
                        </div>
                    </div>
                )}
                
                {/* Category Badge */}
                <span className="absolute top-3 left-3 badge-primary text-xs z-10">
                    {article.category}
                </span>
                
                {/* Reading Time */}
                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Clock size={12} />
                    {article.temps_lecture} min
                </span>
            </Link>

            {/* Content */}
            <div className="p-5">
                {/* Meta info */}
                <div className="flex items-center gap-3 text-xs text-base-muted mb-3">
                    <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {formatDate(article.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Eye size={12} />
                        {article.views} vues
                    </span>
                </div>

                {/* Title */}
                <Link href={`/blog/${article.slug}`}>
                    <h3 className="font-display font-semibold text-base-primary text-xl mb-2 group-hover:text-primary-500 transition-colors line-clamp-2">
                        {article.titre}
                    </h3>
                </Link>

                {/* Subtitle */}
                <p className="text-sm text-primary-500/80 font-medium mb-2">
                    {article.sous_titre}
                </p>

                {/* Description */}
                <p className="text-sm text-base-muted line-clamp-2 mb-4">
                    {article.courte_description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {article.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-muted text-base-muted">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-base flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                            FD
                        </div>
                        <div>
                            <p className="text-xs font-medium text-base-primary">{article.author}</p>
                            <p className="text-xs text-base-muted">Designer</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                        >
                            <Bookmark 
                                size={14} 
                                className={isBookmarked ? 'fill-primary-500 text-primary-500' : 'text-base-muted'} 
                            />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                            <Share2 size={14} className="text-base-muted" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

function FeaturedArticle({ article }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    return (
        <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-500 p-8 md:p-12">
            <div className="relative z-10 max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                    <span className="badge bg-white/20 text-white">À la une</span>
                    <span className="text-white/80 text-sm flex items-center gap-1">
                        <Clock size={14} />
                        {article.temps_lecture} min de lecture
                    </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                    {article.titre}
                </h2>
                
                <p className="text-primary-100 text-lg mb-2">
                    {article.sous_titre}
                </p>
                
                <p className="text-white/80 mb-6 line-clamp-2">
                    {article.courte_description}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Calendar size={14} />
                        {formatDate(article.published_at)}
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Eye size={14} />
                        {article.views} vues
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-sm">
                        <Heart size={14} />
                        {article.likes} likes
                    </div>
                </div>
                
                <Link 
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all group"
                >
                    Lire l'article
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
        </div>
    )
}

export default function Blog({ articles = [], categories = [] }) {
    const [filterCategory, setFilterCategory] = useState('Tous')
    const [searchTerm, setSearchTerm] = useState('')
    const [showFilters, setShowFilters] = useState(false)
    
    // Utiliser les articles de la base de données ou les données factices
    const displayArticles = articles.length > 0 ? articles : MOCK_ARTICLES
    const publishedArticles = displayArticles.filter(a => a.is_published)
    
    // Article à la une (le plus récent ou le plus vu)
    const featuredArticle = publishedArticles.length > 0 
        ? publishedArticles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))[0]
        : null
    
    // Autres articles (sans l'article à la une)
    const otherArticles = publishedArticles.filter(a => a.id !== featuredArticle?.id)
    
    // Filtrage des articles
    const filteredArticles = otherArticles.filter(article => {
        const matchCategory = filterCategory === 'Tous' || article.category === filterCategory
        const matchSearch = article.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.sous_titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.courte_description.toLowerCase().includes(searchTerm.toLowerCase())
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
            <section className="relative pt-32 pb-16 bg-gradient-to-b from-primary-50/30 to-transparent dark:from-primary-950/20">
                <div className="container-main px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="divider" />
                            <span className="text-sm font-medium text-primary-500 uppercase tracking-wider">Blog & Articles</span>
                            <span className="divider" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Inspirations &{' '}
                            <span className="text-gradient">Connaissances</span>
                        </h1>
                        <p className="text-lg text-base-muted">
                            Découvrez mes réflexions, tutoriels et analyses sur le design,
                            la créativité et les tendances du moment.
                        </p>
                        <p className="text-sm text-primary-500 mt-4">
                            {publishedArticles.length} articles publiés
                        </p>
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
                                <div className="text-center py-20">
                                    <Sparkles className="mx-auto text-base-muted mb-4" size={48} />
                                    <h3 className="text-xl font-semibold mb-2">Aucun article trouvé</h3>
                                    <p className="text-base-muted">Essayez de modifier vos filtres de recherche.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
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
                                        const count = publishedArticles.filter(a => a.category === cat).length
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
                                    {[...new Set(publishedArticles.flatMap(a => a.tags))].slice(0, 12).map((tag, idx) => (
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