import { Link, Head } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    ShoppingBag,
    Clock,
    CheckCircle2,
    DownloadCloud,
    FileText,
    ArrowRight,
    MessageSquareText,
    Sparkles,
    Eye,
    PlusCircle,
    Receipt,
    ExternalLink,
    HelpCircle
} from 'lucide-react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export default function Dashboard({
    stats = {},
    currentOrder = null,
    recentOrders = [],
    recentDeliverables = [],
    whatsappNumber = "237690112233"
}) {

    const getStatusBadge = (status) => {
        switch (status) {
            case 'termine':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">✓ Livré & Terminé</span>
            case 'en_cours':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">🎨 En cours de création</span>
            case 'en_revision':
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">⚡ En révision</span>
            default:
                return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-700/40 text-slate-300 border border-slate-700">⏳ En attente</span>
        }
    }

    return (
        <ClientLayout title="Tableau de bord">
            <Head title="Tableau de bord — Espace Client" />

            <div className="space-y-8">

                {/* ══════════════════════════════════════════════════
                    § 1 – WELCOME BANNER
                ══════════════════════════════════════════════════ */}
                <div className="relative rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/20 p-6 md:p-8 overflow-hidden shadow-xl">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                                <Sparkles size={14} />
                                <span>Bienvenue dans votre studio DCA</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                Suivez l'avancement de vos <span className="text-amber-400">projets de design</span>
                            </h1>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Retrouvez vos créations en cours, téléchargez vos livrables finaux et échangez directement avec votre designer en toute simplicité.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/packages"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
                            >
                                <PlusCircle size={17} />
                                <span>Commander une prestation</span>
                            </Link>

                            <Link
                                href="/client/livrables"
                                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-white font-medium text-sm border border-slate-700 transition-all"
                            >
                                <DownloadCloud size={16} />
                                <span>Mes Livrables ({stats.total_livrables || 0})</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – 4 STATS CARDS
                ══════════════════════════════════════════════════ */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {/* Projets en cours */}
                    <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800/80 hover:border-indigo-500/40 transition-all shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400">En Production</span>
                            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                                <Clock size={18} />
                            </div>
                        </div>
                        <p className="text-2xl md:text-3xl font-extrabold text-white">
                            {stats.en_cours ?? 0}
                        </p>
                        <p className="text-xs text-indigo-400 mt-1 font-medium">
                            Designs en cours de création
                        </p>
                    </div>

                    {/* Livrables Prêts */}
                    <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400">Livrables Prêts</span>
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                <CheckCircle2 size={18} />
                            </div>
                        </div>
                        <p className="text-2xl md:text-3xl font-extrabold text-white">
                            {stats.total_livrables ?? 0}
                        </p>
                        <p className="text-xs text-emerald-400 mt-1 font-medium">
                            Fichiers HD & exports téléchargeables
                        </p>
                    </div>

                    {/* Commandes Totales */}
                    <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800/80 hover:border-amber-500/40 transition-all shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400">Total Commandes</span>
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                                <ShoppingBag size={18} />
                            </div>
                        </div>
                        <p className="text-2xl md:text-3xl font-extrabold text-white">
                            {stats.total_commandes ?? 0}
                        </p>
                        <p className="text-xs text-amber-400 mt-1 font-medium">
                            Prestations et abonnements
                        </p>
                    </div>

                    {/* Total Investi */}
                    <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800/80 hover:border-slate-700 transition-all shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-400">Factures Réglées</span>
                            <div className="w-9 h-9 rounded-xl bg-slate-800 text-slate-300 flex items-center justify-center">
                                <Receipt size={18} />
                            </div>
                        </div>
                        <p className="text-xl md:text-2xl font-extrabold text-white truncate">
                            {formatPrix(stats.total_investi)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 font-medium">
                            Paiements sécurisés CinetPay
                        </p>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 3 – PROJET EN COURS (STEPPER VISUEL)
                ══════════════════════════════════════════════════ */}
                {currentOrder && (
                    <div className="p-6 md:p-8 rounded-3xl bg-[#14171F] border border-slate-800/90 shadow-md space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
                            <div>
                                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">
                                    Commande Active
                                </span>
                                <h3 className="text-lg md:text-xl font-bold text-white mt-0.5">
                                    {currentOrder.servicePackage?.titre || currentOrder.service?.titre || 'Prestation de Design'}
                                </h3>
                                <p className="text-xs text-slate-400 mt-1">
                                    Réf : <strong className="text-slate-200">{currentOrder.reference}</strong> • Commandé le {formatDate(currentOrder.created_at)}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {getStatusBadge(currentOrder.statut_production)}
                                <Link
                                    href={`/client/souscriptions/${currentOrder.id}`}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                                >
                                    <span>Ouvrir la fiche</span>
                                    <ArrowRight size={14} />
                                </Link>
                            </div>
                        </div>

                        {/* Stepper de Progression Graphique */}
                        <div className="py-2">
                            <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
                                {[
                                    { step: 1, label: '1. Briefing', desc: 'Validé', active: true, done: true },
                                    { step: 2, label: '2. Création', desc: 'En cours', active: currentOrder.statut_production !== 'non_demarre', done: ['en_cours', 'en_revision', 'termine'].includes(currentOrder.statut_production) },
                                    { step: 3, label: '3. Révisions', desc: 'Ajustements', active: ['en_revision', 'termine'].includes(currentOrder.statut_production), done: ['termine'].includes(currentOrder.statut_production) },
                                    { step: 4, label: '4. Livraison', desc: 'Fichiers finaux', active: currentOrder.statut_production === 'termine', done: currentOrder.statut_production === 'termine' },
                                ].map((s) => (
                                    <div key={s.step} className="flex flex-col items-center text-center space-y-2">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                                            s.done
                                                ? 'bg-emerald-500 text-black ring-4 ring-emerald-500/20'
                                                : s.active
                                                ? 'bg-amber-400 text-black ring-4 ring-amber-400/20 animate-pulse'
                                                : 'bg-slate-800 text-slate-500'
                                        }`}>
                                            {s.done ? '✓' : s.step}
                                        </div>
                                        <div>
                                            <p className={`text-xs font-bold ${s.active ? 'text-white' : 'text-slate-500'}`}>
                                                {s.label}
                                            </p>
                                            <p className="text-[10px] text-slate-400 hidden sm:block">
                                                {s.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Raccourcis rapides commande */}
                        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2 text-slate-400">
                                <MessageSquareText size={15} className="text-amber-400" />
                                <span>{currentOrder.messages?.length || 0} messages échangés</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={`/invoices/${currentOrder.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-slate-300 hover:text-white flex items-center gap-1 font-medium"
                                >
                                    <FileText size={13} />
                                    <span>Télécharger la facture</span>
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════
                    § 4 – GRILLE : DERNIERS LIVRABLES & COMMANDES
                ══════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Derniers Livrables Reçus */}
                    <div className="p-6 rounded-3xl bg-[#14171F] border border-slate-800/80 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DownloadCloud size={18} className="text-emerald-400" />
                                <h3 className="text-base font-bold text-white">Derniers Livrables Déposés</h3>
                            </div>
                            <Link href="/client/livrables" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                                <span>Voir tout</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        {recentDeliverables.length === 0 ? (
                            <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
                                <p>Vos fichiers livrables apparaîtront ici dès que le designer aura finalisé vos créations.</p>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {recentDeliverables.map((livrable) => (
                                    <div
                                        key={livrable.id}
                                        className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-emerald-500/30 flex items-center justify-between gap-3 transition-all"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-white truncate">
                                                {livrable.nom}
                                            </p>
                                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                                {livrable.fichier_nom_original || 'Fichier de livraison'} • {formatDate(livrable.created_at)}
                                            </p>
                                        </div>

                                        <a
                                            href={`/storage/${livrable.fichier_path}`}
                                            download
                                            target="_blank"
                                            rel="noreferrer"
                                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black font-semibold text-xs transition-all shrink-0 flex items-center gap-1.5"
                                        >
                                            <DownloadCloud size={13} />
                                            <span>Télécharger</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Historique des Commandes Récentes */}
                    <div className="p-6 rounded-3xl bg-[#14171F] border border-slate-800/80 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ShoppingBag size={18} className="text-amber-400" />
                                <h3 className="text-base font-bold text-white">Commandes Récentes</h3>
                            </div>
                            <Link href="/client/souscriptions" className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1">
                                <span>Voir tout</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        {recentOrders.length === 0 ? (
                            <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
                                <p>Vous n'avez pas encore passé de commande.</p>
                                <Link href="/packages" className="inline-block mt-3 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs">
                                    Découvrir les packs
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        href={`/client/souscriptions/${order.id}`}
                                        className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-400/40 flex items-center justify-between gap-3 transition-all block group"
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                                                    {order.servicePackage?.titre || order.service?.titre || 'Prestation'}
                                                </p>
                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    #{order.reference}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 mt-0.5">
                                                {formatDate(order.created_at)} • {formatPrix(order.montant || order.servicePackage?.prix || order.service?.prix)}
                                            </p>
                                        </div>

                                        <div className="shrink-0 flex items-center gap-2">
                                            {getStatusBadge(order.statut_production)}
                                            <ArrowRight size={14} className="text-slate-500 group-hover:text-white transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </ClientLayout>
    )
}
