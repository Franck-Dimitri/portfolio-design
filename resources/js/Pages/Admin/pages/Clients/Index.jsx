import { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    Users,
    UserCheck,
    Search,
    Crown,
    CreditCard,
    Package,
    Mail,
    Phone,
    MessageCircle,
    ChevronRight,
    Terminal,
    Crosshair,
    Shield,
    Sparkles,
    Calendar
} from 'lucide-react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'

export default function ClientsIndex({ clients = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '')
    const [role, setRole] = useState(filters.role || '')

    const handleSearch = (e) => {
        e.preventDefault()
        router.get(route('admin.clients.index'), { search, role }, { preserveState: true, replace: true })
    }

    const handleRoleFilter = (newRole) => {
        setRole(newRole)
        router.get(route('admin.clients.index'), { search, role: newRole || undefined }, { preserveState: true, replace: true })
    }

    const updateRole = (clientId, newRole) => {
        if (confirm(`Voulez-vous attribuer le rôle ${newRole} à cet utilisateur ?`)) {
            router.patch(route('admin.clients.role', clientId), { role: newRole }, { preserveScroll: true })
        }
    }

    return (
        <AdminLayout title="Gestion des Clients & Utilisateurs">
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
                                <span>MODULE CRM & GESTION DES RELATIONS CLIENTS</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                                CLIENTS & <span className="text-primary-500">UTILISATEURS</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-1">
                                Suivi des acheteurs, fidélisation, analyse LTV (valeur à vie) et contact direct WhatsApp.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── STATS CARDS ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">TOTAL UTILISATEURS</span>
                        <div className="text-2xl font-bold font-display text-white">{stats.total ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">CLIENTS ACHETEURS</span>
                        <div className="text-2xl font-bold font-display text-green-400">{stats.acheteurs ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">CLIENTS VIP (LTV &gt; 100K)</span>
                        <div className="text-2xl font-bold font-display text-primary-500 flex items-center gap-1.5">
                            <Crown size={18} /> {stats.vip ?? 0}
                        </div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">TOTAL CHIFFRE D'AFFAIRES</span>
                        <div className="text-2xl font-bold font-display text-primary-500">{formatPrix(stats.ca_total)}</div>
                    </div>
                </div>

                {/* ── RECHERCHE & FILTRES ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-4 flex flex-col md:flex-row gap-3">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-3">
                        <div className="relative flex-1">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Rechercher par nom, adresse email ou téléphone..."
                                className="w-full bg-[#141414] border border-gray-800 pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-gray-600 focus:border-primary-500 focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-[#141414] border border-gray-800 hover:border-primary-500 text-gray-300 hover:text-white text-xs font-mono font-bold uppercase transition-colors"
                        >
                            RECHERCHER
                        </button>
                    </form>

                    <select
                        value={role}
                        onChange={(e) => handleRoleFilter(e.target.value)}
                        className="bg-[#141414] border border-gray-800 text-gray-300 text-xs font-mono px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                        <option value="">Tous les rôles</option>
                        <option value="client">Clients uniquement</option>
                        <option value="designer">Designers</option>
                        <option value="admin">Administrateurs</option>
                    </select>
                </div>

                {/* ── TABLEAU DES CLIENTS ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs font-mono">
                            <thead className="bg-[#141414] text-gray-500 text-[10px] uppercase tracking-widest border-b border-gray-800">
                                <tr>
                                    <th className="p-4">CLIENT</th>
                                    <th className="p-4">COORDONNÉES & WHATSAPP</th>
                                    <th className="p-4">COMMANDES</th>
                                    <th className="p-4">VALEUR LTV (TOTAL)</th>
                                    <th className="p-4">STATUT</th>
                                    <th className="p-4">INSCRIPTION</th>
                                    <th className="p-4 text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/60">
                                {clients.data?.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-gray-500">
                                            Aucun utilisateur ou client trouvé.
                                        </td>
                                    </tr>
                                ) : (
                                    clients.data?.map((c) => {
                                        const cleanPhone = (c.whatsapp || c.phone || '').replace(/\D/g, '')
                                        return (
                                            <tr key={c.id} className="hover:bg-[#141414] transition-colors">
                                                {/* Client Name & VIP Badge */}
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-[#181818] border border-gray-800 text-primary-500 font-bold flex items-center justify-center text-xs">
                                                            {c.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-1.5 font-bold text-white uppercase">
                                                                <span>{c.name}</span>
                                                                {c.is_vip && (
                                                                    <span className="px-1.5 py-0.2 bg-primary-500/20 text-primary-400 border border-primary-500/40 text-[9px] flex items-center gap-1">
                                                                        <Crown size={10} /> VIP
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-[10px] text-gray-500">{c.email}</span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Coordonnées & WhatsApp Direct */}
                                                <td className="p-4">
                                                    {c.phone || c.whatsapp ? (
                                                        <div className="space-y-1">
                                                            <span className="text-gray-300 block">{c.phone || c.whatsapp}</span>
                                                            {cleanPhone && (
                                                                <a
                                                                    href={`https://wa.me/${cleanPhone}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="inline-flex items-center gap-1 text-[10px] text-green-400 hover:underline"
                                                                >
                                                                    <MessageCircle size={10} /> Chat WhatsApp
                                                                </a>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-600">—</span>
                                                    )}
                                                </td>

                                                {/* Commandes */}
                                                <td className="p-4">
                                                    <span className="font-bold text-white">{c.total_commandes}</span>
                                                    <span className="text-gray-500 text-[10px] block">
                                                        {c.commandes_en_cours > 0 ? `${c.commandes_en_cours} en cours` : 'Aucune en cours'}
                                                    </span>
                                                </td>

                                                {/* Total Dépensé LTV */}
                                                <td className="p-4">
                                                    <span className="font-bold text-primary-500">
                                                        {formatPrix(c.total_depense)}
                                                    </span>
                                                </td>

                                                {/* Rôle */}
                                                <td className="p-4">
                                                    <select
                                                        value={c.role}
                                                        onChange={(e) => updateRole(c.id, e.target.value)}
                                                        className="bg-[#161616] border border-gray-800 text-[10px] font-mono text-gray-300 px-2 py-1 focus:border-primary-500 focus:outline-none"
                                                    >
                                                        <option value="client">Client</option>
                                                        <option value="designer">Designer</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>

                                                {/* Date Inscription */}
                                                <td className="p-4 text-gray-500 text-[10px]">
                                                    {formatDate(c.created_at)}
                                                </td>

                                                {/* Actions */}
                                                <td className="p-4 text-right">
                                                    <Link
                                                        href={route('admin.clients.show', c.id)}
                                                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary-500 hover:text-black border border-primary-500 px-3 py-1 bg-primary-500/10 hover:bg-primary-500 transition-all"
                                                    >
                                                        FICHE <ChevronRight size={10} />
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
        </AdminLayout>
    )
}
