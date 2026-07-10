import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight, Search, Crown, Package,
    CheckCircle, RefreshCw, Clock, Gift, Box, Focus, Layers, Sparkles
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import SEOHead from '@/Components/SEOHead';

/* ══════════════════════════════════════════════════════════════
   COMPOSANT – Lignes structurelles (Design Canvas)
══════════════════════════════════════════════════════════════ */
function CanvasLines() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 flex justify-center overflow-hidden">
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
            
            <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-gray-400 dark:border-gray-600"></div>
            <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-gray-400 dark:border-gray-600"></div>
            <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-gray-400 dark:border-gray-600"></div>
            <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-gray-400 dark:border-gray-600"></div>
        </div>
    );
}

function PackageCard({ package: pkg }) {
    return (
        <article className="group relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 hover:border-primary-500 transition-all flex flex-col h-full">
            {/* Bounding Box effect */}
            <div className="absolute -inset-[1px] border border-primary-500/0 group-hover:border-primary-500/30 transition-colors pointer-events-none z-20">
                <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
            </div>

            <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 group-hover:border-primary-500 group-hover:text-primary-500 transition-colors bg-gray-50 dark:bg-[#161616]">
                        <Package size={20} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        {pkg.is_populaire && (
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-yellow-500 text-black">
                                <Crown size={10} className="inline mr-1" /> RECOMMANDÉ
                            </span>
                        )}
                        {pkg.prix_barre && (
                            <span className="font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 border border-red-500 text-red-500">
                                <Gift size={10} className="inline mr-1" /> PROMO
                            </span>
                        )}
                    </div>
                </div>

                <h3 className="font-display font-bold text-2xl text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                    {pkg.titre}
                </h3>
                
                {pkg.description_courte && (
                    <p className="text-sm font-sans text-gray-500 leading-relaxed mb-6">
                        {pkg.description_courte}
                    </p>
                )}

                <div className="mb-6">
                    <div className="flex items-end gap-2">
                        <span className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                            {pkg.prix.toLocaleString()}
                        </span>
                        <span className="text-sm font-mono font-bold text-gray-500 uppercase tracking-widest mb-1">FCFA</span>
                    </div>
                    {pkg.prix_barre && (
                        <div className="text-xs font-mono text-gray-400 line-through mt-1">
                            {pkg.prix_barre.toLocaleString()} FCFA
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-px bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 mb-6 font-mono text-[10px] uppercase tracking-widest">
                    <div className="bg-gray-50 dark:bg-[#161616] p-2 text-center">
                        <div className="font-bold text-primary-500">{pkg.nombre_design === 999 ? '∞' : pkg.nombre_design}</div>
                        <div className="text-gray-500">DESIGNS</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#161616] p-2 text-center">
                        <div className="font-bold text-primary-500">{pkg.delai_livraison || '-'}j</div>
                        <div className="text-gray-500">DÉLAI</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-[#161616] p-2 text-center">
                        <div className="font-bold text-primary-500">{pkg.nombre_revision === 999 ? '∞' : (pkg.nombre_revision || 0)}</div>
                        <div className="text-gray-500">RÉVISIONS</div>
                    </div>
                </div>

                {pkg.features && pkg.features.length > 0 && (
                    <div className="space-y-3 mb-8">
                        {pkg.features.slice(0, 4).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 bg-primary-500 mt-1.5 shrink-0"></div>
                                <span className="text-xs font-mono text-gray-600 dark:text-gray-400 uppercase tracking-wide">{feature}</span>
                            </div>
                        ))}
                        {pkg.features.length > 4 && (
                            <div className="text-[10px] font-mono text-primary-500 font-bold uppercase tracking-widest pl-4">
                                + {pkg.features.length - 4} AUTRES CARACTÉRISTIQUES
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
                    <Link
                        href={`/packages/${pkg.slug}`}
                        className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white font-mono font-bold text-xs uppercase tracking-widest px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors"
                    >
                        INSPECTER
                    </Link>
                    {pkg.is_active && (
                        <Link
                            href={`/packages/${pkg.slug}/souscrire`}
                            className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-4 py-3 hover:bg-primary-400 transition-colors"
                        >
                            SOUSCRIRE
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}

export default function PackageIndex({ packages = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterActive, setFilterActive] = useState('all');

    const filteredPackages = packages.filter(pkg => {
        const matchSearch = pkg.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.description_courte?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchActive = filterActive === 'all' || 
                           (filterActive === 'active' && pkg.is_active) ||
                           (filterActive === 'inactive' && !pkg.is_active);
        return matchSearch && matchActive;
    });

    return (
        <MainLayout>
            <SEOHead 
                title="Packs & Souscriptions | Dims Creative Academy"
                description="Découvrez nos packs de design structurés. Abonnements mensuels avec des livrables illimités."
                url="/packages"
            />

            <CanvasLines />

            <div className="relative z-10">
                {/* ══════════════════════════════════════════════════
                    § 1 – HERO SECTION
                ══════════════════════════════════════════════════ */}
                <section className="pt-32 pb-16 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A]">
                    <div className="container-main px-4">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-6">
                                <Box size={12} />
                                <span>OFFRES PACKAGÉES</span>
                                <span className="w-8 h-px bg-primary-500/50"></span>
                                <span className="text-gray-400 dark:text-gray-600">VOL: {packages.length} PLANS</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-gray-900 dark:text-white mb-6 leading-none">
                                SOLUTIONS <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">SUR MESURE</span>
                            </h1>
                            
                            <p className="text-lg text-gray-500 leading-relaxed mb-6 font-sans">
                                Des environnements de conception complets. Sélectionnez le plan 
                                qui correspond à la vélocité et aux besoins de votre entreprise.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 2 – BARRE DE CONTRÔLE (FILTRES)
                ══════════════════════════════════════════════════ */}
                <section className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                    <div className="container-main px-4">
                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center py-4">
                            
                            <div className="flex flex-wrap gap-2">
                                {['all', 'active', 'inactive'].map((filter) => {
                                    const labels = {
                                        all: 'TOUS LES PLANS',
                                        active: 'DISPONIBLES',
                                        inactive: 'ARCHIVÉS'
                                    };
                                    const isActive = filterActive === filter;
                                    return (
                                        <button
                                            key={filter}
                                            onClick={() => setFilterActive(filter)}
                                            className={`font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 border transition-colors ${
                                                isActive 
                                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-500' 
                                                    : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] text-gray-500 hover:border-gray-400 dark:hover:border-gray-600'
                                            }`}
                                        >
                                            {labels[filter]}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="relative w-full lg:w-72">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="RECHERCHER..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 text-xs font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-400"
                                />
                            </div>
                            
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 3 – GRILLE DES PACKS
                ══════════════════════════════════════════════════ */}
                <section className="py-20 bg-gray-50 dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-gray-800">
                    <div className="container-main px-4">
                        {filteredPackages.length === 0 ? (
                            <div className="text-center py-20 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                                <Focus size={32} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-display font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">AUCUN RÉSULTAT</h3>
                                <p className="text-xs font-mono text-gray-500 mb-6 uppercase tracking-widest">Les paramètres de recherche ne retournent aucun plan.</p>
                                <button
                                    onClick={() => { setFilterActive('all'); setSearchTerm(''); }}
                                    className="inline-flex items-center gap-2 bg-gray-100 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-mono font-bold text-xs uppercase tracking-widest px-6 py-3 hover:border-gray-400 transition-colors"
                                >
                                    <RefreshCw size={14} /> RÉINITIALISER LA REQUÊTE
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredPackages.map((pkg) => (
                                    <PackageCard key={pkg.id} package={pkg} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 4 – CTA (OFFRE SUR MESURE)
                ══════════════════════════════════════════════════ */}
                <section className="py-24 bg-white dark:bg-[#111] text-center">
                    <div className="container-main px-4">
                        <div className="inline-flex items-center justify-center p-4 border border-gray-200 dark:border-gray-800 mb-6">
                            <Layers className="text-primary-500" size={24} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-6">
                            ARCHITECTURE <span className="text-primary-500">SUR MESURE</span>
                        </h2>
                        <p className="text-gray-500 font-mono text-sm max-w-lg mx-auto mb-10 leading-relaxed uppercase tracking-wide">
                            Aucun plan ne correspond exactement à vos spécifications ? Paramétrons ensemble un environnement adapté.
                        </p>
                        <Link 
                            href="/contact" 
                            className="inline-flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-primary-400 transition-colors"
                        >
                            ÉTABLIR UN CAHIER DES CHARGES <ArrowRight size={14} />
                        </Link>
                    </div>
                </section>

            </div>
        </MainLayout>
    );
}