import { useState } from 'react'
import { router, Link } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    Package, Clock, CheckCircle2, ChevronRight, Download,
    FileText, Terminal, Crosshair, Sparkles, Filter, Inbox
} from 'lucide-react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'

export default function Index({ souscriptions = { data: [] }, filters = {} }) {
    const [statut, setStatut] = useState(filters.statut || '')

    const handleFilter = (val) => {
        setStatut(val)
        router.get(route('client.souscriptions.index'), {
            statut: val || undefined,
        }, {
            preserveState: true,
            replace: true,
        })
    }

    return (
        <ClientLayout title="Mes Commandes & Packs">
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
                                <span>HISTORIQUE PERSONNEL</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                                MES COMMANDES & <span className="text-primary-500">SOUSCRIPTIONS</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-1">
                                Suivez chaque projet, accédez aux livrables et téléchargez vos reçus officiels.
                            </p>
                        </div>

                        <Link
                            href="/packages"
                            className="inline-flex items-center gap-2 bg-primary-500 text-black px-5 py-2.5 font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors shrink-0"
                        >
                            COMMANDER UN AUTRE PACK
                        </Link>
                    </div>
                </div>

                {/* ── FILTRES ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-4 flex gap-3">
                    <select
                        value={statut}
                        onChange={(e) => handleFilter(e.target.value)}
                        className="bg-[#141414] border border-gray-800 text-gray-300 text-xs font-mono px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                        <option value="">Tous les statuts de production</option>
                        <option value="non_demarre">En attente du brief</option>
                        <option value="en_cours">En cours de création</option>
                        <option value="en_revision">En révision</option>
                        <option value="termine">Livrées & terminées</option>
                    </select>
                </div>

                {/* ── TABLEAU DES COMMANDES ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-[#141414] text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
                                <tr>
                                    <th className="p-4">RÉFÉRENCE</th>
                                    <th className="p-4">OFFRE / PACK</th>
                                    <th className="p-4">MONTANT</th>
                                    <th className="p-4">STATUT</th>
                                    <th className="p-4">LIVRAISON ESTIMÉE</th>
                                    <th className="p-4">DATE COMMANDE</th>
                                    <th className="p-4 text-right">ACTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                                {souscriptions.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-gray-500 font-mono text-xs">
                                            <Inbox size={32} className="mx-auto mb-3 opacity-40" />
                                            AUCUNE COMMANDE TROUVÉE
                                        </td>
                                    </tr>
                                ) : (
                                    souscriptions.data?.map((sub) => {
                                        const item = sub.service_package || sub.service || {}
                                        return (
                                            <tr key={sub.id} className="hover:bg-[#141414] transition-colors">
                                                <td className="p-4 font-bold text-primary-500">
                                                    {sub.reference}
                                                </td>
                                                <td className="p-4 text-white">
                                                    <span className="px-1.5 py-0.5 border border-gray-800 bg-[#161616] text-[9px] uppercase mr-1.5 text-gray-400">
                                                        {sub.service_package_id ? 'PACK' : 'SERVICE'}
                                                    </span>
                                                    {item.titre || item.nom || 'Sur-mesure'}
                                                </td>
                                                <td className="p-4 font-bold text-gray-300">
                                                    {formatPrix(sub.montant)}
                                                </td>
                                                <td className="p-4">
                                                    {sub.statut_production === 'termine' ? (
                                                        <span className="px-2 py-0.5 text-[9px] bg-green-500/10 text-green-400 border border-green-500/30 uppercase font-bold">
                                                            TERMINÉ ✓
                                                        </span>
                                                    ) : sub.statut_production === 'en_cours' ? (
                                                        <span className="px-2 py-0.5 text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase font-bold">
                                                            EN CRÉATION ⏳
                                                        </span>
                                                    ) : sub.statut_production === 'en_revision' ? (
                                                        <span className="px-2 py-0.5 text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase font-bold">
                                                            RÉVISION ⚡
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 text-[9px] bg-gray-800 text-gray-400 uppercase">
                                                            EN ATTENTE DU BRIEF
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-gray-400 text-[11px]">
                                                    {sub.date_livraison_estimee ? formatDate(sub.date_livraison_estimee) : '—'}
                                                </td>
                                                <td className="p-4 text-gray-500 text-[10px]">
                                                    {formatDate(sub.created_at)}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <Link
                                                        href={route('client.souscriptions.show', sub.id)}
                                                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary-500 hover:text-black border border-primary-500 px-3 py-1 bg-primary-500/10 hover:bg-primary-500 transition-all"
                                                    >
                                                        SUIVRE <ChevronRight size={10} />
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

            </div>
        </ClientLayout>
    )
}
