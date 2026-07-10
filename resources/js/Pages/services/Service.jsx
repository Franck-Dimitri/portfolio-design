import { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight, Palette, Layers, Zap, Award, Sparkles,
    PenTool, Video, Globe, Smartphone, Package, Star,
    CheckCircle, Mail, Clock, Shield, Box, Target, Focus
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

const PROCESS_STEPS = [
    { step: "01", title: "DÉCOUVERTE", description: "Audit initial et définition des paramètres du projet.", icon: Target },
    { step: "02", title: "RECHERCHE", description: "Analyse concurrentielle et benchmark visuel.", icon: Sparkles },
    { step: "03", title: "CRÉATION", description: "Développement des pistes et systèmes graphiques.", icon: Palette },
    { step: "04", title: "ITÉRATION", description: "Ajustements selon vos retours qualitatifs.", icon: Layers },
    { step: "05", title: "LIVRAISON", description: "Export des assets et documentation.", icon: Package },
    { step: "06", title: "SUPPORT", description: "Accompagnement lors du déploiement.", icon: Shield }
];

export default function Service({ services = [] }) {
    const [heroVisible, setHeroVisible] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 50);
        return () => clearTimeout(t);
    }, []);

    const getCategoryIcon = (category) => {
        switch (category?.toLowerCase()) {
            case 'logo design': return Palette;
            case 'branding': return Layers;
            case 'flyer design': return PenTool;
            case 'poster design': return PenTool;
            case 'social media design': return Smartphone;
            case 'ui/ux design': return Globe;
            case 'illustration': return Palette;
            case 'motion design': return Zap;
            default: return Package;
        }
    };

    // SERVICES PAR DEFAUT EN CAS DE BDD VIDE
    const defaultServices = [
        {
            title: "Identité Visuelle", description: "Logo, charte graphique, système de marque cohérent du digital au print.",
            features: ["Logo design", "Palette", "Typographie", "Papeterie"], price: "À partir de 500€", duration: "2-3 semaines", icon: Palette
        },
        {
            title: "Direction Artistique", description: "Concept créatif, casting visuel, supervision de production.",
            features: ["Concept", "Direction photo", "Supervision", "Brand content"], price: "Sur devis", duration: "Variable", icon: Layers
        },
        {
            title: "Motion & Digital", description: "Animations de marque, contenu social media, interfaces.",
            features: ["Motion design", "Animation 2D/3D", "Contenu social", "Publicités"], price: "À partir de 800€", duration: "2-4 semaines", icon: Zap
        }
    ];

    const displayServices = services.length > 0 ? services.map(service => ({
        title: service.titre,
        description: service.description,
        features: service.features || [],
        price: service.starting_price ? `À partir de ${service.starting_price.toLocaleString('fr-FR')} FCFA` : 'Sur devis',
        duration: service.delaie_livraison ? `${service.delaie_livraison}` : 'À convenir',
        slug: service.slug,
        icon: getCategoryIcon(service.cathegorie),
    })) : defaultServices;

    return (
        <MainLayout>
            <SEOHead 
                title="Services & Modules | Dims Creative Academy"
                description="Découvrez nos modules d'intervention en design graphique : identité visuelle, direction artistique, motion design."
                url="/services"
            />

            <CanvasLines />

            <div className="relative z-10">
                {/* ══════════════════════════════════════════════════
                    § 1 – HERO SECTION
                ══════════════════════════════════════════════════ */}
                <section className="pt-32 pb-16 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A]">
                    <div className="container-main px-4">
                        <div className="max-w-4xl">
                            <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-6">
                                    <Box size={12} />
                                    <span>CATALOGUE: PRESTATIONS</span>
                                    <span className="w-8 h-px bg-primary-500/50"></span>
                                    <span className="text-gray-400 dark:text-gray-600">VOL: {displayServices.length} MODULES</span>
                                </div>

                                <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-gray-900 dark:text-white mb-6 leading-none">
                                    MODULES <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">D'INTERVENTION</span>
                                </h1>
                                
                                <p className="text-lg text-gray-500 leading-relaxed mb-6 font-sans">
                                    Des solutions structurées et évolutives, adaptées à vos objectifs.
                                    Chaque prestation est conçue comme un composant indépendant au sein de votre architecture de marque.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 2 – SERVICES GRID (MODULES)
                ══════════════════════════════════════════════════ */}
                <section className="py-20 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                    <div className="container-main px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayServices.map((service, i) => {
                                const Icon = service.icon;
                                return (
                                    <div key={i} className="group relative bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 hover:border-primary-500 transition-colors flex flex-col h-full">
                                        {/* Bounding box hover effect */}
                                        <div className="absolute -inset-[1px] border border-primary-500/0 group-hover:border-primary-500/30 transition-colors pointer-events-none z-20">
                                            <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                            <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                            <div className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                            <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="w-10 h-10 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-6 group-hover:border-primary-500 group-hover:text-primary-500 text-gray-500 transition-colors bg-white dark:bg-[#111]">
                                                {Icon && <Icon size={18} />}
                                            </div>
                                            <h3 className="text-xl font-display font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
                                                {service.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mb-6 font-sans leading-relaxed">
                                                {service.description}
                                            </p>
                                            
                                            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
                                                <p className="text-[10px] font-mono font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-3">
                                                    INCLUS DANS LE MODULE :
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {service.features.map((feature, f) => (
                                                        <span key={f} className="text-[10px] font-mono px-2 py-1 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pied de module : Infos techniques */}
                                        <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-[#0A0A0A] p-4 flex justify-between items-center font-mono text-xs uppercase tracking-widest">
                                            <div>
                                                <span className="text-gray-500 block text-[10px]">BUDGET EST.</span>
                                                <span className="font-bold text-gray-900 dark:text-white">{service.price}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-gray-500 block text-[10px]">DÉLAI</span>
                                                <span className="font-bold text-gray-900 dark:text-white">{service.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 3 – WORKFLOW DIAGRAM
                ══════════════════════════════════════════════════ */}
                <section className="py-20 bg-gray-50 dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-gray-800">
                    <div className="container-main px-4">
                        <div className="max-w-3xl mb-12">
                            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-4">
                                <Layers size={12} />
                                <span>WORKFLOW OPÉRATIONNEL</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-4">
                                PROTOCOLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">D'EXÉCUTION</span>
                            </h2>
                            <p className="text-sm font-mono text-gray-500 uppercase tracking-wide">
                                Une méthodologie claire et transparente pour vous accompagner de l'idée à la réalisation.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 relative">
                            {PROCESS_STEPS.map((step, i) => {
                                const Icon = step.icon;
                                return (
                                    <div key={i} className="bg-white dark:bg-[#111] p-8 flex flex-col relative group hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="text-4xl font-display font-bold text-gray-200 dark:text-gray-800 group-hover:text-primary-500/30 transition-colors">
                                                {step.step}
                                            </div>
                                            <Icon size={20} className="text-gray-400 group-hover:text-primary-500 transition-colors" />
                                        </div>
                                        <h3 className="font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-xs font-mono text-gray-500 uppercase tracking-wide">
                                            {step.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 4 – FAQ (TROUBLESHOOTING)
                ══════════════════════════════════════════════════ */}
                <section className="py-20 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                    <div className="container-main px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="mb-12 text-center">
                                <h2 className="text-3xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-2">
                                    TROUBLESHOOTING <span className="text-primary-500">& FAQ</span>
                                </h2>
                                <p className="text-sm font-mono text-gray-500 uppercase tracking-widest">Base de connaissances commune</p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        q: "QUELS SONT VOS TARIFS ?",
                                        a: "Nos tarifs varient selon la complexité et les modules requis. Nous proposons des devis structurés après audit de vos besoins."
                                    },
                                    {
                                        q: "QUELS SONT LES DÉLAIS ?",
                                        a: "Les temps d'exécution oscillent entre 2 et 6 semaines en fonction du volume d'assets à produire. Le planning est fixé dès le départ."
                                    },
                                    {
                                        q: "COMMENT COLLABORONS-NOUS ?",
                                        a: "Nous fonctionnons par itérations successives avec des points de synchronisation réguliers pour valider chaque étape du workflow."
                                    },
                                    {
                                        q: "LIVRABLES ET SOURCES ?",
                                        a: "L'ensemble des fichiers sources et des exports optimisés vous sont transmis en fin de projet avec un guide d'utilisation."
                                    }
                                ].map((faq, i) => (
                                    <div key={i} className="border border-gray-200 dark:border-gray-800 p-6 bg-gray-50 dark:bg-[#161616] group hover:border-primary-500 transition-colors">
                                        <div className="flex items-start gap-3 mb-3">
                                            <span className="font-mono text-xs font-bold text-primary-500 mt-0.5">Q.</span>
                                            <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide leading-relaxed">
                                                {faq.q}
                                            </h3>
                                        </div>
                                        <div className="flex items-start gap-3 pl-5">
                                            <p className="text-xs font-mono text-gray-500 leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 5 – CTA (NEW CANVAS)
                ══════════════════════════════════════════════════ */}
                <section className="py-24 bg-gray-50 dark:bg-[#0A0A0A] text-center">
                    <div className="container-main px-4">
                        <div className="inline-flex items-center justify-center p-4 border border-gray-200 dark:border-gray-800 mb-6 bg-white dark:bg-[#111]">
                            <Focus className="text-primary-500" size={24} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-6">
                            INITIALISER UN <span className="text-primary-500">PROJET</span>
                        </h2>
                        <p className="text-gray-500 font-mono text-sm max-w-lg mx-auto mb-10 leading-relaxed uppercase tracking-wide">
                            Sélectionnez un ou plusieurs modules pour commencer l'élaboration de votre architecture de marque.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href="/contact" 
                                className="inline-flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-primary-400 transition-colors"
                            >
                                DEMANDER UN DEVIS <ArrowRight size={14} />
                            </Link>
                            <a 
                                href="mailto:dims.creative.academy@gmail.com" 
                                className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-[#111] font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <Mail size={14} />
                                CONTACT DIRECT
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </MainLayout>
    );
}