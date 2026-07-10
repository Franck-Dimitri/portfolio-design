import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import {
    ArrowRight, Search, Calendar, Clock, BookOpen,
    Filter, Focus, Box, Layers, ArrowUpRight
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

const CATEGORIES = [
    "Tous", "Inspiration", "Branding", "Motion Design", 
    "Packaging", "UI/UX", "Tech & Design"
];

function ArticleCard({ article }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <article className="group relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 hover:border-primary-500 transition-all flex flex-col sm:flex-row h-full">
            {/* Bounding Box effect */}
            <div className="absolute -inset-[1px] border border-primary-500/0 group-hover:border-primary-500/30 transition-colors pointer-events-none z-20">
                <div className="absolute -top-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute -top-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute -bottom-[1px] -left-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
                <div className="absolute -bottom-[1px] -right-[1px] w-1.5 h-1.5 bg-white dark:bg-[#111] border border-primary-500 opacity-0 group-hover:opacity-100"></div>
            </div>

            {/* Image Section */}
            <Link href={`/blog/${article.slug}`} className="block relative sm:w-2/5 shrink-0 bg-gray-50 dark:bg-[#161616] overflow-hidden border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-800">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none z-10"></div>
                
                {article.image ? (
                    <img 
                        src={`/storage/${article.image}`} 
                        alt={article.titre}
                        className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center font-mono opacity-20">
                            <BookOpen size={40} className="mx-auto mb-2" />
                            <p className="text-xs tracking-widest uppercase">NO_IMAGE</p>
                        </div>
                    </div>
                )}
                
                {article.cathegorie && article.cathegorie.length > 0 && (
                    <span className="absolute top-4 left-4 bg-primary-500 text-black text-[10px] uppercase font-mono tracking-widest px-2 py-1 z-20 shadow-sm font-bold">
                        {article.cathegorie[0]}
                    </span>
                )}
            </Link>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col relative z-10">
                <div className="absolute right-4 top-4 font-mono text-5xl font-bold text-gray-200 dark:text-gray-800 opacity-20 pointer-events-none select-none group-hover:text-primary-500/10 transition-colors">
                    {article.id.toString().padStart(3, '0')}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                        <Calendar size={10} className="text-primary-500" />
                        {formatDate(article.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock size={10} className="text-primary-500" />
                        {article.temps_lecture} MIN
                    </span>
                </div>

                <Link href={`/blog/${article.slug}`} className="mb-3">
                    <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors leading-tight uppercase tracking-wider">
                        {article.titre}
                    </h3>
                </Link>

                <p className="text-sm font-sans text-gray-500 line-clamp-2 mb-6 leading-relaxed flex-1">
                    {article.courte_description || article.sous_titre}
                </p>

                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#161616] flex items-center justify-center text-primary-500 text-[10px] font-mono font-bold">
                            DD
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-900 dark:text-white font-mono uppercase tracking-widest">Dims Design</p>
                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Auteur</p>
                        </div>
                    </div>
                    
                    <Link href={`/blog/${article.slug}`} className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary-500 flex items-center gap-1 group/link hover:text-primary-400 transition-colors">
                        LIRE DOC
                        <ArrowUpRight size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </article>
    );
}

function FeaturedArticle({ article }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    return (
        <div className="group relative bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 mb-16 overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none"></div>
            
            <div className="grid lg:grid-cols-2 relative z-10">
                
                {/* Content */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-primary-500 text-black text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1">
                            DOCUMENT_MAÎTRE
                        </span>
                        {article.cathegorie && article.cathegorie.length > 0 && (
                            <span className="border border-gray-200 dark:border-gray-800 text-gray-500 text-[10px] font-mono font-bold tracking-widest uppercase px-3 py-1 bg-gray-50 dark:bg-[#161616]">
                                {article.cathegorie[0]}
                            </span>
                        )}
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
                        {article.titre}
                    </h2>
                    
                    <p className="text-lg font-mono text-primary-500 uppercase tracking-widest mb-6">
                        {article.sous_titre}
                    </p>
                    
                    <p className="text-gray-500 text-sm font-sans mb-8 leading-relaxed max-w-xl">
                        {article.courte_description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-8 font-bold">
                        <span className="flex items-center gap-2">
                            <Calendar size={12} className="text-primary-500" />
                            {formatDate(article.published_at)}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock size={12} className="text-primary-500" />
                            {article.temps_lecture} MIN
                        </span>
                    </div>
                    
                    <Link 
                        href={`/blog/${article.slug}`}
                        className="inline-flex items-center justify-center gap-3 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white px-8 py-4 text-xs font-mono font-bold uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors w-max"
                    >
                        INSPECTER LE DOSSIER
                        <ArrowUpRight size={14} />
                    </Link>
                </div>

                {/* Featured Image */}
                <div className="relative h-[300px] lg:h-auto border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A]">
                    {article.image ? (
                        <img 
                            src={`/storage/${article.image}`} 
                            alt={article.titre}
                            className="w-full h-full object-cover filter grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <span className="font-mono text-sm text-gray-400">NO_PREVIEW</span>
                        </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-mono text-[10px] font-bold px-3 py-1">
                        FIG.{article.id.toString().padStart(3, '0')}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Blog({ articles = [], categories = [] }) {
    const [filterCategory, setFilterCategory] = useState('Tous');
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    const displayArticles = articles || [];
    const publishedArticles = displayArticles;
    
    const featuredArticle = publishedArticles.length > 0 
        ? publishedArticles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at))[0]
        : null;
    
    const otherArticles = publishedArticles.filter(a => a.id !== featuredArticle?.id);
    
    const filteredArticles = otherArticles.filter(article => {
        const matchCategory = filterCategory === 'Tous' || (article.cathegorie && article.cathegorie.includes(filterCategory));
        const matchSearch = article.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.sous_titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.courte_description?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCategory && matchSearch;
    });

    const availableCategories = categories.length > 0 ? ['Tous', ...categories] : CATEGORIES;

    const popularArticles = [...publishedArticles]
        .sort((a, b) => b.views - a.views)
        .slice(0, 3);

    return (
        <MainLayout>
            <SEOHead 
                title="Blog & Analyses | Dims Creative Academy"
                description="Articles et inspirations sur le design graphique, le branding, la direction artistique et les tendances créatives."
                url="/blog"
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
                                <span>ARCHIVES PUBLIQUES</span>
                                <span className="w-8 h-px bg-primary-500/50"></span>
                                <span className="text-gray-400 dark:text-gray-600">VOL: {publishedArticles.length} DOCS</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-gray-900 dark:text-white mb-6 leading-none">
                                NOTES & <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">ANALYSES</span>
                            </h1>
                            
                            <p className="text-lg text-gray-500 leading-relaxed mb-6 font-sans">
                                Exploration technique et conceptuelle du design graphique, du branding et de l'architecture visuelle moderne.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 2 – FEATURED & FILTRES
                ══════════════════════════════════════════════════ */}
                <section className="py-12">
                    <div className="container-main px-4">
                        
                        {featuredArticle && <FeaturedArticle article={featuredArticle} />}

                        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 p-4 mb-8">
                            <div className="flex flex-wrap gap-2">
                                {availableCategories.map((cat, idx) => {
                                    const isActive = filterCategory === cat;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setFilterCategory(cat)}
                                            className={`font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 border transition-colors ${
                                                isActive 
                                                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-500' 
                                                    : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] text-gray-500 hover:border-gray-400 dark:hover:border-gray-600'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="relative w-full lg:w-72">
                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="RECHERCHE..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 text-xs font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-400"
                                />
                            </div>
                        </div>

                        {/* ══════════════════════════════════════════════════
                            § 3 – CONTENU
                        ══════════════════════════════════════════════════ */}
                        <div className="grid lg:grid-cols-12 gap-8">
                            <div className="lg:col-span-8">
                                {filteredArticles.length === 0 ? (
                                    <div className="text-center py-20 border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                                        <Focus size={32} className="mx-auto text-gray-400 mb-4" />
                                        <h3 className="text-lg font-display font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-2">AUCUN RÉSULTAT</h3>
                                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Ajustez vos filtres de recherche.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {filteredArticles.map((article) => (
                                            <ArticleCard key={article.id} article={article} />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-4 space-y-6">
                                {/* SIDEPANEL: POPULAR */}
                                <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                                    <div className="border-b border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-[#161616] font-mono text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400">
                                        DOCUMENTS CONSULTÉS
                                    </div>
                                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {popularArticles.map((article, idx) => (
                                            <Link 
                                                key={idx}
                                                href={`/blog/${article.slug}`}
                                                className="block p-4 hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors group"
                                            >
                                                <h4 className="text-sm font-display font-bold text-gray-900 dark:text-white group-hover:text-primary-500 uppercase tracking-wider leading-tight mb-2">
                                                    {article.titre}
                                                </h4>
                                                <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                                    <span>{article.temps_lecture} MIN</span>
                                                    <span>•</span>
                                                    <span>{article.views} VUES</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* SIDEPANEL: NEWSLETTER */}
                                <div className="border border-primary-500 bg-primary-500/5 p-6 text-center">
                                    <h3 className="font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                                        SYSTÈME D'ALERTE
                                    </h3>
                                    <p className="text-xs font-mono text-gray-500 mb-6 uppercase tracking-widest">
                                        Recevez les mises à jour directement.
                                    </p>
                                    <form className="space-y-3">
                                        <input
                                            type="email"
                                            placeholder="ADRESSE EMAIL"
                                            className="w-full p-3 bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 text-xs font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors placeholder:text-gray-400"
                                        />
                                        <button className="w-full bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-4 py-3 hover:bg-primary-400 transition-colors">
                                            S'ABONNER
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 4 – CTA
                ══════════════════════════════════════════════════ */}
                <section className="py-24 bg-gray-50 dark:bg-[#0A0A0A] text-center border-t border-gray-200 dark:border-gray-800">
                    <div className="container-main px-4">
                        <div className="inline-flex items-center justify-center p-4 border border-gray-200 dark:border-gray-800 mb-6 bg-white dark:bg-[#111]">
                            <Layers className="text-primary-500" size={24} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-6">
                            VOUS AVEZ APPRÉCIÉ <span className="text-primary-500">LA LECTURE ?</span>
                        </h2>
                        <p className="text-gray-500 font-mono text-sm max-w-lg mx-auto mb-10 leading-relaxed uppercase tracking-wide">
                            Passez de la théorie à la pratique. Confiez-nous l'élaboration de votre architecture de marque.
                        </p>
                        <Link 
                            href="/contact" 
                            className="inline-flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-primary-400 transition-colors"
                        >
                            INITIER UN PROJET <ArrowRight size={14} />
                        </Link>
                    </div>
                </section>

            </div>
        </MainLayout>
    );
}