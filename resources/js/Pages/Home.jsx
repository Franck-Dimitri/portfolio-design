import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight, ExternalLink, Sparkles, Eye, ImageIcon, Plus,
    Layers, Palette, Zap, Award, ChevronDown, Code2, CheckCircle, Pencil, Trash2,
    Star, ArrowUpRight, Mail, MessageSquare, Camera, DollarSign, Terminal, Crosshair, Box
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import SEOHead from '@/Components/SEOHead';

/* ══════════════════════════════════════════════════════════════
   HOOK – Intersection Observer pour animations au scroll
══════════════════════════════════════════════════════════════ */
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
   COMPOSANT – Lignes structurelles (Blueprint)
══════════════════════════════════════════════════════════════ */
function StructuralLines() {
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
                <div className="flex-1 border-r border-gray-200/30 dark:border-gray-800/30 border-dashed hidden md:block"></div>
                <div className="flex-1 border-r border-gray-200/30 dark:border-gray-800/30 border-dashed hidden lg:block"></div>
                <div className="flex-1 border-r border-gray-200/30 dark:border-gray-800/30 border-dashed hidden lg:block"></div>
                <div className="flex-1 hidden md:block"></div>
            </div>
            
            {/* Repères de mesure absolus (Viewport) */}
            <div className="absolute top-0 left-4 h-full w-px bg-primary-500/20">
                <div className="absolute top-[10vh] -left-1 w-2.5 h-px bg-primary-500/50" />
                <div className="absolute top-[25vh] -left-2 w-4 h-px bg-primary-500" />
                <div className="absolute top-[50vh] -left-1 w-2.5 h-px bg-primary-500/50" />
                <div className="absolute top-[75vh] -left-2 w-4 h-px bg-primary-500" />
            </div>
            <div className="absolute top-0 right-4 h-full w-px bg-primary-500/20">
                <div className="absolute top-[30vh] -right-1 w-2.5 h-px bg-primary-500/50" />
                <div className="absolute top-[60vh] -right-2 w-4 h-px bg-primary-500" />
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════════════
   COMPOSANT – Compteur animé
══════════════════════════════════════════════════════════════ */
function AnimatedCounter({ value, suffix = '', duration = 1800 }) {
    const [count, setCount] = useState(0);
    const [ref, inView] = useInView();
    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const end = parseInt(value);
        const step = end / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= end) { setCount(end); clearInterval(timer); }
            else setCount(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [inView, value, duration]);
    return <span ref={ref}>{count}{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════════
   COMPOSANT – Carte projet
══════════════════════════════════════════════════════════════ */
function ProjectCard({ project, index = 0 }) {
    const [isHovered, setIsHovered] = useState(false);
    const [ref, inView] = useInView();

    return (
        <Link href={`/projects/${project.slug}`} className="block">
            <article
                ref={ref}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`group relative overflow-hidden bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-primary-500 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
            >
                {/* Blueprint Corners */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary-500/0 group-hover:border-primary-500 transition-colors z-10"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary-500/0 group-hover:border-primary-500 transition-colors z-10"></div>

                <div className="relative h-56 bg-gray-100 dark:bg-[#161616] overflow-hidden border-b border-gray-200 dark:border-gray-800">
                    {project.images && project.images[0] ? (
                        <img 
                            src={`/storage/${project.images[0].path}`}
                            alt={project.titre}
                            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-105' : 'scale-100'} grayscale group-hover:grayscale-0`}
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Box size={40} className="text-gray-300 dark:text-gray-700" />
                        </div>
                    )}
                    
                    <div className="absolute top-3 left-3 z-10">
                        <span className="px-2 py-1 bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-300 font-mono text-[10px] uppercase tracking-widest">
                            [CAT: {project.cathegorie}]
                        </span>
                    </div>
                    
                    {project.is_featured && (
                        <span className="absolute top-3 right-3 z-10 px-2 py-1 bg-yellow-500 text-black font-mono text-[10px] uppercase tracking-widest flex items-center gap-1 border border-yellow-600">
                            <Star size={10} /> FEATURED
                        </span>
                    )}
                    
                    <div className={`absolute inset-0 bg-primary-500/10 backdrop-blur-[2px] flex items-center justify-center gap-3 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="w-12 h-12 bg-white text-primary-500 flex items-center justify-center font-mono text-xs font-bold transform hover:scale-110 transition-transform">
                            VOIR
                        </div>
                    </div>
                </div>
                
                <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-lg mb-1 group-hover:text-primary-500 transition-colors line-clamp-1">
                        {project.titre}
                    </h3>
                    <p className="text-sm text-gray-500 font-mono line-clamp-2 mb-4 leading-relaxed">
                        {project.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.outils?.slice(0, 3).map((tool, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-mono uppercase tracking-wider border border-gray-200 dark:border-gray-700">
                                {tool}
                            </span>
                        ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <Terminal size={14} className="text-primary-500" />
                            <span className="text-xs font-mono font-bold text-gray-900 dark:text-white uppercase">
                                VAL: {parseInt(project.prix).toLocaleString()} FCFA
                            </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-mono text-gray-500">
                            <Eye size={12} />
                            <span>{project.views || 0}</span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}

/* ══════════════════════════════════════════════════════════════
   COMPOSANT – Carte service
══════════════════════════════════════════════════════════════ */
function ServiceCard({ service, index }) {
    const [ref, inView] = useInView();
    return (
        <div
            ref={ref}
            className={`group relative p-6 flex flex-col gap-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-primary-500
                        ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="absolute top-0 right-0 w-2 h-2 border-l border-b border-gray-200 dark:border-gray-800 group-hover:border-primary-500 transition-colors"></div>
            
            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-800 pb-4 mb-2">
                {service.icon && (
                    <div className={`w-10 h-10 flex items-center justify-center border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400
                                    group-hover:border-primary-500 group-hover:text-primary-500
                                    transition-all duration-300`}>
                        {service.icon}
                    </div>
                )}
                <div className="flex-1">
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest leading-none mb-1">MODULE</p>
                    <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm leading-tight">{service.title || service.titre}</h3>
                </div>
            </div>
            
            <p className="text-xs font-mono text-gray-500 leading-relaxed flex-1">
                {service.description}
            </p>
            
            <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-mono font-bold text-gray-400 dark:text-gray-600 group-hover:text-primary-500 transition-colors uppercase tracking-widest">
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                INITIER LE PROTOCOLE
            </div>
        </div>
    );
}

