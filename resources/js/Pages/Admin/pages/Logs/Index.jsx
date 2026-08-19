import { useState } from 'react'
import { router, Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    Terminal,
    Shield,
    Download,
    Trash2,
    Search,
    AlertTriangle,
    CheckCircle2,
    Info,
    XCircle,
    User,
    Globe,
    Clock,
    Filter,
    RefreshCw,
    X,
    Eye
} from 'lucide-react'

const formatDateTime = (d) => d ? new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
}) : '—'

const LEVEL_CONFIG = {
    info:     { bg: 'bg-blue-500/10',    text: 'text-blue-400',    border: 'border-blue-500/30',    icon: Info },
    success:  { bg: 'bg-green-500/10',   text: 'text-green-400',   border: 'border-green-500/30',   icon: CheckCircle2 },
    warning:  { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/30',   icon: AlertTriangle },
    error:    { bg: 'bg-red-500/10',     text: 'text-red-400',     border: 'border-red-500/30',     icon: XCircle },
    critical: { bg: 'bg-red-600/20',     text: 'text-red-300',     border: 'border-red-500',        icon: XCircle },
}

export default function LogsIndex({ logs = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '')
    const [category, setCategory] = useState(filters.category || '')
    const [level, setLevel] = useState(filters.level || '')
    const [selectedLog, setSelectedLog] = useState(null)

    const handleFilter = (e) => {
        if (e) e.preventDefault()
        router.get(route('admin.logs.index'), {
            search: search || undefined,
            category: category || undefined,
            level: level || undefined,
        }, {
            preserveState: true,
            replace: true,
        })
    }

    const handleClearOld = () => {
        if (confirm('Voulez-vous vraiment purger les logs de plus de 30 jours ?')) {
            router.post(route('admin.logs.clear'), {}, { preserveScroll: true })
        }
    }

    return (
        <AdminLayout title="Logs & Audit Trail Système">
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
                                <span>CONSOLE DE SÉCURITÉ & AUDIT TRAIL</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                                LOGS SYSTÈME & <span className="text-primary-500">TRACKING D'AUDIT</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-1">
                                Enregistrement temps réel des actions administrateurs, flux de commandes, paiements et sessions utilisateurs.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <a
                                href={route('admin.logs.export')}
                                className="inline-flex items-center gap-2 border border-gray-700 hover:border-primary-500 text-gray-300 hover:text-white px-4 py-2 font-mono text-xs uppercase tracking-widest bg-[#141414] transition-colors"
                            >
                                <Download size={14} /> EXPORT CSV
                            </a>

                            <button
                                onClick={handleClearOld}
                                className="inline-flex items-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 font-mono text-xs uppercase tracking-widest bg-[#141414] transition-colors"
                            >
                                <Trash2 size={14} /> PURGER (&gt; 30J)
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── STATS BAR ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">TOTAL ACTIONS LOGUÉES</span>
                        <div className="text-2xl font-bold font-display text-white">{stats.total ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">AUJOURD'HUI</span>
                        <div className="text-2xl font-bold font-display text-primary-500">{stats.aujourdhui ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">CONNEXIONS (AUTH)</span>
                        <div className="text-2xl font-bold font-display text-blue-400">{stats.auth ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">ALERTES & ERREURS</span>
                        <div className="text-2xl font-bold font-display text-red-400">{stats.alertes ?? 0}</div>
                    </div>
                </div>

                {/* ── RECHERCHE & FILTRES ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-4 flex flex-col md:flex-row gap-3">
                    <form onSubmit={handleFilter} className="flex-1 flex gap-3">
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par description, utilisateur, action, adresse IP..."
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

                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value)
                            router.get(route('admin.logs.index'), { search, category: e.target.value || undefined, level: level || undefined }, { preserveState: true, replace: true })
                        }}
                        className="bg-[#141414] border border-gray-800 text-gray-300 text-xs font-mono px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                        <option value="">Toutes les catégories</option>
                        <option value="auth">Authentification (auth)</option>
                        <option value="order">Commandes (order)</option>
                        <option value="payment">Paiements (payment)</option>
                        <option value="client">Clients (client)</option>
                        <option value="catalog">Catalogue (catalog)</option>
                        <option value="system">Système (system)</option>
                    </select>

                    <select
                        value={level}
                        onChange={(e) => {
                            setLevel(e.target.value)
                            router.get(route('admin.logs.index'), { search, category: category || undefined, level: e.target.value || undefined }, { preserveState: true, replace: true })
                        }}
                        className="bg-[#141414] border border-gray-800 text-gray-300 text-xs font-mono px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                        <option value="">Tous les niveaux</option>
                        <option value="info">INFO</option>
                        <option value="success">SUCCESS</option>
                        <option value="warning">WARNING</option>
                        <option value="error">ERROR</option>
                    </select>
                </div>

                {/* ── TABLEAU CONSOLE DES LOGS ── */}
                <div className="border border-gray-800 bg-[#0A0A0A] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-[#101010] text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
                                <tr>
                                    <th className="p-4">HORODATAGE</th>
                                    <th className="p-4">NIVEAU</th>
                                    <th className="p-4">CATÉGORIE</th>
                                    <th className="p-4">ÉVÉNEMENT & DESCRIPTION</th>
                                    <th className="p-4">ACTEUR</th>
                                    <th className="p-4">IP</th>
                                    <th className="p-4 text-right">DÉTAILS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                                {logs.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-gray-600 font-mono text-xs">
                                            AUCUN ÉVÉNEMENT CORRESPONDANT DANS LES LOGS D'AUDIT
                                        </td>
                                    </tr>
                                ) : (
                                    logs.data?.map((log) => {
                                        const lvl = LEVEL_CONFIG[log.level] || LEVEL_CONFIG.info
                                        const Icon = lvl.icon

                                        return (
                                            <tr key={log.id} className="hover:bg-[#121212] transition-colors">
                                                {/* Horodatage */}
                                                <td className="p-4 text-gray-400 whitespace-nowrap text-[11px]">
                                                    {formatDateTime(log.created_at)}
                                                </td>

                                                {/* Niveau */}
                                                <td className="p-4 whitespace-nowrap">
                                                    <span className={`px-2 py-0.5 text-[9px] font-bold uppercase border flex items-center gap-1 w-fit ${lvl.bg} ${lvl.text} ${lvl.border}`}>
                                                        <Icon size={10} />
                                                        {log.level}
                                                    </span>
                                                </td>

                                                {/* Catégorie */}
                                                <td className="p-4 whitespace-nowrap">
                                                    <span className="px-1.5 py-0.5 bg-[#181818] border border-gray-800 text-[9px] text-gray-400 uppercase font-bold">
                                                        {log.category}
                                                    </span>
                                                </td>

                                                {/* Description & Action */}
                                                <td className="p-4">
                                                    <p className="text-white font-bold text-xs">{log.description}</p>
                                                    <span className="text-[10px] text-primary-500/80 font-mono block mt-0.5">
                                                        {log.action}
                                                    </span>
                                                </td>

                                                {/* Utilisateur */}
                                                <td className="p-4 whitespace-nowrap">
                                                    <span className="text-gray-300 block font-bold">{log.user_name || 'Invité / Système'}</span>
                                                    {log.user_email && <span className="text-[10px] text-gray-500 block">{log.user_email}</span>}
                                                </td>

                                                {/* IP */}
                                                <td className="p-4 whitespace-nowrap text-gray-500 text-[10px]">
                                                    {log.ip_address || '—'}
                                                </td>

                                                {/* Action inspecter */}
                                                <td className="p-4 text-right whitespace-nowrap">
                                                    <button
                                                        onClick={() => setSelectedLog(log)}
                                                        className="p-1.5 border border-gray-800 hover:border-primary-500 text-gray-400 hover:text-white transition-colors"
                                                        title="Inspecter les métadonnées"
                                                    >
                                                        <Eye size={12} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── MODALE INSPECTION DÉTAILS DU LOG ── */}
                {selectedLog && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-[#0E0E0E] border border-gray-800 w-full max-w-2xl p-6 relative font-mono text-xs space-y-4">
                            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                                <div className="flex items-center gap-2 text-primary-500 font-bold text-xs uppercase tracking-widest">
                                    <Terminal size={14} />
                                    <span>MÉTADONNÉES TECHNIQUES DU LOG #{selectedLog.id}</span>
                                </div>
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="text-gray-500 hover:text-white p-1"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <p><strong className="text-gray-500">Action :</strong> <span className="text-primary-500">{selectedLog.action}</span></p>
                                <p><strong className="text-gray-500">Description :</strong> <span className="text-white">{selectedLog.description}</span></p>
                                <p><strong className="text-gray-500">Acteur :</strong> <span className="text-gray-300">{selectedLog.user_name} ({selectedLog.user_email || 'sans email'}) - Rôle: {selectedLog.user_role}</span></p>
                                <p><strong className="text-gray-500">Adresse IP :</strong> <span className="text-gray-400">{selectedLog.ip_address}</span></p>
                                <p><strong className="text-gray-500">User Agent :</strong> <span className="text-gray-400 break-all">{selectedLog.user_agent}</span></p>
                                <p><strong className="text-gray-500">Date/Heure :</strong> <span className="text-gray-400">{formatDateTime(selectedLog.created_at)}</span></p>
                            </div>

                            {selectedLog.properties && (
                                <div>
                                    <strong className="text-gray-500 block mb-1">Payload JSON (Propriétés) :</strong>
                                    <pre className="p-3 bg-[#080808] border border-gray-800 text-green-400 text-[10px] overflow-x-auto max-h-48">
                                        {JSON.stringify(selectedLog.properties, null, 2)}
                                    </pre>
                                </div>
                            )}

                            <div className="flex justify-end pt-3 border-t border-gray-800">
                                <button
                                    onClick={() => setSelectedLog(null)}
                                    className="px-4 py-2 bg-primary-500 text-black font-bold uppercase text-[10px] tracking-widest hover:bg-primary-400"
                                >
                                    FERMER
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    )
}
