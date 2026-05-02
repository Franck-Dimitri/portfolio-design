import { useState, useRef, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import {
    ArrowRight, Eye, Search,
    Sparkles, Star, ArrowUpRight, Grid3x3, List,
    DollarSign, Camera, RefreshCw
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

function ProjectCard({ project, viewMode = 'grid', index = 0 }) {
    const [isHovered, setIsHovered] = useState(false)
    const [ref, inView] = useInView()

    if (viewMode === 'list') {
        return (
            <article
                ref={ref}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`group flex flex-col md:flex-row gap-6 p-4 rounded-2xl bg-elevated border border-base hover:shadow-orange-md transition-all duration-300 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 50}ms` }}
            >
                <div className="relative md:w-72 h-48 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                    {project.images && project.images[0] ? (
                        <img
                            src={`/storage/${project.images[0].path}`}
                            alt={project.titre}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Camera size={32} className="text-base-muted" />
                        </div>
                    )}
                    {project.is_featured && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-yellow-500 text-white text-xs font-medium flex items-center gap-1">
                            <Star size={10} /> Featured
                        </span>
                    )}
                </div>
                <div className="flex-1 space-y-3">
                    <div>
                        <span className="text-xs text-primary-500 font-medium uppercase tracking-wider">
                            {project.cathegorie}
                        </span>
                        <h3 className="text-xl font-bold text-base-primary mt-1 group-hover:text-primary-500 transition-colors">
                            {project.titre}
                        </h3>
                    </div>
                    <p className="text-base-muted line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                        {project.outils?.slice(0, 4).map((tool, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 rounded-md bg-muted text-base-muted">
                                {tool}
                            </span>
                        ))}
                    </div>
                    <div className="flex items-center justify-between pt-3">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 text-sm font-semibold text-primary-500">
                                <DollarSign size={14} />
                                {parseInt(project.prix).toLocaleString()} FCFA
                            </span>
                            <span className="flex items-center gap-1 text-xs text-base-muted">
                                <Eye size={12} />
                                {project.views || 0} vues
                            </span>
                        </div>
                        <Link
                            href={`/projets/${project.slug}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary-500 hover:text-primary-600"
                        >
                            Voir détails <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </div>
            </article>
        )
    }

    // Mode grid
    return (
        <>
         <Link
                        href={`/projects/${project.slug}`}
            
                    >
                         <article
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative overflow-hidden rounded-2xl bg-elevated border border-base transition-all duration-500 hover:shadow-orange-md hover:-translate-y-1 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative h-56 bg-gradient-to-br from-primary-500/20 to-primary-700/20 overflow-hidden">
                {project.images && project.images[0] ? (
                    <>
                        <img 
                            src={`/storage/${project.images[0].path}`}
                            alt={project.titre}
                            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </>
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary-500/10 to-primary-700/10">
                        <Camera size={40} className="text-primary-500/30" />
                    </div>
                )}
                
                <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-semibold">
                        {project.cathegorie}
                    </span>
                </div>
                
                {project.is_featured && (
                    <span className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold flex items-center gap-1">
                        <Star size={12} /> Featured
                    </span>
                )}
                
                <div className={`absolute inset-0 bg-black/50 flex items-center justify-center gap-3 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    <Link
                        href={`/projects/${project.slug}`}
                        className="w-10 h-10 rounded-full bg-white text-neutral-900 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-200 transform hover:scale-110"
                    >
                        <Eye size={18} />
                    </Link>
                </div>
            </div>
            
            <div className="p-5">
                <h3 className="font-bold text-base-primary text-lg mb-1 group-hover:text-primary-500 transition-colors line-clamp-1">
                    {project.titre}
                </h3>
                <p className="text-sm text-base-muted line-clamp-2 mb-3">
                    {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.outils?.slice(0, 3).map((tool, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400">
                            {tool}
                        </span>
                    ))}
                    {project.outils?.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-base-muted">
                            +{project.outils.length - 3}
                        </span>
                    )}
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-base">
                    <div className="flex items-center gap-1">
                        <DollarSign size={12} className="text-primary-500" />
                        <span className="text-sm font-semibold text-primary-500">
                            {parseInt(project.prix).toLocaleString()} FCFA
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-base-muted">
                        <Eye size={10} />
                        <span>{project.views || 0}</span>
                    </div>
                </div>
            </div>
        </article>
                    </Link>
        </>
       
    )
}

