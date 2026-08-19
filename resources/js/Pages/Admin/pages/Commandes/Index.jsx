import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    CheckSquare,
    FolderKanban,
    List,
    Clock,
    Search,
    User,
    Package,
    Calendar,
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Download,
    Eye,
    MessageCircle,
    ChevronRight,
    Terminal,
    Crosshair,
    Plus
} from 'lucide-react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'

const COLUMNS = [
    { id: 'non_demarre', label: 'EN ATTENTE DU BRIEF', color: 'border-gray-700 text-gray-400', badge: 'bg-gray-800 text-gray-400' },
    { id: 'en_cours',    label: 'EN COURS DE CRÉATION', color: 'border-blue-500 text-blue-400', badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/30' },
    { id: 'en_revision', label: 'EN COURS DE RÉVISION', color: 'border-amber-500 text-amber-400', badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/30' },
    { id: 'termine',     label: 'LIVRÉES & TERMINÉES',  color: 'border-green-500 text-green-400', badge: 'bg-green-500/10 text-green-400 border border-green-500/30' },
]

export default function CommandesIndex({ commandes = { data: [] }, kanban = {}, filters = {}, stats = {} }) {
    const [view, setView] = useState(filters.view || 'kanban')
    const [search, setSearch] = useState(filters.search || '')

    const handleSearch = (e) => {
        e.preventDefault()
        router.get(route('admin.commandes.index'), { search, view }, { preserveState: true, replace: true })
    }

    const switchView = (newView) => {
        setView(newView)
        router.get(route('admin.commandes.index'), { search, view: newView }, { preserveState: true, replace: true })
    }

    const changeStatus = (commandeId, newStatus) => {
        router.patch(route('admin.commandes.quick-status', commandeId), {
            statut_production: newStatus
        }, { preserveScroll: true })
    }

    return (
        <AdminLayout title="Gestion des Commandes de Design">
            <div className="space-y-8">

                {/* ── HEADER BANNER ── */}
                <div className="relative border border-gray-800 bg-[#0E0E0E] p-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary-500"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary-500"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary-500"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary-500"></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-1">
                                <Terminal size={12} />
                                <span>CENTRE DE CONTRÔLE DE PRODUCTION</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                                TÂCHES & <span className="text-primary-500">COMMANDES DE DESIGN</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-1">
                                Pilotage opérationnel du flux graphique, transitions d'états Kanban et expédition des livrables.
                            </p>
                        </div>

                        {/* Switcher Vue Kanban / Liste */}
                        <div className="flex items-center gap-2 bg-[#141414] border border-gray-800 p-1 self-start sm:self-auto">
                            <button
                                onClick={() => switchView('kanban')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                                    view === 'kanban' ? 'bg-primary-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <FolderKanban size={14} /> KANBAN
                            </button>
                            <button
                                onClick={() => switchView('list')}
                                className={`flex items-center gap-1.5 px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                                    view === 'list' ? 'bg-primary-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <List size={14} /> TABLEAU
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── STATS BAR ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">TOTAL COMMANDES</span>
                        <div className="text-2xl font-bold font-display text-white">{stats.total ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">EN CRÉATION</span>
                        <div className="text-2xl font-bold font-display text-blue-400">{stats.en_cours ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">EN RÉVISION</span>
                        <div className="text-2xl font-bold font-display text-amber-400">{stats.en_revision ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">LIVRÉES & TERMINÉES</span>
                        <div className="text-2xl font-bold font-display text-green-400">{stats.termine ?? 0}</div>
                    </div>
                </div>

                {/* ── RECHERCHE ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par référence, client ou email..."
                                className="w-full bg-[#141414] border border-gray-800 pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-gray-600 focus:border-primary-500 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#141414] border border-gray-800 hover:border-primary-500 text-gray-300 hover:text-white text-xs font-mono font-bold uppercase transition-colors"
                        >
                            FILTRER
                        </button>
                    </form>
                </div>

                {/* ── VUE KANBAN ── */}
                {view === 'kanban' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                        {COLUMNS.map((col) => {
                            const items = kanban[col.id] || []
                            return (
                                <div key={col.id} className="border border-gray-800 bg-[#0A0A0A] flex flex-col">
                                    {/* Header Colonne */}
                                    <div className="p-3.5 border-b border-gray-800 bg-[#101010] flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${col.color}`}>
                                                {col.label}
                                            </span>
                                        </div>
                                        <span className="w-5 h-5 bg-[#181818] border border-gray-800 font-mono text-[10px] font-bold text-gray-300 flex items-center justify-center">
                                            {items.length}
                                        </span>
                                    </div>

                                    {/* Cartes Kanban */}
                                    <div className="p-3 space-y-3 flex-1 min-h-[400px] overflow-y-auto max-h-[70vh]">
                                        {items.length === 0 ? (
                                            <div className="h-32 border border-dashed border-gray-800/80 flex items-center justify-center text-[10px] font-mono text-gray-600">
                                                AUCUNE COMMANDE
                                            </div>
                                        ) : (
                                            items.map((cmd) => {
                                                const item = cmd.service_package || cmd.service || {}
                                                return (
                                                    <div
                                                        key={cmd.id}
                                                        className="border border-gray-800 hover:border-primary-500/80 bg-[#121212] p-4 transition-all duration-200 space-y-3 group relative"
                                                    >
                                                        {/* Réf & Montant */}
                                                        <div className="flex items-center justify-between font-mono text-[10px]">
                                                            <span className="font-bold text-primary-500">
                                                                #{cmd.reference}
                                                            </span>
                                                            <span className="text-gray-400 font-bold">
                                                                {formatPrix(cmd.montant)}
                                                            </span>
                                                        </div>

                                                        {/* Prestation & Client */}
                                                        <div>
                                                            <h4 className="text-xs font-bold text-white uppercase group-hover:text-primary-400 transition-colors line-clamp-1">
                                                                {item.titre || item.nom || 'Sur-mesure'}
                                                            </h4>
                                                            <p className="text-[11px] font-mono text-gray-400 flex items-center gap-1 mt-1">
                                                                <User size={10} className="text-gray-500" />
                                                                <span className="truncate">{cmd.client_nom || cmd.user?.name || 'Client'}</span>
                                                            </p>
                                                        </div>

                                                        {/* Délais & Livrables count */}
                                                        <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between font-mono text-[10px] text-gray-500">
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={11} />
                                                                {cmd.date_livraison_estimee ? formatDate(cmd.date_livraison_estimee) : 'Non planifié'}
                                                            </span>
                                                            <span>
                                                                {cmd.livrables?.length || 0} livrable(s)
                                                            </span>
                                                        </div>

                                                        {/* Actions de changement rapide de statut */}
                                                        <div className="pt-2 flex items-center justify-between gap-1 border-t border-gray-800/50">
                                                            <select
                                                                value={cmd.statut_production}
                                                                onChange={(e) => changeStatus(cmd.id, e.target.value)}
                                                                className="bg-[#181818] border border-gray-800 text-[9px] font-mono text-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none"
                                                            >
                                                                <option value="non_demarre">→ Brief</option>
                                                                <option value="en_cours">→ En création</option>
                                                                <option value="en_revision">→ En révision</option>
                                                                <option value="termine">→ Terminé</option>
                                                            </select>

                                                            <Link
                                                                href={route('admin.souscriptions.show', cmd.id)}
                                                                className="p-1.5 border border-gray-800 hover:border-primary-500 text-gray-400 hover:text-white transition-colors"
                                                                title="Ouvrir la commande"
                                                            >
                                                                <ChevronRight size={12} />
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    /* ── VUE TABLEAU ── */
                    <div className="border border-gray-800 bg-[#0E0E0E] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                                <thead className="bg-[#141414] text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
                                    <tr>
                                        <th className="p-4">RÉFÉRENCE</th>
                                        <th className="p-4">CLIENT</th>
                                        <th className="p-4">PRESTATION / PACK</th>
                                        <th className="p-4">MONTANT</th>
                                        <th className="p-4">STATUT PRODUCTION</th>
                                        <th className="p-4">LIVRAISON ESTIMÉE</th>
                                        <th className="p-4 text-right">ACTION</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/60">
                                    {commandes.data?.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="p-8 text-center text-gray-500">
                                                Aucune commande trouvée.
                                            </td>
                                        </tr>
                                    ) : (
                                        commandes.data?.map((cmd) => {
                                            const item = cmd.service_package || cmd.service || {}
                                            return (
                                                <tr key={cmd.id} className="hover:bg-[#141414] transition-colors">
                                                    <td className="p-4 font-bold text-primary-500">
                                                        #{cmd.reference}
                                                    </td>
                                                    <td className="p-4 text-white">
                                                        {cmd.client_nom || cmd.user?.name || '—'}
                                                        <span className="block text-[10px] text-gray-500">{cmd.client_email || cmd.user?.email}</span>
                                                    </td>
                                                    <td className="p-4 text-gray-300">
                                                        {item.titre || item.nom || 'Sur-mesure'}
                                                    </td>
                                                    <td className="p-4 font-bold text-white">
                                                        {formatPrix(cmd.montant)}
                                                    </td>
                                                    <td className="p-4">
                                                        <select
                                                            value={cmd.statut_production}
                                                            onChange={(e) => changeStatus(cmd.id, e.target.value)}
                                                            className="bg-[#161616] border border-gray-800 text-[10px] font-mono text-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none"
                                                        >
                                                            <option value="non_demarre">En attente brief</option>
                                                            <option value="en_cours">En création</option>
                                                            <option value="en_revision">En révision</option>
                                                            <option value="termine">Terminé</option>
                                                        </select>
                                                    </td>
                                                    <td className="p-4 text-gray-400">
                                                        {cmd.date_livraison_estimee ? formatDate(cmd.date_livraison_estimee) : '—'}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <Link
                                                            href={route('admin.souscriptions.show', cmd.id)}
                                                            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary-500 hover:text-black border border-primary-500 px-3 py-1 bg-primary-500/10 hover:bg-primary-500 transition-all"
                                                        >
                                                            GÉRER <ChevronRight size={10} />
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
                )}

            </div>
        </AdminLayout>
    )
}
