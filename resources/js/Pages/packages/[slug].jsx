import { useState } from 'react'
import { Link, useForm } from '@inertiajs/react'
import {
    ArrowLeft, Calendar, DollarSign, Clock, Heart, Share2,
    Twitter, Linkedin, Mail, CheckCircle, X, Star, Crown,
    Layers, Package, Shield, Zap, RefreshCw, MessageCircle,
    ChevronRight, Sparkles, Rocket, Gift, TrendingUp
} from 'lucide-react'
import MainLayout from '@/Layouts/MainLayout'
import SEOHead from '@/Components/SEOHead'

export default function PackageDetail({ package: pkg, relatedPackages = [] }) {
    const [isLiked, setIsLiked] = useState(false)
    const [activeTab, setActiveTab] = useState('features')

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        nom: '',
        telephone: '',
        message: '',
    })

    if (!pkg) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Pack non trouvé</h1>
                        <Link href="/packages" className="btn btn-primary">
                            Retour aux packs
                        </Link>
                    </div>
                </div>
            </MainLayout>
        )
    }

    const getBadgeColor = () => {
        if (pkg.couleur_badge) return pkg.couleur_badge
        if (pkg.is_populaire) return '#f59e0b'
        return '#f97316'
    }

    const badgeColor = getBadgeColor()

    return (
        <MainLayout>
            <SEOHead 
                title={`${pkg.titre} | Pack de Design`}
                description={pkg.description_courte || pkg.description?.substring(0, 160) || ''}
                url={`/packages/${pkg.slug}`}
            />

            <div className="pt-24 px-4">
                <div className="container-main">
                    <Link 
                        href="/packages"
                        className="inline-flex items-center gap-2 text-base-muted hover:text-primary-500 transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Retour aux packs
                    </Link>
                </div>
            </div>

            {/* Hero Section améliorée */}
            <section className="py-8">
                <div className="container-main px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Left Column - Package Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-4 mb-2">
                                            {pkg.icone && (
                                                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-4xl shadow-sm">
                                                    <span>{pkg.icone}</span>
                                                </div>
                                            )}
                                            <div>
                                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-primary">
                                                    {pkg.titre}
                                                </h1>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {pkg.is_populaire && (
                                                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium flex items-center gap-1">
                                                            <Crown size={14} /> Populaire
                                                        </span>
                                                    )}
                                                    {pkg.prix_barre && (
                                                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium flex items-center gap-1">
                                                            <Gift size={14} /> Promotion
                                                        </span>
                                                    )}
                                                    {pkg.is_active ? (
                                                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                                            Disponible
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                                                            Indisponible
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsLiked(!isLiked)}
                                        className="p-3 rounded-full border border-base hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group"
                                    >
                                        <Heart 
                                            size={20} 
                                            className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-base-muted group-hover:text-red-500'}`}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <p className="text-base-muted leading-relaxed">
                                    {pkg.description}
                                </p>
                            </div>

                            {/* Tabs modernisés */}
                            <div className="border-b border-base">
                                <div className="flex gap-6 overflow-x-auto pb-1">
                                    {[
                                        { id: 'features', label: 'Fonctionnalités', icon: Zap },
                                        { id: 'livrables', label: 'Livrables', icon: Package },
                                        { id: 'services', label: 'Services inclus', icon: Shield }
                                    ].map((tab) => {
                                        const Icon = tab.icon
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`pb-3 px-1 text-sm font-medium transition-all duration-200 border-b-2 flex items-center gap-2 ${
                                                    activeTab === tab.id 
                                                        ? 'border-primary-500 text-primary-500' 
                                                        : 'border-transparent text-base-muted hover:text-base-primary'
                                                }`}
                                            >
                                                <Icon size={16} />
                                                {tab.label}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="py-4">
                                {activeTab === 'features' && pkg.features && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {pkg.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <CheckCircle size={14} className="text-primary-500" />
                                                </div>
                                                <span className="text-base-muted">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'livrables' && pkg.livrables && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {pkg.livrables.map((livrable, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Package size={14} className="text-primary-500" />
                                                </div>
                                                <span className="text-base-muted">{livrable}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'services' && pkg.services && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {pkg.services.map((service, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                                                <div className="w-6 h-6 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <Shield size={14} className="text-primary-500" />
                                                </div>
                                                <span className="text-base-muted">{service}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {pkg.non_inclus && pkg.non_inclus.length > 0 && (
                                    <div className="mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50">
                                        <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                                            <X size={18} /> Non inclus
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {pkg.non_inclus.map((item, idx) => (
                                                <span key={idx} className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30">
                                                    <X size={12} /> {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Pricing & Actions amélioré */}
                        <div className="space-y-6">
                            <div className="card p-6 sticky top-28">
                                <div className="text-center">
                                    <div className="text-5xl font-bold text-primary-500">
                                        {pkg.prix.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-base-muted">FCFA / mois</div>
                                    {pkg.prix_barre && (
                                        <div className="text-sm text-base-muted line-through mt-1">
                                            {pkg.prix_barre.toLocaleString()} FCFA
                                        </div>
                                    )}
                                    {pkg.is_populaire && (
                                        <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                                            <TrendingUp size={12} />
                                            Meilleur rapport qualité-prix
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 space-y-3 border-t border-base pt-6">
                                    {pkg.nombre_design && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-base-muted">Designs inclus</span>
                                            <span className="font-semibold text-base-primary">{pkg.nombre_design === 999 ? 'Illimité' : pkg.nombre_design}</span>
                                        </div>
                                    )}
                                    {pkg.delai_livraison && (
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-base-muted">Délai de livraison</span>
                                            <span className="font-semibold text-base-primary">{pkg.delai_livraison} jours</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-base-muted">Révisions</span>
                                        <span className="font-semibold text-base-primary">{pkg.nombre_revision || 0}</span>
                                    </div>
                                </div>

                                <div className="mt-6 space-y-3">
                                    <Link
                                        href={pkg.is_active ? `/packages/${pkg.slug}/souscrire` : '#'}
                                        className={`btn ${pkg.is_active ? 'btn-primary' : 'btn-secondary opacity-50 cursor-not-allowed'} w-full justify-center text-center py-4 text-base font-semibold group transition-all duration-300`}
                                        onClick={(e) => !pkg.is_active && e.preventDefault()}
                                    >
                                        {pkg.is_active ? (
                                            <>
                                                <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                                                Souscrire maintenant
                                                <Rocket size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        ) : (
                                            'Indisponible'
                                        )}
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="btn btn-secondary w-full justify-center text-center text-sm"
                                    >
                                        <MessageCircle size={16} />
                                        Demander un devis
                                    </Link>
                                </div>
                            </div>

                            {/* Contact Card amélioré */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500/10 to-primary-600/5 border border-primary-200/30 dark:border-primary-800/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                                        <MessageCircle size={20} className="text-primary-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base-primary">Des questions ?</h3>
                                        <p className="text-sm text-base-muted">
                                            Contactez-nous pour discuter de vos besoins.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Share Section */}
                            <div className="p-4 rounded-2xl border border-base flex items-center justify-between">
                                <span className="text-sm text-base-muted">Partager</span>
                                <div className="flex gap-2">
                                    <button className="p-2 rounded-full hover:bg-primary-500 hover:text-white transition-all">
                                        <Share2 size={16} />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-primary-500 hover:text-white transition-all">
                                        <Twitter size={16} />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-primary-500 hover:text-white transition-all">
                                        <Linkedin size={16} />
                                    </button>
                                    <button className="p-2 rounded-full hover:bg-primary-500 hover:text-white transition-all">
                                        <Mail size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Packages amélioré */}
            {relatedPackages.length > 0 && (
                <section className="py-16 bg-subtle">
                    <div className="container-main px-4">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-gradient-to-b from-primary-500 to-primary-400 rounded-full"></div>
                                <h2 className="text-2xl md:text-3xl font-bold text-base-primary">
                                    Packs similaires
                                </h2>
                            </div>
                            <Link href="/packages" className="text-primary-500 hover:text-primary-600 font-medium inline-flex items-center gap-1">
                                Voir tous <ChevronRight size={16} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedPackages.map((relatedPkg) => (
                                <Link 
                                    key={relatedPkg.id} 
                                    href={`/packages/${relatedPkg.slug}`}
                                    className="group block"
                                >
                                    <div className="rounded-xl overflow-hidden bg-elevated border border-base hover:shadow-orange-md hover:-translate-y-1 transition-all duration-300 p-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            {relatedPkg.icone && (
                                                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{relatedPkg.icone}</span>
                                            )}
                                            <h3 className="font-semibold text-base-primary group-hover:text-primary-500 transition-colors">
                                                {relatedPkg.titre}
                                            </h3>
                                        </div>
                                        <p className="text-sm text-base-muted line-clamp-2">
                                            {relatedPkg.description_courte || relatedPkg.description}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className="text-xl font-bold text-primary-500">
                                                {relatedPkg.prix.toLocaleString()} FCFA
                                            </span>
                                            {relatedPkg.is_populaire && (
                                                <span className="text-xs text-yellow-500 flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-full">
                                                    <Star size={12} /> Populaire
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    )
}