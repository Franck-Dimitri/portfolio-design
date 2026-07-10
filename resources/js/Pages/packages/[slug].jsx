import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import {
    ArrowLeft, Share2, Twitter, Linkedin, Mail, CheckCircle, X,
    Crown, Package, Shield, Zap, MessageCircle, ChevronRight, Focus, Box, Layers
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

export default function PackageDetail({ package: pkg, relatedPackages = [] }) {
    const [activeTab, setActiveTab] = useState('features');

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        nom: '',
        telephone: '',
        message: '',
    });

    if (!pkg) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
                    <div className="text-center border border-gray-200 dark:border-gray-800 p-12 bg-white dark:bg-[#111]">
                        <Focus size={32} className="mx-auto text-gray-400 mb-4" />
                        <h1 className="text-2xl font-display font-bold mb-4 uppercase tracking-wider">PLAN NON TROUVÉ</h1>
                        <p className="text-xs font-mono text-gray-500 mb-8 uppercase tracking-widest">Le plan demandé n'existe pas ou a été désactivé.</p>
                        <Link href="/packages" className="inline-flex items-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-6 py-3 hover:bg-primary-400 transition-colors">
                            RETOUR AUX OFFRES
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <SEOHead 
                title={`${pkg.titre} | Packs de Design`}
                description={pkg.description_courte || pkg.description?.substring(0, 160) || ''}
                url={`/packages/${pkg.slug}`}
            />

            <CanvasLines />

            <div className="relative z-10 pt-24 pb-8">
                <div className="container-main px-4">
                    <Link 
                        href="/packages"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 font-mono text-[10px] uppercase tracking-widest transition-colors group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        RETOUR AUX PLANS
                    </Link>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                § 1 – DÉTAILS DU PACK (SPEC SHEET)
            ══════════════════════════════════════════════════ */}
            <section className="py-16 relative z-10 bg-white dark:bg-transparent">
                <div className="container-main px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        
                        {/* CONTENU PRINCIPAL */}
                        <div className="lg:col-span-8 space-y-12">
                            <div>
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-4">
                                            <Package size={12} />
                                            <span>PLAN D'ABONNEMENT</span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-4">
                                            {pkg.titre}
                                        </h1>
                                        <div className="flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest font-bold">
                                            <span className={`px-2 py-1 border ${pkg.is_active ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-orange-500/10 text-orange-600 border-orange-500/30'}`}>
                                                STATUT: {pkg.is_active ? 'DISPONIBLE' : 'INDISPONIBLE'}
                                            </span>
                                            {pkg.is_populaire && (
                                                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 border border-yellow-500/30 flex items-center gap-1">
                                                    <Crown size={10} /> RECOMMANDÉ
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 font-sans leading-relaxed">
                                    <p className="text-xl leading-relaxed">
                                        {pkg.description}
                                    </p>
                                </div>
                            </div>

                            {/* TABS DE SPÉCIFICATIONS */}
                            <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                                <div className="border-b border-gray-200 dark:border-gray-800 flex overflow-x-auto hide-scrollbar bg-gray-50 dark:bg-[#161616]">
                                    {[
                                        { id: 'features', label: 'FONCTIONNALITÉS', icon: Zap },
                                        { id: 'livrables', label: 'LIVRABLES', icon: Package },
                                        { id: 'services', label: 'SERVICES INCLUS', icon: Shield }
                                    ].map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`px-6 py-4 font-mono text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 transition-colors ${
                                                    activeTab === tab.id 
                                                        ? 'bg-white dark:bg-[#111] text-primary-500 border-t-2 border-primary-500' 
                                                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white border-t-2 border-transparent'
                                                }`}
                                            >
                                                <Icon size={12} />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                <div className="p-6">
                                    {activeTab === 'features' && pkg.features && (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {pkg.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 bg-primary-500 mt-1.5 shrink-0"></div>
                                                    <span className="font-mono text-xs text-gray-900 dark:text-white uppercase tracking-wider">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'livrables' && pkg.livrables && (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {pkg.livrables.map((livrable, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 bg-primary-500 mt-1.5 shrink-0"></div>
                                                    <span className="font-mono text-xs text-gray-900 dark:text-white uppercase tracking-wider">{livrable}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeTab === 'services' && pkg.services && (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {pkg.services.map((service, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <div className="w-1.5 h-1.5 bg-primary-500 mt-1.5 shrink-0"></div>
                                                    <span className="font-mono text-xs text-gray-900 dark:text-white uppercase tracking-wider">{service}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Non Inclus */}
                                    {pkg.non_inclus && pkg.non_inclus.length > 0 && (
                                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                                            <h4 className="font-mono text-[10px] font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <X size={12} /> RESTRICTIONS / NON INCLUS
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {pkg.non_inclus.map((item, idx) => (
                                                    <span key={idx} className="font-mono text-[10px] border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 px-2 py-1 uppercase tracking-wider flex items-center gap-1">
                                                        <X size={10} /> {item}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* PANNEAU LATÉRAL (PROPRIÉTÉS & SOUSCRIPTION) */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] sticky top-24">
                                <div className="border-b border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-[#161616] flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400">
                                    <Focus size={12} /> PARAMÈTRES FINANCIERS
                                </div>
                                
                                <div className="p-8 text-center border-b border-gray-200 dark:border-gray-800">
                                    <div className="text-5xl font-display font-bold text-primary-500">
                                        {pkg.prix.toLocaleString()}
                                    </div>
                                    <div className="text-sm font-mono text-gray-500 uppercase tracking-widest mt-2">FCFA / MOIS</div>
                                    {pkg.prix_barre && (
                                        <div className="text-xs font-mono text-gray-400 line-through mt-2">
                                            {pkg.prix_barre.toLocaleString()} FCFA
                                        </div>
                                    )}
                                </div>

                                <div className="divide-y divide-gray-200 dark:divide-gray-800 font-mono text-[10px] uppercase tracking-widest">
                                    <div className="p-4 grid grid-cols-2 items-center">
                                        <span className="text-gray-500">DESIGNS INCLUS</span>
                                        <span className="font-bold text-gray-900 dark:text-white text-right">
                                            {pkg.nombre_design === 999 ? 'ILLIMITÉ' : pkg.nombre_design}
                                        </span>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 items-center">
                                        <span className="text-gray-500">DÉLAI DE LIVRAISON</span>
                                        <span className="font-bold text-gray-900 dark:text-white text-right">
                                            {pkg.delai_livraison || '-'} JOURS
                                        </span>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 items-center">
                                        <span className="text-gray-500">RÉVISIONS</span>
                                        <span className="font-bold text-gray-900 dark:text-white text-right">
                                            {pkg.nombre_revision === 999 ? 'ILLIMITÉ' : (pkg.nombre_revision || 0)}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 dark:bg-[#161616]">
                                    <Link
                                        href={pkg.is_active ? route('subscription.create.package', { slug: pkg.slug }) : '#'}
                                        className={`flex items-center justify-center gap-2 font-mono font-bold text-xs uppercase tracking-widest px-6 py-4 transition-colors w-full ${
                                            pkg.is_active 
                                                ? 'bg-primary-500 text-black hover:bg-primary-400' 
                                                : 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                                        }`}
                                        onClick={(e) => !pkg.is_active && e.preventDefault()}
                                    >
                                        {pkg.is_active ? 'INITIALISER SOUSCRIPTION' : 'PLAN INDISPONIBLE'}
                                    </Link>
                                    
                                    <Link
                                        href="/contact"
                                        className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] text-gray-900 dark:text-white font-mono font-bold text-xs uppercase tracking-widest px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors w-full mt-3"
                                    >
                                        <MessageCircle size={14} /> DEMANDER UN DEVIS
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                § 2 – PLANS CONNEXES
            ══════════════════════════════════════════════════ */}
            {relatedPackages.length > 0 && (
                <section className="py-20 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A] relative z-10">
                    <div className="container-main px-4">
                        <div className="flex items-center justify-between mb-10 border-b border-gray-200 dark:border-gray-800 pb-4">
                            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                PLANS <span className="text-primary-500">SIMILAIRES</span>
                            </h2>
                            <Link href="/packages" className="font-mono text-[10px] font-bold text-primary-500 uppercase tracking-widest hover:text-primary-400 transition-colors">
                                EXPLORER TOUS LES PLANS &rarr;
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedPackages.map((relatedPkg) => (
                                <Link 
                                    key={relatedPkg.id} 
                                    href={`/packages/${relatedPkg.slug}`}
                                    className="group block relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 transition-all hover:border-primary-500"
                                >
                                    <div className="absolute -inset-[1px] border border-primary-500/0 group-hover:border-primary-500/30 transition-colors pointer-events-none z-20">
                                        <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                        <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                        <div className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                        <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                    </div>

                                    <div className="p-6">
                                        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 group-hover:text-primary-500 transition-colors">
                                            {relatedPkg.titre}
                                        </h3>
                                        <p className="text-xs font-mono text-gray-500 mb-6 uppercase tracking-wide line-clamp-2">
                                            {relatedPkg.description_courte || relatedPkg.description}
                                        </p>
                                        <div className="flex items-end gap-2 border-t border-gray-200 dark:border-gray-800 pt-4">
                                            <span className="text-2xl font-display font-bold text-primary-500">
                                                {relatedPkg.prix.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">FCFA / MOIS</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    );
}