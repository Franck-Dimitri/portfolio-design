import { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight, Award, Coffee, Heart, Users, Target,
    Sparkles, Code, Palette, Zap, Mail, Github, Linkedin,
    Twitter, MapPin, Briefcase, GraduationCap, Star,
    Crosshair, Box, Layers, Focus
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

export default function Propos() {
    const [heroVisible, setHeroVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    const stats = [
        { value: '3', suffix: '+', label: "ANNÉES D'EXPÉRIENCE", icon: Briefcase },
        { value: '47', suffix: '+', label: "PROJETS LIVRÉS", icon: Award },
        { value: '28', suffix: '', label: "CLIENTS ACTIFS", icon: Users },
        { value: '12', suffix: '', label: "AWARDS & DISTINCTIONS", icon: Star },
    ];

    const values = [
        { icon: Heart, title: "PASSION", description: "Implication totale dans chaque projet pour créer des systèmes qui racontent une histoire." },
        { icon: Target, title: "PRÉCISION", description: "Validation rigoureuse. Une approche méticuleuse pour des rendus techniques impeccables." },
        { icon: Coffee, title: "DÉVOUEMENT", description: "Nous itérons sur le design jusqu'à l'alignement parfait avec vos objectifs." },
        { icon: Sparkles, title: "CRÉATIVITÉ", description: "Architecture visuelle originale qui différencie et positionne votre marque." },
    ];

    const skills = [
        { name: "BRANDING & IDENTITÉ", level: 95 },
        { name: "DIRECTION ARTISTIQUE", level: 90 },
        { name: "UI/UX DESIGN", level: 85 },
        { name: "MOTION DESIGN", level: 75 },
        { name: "PRINT & PACKAGING", level: 88 },
        { name: "TYPOGRAPHIE", level: 92 },
    ];

    return (
        <MainLayout>
            <SEOHead 
                title="À propos | Dims Creative Academy"
                description="Agence création digitale d'identités visuelles percutantes. Découvrez notre architecture de marque et notre philosophie."
                url="/a-propos"
            />

            <CanvasLines />

            <div className="relative z-10">
                {/* ══════════════════════════════════════════════════
                    § 1 – HERO SECTION
                ══════════════════════════════════════════════════ */}
                <section className="pt-32 pb-16 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A]">
                    <div className="container-main px-4">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            
                            <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-6">
                                    <Focus size={12} />
                                    <span>WORKSPACE: AGENCY</span>
                                    <span className="w-8 h-px bg-primary-500/50"></span>
                                    <span className="text-gray-400 dark:text-gray-600">ID: DIMS_CREATIVE</span>
                                </div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tighter text-gray-900 dark:text-white mb-6 leading-none">
                                    NOUS CRÉONS DES IDENTITÉS QUI <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">STRUTURENT</span> VOTRE VISION
                                </h1>
                                
                                <p className="text-lg text-gray-500 leading-relaxed mb-6 font-sans">
                                    Agence de création digitale basée à Yaoundé. Nous transformons des idées en 
                                    systèmes visuels percutants depuis plus de 3 ans. Notre approche allie 
                                    créativité audacieuse et architecture de marque.
                                </p>
                                
                                <p className="text-sm font-mono text-gray-400 dark:text-gray-500 leading-relaxed mb-8 uppercase tracking-wide">
                                    Chaque projet est traité comme un écosystème indépendant.
                                    Nous collaborons avec des entrepreneurs, des marques et des agences pour concevoir 
                                    des interfaces et des identités qui ne passent pas inaperçues.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-primary-400 transition-colors">
                                        INITIER COLLABORATION <ArrowRight size={14} />
                                    </Link>
                                    <Link href="/projets" className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                        INSPECTER L'ARCHIVE
                                    </Link>
                                </div>
                            </div>
                            
                            <div className={`relative transition-all duration-1000 delay-200 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                                <div className="relative w-full max-w-md mx-auto aspect-square border border-gray-200 dark:border-gray-800 p-2 bg-white dark:bg-[#111]">
                                    {/* Blueprint Guides */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gray-200 dark:bg-gray-800/50"></div>
                                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-px bg-gray-200 dark:bg-gray-800/50"></div>
                                    
                                    {/* Corners */}
                                    <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t border-l border-primary-500"></div>
                                    <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t border-r border-primary-500"></div>
                                    <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b border-l border-primary-500"></div>
                                    <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b border-r border-primary-500"></div>

                                    <div className="relative w-full h-full overflow-hidden border border-gray-200 dark:border-gray-800 filter grayscale hover:grayscale-0 transition-all duration-700">
                                        <img src="/image/moi1.JPG" alt="Franck Dimitri" className="w-full h-full object-cover object-center" />
                                    </div>
                                    
                                    <div className="absolute -bottom-4 -right-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 px-4 py-3 font-mono text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3">
                                        <Award className="text-primary-500" size={18} />
                                        <div>
                                            <p className="text-gray-900 dark:text-white font-bold mb-0.5">DIRECTEUR</p>
                                            <p className="text-gray-500">ARTISTIQUE</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 2 – STATS (TECHNICAL GRID)
                ══════════════════════════════════════════════════ */}
                <section className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                    <div className="container-main">
                        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200 dark:divide-gray-800">
                            {stats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={i} className="p-8 flex flex-col items-start justify-center group hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors">
                                        <div className="flex items-center gap-2 mb-4 text-gray-400 group-hover:text-primary-500 transition-colors">
                                            <Icon size={16} />
                                            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">DATA_{String(i+1).padStart(2, '0')}</span>
                                        </div>
                                        <p className="text-4xl lg:text-5xl font-display font-bold text-gray-900 dark:text-white mb-2">
                                            <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                        </p>
                                        <p className="text-xs font-mono text-gray-500">{stat.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 3 – PHILOSOPHIE (MODULES)
                ══════════════════════════════════════════════════ */}
                <section className="py-20 bg-gray-50 dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-gray-800 relative">
                    <div className="container-main px-4">
                        <div className="max-w-3xl mb-12">
                            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-4">
                                <Box size={12} />
                                <span>ARCHITECTURE FONDAMENTALE</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-4">
                                CRÉER AVEC <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">INTENTION</span>
                            </h2>
                            <p className="text-sm font-mono text-gray-500 leading-relaxed uppercase tracking-wide">
                                Chaque projet est une opportunité de construire un système graphique pérenne. 
                                Voici les vecteurs qui guident notre production.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800">
                            {values.map((value, i) => {
                                const Icon = value.icon;
                                return (
                                    <div key={i} className="bg-white dark:bg-[#111] p-8 group hover:border-primary-500 relative transition-all">
                                        <div className="absolute top-0 right-0 w-3 h-3 border-b border-l border-gray-200 dark:border-gray-800 group-hover:border-primary-500 transition-colors"></div>
                                        
                                        <div className="w-10 h-10 border border-gray-200 dark:border-gray-800 flex items-center justify-center mb-6 group-hover:border-primary-500 group-hover:text-primary-500 text-gray-500 transition-all">
                                            <Icon size={18} />
                                        </div>
                                        <h3 className="font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
                                            {value.title}
                                        </h3>
                                        <p className="text-xs font-mono text-gray-500 leading-relaxed uppercase tracking-wide">
                                            {value.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 4 – COMPÉTENCES (SPEC SHEET)
                ══════════════════════════════════════════════════ */}
                <section className="py-20 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                    <div className="container-main px-4">
                        <div className="grid lg:grid-cols-2 gap-16">
                            
                            {/* Skills progress */}
                            <div>
                                <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-4">
                                    CAPACITÉS <span className="text-primary-500">TECHNIQUES</span>
                                </h2>
                                <p className="text-sm font-mono text-gray-500 mb-10 uppercase tracking-wide">
                                    Des compétences calibrées pour répondre aux exigences créatives modernes.
                                </p>
                                
                                <div className="space-y-6">
                                    {skills.map((skill, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between mb-2 font-mono text-xs uppercase tracking-widest font-bold">
                                                <span className="text-gray-900 dark:text-white">{skill.name}</span>
                                                <span className="text-primary-500">{skill.level}%</span>
                                            </div>
                                            <div className="h-1 bg-gray-100 dark:bg-gray-800 w-full relative">
                                                <div 
                                                    className="absolute top-0 left-0 h-full bg-primary-500 transition-all duration-1000"
                                                    style={{ width: `${skill.level}%` }}
                                                />
                                                {/* Skill marker */}
                                                <div 
                                                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-3 bg-gray-900 dark:bg-white transition-all duration-1000"
                                                    style={{ left: `calc(${skill.level}% - 3px)` }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Why choose us (Spec Box) */}
                            <div>
                                <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] p-8 h-full flex flex-col relative">
                                    <div className="absolute top-0 right-0 w-8 h-8 border-l border-b border-gray-200 dark:border-gray-800"></div>
                                    
                                    <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-6 font-bold">
                                        <Layers size={12} /> SPÉCIFICATIONS OPÉRATIONNELLES
                                    </div>
                                    
                                    <h3 className="text-2xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-8">
                                        POURQUOI COLLABORER AVEC NOUS ?
                                    </h3>
                                    
                                    <ul className="space-y-4 mb-auto">
                                        {[
                                            "Approche systémique pour chaque projet",
                                            "Protocoles de validation stricts",
                                            "Design pensé pour la scalabilité",
                                            "Documentation et livraison structurée",
                                            "Support technique post-déploiement"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-1.5 h-1.5 bg-primary-500 mt-1.5 shrink-0"></div>
                                                <span className="text-sm font-mono text-gray-600 dark:text-gray-400 uppercase tracking-wide">{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex -space-x-2">
                                                {['MD','KM','SL','OT'].map((initials, i) => (
                                                    <div key={i} className="w-8 h-8 rounded-none border border-gray-200 dark:border-gray-800 flex items-center justify-center text-[10px] font-mono font-bold text-black"
                                                         style={{ backgroundColor: ['#f97316','#ea580c','#c2410c','#9a3412'][i] }}>
                                                        {initials}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="font-mono text-[10px] uppercase tracking-widest">
                                                <p className="text-gray-900 dark:text-white font-bold mb-0.5">28+ CLIENTS</p>
                                                <p className="text-gray-500">RÉSEAU ACTIF</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 5 – CTA (NEW CANVAS)
                ══════════════════════════════════════════════════ */}
                <section className="py-24 bg-white dark:bg-[#111] text-center">
                    <div className="container-main px-4">
                        <div className="inline-flex items-center justify-center p-4 border border-gray-200 dark:border-gray-800 mb-6">
                            <Sparkles className="text-primary-500" size={24} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-6">
                            INITIALISER UN <span className="text-primary-500">NOUVEAU CANVAS</span>
                        </h2>
                        <p className="text-gray-500 font-mono text-sm max-w-lg mx-auto mb-10 leading-relaxed uppercase tracking-wide">
                            Vous avez une idée ? Paramétrons ensemble votre prochain projet créatif.
                        </p>
                        <Link 
                            href="/contact" 
                            className="inline-flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-primary-400 transition-colors"
                        >
                            DÉFINIR LES PARAMÈTRES <ArrowRight size={14} />
                        </Link>
                    </div>
                </section>

            </div>
        </MainLayout>
    );
}