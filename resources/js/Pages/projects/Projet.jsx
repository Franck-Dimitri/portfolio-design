import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight, Eye, Search,
    Sparkles, Star, ArrowUpRight, Grid3x3, List,
    DollarSign, Camera, RefreshCw, Crosshair, Filter, Box
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import SEOHead from '@/Components/SEOHead';

function useInView(options = {}) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
            { threshold: 0.12, ...options }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);
    return [ref, inView];
}

/* ══════════════════════════════════════════════════════════════
   COMPOSANT – Lignes structurelles (Design Canvas)
══════════════════════════════════════════════════════════════ */
function CanvasLines() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 flex justify-center overflow-hidden">
            {/* Motif de grille Blueprint subtil en fond */}
            <div 
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] text-black dark:text-white"
                style={{
                    backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            ></div>

            <div className="w-full max-w-7xl h-full relative border-x border-gray-200/50 dark:border-gray-800/50 flex">
                <div className="flex-1 border-r border-gray-200/30 dark:border-gray-800/30 hidden md:block"></div>
                <div className="flex-1 border-r border-gray-200/30 dark:border-gray-800/30 hidden lg:block"></div>
                <div className="flex-1 border-r border-gray-200/30 dark:border-gray-800/30 hidden lg:block"></div>
                <div className="flex-1 hidden md:block"></div>
            </div>
            
            {/* Repères de coupe design (Crop marks) */}
            <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-gray-400 dark:border-gray-600"></div>
            <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-gray-400 dark:border-gray-600"></div>
            <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-gray-400 dark:border-gray-600"></div>
            <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-gray-400 dark:border-gray-600"></div>
        </div>
    );
}

