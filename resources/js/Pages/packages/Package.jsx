import { useState, useRef, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import {
    ArrowRight, Eye, Search, Sparkles, Star, ArrowUpRight,
    Grid3x3, List, DollarSign, Package, CheckCircle,
    RefreshCw, Clock, Layers, Crown, Shield, Zap,
    TrendingUp, Rocket, Gift
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

function PackageCard({ package: pkg, index = 0 }) {
    const [isHovered, setIsHovered] = useState(false)
    const [ref, inView] = useInView()

    const getBadgeColor = () => {
        if (pkg.couleur_badge) return pkg.couleur_badge
        if (pkg.is_populaire) return '#f59e0b'
        return '#f97316'
    }

    const badgeColor = getBadgeColor()

    return (
        <article
            ref={ref}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative overflow-hidden rounded-2xl bg-elevated border border-base transition-all duration-500 hover:shadow-orange-md hover:-translate-y-2 ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            {/* Motif de fond subtil */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* Badge "Populaire" amélioré */}
            {pkg.is_populaire && (
                <div className="absolute -top-1 -right-1 z-20">
                    <div className="relative">
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-500 rotate-45 shadow-lg"></div>
                        <div className="relative z-10 px-4 py-1.5 text-xs font-bold text-white flex items-center gap-1.5">
                            <Crown size={12} />
                            Populaire
                        </div>
                    </div>
                </div>
            )}

            {/* Badge "Nouveau" ou "Promo" */}
            {pkg.prix_barre && (
                <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold flex items-center gap-1 shadow-lg">
                        <Gift size={12} />
                        Promo
                    </span>
                </div>
            )}

            {/* En-tête avec icône et gradient */}
            <div 
                className={`relative p-6 transition-all duration-300 ${
                    isHovered ? 'scale-[1.02]' : 'scale-100'
                }`}
                style={{
                    background: `linear-gradient(135deg, ${badgeColor}15, ${badgeColor}05)`
                }}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-neutral-800 shadow-md flex items-center justify-center text-3xl mb-4 transition-all duration-300 group-hover:shadow-orange-sm group-hover:scale-110">
                            {pkg.icone ? (
                                <span>{pkg.icone}</span>
                            ) : (
                                <Package size={28} className="text-primary-500" />
                            )}
                        </div>
                        <h3 className="font-bold text-xl text-base-primary group-hover:text-primary-500 transition-colors">
                            {pkg.titre}
                        </h3>
                        {pkg.description_courte && (
                            <p className="text-sm text-base-muted mt-1 max-w-xs">
                                {pkg.description_courte}
                            </p>
                        )}
                    </div>
                    {pkg.is_active ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/15 text-green-600 dark:text-green-400 text-xs font-medium border border-green-500/20 backdrop-blur-sm">
                            Disponible
                        </span>
                    ) : (
                        <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-600 dark:text-red-400 text-xs font-medium border border-red-500/20 backdrop-blur-sm">
                            Indisponible
                        </span>
                    )}
                </div>

                {/* Prix mis en valeur */}
                <div className="mt-6 pt-4 border-t border-base/50">
                    <div className="flex items-end gap-3">
                        <div>
                            <span className="text-4xl font-bold text-base-primary">
                                {pkg.prix.toLocaleString()}
                            </span>
                            <span className="text-sm font-medium text-base-muted ml-1">FCFA</span>
                        </div>
                        {pkg.prix_barre && (
                            <span className="text-sm text-base-muted line-through mb-1">
                                {pkg.prix_barre.toLocaleString()} FCFA
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-base-muted mt-0.5">
                        <Clock size={12} />
                        <span>Paiement mensuel • Sans engagement</span>
                    </div>
                </div>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-4">
                {/* Stats rapides avec icônes */}
                <div className="grid grid-cols-3 gap-2 bg-muted/30 rounded-xl p-3">
                    {pkg.nombre_design && (
                        <div className="text-center">
                            <div className="text-primary-500 font-bold text-sm">
                                {pkg.nombre_design === 999 ? '∞' : pkg.nombre_design}
                            </div>
                            <div className="text-xs text-base-muted">Designs</div>
                        </div>
                    )}
                    {pkg.delai_livraison && (
                        <div className="text-center">
                            <div className="text-primary-500 font-bold text-sm">
                                {pkg.delai_livraison}j
                            </div>
                            <div className="text-xs text-base-muted">Livraison</div>
                        </div>
                    )}
                    <div className="text-center">
                        <div className="text-primary-500 font-bold text-sm">
                            {pkg.nombre_revision || 0}
                        </div>
                        <div className="text-xs text-base-muted">Révisions</div>
                    </div>
                </div>

                {/* Features avec puces modernes */}
                {pkg.features && pkg.features.length > 0 && (
                    <div className="space-y-2">
                        {pkg.features.slice(0, 3).map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2.5 text-sm group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${idx * 50}ms` }}>
                                <div className="w-5 h-5 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <CheckCircle size={12} className="text-primary-500" />
                                </div>
                                <span className="text-base-muted">{feature}</span>
                            </div>
                        ))}
                        {pkg.features.length > 3 && (
                            <div className="text-sm text-primary-500 font-medium pl-7">
                                +{pkg.features.length - 3} autres avantages
                            </div>
                        )}
                    </div>
                )}

                {/* Boutons */}
                <div className="pt-4 border-t border-base flex flex-col sm:flex-row gap-3">
                    <Link
                        href={`/packages/${pkg.slug}`}
                        className="flex-1 btn btn-primary text-center justify-center group/btn gap-2"
                    >
                        Voir détails
                        <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Link>
                    {pkg.is_active && (
                        <Link
                            href={`/packages/${pkg.slug}/souscrire`}
                            className="flex-1 btn btn-secondary text-center justify-center gap-2"
                        >
                            <Sparkles size={16} />
                            Souscrire
                        </Link>
                    )}
                </div>
            </div>
        </article>
    )
}

export default function PackageIndex({ packages = [] }) {
    const [searchTerm, setSearchTerm] = useState('')
    const [viewMode, setViewMode] = useState('grid')
    const [filterActive, setFilterActive] = useState('all')

    const filteredPackages = packages.filter(pkg => {
        const matchSearch = pkg.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           pkg.description_courte?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchActive = filterActive === 'all' || 
                           (filterActive === 'active' && pkg.is_active) ||
                           (filterActive === 'inactive' && !pkg.is_active)
        return matchSearch && matchActive
    })

    const totalPackages = packages.length
    const activePackages = packages.filter(p => p.is_active).length
    const popularPackages = packages.filter(p => p.is_populaire).length
    const avgPrice = packages.reduce((sum, p) => sum + (p.prix || 0), 0) / packages.length || 0

    return (
        <MainLayout>
            <SEOHead 
                title="Dim's Creative Academy | Nos Packs de Design"
                description="Découvrez nos packs de design adaptés à vos besoins. Abonnements mensuels avec des designs illimités."
                url="/packages"
            />

            {/* Hero Section améliorée */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                {/* Motif de fond */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary-50/30 to-transparent dark:from-primary-950/20">
                    <div className="absolute top-0 left-0 w-full h-full opacity-[0.03]">
                        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-400 rounded-full blur-3xl"></div>
                    </div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmOTczMTYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
                </div>

                <div className="container-main px-4 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950/50 border border-primary-200/50 dark:border-primary-800/50 mb-6 backdrop-blur-sm">
                            <Package size={14} className="text-primary-500" />
                            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">Nos Offres</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            Choisissez le{' '}
                            <span className="bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                                Pack Parfait
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-base-muted max-w-2xl mx-auto leading-relaxed">
                            Des solutions de design adaptées à tous vos besoins. Des packs flexibles et abordables.
                        </p>
                        
                        {/* Stats avec icônes */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-3xl mx-auto">
                            <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-4 border border-base/50">
                                <div className="text-2xl font-bold text-primary-500">{totalPackages}</div>
                                <div className="text-xs text-base-muted">Packs disponibles</div>
                            </div>
                            <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-4 border border-base/50">
                                <div className="text-2xl font-bold text-primary-500">{activePackages}</div>
                                <div className="text-xs text-base-muted">Packs actifs</div>
                            </div>
                            <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-4 border border-base/50">
                                <div className="text-2xl font-bold text-primary-500">{popularPackages}</div>
                                <div className="text-xs text-base-muted">Packs populaires</div>
                            </div>
                            <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm rounded-2xl p-4 border border-base/50">
                                <div className="text-2xl font-bold text-primary-500">{Math.round(avgPrice).toLocaleString()} FCFA</div>
                                <div className="text-xs text-base-muted">Prix moyen</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters - avec style moderne */}
            <section className="sticky top-16 z-30 py-4 bg-base/95 backdrop-blur-md border-b border-base">
                <div className="container-main px-4">
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['all', 'active', 'inactive'].map((filter) => {
                                const labels = {
                                    all: 'Tous les packs',
                                    active: 'Actifs',
                                    inactive: 'Indisponibles'
                                }
                                return (
                                    <button
                                        key={filter}
                                        onClick={() => setFilterActive(filter)}
                                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                            filterActive === filter 
                                                ? 'bg-primary-500 text-white shadow-orange-sm' 
                                                : 'bg-muted text-base-muted hover:bg-primary-100 dark:hover:bg-primary-900/30'
                                        }`}
                                    >
                                        {labels[filter]}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="flex gap-3">
                            <div className="relative">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un pack..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-full border border-base bg-muted text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
                                />
                            </div>
                            <button
                                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                                className="p-2 rounded-full border border-base hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/50 transition-all"
                            >
                                {viewMode === 'grid' ? <List size={18} /> : <Grid3x3 size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Packages Grid */}
            <section className="section">
                <div className="container-main px-4">
                    {filteredPackages.length === 0 ? (
                        <div className="text-center py-20 animate-fade-in">
                            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-950 dark:to-primary-900 flex items-center justify-center">
                                <Package className="text-primary-500" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-base-primary">Aucun pack trouvé</h3>
                            <p className="text-base-muted mb-6">Aucun pack ne correspond à vos critères de recherche.</p>
                            <button
                                onClick={() => { setFilterActive('all'); setSearchTerm('') }}
                                className="btn btn-primary gap-2"
                            >
                                <RefreshCw size={16} />
                                Réinitialiser les filtres
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 flex flex-wrap justify-between items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-400 rounded-full"></div>
                                    <p className="text-base-muted">
                                        <span className="font-bold text-2xl text-primary-500 mr-1">{filteredPackages.length}</span>
                                        pack{filteredPackages.length > 1 ? 's' : ''} disponible{filteredPackages.length > 1 ? 's' : ''}
                                        <span className="mx-2 text-base-muted/30">|</span>
                                        <span className="inline-flex items-center gap-1">
                                            <Star size={14} className="text-yellow-500 fill-yellow-500" />
                                            {filteredPackages.filter(p => p.is_populaire).length} populaire{filteredPackages.filter(p => p.is_populaire).length > 1 ? 's' : ''}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className={`grid ${viewMode === 'grid' 
                                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                                : 'grid-cols-1'} gap-6 md:gap-8`}>
                                {filteredPackages.map((pkg, index) => (
                                    <PackageCard key={pkg.id} package={pkg} index={index} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* CTA Section améliorée */}
            <section className="section bg-subtle">
                <div className="container-main px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-primary-600 p-12 text-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                                <Rocket size={16} className="text-white" />
                                <span className="text-white/80 text-sm">Offre personnalisée</span>
                            </div>
                            <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
                                Besoin d'un pack personnalisé ?
                            </h2>
                            <p className="text-primary-100 text-lg max-w-md mx-auto mb-8">
                                Contactez-nous pour créer une offre sur mesure adaptée à vos besoins spécifiques.
                            </p>
                            <Link 
                                href="/contact" 
                                className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold hover:bg-primary-50 hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                            >
                                Nous contacter
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}