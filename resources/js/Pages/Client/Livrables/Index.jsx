import { Link, Head, router } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    DownloadCloud,
    FolderDown,
    Search,
    FileArchive,
    FileImage,
    FileText,
    ExternalLink,
    Filter,
    CheckCircle2,
    Calendar,
    ArrowRight
} from 'lucide-react'
import { useState } from 'react'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function Index({
    livrables = { data: [] },
    filters = {},
    stats = {},
    whatsappNumber = "237690112233"
}) {
    const [search, setSearch] = useState(filters.search || '')
    const [currentType, setCurrentType] = useState(filters.type || '')

    const handleFilterChange = (type) => {
        setCurrentType(type)
        router.get(route('client.livrables.index'), {
            type: type || undefined,
            search: search || undefined
        }, { preserveState: true, replace: true })
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        router.get(route('client.livrables.index'), {
            type: currentType || undefined,
            search: search || undefined
        }, { preserveState: true, replace: true })
    }

    const getFileIcon = (livrable) => {
        const path = (livrable.fichier_path || livrable.fichier_nom_original || '').toLowerCase()
        if (path.endsWith('.zip') || path.endsWith('.rar')) {
            return <FileArchive size={22} className="text-amber-400" />
        }
        if (path.endsWith('.pdf')) {
            return <FileText size={22} className="text-red-400" />
        }
        if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.svg') || path.endsWith('.webp')) {
            return <FileImage size={22} className="text-emerald-400" />
        }
        return <DownloadCloud size={22} className="text-indigo-400" />
    }

    const typeTabs = [
        { key: '', label: 'Tous les fichiers' },
        { key: 'zip', label: 'Archives ZIP & Vectoriels' },
        { key: 'image', label: 'Images & Logos' },
        { key: 'pdf', label: 'Documents PDF' },
    ]

    return (
        <ClientLayout title="Mes Livrables & Fichiers">
            <Head title="Mes Livrables — Espace Client" />

            <div className="space-y-6">

                {/* ══════════════════════════════════════════════════
                    § 1 – HEADER & STATS
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                            Bibliothèque de Livrables
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Accédez à tous les fichiers finaux haute définition livrés par Dim's Creative Academy.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold text-xs">
                            {stats.total || 0} livrables disponibles
                        </span>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – RECHERCHE & FILTRES
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex flex-wrap gap-2">
                        {typeTabs.map((tab) => {
                            const isActive = currentType === tab.key
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => handleFilterChange(tab.key)}
                                    className={`
                                        px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all
                                        ${isActive
                                            ? 'bg-amber-400 text-slate-950 shadow-sm'
                                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                                        }
                                    `}
                                >
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>

                    <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher un livrable..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-white text-xs placeholder-slate-500 focus:ring-0 transition-colors"
                        />
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                    </form>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 3 – GRILLE DES LIVRABLES
                ══════════════════════════════════════════════════ */}
                {livrables.data.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-[#14171F] border border-slate-800/80 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                            <FolderDown size={24} />
                        </div>
                        <h3 className="text-base font-bold text-white">Aucun livrable disponible</h3>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Vos fichiers téléchargeables apparaîtront ici dès que vos commandes seront finalisées.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {livrables.data.map((l) => (
                            <div
                                key={l.id}
                                className="p-5 rounded-2xl bg-[#14171F] border border-slate-800/80 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 shadow-sm"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                                            {getFileIcon(l)}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-white truncate" title={l.nom}>
                                                {l.nom}
                                            </h3>
                                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                                {l.fichier_nom_original || 'Fichier final'}
                                            </p>
                                        </div>
                                    </div>

                                    {l.message && (
                                        <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl leading-relaxed">
                                            "{l.message}"
                                        </p>
                                    )}

                                    {l.souscription && (
                                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                                            <span>Commande :</span>
                                            <Link
                                                href={`/client/souscriptions/${l.souscription.id}`}
                                                className="text-amber-400 hover:underline font-semibold"
                                            >
                                                #{l.souscription.reference}
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3 text-xs">
                                    <span className="text-[11px] text-slate-500">
                                        {formatDate(l.created_at)}
                                    </span>

                                    <a
                                        href={`/storage/${l.fichier_path}`}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition-all"
                                    >
                                        <DownloadCloud size={14} />
                                        <span>Télécharger</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </ClientLayout>
    )
}