export default function Projet({ projects = [], categories = [] }) {
    const [filterCategory, setFilterCategory] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState('grid')
    
    const allCategories = categories.length > 0 
        ? categories 
        : [...new Set(projects.map(p => p.cathegorie))]

    const filteredProjects = projects.filter(project => {
        const matchCategory = filterCategory === 'all' || project.cathegorie === filterCategory
        const matchSearch = project.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchCategory && matchSearch
    })

    const totalProjects = projects.length
    const featuredCount = projects.filter(p => p.is_featured).length
    const avgPrice = projects.reduce((sum, p) => sum + (parseInt(p.prix) || 0), 0) / projects.length || 0

    return (
        <MainLayout>
            <SEOHead 
                title="Portfolio | Projets de Design Graphique"
                description="Découvrez mon portfolio de projets en design graphique, branding, UI/UX et direction artistique."
                url="/projets"
            />

            <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary-50/30 to-transparent dark:from-primary-950/20">
                <div className="container-main px-4">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/50 mb-6">
                            <Sparkles size={14} className="text-primary-500" />
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Mon Portfolio</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
                            Mes{' '}
                            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                Créations
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-base-muted max-w-2xl mx-auto">
                            Une sélection de projets uniques mêlant créativité, innovation et expertise technique.
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-8 mt-12">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary-500">{totalProjects}</div>
                                <div className="text-sm text-base-muted">Projets réalisés</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary-500">{featuredCount}</div>
                                <div className="text-sm text-base-muted">Projets en vedette</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary-500">{Math.round(avgPrice).toLocaleString()} FCFA</div>
                                <div className="text-sm text-base-muted">Prix moyen</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="sticky top-16 z-30 py-4 bg-base/95 backdrop-blur-md border-b border-base">
                <div className="container-main px-4">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button
                                onClick={() => setFilterCategory('all')}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                                    ${filterCategory === 'all' 
                                        ? 'bg-primary-500 text-white shadow-orange-sm' 
                                        : 'bg-muted text-base-muted hover:bg-primary-100 dark:hover:bg-primary-900/30'}`}
                            >
                                Tous les projets
                            </button>
                            {allCategories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                                        ${filterCategory === cat 
                                            ? 'bg-primary-500 text-white shadow-orange-sm' 
                                            : 'bg-muted text-base-muted hover:bg-primary-100 dark:hover:bg-primary-900/30'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un projet..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-full border border-base bg-muted text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                                />
                            </div>
                            <button
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="p-2 rounded-full border border-base hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-all"
                            >
                                {viewMode === 'grid' ? <List size={18} /> : <Grid3x3 size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container-main px-4">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-20 animate-fade-in">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-950 dark:to-primary-900 flex items-center justify-center">
                                <Sparkles className="text-primary-500" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-base-primary">Aucun projet trouvé</h3>
                            <p className="text-base-muted mb-6">Aucun projet ne correspond à vos critères de recherche.</p>
                            <button
                                onClick={() => { setFilterCategory('all'); setSearchTerm('') }}
                                className="btn btn-primary gap-2"
                            >
                                <RefreshCw size={16} />
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-6 bg-primary-500 rounded-full"></div>
                                    <p className="text-base-muted">
                                        <span className="font-bold text-2xl text-primary-500 mr-1">{filteredProjects.length}</span>
                                        projet{filteredProjects.length > 1 ? 's' : ''} 
                                        <span className="mx-1">•</span>
                                        {filteredProjects.filter(p => p.is_featured).length} en vedette
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2.5 rounded-xl transition-all duration-200 ${
                                            viewMode === 'grid' 
                                                ? 'bg-primary-500 text-white shadow-orange-sm' 
                                                : 'bg-muted text-base-muted hover:bg-primary-100 dark:hover:bg-primary-900/30'
                                        }`}
                                    >
                                        <Grid3x3 size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2.5 rounded-xl transition-all duration-200 ${
                                            viewMode === 'list' 
                                                ? 'bg-primary-500 text-white shadow-orange-sm' 
                                                : 'bg-muted text-base-muted hover:bg-primary-100 dark:hover:bg-primary-900/30'
                                        }`}
                                    >
                                        <List size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className={`grid ${viewMode === 'grid' 
                                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                                : 'grid-cols-1'} gap-6 md:gap-8`}>
                                {filteredProjects.map((project, index) => (
                                    <ProjectCard key={project.id} project={project} viewMode={viewMode} index={index} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            <section className="section bg-subtle">
                <div className="container-main px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 p-12 text-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10">
                            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                                Vous avez un projet en tête ?
                            </h2>
                            <p className="text-primary-100 text-lg max-w-md mx-auto mb-8">
                                Discutons de votre vision et créons ensemble quelque chose d'unique et mémorable.
                            </p>
                            <Link 
                                href="/contact" 
                                className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold hover:bg-primary-50 hover:shadow-xl transition-all group"
                            >
                                Démarrer un projet
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}