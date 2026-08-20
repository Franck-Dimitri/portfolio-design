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
    Calendar,
    ArrowRight
} from 'lucide-react'
import { useState } from 'react'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'

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
            return <FileArchive size={22} className="text-primary-500" />
        }
        if (path.endsWith('.pdf')) {
            return <FileText size={22} className="text-red-500" />
        }
        if (path.endsWith('.png') || path.endsWith('.jpg') || path.endsWith('.svg') || path.endsWith('.webp')) {
            return <FileImage size={22} className="text-emerald-500" />
        }
        return <DownloadCloud size={22} className="text-primary-500" />
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

            <div className="w-full space-y-6">

                {/* ══════════════════════════════════════════════════
                    § 1 – HEADER & STATS
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Bibliothèque de Livrables
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Accédez à tous vos fichiers finaux haute définition livrés par Dims Creative Academy.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                            {stats.total || 0} livrables disponibles
                        </span>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – RECHERCHE & FILTRES
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
                    <div className="flex flex-wrap gap-2">
                        {typeTabs.map((tab) => {
                            const isActive = currentType === tab.key
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => handleFilterChange(tab.key)}
                                    className={`
                                        px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer
                                        ${isActive
                                            ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/20'
                                            : 'bg-white dark:bg-[#121212] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800'
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
                            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 focus:border-primary-500 text-neutral-900 dark:text-white text-xs placeholder-neutral-400 focus:ring-0 transition-colors"
                        />
                        <Search size={14} className="absolute left-3 top-3 text-neutral-400" />
                    </form>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 3 – GRILLE DES LIVRABLES
                ══════════════════════════════════════════════════ */}
                {livrables.data.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                            <FolderDown size={24} />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">Aucun livrable disponible</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                            Vos fichiers téléchargeables apparaîtront ici dès que vos commandes seront finalisées.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {livrables.data.map((l) => (
                            <div
                                key={l.id}
                                className="p-5 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 hover:border-primary-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xs"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-11 h-11 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                                            {getFileIcon(l)}
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate" title={l.nom}>
                                                {l.nom}
                                            </h3>
                                            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                                                {l.fichier_nom_original || 'Fichier final'}
                                            </p>
                                        </div>
                                    </div>

                                    {l.message && (
                                        <p className="text-xs text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-2xl leading-relaxed">
                                            "{l.message}"
                                        </p>
                                    )}

                                    {l.souscription && (
                                        <div className="flex items-center gap-1.5 text-[11px] text-neutral-500">
                                            <span>Commande :</span>
                                            <Link
                                                href={`/client/souscriptions/${l.souscription.id}`}
                                                className="text-primary-500 hover:underline font-semibold"
                                            >
                                                #{l.souscription.reference}
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-3 text-xs">
                                    <span className="text-[11px] text-neutral-400">
                                        {formatDate(l.created_at)}
                                    </span>

                                    <a
                                        href={`/storage/${l.fichier_path}`}
                                        download
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-md shadow-primary-500/20 transition-all"
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
