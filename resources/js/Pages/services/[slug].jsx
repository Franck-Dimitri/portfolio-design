import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowLeft, Calendar, DollarSign,
    Clock, Share2, Twitter, Linkedin, Mail,
    CheckCircle, Layers, Box, Zap, Shield, Focus
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

export default function ServiceDetail({ service, relatedServices = [] }) {
    if (!service) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
                    <div className="text-center border border-gray-200 dark:border-gray-800 p-12 bg-white dark:bg-[#111]">
                        <Focus size={32} className="mx-auto text-gray-400 mb-4" />
                        <h1 className="text-2xl font-display font-bold mb-4 uppercase tracking-wider">MODULE NON TROUVÉ</h1>
                        <p className="text-xs font-mono text-gray-500 mb-8 uppercase tracking-widest">Le service demandé n'existe pas ou a été désactivé.</p>
                        <Link href="/services" className="inline-flex items-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-6 py-3 hover:bg-primary-400 transition-colors">
                            RETOUR AU CATALOGUE
                        </Link>
                    </div>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <SEOHead 
                title={`${service.titre} | Modules | Dims Creative Academy`}
                description={service.description?.substring(0, 160) || ''}
                url={`/services/${service.slug}`}
            />

            <CanvasLines />

            <div className="relative z-10 pt-24 pb-8">
                <div className="container-main px-4">
                    <Link 
                        href="/services"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 font-mono text-[10px] uppercase tracking-widest transition-colors group"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        RETOUR AUX MODULES
                    </Link>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════
                § 1 – DÉTAILS DU MODULE
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
                                            <Box size={12} />
                                            <span>MODULE: {service.cathegorie}</span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-4">
                                            {service.titre}
                                        </h1>
                                        <div className="flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest font-bold">
                                            <span className={`px-2 py-1 border ${service.is_active ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-orange-500/10 text-orange-600 border-orange-500/30'}`}>
                                                STATUT: {service.is_active ? 'DISPONIBLE' : 'INDISPONIBLE'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-400 font-sans leading-relaxed">
                                    <p className="text-xl leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </div>

                            {service.features && service.features.length > 0 && (
                                <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                                    <h2 className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-6 font-bold flex items-center gap-2">
                                        <Layers size={12} /> SPÉCIFICATIONS INCLUSES DANS CE MODULE
                                    </h2>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        {service.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 p-4">
                                                <div className="w-1.5 h-1.5 bg-primary-500 mt-1.5 shrink-0"></div>
                                                <span className="font-mono text-xs text-gray-900 dark:text-white uppercase tracking-wider">{feature}</span>
                                            </div>
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
                                    <Focus size={12} /> PARAMÈTRES DU MODULE
                                </div>
                                
                                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                    <div className="p-4 grid grid-cols-2 items-center">
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Budget estimé</span>
                                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                            {service.starting_price ? `À partir de ${service.starting_price.toLocaleString('fr-FR')} FCFA` : 'Sur devis'}
                                        </span>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 items-center">
                                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Délai d'exécution</span>
                                        <span className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                                            {service.delaie_livraison || 'À convenir'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Box */}
                            <div className="border border-primary-500 bg-primary-500/5 p-6">
                                <h3 className="font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">SOUSCRIRE À CE MODULE</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 font-mono">
                                    Ce module correspond à vos besoins ? Initiez le processus d'intégration.
                                </p>
                                <Link
                                    href={`/services/${service.slug}/souscrire`}
                                    className="flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-6 py-4 hover:bg-primary-400 transition-colors w-full mb-3"
                                >
                                    DÉMARRER LE MODULE
                                </Link>
                                <Link
                                    href="/contact"
                                    className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] text-gray-900 dark:text-white font-mono font-bold text-xs uppercase tracking-widest px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors w-full"
                                >
                                    DEMANDER DES INFOS
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                § 2 – MODULES CONNEXES
            ══════════════════════════════════════════════════ */}
            {relatedServices.length > 0 && (
                <section className="py-20 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A] relative z-10">
                    <div className="container-main px-4">
                        <div className="flex items-center justify-between mb-10 border-b border-gray-200 dark:border-gray-800 pb-4">
                            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                MODULES <span className="text-primary-500">CONNEXES</span>
                            </h2>
                            <Link href="/services" className="font-mono text-[10px] font-bold text-primary-500 uppercase tracking-widest hover:text-primary-400 transition-colors">
                                VOIR TOUT LE CATALOGUE &rarr;
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relatedServices.map((related) => (
                                <Link 
                                    key={related.id} 
                                    href={`/services/${related.slug}`}
                                    className="group block relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 transition-all hover:border-primary-500"
                                >
                                    <div className="absolute -inset-1 border border-primary-500/0 group-hover:border-primary-500/30 transition-colors pointer-events-none z-20">
                                        <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                        <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                        <div className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                        <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                                                {related.cathegorie}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2 group-hover:text-primary-500 transition-colors">
                                            {related.titre}
                                        </h3>
                                        <p className="text-xs font-mono text-gray-500 mb-6 uppercase tracking-wide">
                                            {related.starting_price ? `À partir de ${related.starting_price.toLocaleString('fr-FR')} FCFA` : 'Sur devis'}
                                        </p>
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
