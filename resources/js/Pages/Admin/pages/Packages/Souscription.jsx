// resources/js/Pages/Admin/pages/Packages/Souscription.jsx
import { useState } from 'react'
import { router, Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    Search, Filter, Users, TrendingUp, Clock, CheckCircle2,
    ChevronRight, Mail, Phone, MessageCircle, Package,
    Calendar, AlertCircle, RefreshCw, Eye, Download,
    CreditCard, BarChart3, Inbox, Terminal, DollarSign, Sparkles, ChevronLeft
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────
const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'
const formatDateTime = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—'

const STATUT_PAIEMENT_CONFIG = {
    en_attente: { label: 'En attente',  color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    initie:     { label: 'Initié',      color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    paye:       { label: 'Payé ✓',      color: 'text-green-400 bg-green-500/10 border-green-500/30' },
    echoue:     { label: 'Échoué',      color: 'text-red-400 bg-red-500/10 border-red-500/30' },
}

const STATUT_PROD_CONFIG = {
    non_demarre: { label: 'Non démarré', color: 'text-gray-500 bg-gray-800' },
    en_cours:    { label: 'En cours',    color: 'text-blue-400 bg-blue-500/10 border border-blue-500/30' },
    en_revision: { label: 'En révision', color: 'text-amber-400 bg-amber-500/10 border border-amber-500/30' },
    termine:     { label: 'Terminé',     color: 'text-green-400 bg-green-500/10 border border-green-500/30' },
    archive:     { label: 'Archivé',     color: 'text-gray-500 bg-gray-800' },
}

export default function Souscription({ souscriptions = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '')
    const [statutPaiement, setStatutPaiement] = useState(filters.statut_paiement || '')
    const [statutProduction, setStatutProduction] = useState(filters.statut_production || '')

    const applyFilters = (newFilters = {}) => {
        const merged = {
            search: search || undefined,
            statut_paiement: statutPaiement || undefined,
            statut_production: statutProduction || undefined,
            ...newFilters
        }
        router.get(route('admin.souscriptions.index'), merged, {
            preserveState: true,
            replace: true,
        })
    }

    return (
        <AdminLayout title="Gestion des Souscriptions">
            <div className="space-y-8">

                {/* ── HEADER ── */}
                <div className="relative border border-gray-800 bg-[#0E0E0E] p-6 overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary-500"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary-500"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary-500"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary-500"></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-1">
                                <Terminal size={12} />
                                <span>MODULE : GESTION DES COMMANDES & LIVRABLES</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                                SOUSCRIPTIONS <span className="text-primary-500">& COMMANDES</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-1">
                                Suivi du cycle de vie des commandes clients, avancement de production et expédition des livrables.
                            </p>
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
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">PAYÉES</span>
                        <div className="text-2xl font-bold font-display text-green-400">{stats.payees ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">EN COURS DE PROD.</span>
                        <div className="text-2xl font-bold font-display text-blue-400">{stats.en_cours ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">CHIFFRE D'AFFAIRES</span>
                        <div className="text-2xl font-bold font-display text-primary-500">{formatPrix(stats.ca_total)}</div>
                    </div>
                </div>

                {/* ── FILTRES & RECHERCHE ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-4 flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            placeholder="Rechercher par référence, nom, email..."
                            className="w-full bg-[#141414] border border-gray-800 text-white pl-9 pr-4 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none placeholder:text-gray-600"
                        />
                    </div>

                    <select
                        value={statutPaiement}
                        onChange={(e) => {
                            setStatutPaiement(e.target.value)
                            applyFilters({ statut_paiement: e.target.value || undefined })
                        }}
                        className="bg-[#141414] border border-gray-800 text-gray-300 text-xs font-mono px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                        <option value="">Tous les paiements</option>
                        <option value="paye">Payé ✓</option>
                        <option value="en_attente">En attente</option>
                        <option value="echoue">Échoué</option>
                    </select>

                    <select
                        value={statutProduction}
                        onChange={(e) => {
                            setStatutProduction(e.target.value)
                            applyFilters({ statut_production: e.target.value || undefined })
                        }}
                        className="bg-[#141414] border border-gray-800 text-gray-300 text-xs font-mono px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                        <option value="">Toute la production</option>
                        <option value="non_demarre">Non démarré</option>
                        <option value="en_cours">En cours</option>
                        <option value="en_revision">En révision</option>
                        <option value="termine">Terminé</option>
                        <option value="archive">Archivé</option>
                    </select>

                    <button
                        onClick={() => applyFilters()}
                        className="px-4 py-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors"
                    >
                        FILTRER
                    </button>
                </div>

                {/* ── TABLEAU DES COMMANDES ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-[#141414] text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
                                <tr>
                                    <th className="p-4">RÉFÉRENCE</th>
                                    <th className="p-4">CLIENT</th>
                                    <th className="p-4">OFFRE / SERVICE</th>
                                    <th className="p-4">MONTANT</th>
                                    <th className="p-4">PAIEMENT</th>
                                    <th className="p-4">PRODUCTION</th>
                                    <th className="p-4">DATE</th>
                                    <th className="p-4 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                                {souscriptions.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-12 text-center text-gray-500 font-mono text-xs">
                                            <Inbox size={32} className="mx-auto mb-3 opacity-40" />
                                            AUCUNE COMMANDE TROUVÉE AVEC CES CRITÈRES
                                        </td>
                                    </tr>
                                ) : (
                                    souscriptions.data?.map((sub) => {
                                        const pCfg = STATUT_PAIEMENT_CONFIG[sub.statut_paiement] || { label: sub.statut_paiement, color: 'text-gray-400 bg-gray-800' }
                                        const prCfg = STATUT_PROD_CONFIG[sub.statut_production] || { label: sub.statut_production, color: 'text-gray-400 bg-gray-800' }
                                        const itemTitre = sub.service_package?.titre || sub.service?.titre || 'Sur-mesure'
                                        const clientNom = sub.client_nom || sub.user?.name || 'Client'
                                        const clientEmail = sub.client_email || sub.user?.email || '—'

                                        return (
                                            <tr key={sub.id} className="hover:bg-[#141414] transition-colors">
                                                <td className="p-4 font-bold text-primary-500">
                                                    {sub.reference}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-white uppercase">{clientNom}</div>
                                                    <div className="text-[10px] text-gray-500">{clientEmail}</div>
                                                </td>
                                                <td className="p-4 text-gray-300">
                                                    <span className="px-1.5 py-0.5 border border-gray-800 bg-[#161616] text-[9px] uppercase mr-1.5 text-gray-400">
                                                        {sub.service_package_id ? 'PACK' : 'SERVICE'}
                                                    </span>
                                                    {itemTitre}
                                                    {sub.duration_months > 1 && (
                                                        <span className="text-[10px] text-primary-500 ml-1">({sub.duration_months}m)</span>
                                                    )}
                                                </td>
                                                <td className="p-4 font-bold text-white">
                                                    {formatPrix(sub.montant)}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider border ${pCfg.color}`}>
                                                        {pCfg.label}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider ${prCfg.color}`}>
                                                        {prCfg.label}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-500 text-[10px]">
                                                    {formatDate(sub.created_at)}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link
                                                        href={route('admin.souscriptions.show', sub.id)}
                                                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-black transition-all"
                                                    >
                                                        GÉRER <ChevronRight size={12} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {souscriptions.links?.length > 3 && (
                        <div className="p-4 border-t border-gray-800 flex items-center justify-between font-mono text-xs">
                            <span className="text-gray-500 text-[10px]">
                                Affichage de {souscriptions.from || 0} à {souscriptions.to || 0} sur {souscriptions.total || 0} commandes
                            </span>
                            <div className="flex gap-1">
                                {souscriptions.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 text-[10px] border transition-colors ${
                                            link.active
                                                ? 'bg-primary-500 text-black border-primary-500 font-bold'
                                                : link.url
                                                ? 'border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white'
                                                : 'border-transparent text-gray-600 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    )
}