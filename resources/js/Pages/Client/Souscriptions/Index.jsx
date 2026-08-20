import { Link, Head, router } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    ShoppingBag,
    Search,
    Filter,
    ArrowRight,
    DownloadCloud,
    FileText,
    MessageSquareText,
    Clock,
    CheckCircle2,
    Sparkles,
    PlusCircle,
    Receipt
} from 'lucide-react'
import { useState } from 'react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

export default function Index({
    souscriptions = { data: [] },
    filters = {},
    counts = {},
    whatsappNumber = "237690112233"
}) {
    const [search, setSearch] = useState(filters.search || '')
    const [currentStatut, setCurrentStatut] = useState(filters.statut || '')

    const handleFilterChange = (statut) => {
        setCurrentStatut(statut)
        router.get(route('client.souscriptions.index'), {
            statut: statut || undefined,
            search: search || undefined
        }, { preserveState: true, replace: true })
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        router.get(route('client.souscriptions.index'), {
            statut: currentStatut || undefined,
            search: search || undefined
        }, { preserveState: true, replace: true })
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'termine':
                return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">✓ Livré & Terminé</span>
            case 'en_cours':
                return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">🎨 En cours de création</span>
            case 'en_revision':
                return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">⚡ En révision</span>
            default:
                return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-700/40 text-slate-300 border border-slate-700">⏳ En attente</span>
        }
    }

    const tabs = [
        { key: '', label: 'Toutes les commandes', count: counts.all || 0 },
        { key: 'en_cours', label: 'En création', count: counts.en_cours || 0 },
        { key: 'en_revision', label: 'En révision', count: counts.en_revision || 0 },
        { key: 'termine', label: 'Livrées', count: counts.termine || 0 },
    ]

    return (
        <ClientLayout title="Mes Commandes & Projets">
            <Head title="Mes Commandes — Espace Client" />

            <div className="space-y-6">

                {/* ══════════════════════════════════════════════════
                    § 1 – HEADER & ACTION
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            Mes Commandes & Abonnements
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Retrouvez l'historique complet de vos prestations et suivez l'avancement en temps réel.
                        </p>
                    </div>

                    <Link
                        href="/packages"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
                    >
                        <PlusCircle size={15} />
                        <span>Nouvelle commande</span>
                    </Link>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – BARRE DE FILTRES & RECHERCHE
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    {/* Tabs statut */}
                    <div className="flex flex-wrap gap-2">
                        {tabs.map((tab) => {
                            const isActive = currentStatut === tab.key
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => handleFilterChange(tab.key)}
                                    className={`
                                        flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all
                                        ${isActive
                                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                                        }
                                    `}
                                >
                                    <span>{tab.label}</span>
                                    <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-bold ${
                                        isActive ? 'bg-black/20 text-slate-950' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Recherche */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher référence ou titre..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-white text-xs placeholder-slate-500 focus:ring-0 transition-colors"
                        />
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                    </form>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 3 – LISTE DES COMMANDES
                ══════════════════════════════════════════════════ */}
                {souscriptions.data.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-[#14171F] border border-slate-800/80 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                            <ShoppingBag size={24} />
                        </div>
                        <h3 className="text-base font-bold text-white">Aucune commande trouvée</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Vous n'avez aucune commande correspondant aux critères de recherche actuels.
                        </p>
                        <Link
                            href="/packages"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-md hover:bg-amber-300 transition-colors"
                        >
                            <span>Découvrir nos offres & packs</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {souscriptions.data.map((sub) => {
                            const title = sub.servicePackage?.titre || sub.service?.titre || 'Prestation de Design'
                            const price = sub.payment?.amount || sub.montant || sub.servicePackage?.prix || sub.service?.prix
                            const hasDeliverables = (sub.livrables?.length || 0) > 0

                            return (
                                <div
                                    key={sub.id}
                                    className="p-5 md:p-6 rounded-3xl bg-[#14171F] border border-slate-800/80 hover:border-slate-700 transition-all shadow-sm space-y-4"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2.5">
                                                <h3 className="text-base md:text-lg font-bold text-white">
                                                    {title}
                                                </h3>
                                                <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                                                    #{sub.reference}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400">
                                                Commandé le <strong className="text-slate-300">{formatDate(sub.created_at)}</strong> • Montant : <strong className="text-amber-400">{formatPrix(price)}</strong>
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 self-start md:self-auto">
                                            {getStatusBadge(sub.statut_production)}
                                        </div>
                                    </div>

                                    {/* Informations & Actions */}
                                    <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                                        <div className="flex items-center gap-4 text-slate-400">
                                            <span className="flex items-center gap-1.5">
                                                <MessageSquareText size={14} className="text-amber-400" />
                                                <span>{sub.messages?.length || 0} messages</span>
                                            </span>

                                            <span className="flex items-center gap-1.5">
                                                <DownloadCloud size={14} className={hasDeliverables ? 'text-emerald-400' : 'text-slate-500'} />
                                                <span>{sub.livrables?.length || 0} livrables</span>
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <a
                                                href={`/invoices/${sub.id}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium transition-colors"
                                            >
                                                <FileText size={13} />
                                                <span>Facture</span>
                                            </a>

                                            <Link
                                                href={`/client/souscriptions/${sub.id}`}
                                                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold shadow-xs transition-colors"
                                            >
                                                <span>Détails & Discussion</span>
                                                <ArrowRight size={13} />
                                            </Link>
                                        </div>
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
