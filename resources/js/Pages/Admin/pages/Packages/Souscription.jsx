// resources/js/Pages/Admin/Packages/Souscriptions.jsx
import { useState } from 'react'
import { router, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    Search, Filter, Users, TrendingUp, Clock, CheckCircle2,
    ChevronRight, Mail, Phone, MessageCircle, Package,
    Calendar, AlertCircle, RefreshCw, Eye, Download,
    CreditCard, BarChart3, Inbox
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────
const formatPrix   = (v) => new Intl.NumberFormat('fr-FR').format(v) + ' FCFA'
const formatDate   = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'
const formatDateTime = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' }) : '—'

const STATUT_PAIEMENT_CONFIG = {
    en_attente: { label: 'En attente',  color: 'text-amber-600 bg-amber-50  dark:bg-amber-900/20 dark:text-amber-400' },
    initie:     { label: 'Initié',      color: 'text-blue-600  bg-blue-50   dark:bg-blue-900/20  dark:text-blue-400'  },
    paye:       { label: 'Payé ✓',      color: 'text-green-600 bg-green-50  dark:bg-green-900/20 dark:text-green-400' },
    echoue:     { label: 'Échoué',      color: 'text-red-600   bg-red-50    dark:bg-red-900/20   dark:text-red-400'   },
    rembourse:  { label: 'Remboursé',   color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400' },
}

const STATUT_PROD_CONFIG = {
    non_demarre: { label: 'Non démarré', dot: 'bg-[var(--text-subtle)]'  },
    en_cours:    { label: 'En cours',    dot: 'bg-blue-500'              },
    en_revision: { label: 'Révision',    dot: 'bg-amber-500'             },
    termine:     { label: 'Terminé',     dot: 'bg-green-500'             },
    archive:     { label: 'Archivé',     dot: 'bg-[var(--text-subtle)]'  },
}

// ── Badge statut paiement ─────────────────────────────────────
function BadgePaiement({ statut }) {
    const cfg = STATUT_PAIEMENT_CONFIG[statut] || { label: statut, color: '' }
    return (
        <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${cfg.color}`}>
            {cfg.label}
        </span>
    )
}

// ── Badge statut production ───────────────────────────────────
function BadgeProd({ statut }) {
    const cfg = STATUT_PROD_CONFIG[statut] || { label: statut, dot: '' }
    return (
        <span className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
            {cfg.label}
        </span>
    )
}

// ── Filtres ───────────────────────────────────────────────────
function Filtres({ filters, onChange }) {
    const [search, setSearch] = useState(filters.search || '')

    const apply = (key, val) => {
        onChange({ ...filters, [key]: val || undefined })
    }

    return (
        <div className="card p-4 flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && apply('search', search)}
                    placeholder="Référence, nom, email..."
                    className="input pl-9 py-2 text-sm"
                />
            </div>
            <select
                value={filters.statut_paiement || ''}
                onChange={e => apply('statut_paiement', e.target.value)}
                className="input py-2 text-sm w-auto min-w-[150px]"
            >
                <option value="">Tous les paiements</option>
                {Object.entries(STATUT_PAIEMENT_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                ))}
            </select>
            <select
                value={filters.statut_production || ''}
                onChange={e => apply('statut_production', e.target.value)}
                className="input py-2 text-sm w-auto min-w-[150px]"
            >
                <option value="">Toute la production</option>
                {Object.entries(STATUT_PROD_CONFIG).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                ))}
            </select>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// PAGE SOUSCRIPTIONS
// ══════════════════════════════════════════════════════════════
export default function Souscriptions({ souscriptions, filters, stats }) {
    const handleFilter = (newFilters) => {
        router.get(route('admin.souscriptions.index'), newFilters, {
            preserveState: true, replace: true
        })
    }

    return (
        <AdminLayout title="Souscriptions">

            {/* ── Header ─────────────────────────────────────── */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center">
                        <Users size={16} className="text-primary-500" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Souscriptions</h1>
                </div>
                <p className="text-sm text-[var(--text-muted)]">Gérez toutes les commandes clients</p>
            </div>

            {/* ── KPIs ───────────────────────────────────────── */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
                {[
                    { label: 'Total',       value: stats.total,      icon: Inbox,      suffix: '' },
                    { label: 'Payées',      value: stats.payees,     icon: CreditCard, suffix: '', hl: true },
                    { label: 'En cours',    value: stats.en_cours,   icon: Clock,      suffix: '' },
                    { label: 'Terminées',   value: stats.terminees,  icon: CheckCircle2, suffix: '' },
                    { label: "CA total",    value: formatPrix(stats.ca_total), icon: TrendingUp, suffix: '', wide: true },
                ].map(({ label, value, icon: Icon, hl, wide }) => (
                    <div key={label} className={`card p-4 ${wide ? 'col-span-2 lg:col-span-1' : ''} ${hl ? 'border-primary-200 dark:border-primary-800' : ''}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Icon size={14} className={hl ? 'text-primary-500' : 'text-[var(--text-muted)]'} />
                            <span className="text-xs text-[var(--text-muted)]">{label}</span>
                        </div>
                        <div className={`font-extrabold text-lg ${hl ? 'text-primary-500' : 'text-[var(--text-primary)]'}`}>
                            {value}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Filtres ─────────────────────────────────────── */}
            <Filtres filters={filters} onChange={handleFilter} />

            {/* ── Table ──────────────────────────────────────── */}
            <div className="card overflow-hidden">
                {souscriptions.data.length === 0 ? (
                    <div className="py-16 text-center">
                        <Inbox size={32} className="text-[var(--text-muted)] mx-auto mb-3" />
                        <p className="text-[var(--text-muted)] font-medium">Aucune souscription</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border-base)]">
                                    {['Référence', 'Client', 'Pack', 'Montant', 'Paiement', 'Production', 'Date', ''].map(h => (
                                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-base)]">
                                {souscriptions.data.map(s => (
                                    <tr key={s.id} className="hover:bg-[var(--bg-subtle)] transition-colors group">
                                        <td className="px-4 py-3">
                                            <span className="font-mono text-xs font-semibold text-primary-500">{s.reference}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-[var(--text-primary)] whitespace-nowrap">{s.client_nom}</div>
                                            <div className="text-xs text-[var(--text-muted)]">{s.client_email}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-1 rounded-lg bg-[var(--bg-muted)] text-[var(--text-secondary)] whitespace-nowrap">
                                                {s.service_package?.titre}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold text-[var(--text-primary)] whitespace-nowrap">
                                            {formatPrix(s.montant)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <BadgePaiement statut={s.statut_paiement} />
                                        </td>
                                        <td className="px-4 py-3">
                                            <BadgeProd statut={s.statut_production} />
                                        </td>
                                        <td className="px-4 py-3 text-xs text-[var(--text-muted)] whitespace-nowrap">
                                            {formatDate(s.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <a
                                                href={route('admin.souscriptions.show', s.id)}
                                                className="btn btn-ghost btn-sm gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Eye size={13} /> Voir
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {souscriptions.last_page > 1 && (
                    <div className="px-4 py-3 border-t border-[var(--border-base)] flex items-center justify-between text-sm text-[var(--text-muted)]">
                        <span>Page {souscriptions.current_page} / {souscriptions.last_page}</span>
                        <div className="flex gap-2">
                            {souscriptions.prev_page_url && (
                                <button
                                    onClick={() => router.get(souscriptions.prev_page_url)}
                                    className="btn btn-ghost btn-sm"
                                >Précédent</button>
                            )}
                            {souscriptions.next_page_url && (
                                <button
                                    onClick={() => router.get(souscriptions.next_page_url)}
                                    className="btn btn-primary btn-sm"
                                >Suivant</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}