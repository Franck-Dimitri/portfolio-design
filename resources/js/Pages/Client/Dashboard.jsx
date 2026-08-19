import { Link } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    Package,
    Clock,
    CheckCircle2,
    Download,
    FileText,
    ArrowUpRight,
    Terminal,
    Crosshair,
    Plus,
    Sparkles,
    ChevronRight,
    Eye,
    MessageSquare,
    Printer
} from 'lucide-react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'

export default function Dashboard({ stats = {}, recentOrders = [], recentDeliverables = [] }) {
    return (
        <ClientLayout title="Mon Tableau de Bord">
            <div className="space-y-8">

                {/* ── HERO BANNER ── */}
                <div className="relative border border-gray-800 bg-[#0E0E0E] p-6 md:p-8 overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary-500"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary-500"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary-500"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary-500"></div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-2">
                                <Terminal size={13} />
                                <span>ESPACE DE PRODUCTION & GESTION DE VOS PROJETS</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-white">
                                BIENVENUE DANS VOTRE <span className="text-primary-500">ESPACE DCA</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-2 max-w-xl leading-relaxed">
                                Suivez l'état d'avancement de vos designs en temps réel, téléchargez vos livrables finaux et échangez directement avec Franck Dims.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/packages"
                                className="inline-flex items-center gap-2 bg-primary-500 text-black px-5 py-2.5 font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors shrink-0"
                            >
                                <Plus size={14} /> NOUVEAU PROJET / PACK
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ── STATS BAR ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-gray-800 bg-[#0E0E0E] p-5 relative group hover:border-primary-500/50 transition-colors">
                        <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                            <span>01 // COMMANDES</span>
                            <Package size={16} className="text-primary-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-display font-bold text-white mb-1">
                            {stats.total_commandes ?? 0}
                        </p>
                        <p className="text-[11px] font-mono text-gray-400">
                            Prestations & packs souscrits
                        </p>
                    </div>

                    <div className="border border-gray-800 bg-[#0E0E0E] p-5 relative group hover:border-primary-500/50 transition-colors">
                        <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                            <span>02 // EN PRODUCTION</span>
                            <Clock size={16} className="text-blue-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-display font-bold text-blue-400 mb-1">
                            {stats.en_cours ?? 0}
                        </p>
                        <p className="text-[11px] font-mono text-gray-400">
                            Designs en cours de création
                        </p>
                    </div>

                    <div className="border border-gray-800 bg-[#0E0E0E] p-5 relative group hover:border-primary-500/50 transition-colors">
                        <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                            <span>03 // LIVRÉES</span>
                            <CheckCircle2 size={16} className="text-green-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-display font-bold text-green-400 mb-1">
                            {stats.livrees ?? 0}
                        </p>
                        <p className="text-[11px] font-mono text-gray-400">
                            Commandes finalisées
                        </p>
                    </div>

                    <div className="border border-gray-800 bg-[#0E0E0E] p-5 relative group hover:border-primary-500/50 transition-colors">
                        <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-3">
                            <span>04 // FICHIERS SOURCES</span>
                            <Download size={16} className="text-primary-500" />
                        </div>
                        <p className="text-2xl md:text-3xl font-display font-bold text-primary-500 mb-1">
                            {stats.total_livrables ?? 0}
                        </p>
                        <p className="text-[11px] font-mono text-gray-400">
                            Livrables prêts à télécharger
                        </p>
                    </div>
                </div>

                {/* ── COMMANDES EN COURS ── */}
                <div className="border border-gray-800 bg-[#0E0E0E]">
                    <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold">
                                <Crosshair size={12} />
                                <span>SUIVI OPÉRATIONNEL</span>
                            </div>
                            <h2 className="text-base font-display font-bold uppercase tracking-wider text-white mt-0.5">
                                Mes Commandes de Design
                            </h2>
                        </div>

                        <Link
                            href="/client/souscriptions"
                            className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 hover:text-primary-500 transition-colors"
                        >
                            TOUT VOIR ({stats.total_commandes || 0}) <ArrowUpRight size={12} />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-[#141414] text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
                                <tr>
                                    <th className="p-4">RÉFÉRENCE</th>
                                    <th className="p-4">PRESTATION / PACK</th>
                                    <th className="p-4">MONTANT</th>
                                    <th className="p-4">STATUT DE CONCEPTION</th>
                                    <th className="p-4">LIVRAISON ESTIMÉE</th>
                                    <th className="p-4 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-gray-500 text-xs">
                                            Vous n'avez pas encore de commande active. Découvrez nos packs pour lancer votre projet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((sub) => {
                                        const item = sub.service_package || sub.service || {}
                                        return (
                                            <tr key={sub.id} className="hover:bg-[#141414] transition-colors">
                                                <td className="p-4 font-bold text-primary-500">
                                                    {sub.reference}
                                                </td>
                                                <td className="p-4 text-white">
                                                    <span className="px-1.5 py-0.5 border border-gray-800 bg-[#161616] text-[9px] uppercase mr-1.5 text-gray-400">
                                                        {sub.service_package_id ? 'PACK' : 'SERVICE'}
                                                    </span>
                                                    {item.titre || item.nom || 'Sur-mesure'}
                                                </td>
                                                <td className="p-4 font-bold text-gray-300">
                                                    {formatPrix(sub.montant)}
                                                </td>
                                                <td className="p-4">
                                                    {sub.statut_production === 'termine' ? (
                                                        <span className="px-2 py-0.5 text-[9px] bg-green-500/10 text-green-400 border border-green-500/30 uppercase font-bold">
                                                            LIVRÉ & TERMINÉ ✓
                                                        </span>
                                                    ) : sub.statut_production === 'en_cours' ? (
                                                        <span className="px-2 py-0.5 text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase font-bold">
                                                            EN COURS DE CRÉATION ⏳
                                                        </span>
                                                    ) : sub.statut_production === 'en_revision' ? (
                                                        <span className="px-2 py-0.5 text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase font-bold">
                                                            RÉVISION EN COURS ⚡
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 text-[9px] bg-gray-800 text-gray-400 uppercase">
                                                            EN ATTENTE DU BRIEF
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-gray-400 text-[11px]">
                                                    {sub.date_livraison_estimee ? formatDate(sub.date_livraison_estimee) : 'En cours de calcul'}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link
                                                        href={`/client/souscriptions/${sub.id}`}
                                                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary-500 hover:text-black border border-primary-500 px-3 py-1 bg-primary-500/10 hover:bg-primary-500 transition-all"
                                                    >
                                                        SUIVRE <ChevronRight size={10} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── COFFRE-FORT DES LIVRABLES RÉCENTS ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-6">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-0.5">
                                <Download size={12} />
                                <span>COFFRE-FORT DE FICHIERS</span>
                            </div>
                            <h2 className="text-base font-display font-bold uppercase tracking-wider text-white">
                                Derniers Fichiers & Livrables Remis
                            </h2>
                        </div>
                    </div>

                    {recentDeliverables.length === 0 ? (
                        <p className="text-gray-500 text-xs font-mono py-6 text-center">
                            Vos fichiers sources et exports HD apparaîtront ici dès que Franck Dims aura finalisé votre commande.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentDeliverables.map((liv) => (
                                <div key={liv.id} className="p-4 border border-gray-800 bg-[#141414] hover:border-primary-500 transition-colors flex flex-col justify-between space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 border border-gray-800 bg-[#181818] text-primary-500 flex items-center justify-center shrink-0">
                                            <FileText size={18} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-white text-xs uppercase truncate">{liv.nom}</h4>
                                            <p className="text-[10px] font-mono text-gray-500 truncate mt-0.5">
                                                {liv.fichier_nom_original} • {liv.taille_formattee}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-gray-800/80 font-mono text-[10px]">
                                        <span className="text-gray-500">{formatDate(liv.created_at)}</span>
                                        <a
                                            href={`/storage/${liv.fichier_path}`}
                                            target="_blank"
                                            download
                                            className="inline-flex items-center gap-1 text-primary-500 hover:text-primary-400 font-bold uppercase"
                                        >
                                            <Download size={12} /> TÉLÉCHARGER
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </ClientLayout>
    )
}