function ProjectCard({ project, viewMode = 'grid', index = 0 }) {
    const [isHovered, setIsHovered] = useState(false);
    const [ref, inView] = useInView();

    if (viewMode === 'list') {
        return (
            <Link href={`/projects/${project.slug}`} className="block group">
                <article
                    ref={ref}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`relative flex flex-col md:flex-row gap-8 p-6 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-primary-500 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    {/* Bounding box hover effect */}
                    <div className="absolute -inset-1 border border-primary-500/0 group-hover:border-primary-500/30 transition-colors pointer-events-none">
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>

                    <div className="relative md:w-72 h-48 bg-gray-100 dark:bg-[#161616] flex-shrink-0 border border-gray-200 dark:border-gray-800 overflow-hidden">
                        {project.images && project.images[0] ? (
                            <img
                                src={`/storage/${project.images[0].path}`}
                                alt={project.titre}
                                className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Box size={32} className="text-gray-300 dark:text-gray-700" />
                            </div>
                        )}
                        {project.is_featured && (
                            <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-500 text-black font-mono text-[10px] uppercase tracking-widest flex items-center gap-1">
                                <Star size={10} /> FEATURED
                            </span>
                        )}
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                                    {project.cathegorie}
                                </span>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider group-hover:text-primary-500 transition-colors">
                                {project.titre}
                            </h3>
                            <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2 max-w-2xl">
                                {project.description}
                            </p>
                        </div>
                        
                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex flex-wrap gap-2">
                                {project.outils?.slice(0, 4).map((tool, idx) => (
                                    <span key={idx} className="text-[10px] px-2 py-1 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 font-mono uppercase tracking-wider">
                                        {tool}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-mono text-primary-500 font-bold uppercase tracking-widest">
                                INSPECTER <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </div>
                        </div>
                    </div>
                </article>
            </Link>
        );
    }

    // Mode grid
    return (
        <Link href={`/projects/${project.slug}`} className="block group">
            <article
                ref={ref}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-primary-500 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
            >
                {/* Bounding box hover effect */}
                <div className="absolute -inset-1 border border-primary-500/0 group-hover:border-primary-500/30 transition-colors pointer-events-none z-20">
                    <div className="absolute -top-1 -left-1 w-2 h-2 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>

                <div className="relative h-64 bg-gray-100 dark:bg-[#161616] overflow-hidden border-b border-gray-200 dark:border-gray-800">
                    {project.images && project.images[0] ? (
                        <img 
                            src={`/storage/${project.images[0].path}`}
                            alt={project.titre}
                            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Box size={40} className="text-gray-300 dark:text-gray-700" />
                        </div>
                    )}
                    
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"></span>
                        <span className="px-2 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300 font-mono text-[10px] uppercase tracking-widest">
                            {project.cathegorie}
                        </span>
                    </div>
                    
                    {project.is_featured && (
                        <span className="absolute top-3 right-3 z-10 px-2 py-1 bg-yellow-500 text-black font-mono text-[10px] uppercase tracking-widest flex items-center gap-1 border border-yellow-600">
                            <Star size={10} /> FEATURED
                        </span>
                    )}
                    
                    <div className={`absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="bg-primary-500 text-black px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2 transform hover:scale-105 transition-transform">
                            INSPECTER <ArrowUpRight size={14} />
                        </div>
                    </div>
                </div>
                
                <div className="p-6">
                    <h3 className="font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider text-lg mb-2 group-hover:text-primary-500 transition-colors line-clamp-1">
                        {project.titre}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                        {project.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                                {project.outils?.length ? `${project.outils.length} OUTILS` : 'ASSETS'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                            <Eye size={12} />
                            <span>{project.views || 0}</span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default function Projet({ projects = [], categories = [] }) {
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    
    const allCategories = categories.length > 0 
        ? categories 
        : [...new Set(projects.map(p => p.cathegorie))];

    const filteredProjects = projects.filter(project => {
        const matchCategory = filterCategory === 'all' || project.cathegorie === filterCategory;
        const matchSearch = project.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    const totalProjects = projects.length;
    const featuredCount = projects.filter(p => p.is_featured).length;

    return (
        <MainLayout>
            <SEOHead 
                title="Design Portfolio | Dims Creative Academy"
                description="Explorez notre galerie de projets en identité visuelle, direction artistique et design graphique."
                url="/projets"
            />

            <CanvasLines />

            <div className="relative z-10">
                {/* ══════════════════════════════════════════════════
                    § 1 – HEADER (CANVAS TITLE)
                ══════════════════════════════════════════════════ */}
                <section className="pt-32 pb-16 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A]">
                    <div className="container-main px-4">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-6">
                                <Crosshair size={12} />
                                <span>WORKSPACE: PORTFOLIO</span>
                                <span className="w-8 h-px bg-primary-500/50"></span>
                                <span className="text-gray-400 dark:text-gray-600">OBJ: {totalProjects}</span>
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-gray-900 dark:text-white mb-6 leading-none">
                                DESIGN <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">EXHIBITION</span>
                            </h1>
                            
                            <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                                Une sélection rigoureuse d'identités visuelles, d'interfaces et de directions artistiques. Chaque projet est traité comme un système graphique indépendant.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 2 – FILTER BAR (PROPERTIES PANEL)
                ══════════════════════════════════════════════════ */}
                <section className="sticky top-16 z-30 bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                    <div className="container-main px-4">
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center py-4">
                            
                            {/* Onglets (Tabs) */}
                            <div className="flex overflow-x-auto w-full lg:w-auto hide-scrollbar gap-1">
                                <button
                                    onClick={() => setFilterCategory('all')}
                                    className={`px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap border-b-2
                                        ${filterCategory === 'all' 
                                            ? 'border-primary-500 text-primary-500' 
                                            : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111]'}`}
                                >
                                    TOUT AFFICHER
                                </button>
                                {allCategories.map((cat, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setFilterCategory(cat)}
                                        className={`px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap border-b-2
                                            ${filterCategory === cat 
                                                ? 'border-primary-500 text-primary-500' 
                                                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#111]'}`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-2 w-full lg:w-auto">
                                <div className="relative flex-1 lg:w-64">
                                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="FILTRER PAR MOT-CLÉ..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-mono text-xs uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors"
                                    />
                                </div>
                                <div className="flex bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 p-1">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#222] text-primary-500 shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                    >
                                        <Grid3x3 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-[#222] text-primary-500 shadow-sm border border-gray-200 dark:border-gray-700' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                    >
                                        <List size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 3 – GALLERY (WORKSPACE)
                ══════════════════════════════════════════════════ */}
                <section className="py-12 bg-gray-50 dark:bg-[#0A0A0A] min-h-[50vh]">
                    <div className="container-main px-4">
                        {filteredProjects.length === 0 ? (
                            <div className="text-center py-24 border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111]">
                                <Filter className="mx-auto text-gray-400 mb-4" size={32} />
                                <h3 className="text-xl font-display font-bold mb-2 text-gray-900 dark:text-white uppercase tracking-wider">RESULTAT VIDE</h3>
                                <p className="text-xs font-mono text-gray-500 mb-6 uppercase tracking-widest">AUCUN OBJET NE CORRESPOND AUX PROPRIÉTÉS SÉLECTIONNÉES.</p>
                                <button
                                    onClick={() => { setFilterCategory('all'); setSearchTerm(''); }}
                                    className="inline-flex items-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-6 py-3 hover:bg-primary-400 transition-colors"
                                >
                                    <RefreshCw size={14} />
                                    RÉINITIALISER VUE
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 flex justify-between items-center text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                    <span>AFFICHAGE: {filteredProjects.length} ÉLÉMENT(S)</span>
                                    <span>VUE: {viewMode === 'grid' ? 'MOSAÏQUE' : 'LISTE'}</span>
                                </div>
                                <div className={`grid ${viewMode === 'grid' 
                                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                                    : 'grid-cols-1'} gap-8`}>
                                    {filteredProjects.map((project, index) => (
                                        <ProjectCard key={project.id} project={project} viewMode={viewMode} index={index} />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 4 – CTA (NEW CANVAS)
                ══════════════════════════════════════════════════ */}
                <section className="py-24 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] text-center">
                    <div className="container-main px-4">
                        <div className="inline-flex items-center justify-center p-4 border border-gray-200 dark:border-gray-800 rounded-full mb-6">
                            <Sparkles className="text-primary-500" size={24} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-6">
                            NOUVEAU <span className="text-primary-500">CANVAS</span>
                        </h2>
                        <p className="text-gray-500 max-w-lg mx-auto mb-10 leading-relaxed">
                            Vous souhaitez collaborer sur une nouvelle identité visuelle ou un support graphique ? Ouvrons un nouveau plan de travail.
                        </p>
                        <Link 
                            href="/contact" 
                            className="inline-flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-primary-400 transition-colors"
                        >
                            CRÉER UN PROJET <ArrowRight size={14} />
                        </Link>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}