const SERVICES = [
    {
        icon: <Palette size={18} />,
        title: 'Identité visuelle',
        description: 'Conception de marque. Logo, charte graphique, architecture visuelle complète.',
    },
    {
        icon: <Layers size={18} />,
        title: 'Direction artistique',
        description: 'Supervision esthétique. Concept créatif, alignement stratégique, production.',
    },
    {
        icon: <Zap size={18} />,
        title: 'Motion & Digital',
        description: 'Dynamique visuelle. Animations de marque, interfaces interactives.',
    },
    {
        icon: <Award size={18} />,
        title: 'Conseil en image',
        description: 'Audit systémique. Repositionnement stratégique, guide opérationnel.',
    },
];

const STATS = [
    { value: '47',  suffix: '+', label: 'PROJETS LIVRÉS' },
    { value: '28',  suffix: '',  label: 'CLIENTS ACTIFS' },
    { value: '3',   suffix: '+', label: 'ANNÉES D\'EXP.' },
    { value: '12',  suffix: '',  label: 'DISTINCTIONS' },
];

const TESTIMONIALS = [
    {
        quote: "Un sens de l'esthétique rare. Notre identité de marque a été transformée, et nos clients le sentent immédiatement.",
        author: 'KALEBIA FRANCK',
        role: 'ENTREPRENEUR',
    },
    {
        quote: "Livré en avance, au-delà des attentes. La direction artistique de notre campagne a dépassé nos KPIs de 40%.",
        author: 'LUCIEN MENSAH',
        role: 'MARKETING DIR. PAYCAM',
    },
    {
        quote: "Pas juste un designer — un vrai partenaire créatif. Il comprend les enjeux business autant que l'esthétique.",
        author: 'MOUAFFO ANGE',
        role: 'FOUNDER, HERITAGE STAYS',
    },
];

