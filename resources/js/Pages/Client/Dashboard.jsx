import { Link, Head } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    ShoppingBag,
    DownloadCloud,
    Clock,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    FileText,
    FolderDown,
    Activity,
    ExternalLink
} from 'lucide-react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export default function Dashboard({
    stats = {},
    activeSubscription = null,
    recentSubscriptions = [],
    latestDeliverables = [],
    whatsappNumber = "237690112233"
}) {
    const steps = [
        { key: 'brief', label: '1. Brief validé', desc: 'Cahier des charges' },
        { key: 'creation', label: '2. En création', desc: 'Direction artistique' },
        { key: 'revision', label: '3. Révisions', desc: 'Ajustements & retours' },
        { key: 'livre', label: '4. Livré & Clôturé', desc: 'Fichiers finaux HD' },
    ]

    const getStepIndex = (status) => {
        if (!status || status === 'attente_brief') return 0
        if (status === 'en_cours') return 1
        if (status === 'en_revision') return 2
        if (status === 'termine') return 3
        return 0
    }

    const currentStepIdx = getStepIndex(activeSubscription?.statut_production)

    return (
        <ClientLayout title="Tableau de bord">
            <Head title="Espace Client — Dims Creative Academy" />

            <div className="w-full space-y-8">

                {/* ══════════════════════════════════════════════════
                    § 1 – BANNIÈRE DE BIENVENUE
                ══════════════════════════════════════════════════ */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 dark:from-[#141414] dark:to-[#1a1a1a] text-white p-6 md:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/20 border border-primary-500/40 text-primary-400 text-xs font-bold">
                                <Sparkles size={13} />
                                <span>Dims Creative Academy • Studio de Design</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                                Bienvenue sur votre Espace Client
                            </h1>
                            <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">
                                Suivez l'avancement de vos identités visuelles, téléchargez vos livrables finaux et échangez directement avec votre designer.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <a
                                href="/#packages"
                                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-lg shadow-primary-500/25 transition-all cursor-pointer"
                            >
                                <ShoppingBag size={15} />
                                <span>Commander un Pack</span>
                            </a>
                            <a
                                href={`https://wa.me/${whatsappNumber}?text=Bonjour%20Franck,%20je%20vous%20contacte%20depuis%20mon%20espace%20client.`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs transition-colors"
                            >
                                <span>Assistance WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – CARTES DE STATISTIQUES
                ══════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Stat 1 : En Production */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">En Production</p>
                            <p className="text-2xl font-black text-primary-500 mt-1">{stats.en_cours || 0}</p>
                            <p className="text-[11px] text-neutral-400 mt-1">Projets actifs en cours</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-primary-500/10 text-primary-500 flex items-center justify-center">
                            <Activity size={22} />
                        </div>
                    </div>

                    {/* Stat 2 : Livrables */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Livrables Prêts</p>
                            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{stats.livrables || 0}</p>
                            <p className="text-[11px] text-neutral-400 mt-1">Fichiers finaux disponibles</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                            <DownloadCloud size={22} />
                        </div>
                    </div>

                    {/* Stat 3 : Total Commandes */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Commandes</p>
                            <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1">{stats.total || 0}</p>
                            <p className="text-[11px] text-neutral-400 mt-1">Depuis votre inscription</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center">
                            <ShoppingBag size={22} />
                        </div>
                    </div>

                    {/* Stat 4 : Factures */}
                    <div className="p-6 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-xs flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Factures Réglées</p>
                            <p className="text-2xl font-black text-neutral-900 dark:text-white mt-1">{stats.payees || 0}</p>
                            <p className="text-[11px] text-neutral-400 mt-1">Reçus disponibles</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 flex items-center justify-center">
                            <FileText size={22} />
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 3 – PROJET ACTIF EN COURS (STEPPER)
                ══════════════════════════════════════════════════ */}
                {activeSubscription && (
                    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
                            <div>
                                <span className="text-[11px] font-bold text-primary-500 uppercase tracking-wider">
                                    Projet Actif en Production
                                </span>
                                <h2 className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white mt-0.5">
                                    {activeSubscription.servicePackage?.titre || activeSubscription.service?.titre || 'Design Sur Mesure'}
                                </h2>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                    Commande #{activeSubscription.reference} • Lancée le {formatDate(activeSubscription.created_at)}
                                </p>
                            </div>

                            <Link
                                href={`/client/souscriptions/${activeSubscription.id}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-primary-500 hover:text-white text-neutral-800 dark:text-neutral-200 font-bold text-xs transition-all self-start sm:self-auto"
                            >
                                <span>Voir le suivi complet</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* Stepper Visuel 4 Étapes */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                            {steps.map((st, idx) => {
                                const isDone = idx <= currentStepIdx
                                const isCurrent = idx === currentStepIdx

                                return (
                                    <div
                                        key={st.key}
                                        className={`p-4 rounded-2xl border transition-all ${
                                            isCurrent
                                                ? 'bg-primary-500/10 border-primary-500/40 text-primary-600 dark:text-primary-400'
                                                : isDone
                                                ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800/80 text-neutral-400'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 mb-1.5">
                                            {isDone ? (
                                                <CheckCircle2 size={16} className={isCurrent ? 'text-primary-500' : 'text-emerald-500'} />
                                            ) : (
                                                <Clock size={16} />
                                            )}
                                            <span className="text-xs font-bold">{st.label}</span>
                                        </div>
                                        <p className="text-[11px] opacity-80">{st.desc}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ══════════════════════════════════════════════════
                    § 4 – GRILLE 2 COLONNES : LIVRABLES & COMMANDES
                ══════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Colonne Gauche : Derniers Livrables */}
                    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
                        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                            <div>
                                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                                    Derniers Livrables Disponibles
                                </h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                    Téléchargez vos maquettes et fichiers finaux
                                </p>
                            </div>

                            <Link
                                href="/client/livrables"
                                className="text-xs text-primary-500 hover:text-primary-600 font-bold flex items-center gap-1"
                            >
                                <span>Tout voir</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        {latestDeliverables.length === 0 ? (
                            <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-dashed border-neutral-200 dark:border-neutral-800 space-y-2">
                                <FolderDown size={28} className="mx-auto text-neutral-400" />
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                                    Aucun livrable disponible pour le moment.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {latestDeliverables.map((liv) => (
                                    <div
                                        key={liv.id}
                                        className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between gap-4 hover:border-primary-500/40 transition-colors"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{liv.nom}</p>
                                            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                                                Ajouté le {formatDate(liv.created_at)}
                                            </p>
                                        </div>

                                        <a
                                            href={`/storage/${liv.fichier_path}`}
                                            download
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-sm transition-all shrink-0"
                                        >
                                            <DownloadCloud size={13} />
                                            <span>Télécharger</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colonne Droite : Commandes Récentes */}
                    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
                        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                            <div>
                                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                                    Historique des Commandes
                                </h3>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                    Vos packs et prestations de design
                                </p>
                            </div>

                            <Link
                                href="/client/souscriptions"
                                className="text-xs text-primary-500 hover:text-primary-600 font-bold flex items-center gap-1"
                            >
                                <span>Tout voir</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        {recentSubscriptions.length === 0 ? (
                            <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-dashed border-neutral-200 dark:border-neutral-800 space-y-2">
                                <ShoppingBag size={28} className="mx-auto text-neutral-400" />
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                                    Aucune commande enregistrée.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentSubscriptions.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between gap-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                                                {sub.servicePackage?.titre || sub.service?.titre || 'Design'}
                                            </p>
                                            <p className="text-[11px] text-neutral-500 mt-0.5">
                                                Réf: #{sub.reference} • {formatPrix(sub.payment?.amount || sub.montant)}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/client/souscriptions/${sub.id}`}
                                            className="px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-primary-500 hover:text-white text-neutral-800 dark:text-neutral-200 font-bold text-xs transition-colors shrink-0"
                                        >
                                            Détails
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </ClientLayout>
    )
}
