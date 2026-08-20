import { Link, Head, router } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    ShoppingBag,
    Search,
    Clock,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    Calendar,
    Receipt
} from 'lucide-react'
import { useState } from 'react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export default function Index({
    subscriptions = { data: [] },
    filters = {},
    counts = {},
    whatsappNumber = "237690112233"
}) {
    const [search, setSearch] = useState(filters.search || '')
    const [currentStatus, setCurrentStatus] = useState(filters.status || '')

    const handleFilter = (st) => {
        setCurrentStatus(st)
        router.get(route('client.souscriptions.index'), {
            status: st || undefined,
            search: search || undefined
        }, { preserveState: true, replace: true })
    }

    const handleSearch = (e) => {
        e.preventDefault()
        router.get(route('client.souscriptions.index'), {
            status: currentStatus || undefined,
            search: search || undefined
        }, { preserveState: true, replace: true })
    }

    const statusTabs = [
        { key: '', label: 'Toutes les commandes', count: counts.all },
        { key: 'en_cours', label: 'En création', count: counts.en_cours },
        { key: 'en_revision', label: 'En révision', count: counts.en_revision },
        { key: 'termine', label: 'Livrées & Clôturées', count: counts.termine },
    ]

    const getStatusBadge = (sub) => {
        const p = sub.statut_production
        if (p === 'termine') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={13} /> Livré & Terminé
                </span>
            )
        }
        if (p === 'en_revision') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    <Clock size={13} /> En révision
                </span>
            )
        }
        if (p === 'en_cours') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20">
                    <Clock size={13} /> En création
                </span>
            )
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700">
                <Clock size={13} /> Initialisation
            </span>
        )
    }

    return (
        <ClientLayout title="Mes Commandes & Projets">
            <Head title="Mes Commandes — Espace Client" />

            <div className="w-full space-y-6">

                {/* ══════════════════════════════════════════════════
                    § 1 – HEADER
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Mes Commandes & Prestations
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Suivez l'état d'avancement et échangez sur chacun de vos projets de design.
                        </p>
                    </div>

                    <a
                        href="/#packages"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-md shadow-primary-500/20 transition-all shrink-0"
                    >
                        <Sparkles size={14} />
                        <span>Commander un nouveau pack</span>
                    </a>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – FILTRES & RECHERCHE
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                    {/* Onglets Filtres */}
                    <div className="flex flex-wrap gap-2">
                        {statusTabs.map((tab) => {
                            const isActive = currentStatus === tab.key
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => handleFilter(tab.key)}
                                    className={`
                                        inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer
                                        ${isActive
                                            ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                                            : 'bg-white dark:bg-[#121212] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
                                        }
                                    `}
                                >
                                    <span>{tab.label}</span>
                                    {tab.count !== undefined && (
                                        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            isActive ? 'bg-white/25 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                        }`}>
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* Barre de Recherche */}
                    <form onSubmit={handleSearch} className="relative w-full md:w-64">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher une commande..."
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 focus:border-primary-500 text-neutral-900 dark:text-white text-xs placeholder-neutral-400 focus:ring-0 transition-colors"
                        />
                        <Search size={14} className="absolute left-3 top-3 text-neutral-400" />
                    </form>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 3 – LISTE DES COMMANDES
                ══════════════════════════════════════════════════ */}
                {subscriptions.data.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                            <ShoppingBag size={24} />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">Aucune commande trouvée</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                            Vous n'avez aucune commande correspondant aux critères sélectionnés.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {subscriptions.data.map((sub) => {
                            const title = sub.servicePackage?.titre || sub.service?.titre || 'Design sur mesure'
                            const price = sub.payment?.amount || sub.montant || sub.servicePackage?.prix || sub.service?.prix

                            return (
                                <div
                                    key={sub.id}
                                    className="p-6 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 hover:border-primary-500/40 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                                >
                                    <div className="space-y-2 max-w-xl">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="font-mono text-xs font-bold text-primary-500">
                                                #{sub.reference}
                                            </span>
                                            {getStatusBadge(sub)}
                                        </div>

                                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                                            {title}
                                        </h3>

                                        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={13} />
                                                <span>Commandé le {formatDate(sub.created_at)}</span>
                                            </span>
                                            <span>•</span>
                                            <span className="font-bold text-neutral-900 dark:text-white">
                                                {formatPrix(price)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                                        <a
                                            href={`/invoices/${sub.id}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold text-xs transition-colors"
                                        >
                                            <Receipt size={14} />
                                            <span>Facture</span>
                                        </a>

                                        <Link
                                            href={`/client/souscriptions/${sub.id}`}
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-md shadow-primary-500/20 transition-all"
                                        >
                                            <span>Suivre le projet</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

            </div>
        </ClientLayout>
    )
}