/* ══════════════════════════════════════════════════════════════
   PAGE HOME
══════════════════════════════════════════════════════════════ */
export default function Home({ projects = [], services = [] }) {
    const [typedText, setTypedText] = useState('');
    const [heroVisible, setHeroVisible] = useState(false);
    const words = ['DESIGNER GRAPHIQUE', 'DIRECTEUR ARTISTIQUE', 'VISUAL STORYTELLER'];
    const wordIndex  = useRef(0);
    const charIndex  = useRef(0);
    const deleting   = useRef(false);
    const [statsRef, statsInView] = useInView();
    const [testimRef, testimInView] = useInView();

    useEffect(() => {
        const tick = () => {
            const current = words[wordIndex.current];
            if (!deleting.current) {
                setTypedText(current.substring(0, charIndex.current + 1));
                charIndex.current++;
                if (charIndex.current === current.length) {
                    deleting.current = true;
                    setTimeout(tick, 1800);
                    return;
                }
            } else {
                setTypedText(current.substring(0, charIndex.current - 1));
                charIndex.current--;
                if (charIndex.current === 0) {
                    deleting.current = false;
                    wordIndex.current = (wordIndex.current + 1) % words.length;
                }
            }
            setTimeout(tick, deleting.current ? 40 : 70);
        };
        const t = setTimeout(tick, 600);
        return () => clearTimeout(t);
    }, []);

    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <MainLayout currentRoute="/">
            <SEOHead
                title={null}
                description="Designer graphique freelance spécialisé en identité visuelle, branding et direction artistique. Basé à Yaoundé, disponible partout dans le monde."
                url="/"
            />

            <StructuralLines />

            <div className="relative z-10">
                {/* ══════════════════════════════════════════════════
                    § 1 – HERO
                ══════════════════════════════════════════════════ */}
                <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 border-b border-gray-200 dark:border-gray-800">
                    <div className="container-main px-4 sm:px-6 relative">
                        {/* Ligne horizontale de coupe */}
                        <div className="absolute top-0 left-0 w-full h-px bg-gray-200 dark:bg-gray-800 hidden md:block" />
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200 dark:bg-gray-800 hidden md:block" />
                        
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-12">
                            
                            <div className="text-left space-y-6">
                                <div className={`flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-gray-500 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                    <span className="flex h-2 w-2 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span>SYS_STATUS: ONLINE</span>
                                    <span className="w-12 h-px bg-gray-300 dark:bg-gray-700"></span>
                                    <span>v2.0.4</span>
                                </div>

                                <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display uppercase tracking-tighter leading-[0.9] text-gray-900 dark:text-white transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                    CONSTRUCTION <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">IDENTITAIRE</span>
                                </h1>

                                <div className={`h-8 font-mono text-sm sm:text-base text-gray-600 dark:text-gray-400 transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                    <span className="text-primary-500 mr-2">&gt;</span>
                                    {typedText}
                                    <span className="animate-blink bg-primary-500 w-2 h-4 inline-block align-middle ml-1"></span>
                                </div>

                                <p className={`text-xs sm:text-sm font-mono text-gray-500 leading-relaxed max-w-lg transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                    // ARCHITECTURE VISUELLE ET DIRECTION ARTISTIQUE.<br />
                                    NOUS TRANSFORMONS DES CONCEPTS ABSTRAITS EN SYSTÈMES GRAPHIQUES STRUCTURÉS, DU LOGOTYPE AU DÉPLOIEMENT DIGITAL.
                                </p>

                                <div className={`flex flex-col sm:flex-row gap-4 pt-4 transition-all duration-700 delay-[400ms] ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                    <Link href="/projets" className="inline-flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-6 py-4 hover:bg-primary-400 transition-colors">
                                        <Crosshair size={14} />
                                        EXPLORER LES TRAVAUX
                                    </Link>
                                    <Link href="/contact" className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-mono font-bold text-xs uppercase tracking-widest px-6 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        <Terminal size={14} />
                                        INITIER UN PROJET
                                    </Link>
                                </div>
                            </div>

                            <div className={`relative flex justify-center lg:justify-end transition-all duration-1000 delay-200 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                                <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 border border-gray-200 dark:border-gray-800 p-2 bg-gray-50 dark:bg-[#0A0A0A]">
                                    {/* Blueprint Guides */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200 dark:bg-gray-800/50"></div>
                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gray-200 dark:bg-gray-800/50"></div>
                                    <div className="absolute -top-4 -left-4 w-8 h-8 border-t border-l border-primary-500"></div>
                                    <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b border-r border-primary-500"></div>

                                    <div className="relative w-full h-full overflow-hidden border border-gray-200 dark:border-gray-800 filter grayscale contrast-125 hover:grayscale-0 transition-all duration-700">
                                        <img 
                                            src="/image/brand-logo.jpg" 
                                            alt="Franck Dimitri" 
                                            className="w-full h-full object-cover object-center" 
                                        />
                                    </div>

                                    <div className="absolute -right-6 top-1/4 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 px-3 py-2 font-mono text-[10px] uppercase tracking-widest shadow-xl">
                                        <p className="text-primary-500 font-bold mb-1">EXP: BRAND</p>
                                        <p className="text-gray-500">ARCHITECT</p>
                                    </div>
                                    <div className="absolute -left-6 bottom-1/4 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 px-3 py-2 font-mono text-[10px] uppercase tracking-widest shadow-xl">
                                        <p className="text-primary-500 font-bold mb-1">VOL: 47+</p>
                                        <p className="text-gray-500">ASSETS</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 2 – STATS
                ══════════════════════════════════════════════════ */}
                <section className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A]">
                    <div className="container-main">
                        <div
                            ref={statsRef}
                            className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-gray-200 dark:divide-gray-800"
                        >
                            {STATS.map((stat, i) => (
                                <div key={i} className="py-10 px-6 flex flex-col items-start justify-center">
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 border-b border-primary-500/30 pb-1">DATA_SET: {String(i+1).padStart(2, '0')}</p>
                                    <p className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-1">
                                        {statsInView ? <AnimatedCounter value={stat.value} suffix={stat.suffix} /> : '0'}
                                    </p>
                                    <p className="text-xs font-mono text-primary-500 font-bold">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 3 – PROJETS SÉLECTIONNÉS
                ══════════════════════════════════════════════════ */}
                <section className="py-20 border-b border-gray-200 dark:border-gray-800">
                    <div className="container-main">
                        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-4">
                                    <Crosshair size={12} />
                                    <span>MODULE: PORTFOLIO</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-4">
                                    SÉLECTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">STRUCTURELLE</span>
                                </h2>
                                <p className="text-xs font-mono text-gray-500 max-w-md">
                                    EXTRACTION DES PROJETS RÉCENTS. ARCHIVES DE CONCEPTION ET PROTOTYPES FONCTIONNELS DÉPLOYÉS.
                                </p>
                            </div>
                            <Link href="/projets" className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-mono font-bold text-[10px] uppercase tracking-widest px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                ACCÉDER À L'ARCHIVE <ArrowRight size={14} />
                            </Link>
                        </header>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative">
                            {/* Lignes de structure internes */}
                            <div className="absolute top-0 left-0 w-full h-px bg-gray-200 dark:bg-gray-800 -translate-y-3"></div>
                            
                            {projects.length === 0 && (
                                <div className="col-span-full border border-dashed border-gray-300 dark:border-gray-700 p-12 text-center">
                                    <Terminal size={32} className="mx-auto text-gray-400 mb-4" />
                                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">ERREUR 404: AUCUN PROJET TROUVÉ DANS LA BASE DE DONNÉES</p>
                                </div>
                            )}

                            {projects.map((project, i) => (
                                <ProjectCard key={project.id} project={project} index={i} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 4 – SERVICES
                ══════════════════════════════════════════════════ */}
                <section className="py-20 bg-gray-50 dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-gray-800 relative">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMTU2LCAxNjMsIDE3NSLCAwLjIpIi8+PC9zdmc+')] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none"></div>

                    <div className="container-main relative z-10">
                        <header className="mb-12">
                            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-4">
                                <Box size={12} />
                                <span>MODULE: SERVICES</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-4">
                                VECTEURS <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">D'INTERVENTION</span>
                            </h2>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
                            {(services.length > 0 ? services : SERVICES).map((service, i) => (
                                <ServiceCard key={i} service={service} index={i} />
                            ))}
                        </div>
                        
                        {services.length > 0 && (
                            <div className="mt-8">
                                <Link 
                                    href={route('services.index')} 
                                    className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-400 font-mono text-xs font-bold uppercase tracking-widest transition-colors"
                                >
                                    &gt; INITIALISER CATALOGUE SERVICES
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 5 – TÉMOIGNAGES
                ══════════════════════════════════════════════════ */}
                <section className="py-20 border-b border-gray-200 dark:border-gray-800">
                    <div className="container-main">
                        <header className="mb-12 text-center">
                            <div className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-4 border border-primary-500/30 px-3 py-1">
                                <span>RETOURS SYSTÈME</span>
                            </div>
                            <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white">
                                FEEDBACK <span className="text-primary-500">RÉSEAU</span>
                            </h2>
                        </header>

                        <div ref={testimRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {TESTIMONIALS.map((t, i) => (
                                <div
                                    key={i}
                                    className={`relative p-8 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 transition-all duration-500 ${testimInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                                    style={{ animationDelay: `${i * 150}ms` }}
                                >
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-gray-50 dark:bg-[#161616] border-l border-b border-gray-200 dark:border-gray-800 flex items-center justify-center font-mono text-[10px] text-gray-400">
                                        0{i+1}
                                    </div>
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(5)].map((_, s) => (
                                            <div key={s} className="w-1.5 h-1.5 bg-primary-500"></div>
                                        ))}
                                    </div>
                                    <p className="text-xs font-mono text-gray-600 dark:text-gray-400 leading-relaxed mb-8 uppercase">
                                        "{t.quote}"
                                    </p>
                                    <div className="border-t border-dashed border-gray-200 dark:border-gray-800 pt-4">
                                        <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t.author}</p>
                                        <p className="text-[10px] font-mono text-gray-500 uppercase">{t.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 6 – CTA FINAL (TERMINAL)
                ══════════════════════════════════════════════════ */}
                <section className="py-24 bg-[#0A0A0A] text-white">
                    <div className="container-main max-w-4xl">
                        <div className="border border-gray-800 bg-[#111] p-1">
                            {/* Top Bar Terminal */}
                            <div className="flex items-center gap-2 bg-[#161616] border-b border-gray-800 p-3">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                                </div>
                                <div className="text-[10px] font-mono text-gray-500 ml-4">root@portfolio:~# new_project.sh</div>
                            </div>
                            
                            <div className="p-8 md:p-12">
                                <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight mb-6">
                                    PRÊT À <span className="text-primary-500">COMPILER</span> <br/>
                                    VOTRE VISION ?
                                </h2>
                                <p className="text-sm font-mono text-gray-400 mb-10 max-w-lg leading-relaxed uppercase">
                                    &gt; Transmettez les paramètres initiaux de votre projet. Le système générera une architecture créative sous 24h.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-primary-400 transition-colors"
                                    >
                                        $ ./START_PROJECT
                                    </Link>
                                    <a
                                        href="https://wa.me/676383986"
                                        className="inline-flex items-center justify-center gap-2 border border-gray-700 text-gray-300 font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-gray-800 transition-colors"
                                    >
                                        CONNECT_WHATSAPP
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}