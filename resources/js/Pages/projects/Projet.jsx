import { useState, useRef, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import {
    ArrowRight, Eye, ExternalLink, Search,
    Sparkles, Star, ArrowUpRight, Grid3x3, List,
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

// Données factices pour l'affichage (en attendant la base de données)
const MOCK_PROJECTS = [
    {
        id: 1,
        titre: "Couverture d'evenement festif",
        description: "COnception et reaclisatin de plusiers element de commnunication pour une grande soiree, la plus grande soiree de l'IAI-Cameroun, la soiree de parrainnage",
        cathegorie: "Flyers, evenement",
        image: "/image/moi1.JPG",

        outils: ["Illustrator", "Photoshop"],
        prix: "145000",
        slug: "couverture-evenement-iai",
        is_featured: true,
        image: null,
    },
    {
        id: 2,
        titre: "Conception de logo -- Brik's Design",
        image: "/image/moi1.JPG",
        description: "Conception et realisation d'un logo Typographique pour une entreprise de prestation de services en communication visuelle",
        cathegorie: "Logo",
        outils: ["Illustrator", "Photoshop"],
        prix: "90000",
        slug: "app-mobile-fintech",
        is_featured: true,
        image: null,
    },
    {
        id: 3,
        titre: "Communication Pro",
        description: "Direction artistique d'une campagne de propection pour une plate-forme evenementielle -- ca-bouge-ou.com.",
        cathegorie: "Flyer",
        image: "/image/moi1.JPG",

        outils: ["Photoshop",],
        prix: "50000",
        slug: "campagne-publicitaire",
        is_featured: false,
        image: null,
    },
    {
        id: 4,
        titre: "Packaging Luxe",
        description: "Design d'emballage pour une gamme de parfums haut de gamme.",
        cathegorie: "Packaging",
        outils: ["Illustrator", "Photoshop", "Dimension"],
        prix: "98000",
        slug: "packaging-luxe",
        image: "/image/moi1.JPG",

        is_featured: true,
        image: null,
    },
    {
        id: 5,
        titre: "Site E-commerce",
        description: "Design complet d'une boutique en ligne avec expérience utilisateur optimisée.",
        cathegorie: "Web Design",
        outils: ["Figma", "Webflow", "Tailwind"],
        prix: "300000",
        slug: "site-ecommerce",
        is_featured: false,
        image: null,
    },
    {
        id: 6,
        titre: "Motion Graphics Showreel",
        description: "Animation et motion design pour une agence de communication.",
        cathegorie: "Motion Design",
        image: "/image/moi1.JPG",

        outils: ["After Effects", "Cinema 4D", "Premiere Pro"],
        prix: "120000",
        slug: "motion-graphics",
        is_featured: false,
        image: null,
    }
]

function ProjectCard({ project, index }) {
    const [ref, inView] = useInView()
    
    return (
        <article
            ref={ref}
            className={`group relative overflow-hidden rounded-2xl bg-elevated border border-base
                        transition-all duration-500 hover:shadow-orange-md hover:-translate-y-1
                        ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="relative h-56 bg-gradient-to-br from-primary-500/20 to-primary-700/20 overflow-hidden">
                {project.image ? (
                    <img 
                        src={project.image}
                        alt={project.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        
                                                
                        <div className="text-center">
                            <Sparkles size={40} className="text-primary-500/50 mx-auto mb-2" />
                            <p className="text-xs text-primary-500/50">Image du projet</p>
                        </div>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/40 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex gap-3">
                        <Link
                            href={`/projets/${project.slug}`}
                            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-neutral-900 hover:bg-primary-500 hover:text-white transition-all duration-200"
                        >
                            <Eye size={16} />
                        </Link>
                    </div>
                </div>
                
                <span className="absolute top-3 left-3 badge-primary text-xs z-10">
                    {project.cathegorie}
                </span>
                
                {project.is_featured && (
                    <span className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                        Featured
                    </span>
                )}
            </div>
            
            <div className="p-5">
                <h3 className="font-display font-semibold text-base-primary text-lg mb-1 group-hover:text-primary-500 transition-colors">
                    {project.titre}
                </h3>
                <p className="text-sm text-base-muted line-clamp-2 mb-4">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                    {project.outils?.slice(0, 3).map((tool, idx) => (
                        <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-muted text-base-muted">
                            {tool}
                        </span>
                    ))}
                </div>
                <div className="mt-3 pt-3 border-t border-base flex justify-between items-center">
                    <span className="text-sm font-semibold text-primary-500">
                        {parseInt(project.prix).toLocaleString()} FCFA
                    </span>
                    <span className="text-xs text-base-muted">
                        Projet #{index + 1}
                    </span>
                </div>
            </div>
            
            <Link href={`/projets/${project.slug}`}
                className="absolute bottom-5 right-5 w-8 h-8 rounded-full border border-base flex items-center justify-center
                           group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white transition-all duration-300">
                <ArrowUpRight size={14} />
            </Link>
        </article>
    )
}

export default function Projet({ projects = [], categories = [] }) {
    const [filterCategory, setFilterCategory] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState('grid')

    // Utiliser les projets de la base de données ou les données factices
    const displayProjects = projects.length > 0 ? projects : MOCK_PROJECTS
    
    // Extraire les catégories uniques des projets
    const allCategories = categories.length > 0 
        ? categories 
        : [...new Set(displayProjects.map(p => p.cathegorie))]

    const filteredProjects = displayProjects.filter(project => {
        const matchCategory = filterCategory === 'all' || project.cathegorie === filterCategory
        const matchSearch = project.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase())
        return matchCategory && matchSearch
    })

    return (
        <MainLayout>
            <SEOHead 
                title="Projets"
                description="Découvrez mon portfolio de projets en design graphique, branding et direction artistique."
                url="/projets"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 bg-gradient-to-b from-primary-50/30 to-transparent dark:from-primary-950/20">
                <div className="container-main px-4">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="divider" />
                            <span className="text-sm font-medium text-primary-500 uppercase tracking-wider">Portfolio</span>
                            <span className="divider" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Mes{' '}
                            <span className="text-gradient">Projets</span>
                        </h1>
                        <p className="text-lg text-base-muted">
                            Une sélection de travaux réalisés pour des clients passionnés,
                            du branding au digital, en passant par la direction artistique.
                        </p>
                        <p className="text-sm text-primary-500 mt-4">
                            {displayProjects.length} projets réalisés
                        </p>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 sticky top-16 bg-base/95 backdrop-blur-sm z-30 border-b border-base">
                <div className="container-main px-4">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 justify-center">
                            <button
                                onClick={() => setFilterCategory('all')}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                                    ${filterCategory === 'all' 
                                        ? 'bg-primary-500 text-white shadow-orange-sm' 
                                        : 'bg-muted text-base-muted hover:bg-primary-100 dark:hover:bg-primary-900/30'}`}
                            >
                                Tous
                            </button>
                            {allCategories.map((cat, idx) => (
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

                        {/* Search & View */}
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" />
                                <input
                                    type="text"
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-full border border-base bg-muted text-sm focus:border-primary-500 focus:outline-none"
                                />
                            </div>
                            <button
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="p-2 rounded-full border border-base hover:border-primary-500 transition-colors"
                            >
                                {viewMode === 'grid' ? <List size={18} /> : <Grid3x3 size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="section">
                <div className="container-main px-4">
                    {filteredProjects.length === 0 ? (
                        <div className="text-center py-20">
                            <Sparkles className="mx-auto text-base-muted mb-4" size={48} />
                            <h3 className="text-xl font-semibold mb-2">Aucun projet trouvé</h3>
                            <p className="text-base-muted">Essayez de modifier vos filtres de recherche.</p>
                        </div>
                    ) : (
                        <div className={`grid ${viewMode === 'grid' 
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                            : 'grid-cols-1'} gap-6`}>
                            {filteredProjects.map((project, index) => (
                                <ProjectCard key={project.id} project={project} index={index} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="section bg-subtle">
                <div className="container-main px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-500 p-12 text-center">
                        <div className="relative z-10">
                            <h2 className="text-white mb-4">Vous avez un projet en tête ?</h2>
                            <p className="text-primary-100 max-w-md mx-auto mb-8">
                                Discutons de votre vision et créons ensemble quelque chose d'unique.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold hover:bg-primary-50 transition-all group">
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