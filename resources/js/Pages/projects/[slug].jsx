import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft, Eye, Calendar, DollarSign,
    Clock, Heart, Share2, Twitter, Linkedin, Mail,
    Camera, ZoomIn, ChevronLeft, ChevronRight, X,
    Code2, Star, MessageCircle, Layers, Box, Focus
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import SEOHead from '@/Components/SEOHead';

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

export default function ProjectDetail({ project, relatedProjects = [] }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    if (!project) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
                    <div className="text-center border border-gray-200 dark:border-gray-800 p-12 bg-white dark:bg-[#111]">
                        <Focus size={32} className="mx-auto text-gray-400 mb-4" />
                        <h1 className="text-2xl font-display font-bold mb-4 uppercase tracking-wider">OBJET NON TROUVÉ</h1>
                        <p className="text-xs font-mono text-gray-500 mb-8 uppercase tracking-widest">Le projet demandé n'existe pas ou a été déplacé.</p>
                        <Link href="/projets" className="inline-flex items-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-6 py-3 hover:bg-primary-400 transition-colors">
                            RETOUR AU WORKSPACE
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const images = project.images || [];
    const mainImage = images[activeImageIndex] || null;
    const hasMultipleImages = images.length > 1;

    const nextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <MainLayout>
            <SEOHead 
                title={`${project.titre} | Portfolio Design`}
                description={project.description?.substring(0, 160) || ''}
                url={`/projets/${project.slug}`}
            />

            <CanvasLines />

            <div className="relative z-10 pt-24 pb-8">
                <div className="container-main px-4">
                    <Link 
                        href="/projets"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 font-mono text-[10px] uppercase tracking-widest transition-colors group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        RETOUR AU PORTFOLIO
                    </Link>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                § 1 – ARTBOARD (IMAGES)
            ══════════════════════════════════════════════════ */}
            <section className="pb-12 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A]">
                <div className="container-main px-4">
                    
                    <div className="flex justify-between items-end mb-4 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                        <div>
                            <span>OBJET: {project.titre}</span>
                            <span className="mx-2">|</span>
                            <span>ASSET: {activeImageIndex + 1}/{images.length || 1}</span>
                        </div>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1"><Focus size={10} /> ZOOM: 100%</span>
                        </div>
                    </div>

                    <div className="relative border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161616] p-2 mb-6 group overflow-hidden">
                        {/* Bounding box hover effect */}
                        <div className="absolute inset-0 border border-primary-500/0 group-hover:border-primary-500 transition-colors pointer-events-none z-20">
                            <div className="absolute -top-[1px] -left-[1px] w-2 h-2 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute -top-[1px] -right-[1px] w-2 h-2 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute -bottom-[1px] -left-[1px] w-2 h-2 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        {mainImage ? (
                            <>
                                <img
                                    src={`/storage/${mainImage.path}`}
                                    alt={project.titre}
                                    className="w-full h-auto max-h-[70vh] object-contain bg-gray-50 dark:bg-[#0A0A0A] cursor-pointer"
                                    onClick={() => setIsLightboxOpen(true)}
                                />
                                <button
                                    onClick={() => setIsLightboxOpen(true)}
                                    className="absolute bottom-6 right-6 p-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:text-primary-500 hover:border-primary-500 transition-all opacity-0 group-hover:opacity-100 z-30"
                                >
                                    <ZoomIn size={18} />
                                </button>
                            </>
                        ) : (
                            <div className="w-full h-[50vh] flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
                                <Camera size={48} className="text-gray-300 dark:text-gray-700" />
                            </div>
                        )}
                    </div>

                    {hasMultipleImages && (
                        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                            {images.map((image, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`relative flex-shrink-0 w-32 h-24 border p-1 transition-all
                                        ${activeImageIndex === idx 
                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] hover:border-gray-400 dark:hover:border-gray-600'}`}
                                >
                                    <img
                                        src={`/storage/${image.path}`}
                                        alt={`${project.titre} - vue ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                § 2 – PROPRIÉTÉS DU PROJET (SPEC SHEET)
            ══════════════════════════════════════════════════ */}
            <section className="py-16 relative z-10 bg-white dark:bg-transparent">
                <div className="container-main px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* CONTENU PRINCIPAL */}
                        <div className="lg:col-span-8 space-y-12">
                            <div>
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-4">
                                            {project.titre}
                                        </h1>
                                        <div className="flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest font-bold">
                                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                CAT: {project.cathegorie}
                                            </span>
                                            {project.is_featured && (
                                                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/30 flex items-center gap-1">
                                                    <Star size={10} /> FEATURED
                                                </span>
                                            )}
                                            <span className={`px-2 py-1 border ${project.is_published ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-orange-500/10 text-orange-600 border-orange-500/30'}`}>
                                                STATUT: {project.is_published ? 'PUBLIÉ' : 'WIP'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsLiked(!isLiked)}
                                        className="p-4 border border-gray-200 dark:border-gray-800 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group bg-white dark:bg-[#111]"
                                    >
                                        <Heart 
                                            size={20} 
                                            className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-500'}`}
                                        />
                                    </button>
                                </div>
                                
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 font-sans leading-relaxed">
                                    <p className="text-xl leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>
                            </div>

                            {project.outils && project.outils.length > 0 && (
                                <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                                    <h2 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4 font-bold flex items-center gap-2">
                                        <Code2 size={12} /> STACK TECHNIQUE & OUTILS
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {project.outils.map((tool, idx) => (
                                            <span key={idx} className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#161616] text-gray-900 dark:text-white font-mono text-[11px] uppercase tracking-wider">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* PANNEAU LATÉRAL (PROPRIÉTÉS) */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* Specifications Sheet */}
                            <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                                <div className="border-b border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-[#161616] flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400">
                                    <Layers size={12} /> SPÉCIFICATIONS DU PROJET
                                </div>
                                
                                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                    <div className="p-4 grid grid-cols-2 items-center">
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Valeur / Budget</span>
                                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{parseInt(project.prix).toLocaleString()} FCFA</span>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 items-center">
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Date Création</span>
                                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                            {new Date(project.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 items-center">
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Visibilité (Vues)</span>
                                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{project.views || 0}</span>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 items-center">
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Fichiers (Assets)</span>
                                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">{images.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions / Partage */}
                            <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] p-6">
                                <h3 className="font-mono text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-4">DISTRIBUTION & RÉSEAUX</h3>
                                <div className="flex gap-2">
                                    <button className="flex-1 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#161616] hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center">
                                        <Share2 size={16} />
                                    </button>
                                    <button className="flex-1 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#161616] hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center">
                                        <Twitter size={16} />
                                    </button>
                                    <button className="flex-1 py-3 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#161616] hover:border-primary-500 hover:text-primary-500 transition-colors flex items-center justify-center">
                                        <Linkedin size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Contact Box */}
                            <div className="border border-primary-500 bg-primary-500/5 p-6">
                                <h3 className="font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">INITIER UN PROJET SIMILAIRE</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-mono">
                                    Une vision créative à réaliser ? Définissons les contours de votre architecture visuelle.
                                </p>
                                <Link
                                    href="/contact"
                                    className="flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-6 py-4 hover:bg-primary-400 transition-colors w-full"
                                >
                                    <MessageCircle size={14} />
                                    DÉMARRER CONSULTATION
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                § 3 – RELATED PROJECTS (MODULES SIMILAIRES)
            ══════════════════════════════════════════════════ */}
            {relatedProjects.length > 0 && (
                <section className="py-20 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A] relative z-10">
                    <div className="container-main px-4">
                        <div className="flex items-center justify-between mb-10 border-b border-gray-200 dark:border-gray-800 pb-4">
                            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                ARCHIVES <span className="text-primary-500">CONNEXES</span>
                            </h2>
                            <Link href="/projets" className="font-mono text-[10px] font-bold text-primary-500 uppercase tracking-widest hover:text-primary-400 transition-colors">
                                EXPLORER TOUT &rarr;
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedProjects.map((relatedProject) => (
                                <Link 
                                    key={relatedProject.id} 
                                    href={`/projets/${relatedProject.slug}`}
                                    className="group block relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 transition-all hover:border-primary-500"
                                >
                                    <div className="absolute -inset-1 border border-primary-500/0 group-hover:border-primary-500/30 transition-colors pointer-events-none z-20">
                                        <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                        <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                        <div className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                        <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                    </div>

                                    <div className="h-48 overflow-hidden bg-gray-100 dark:bg-[#161616] border-b border-gray-200 dark:border-gray-800">
                                        {relatedProject.images && relatedProject.images[0] ? (
                                            <img
                                                src={`/storage/${relatedProject.images[0].path}`}
                                                alt={relatedProject.titre}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Box size={24} className="text-gray-300 dark:text-gray-700" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                                                {relatedProject.cathegorie}
                                            </span>
                                        </div>
                                        <h3 className="font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider group-hover:text-primary-500 transition-colors">
                                            {relatedProject.titre}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Lightbox / Overlay Inspection */}
            {isLightboxOpen && mainImage && (
                <div className="fixed inset-0 z-50 bg-white/95 dark:bg-black/95 flex items-center justify-center" onClick={() => setIsLightboxOpen(false)}>
                    
                    {/* UI Lighbox - Design tool style */}
                    <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-white/50 dark:bg-black/50 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm z-50">
                        <span className="font-mono text-xs text-gray-600 dark:text-gray-400 uppercase tracking-widest font-bold">
                            INSPECTEUR D'ASSET: {project.titre} ({activeImageIndex + 1}/{images.length})
                        </span>
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="p-2 border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white bg-white dark:bg-[#111] hover:border-gray-500 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    {hasMultipleImages && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-colors z-50"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-primary-500 hover:border-primary-500 transition-colors z-50"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}

                    <div className="relative p-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A] shadow-2xl">
                        {/* Blueprint crop marks */}
                        <div className="absolute -top-1 -left-1 w-2 h-2 bg-white dark:bg-black border border-gray-400"></div>
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white dark:bg-black border border-gray-400"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white dark:bg-black border border-gray-400"></div>
                        <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white dark:bg-black border border-gray-400"></div>

                        <img
                            src={`/storage/${mainImage.path}`}
                            alt={project.titre}
                            className="max-w-[90vw] max-h-[80vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </MainLayout>
    );
}