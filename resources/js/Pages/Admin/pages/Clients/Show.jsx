import { Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    ArrowLeft, User, Mail, Phone, MessageCircle, Crown,
    Package, CreditCard, Clock, FileText, Download,
    CheckCircle2, Terminal, ChevronRight, Sparkles, Shield
} from 'lucide-react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'

export default function ClientShow({ client }) {
    if (!client) return null

    const cleanPhone = (client.whatsapp || client.phone || '').replace(/\D/g, '')

    return (
        <AdminLayout title={`Fiche Client : ${client.name}`}>
            <div className="space-y-8">

                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.clients.index')}
                            className="p-2 border border-gray-800 hover:border-primary-500 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] text-primary-500 uppercase tracking-widest font-bold">
                                <Terminal size={12} />
                                <span>FICHE CLIENT #{client.id}</span>
                            </div>
                            <h1 className="text-2xl font-display font-bold uppercase text-white tracking-tight flex items-center gap-2">
                                <span>{client.name}</span>
                                {client.is_vip && (
                                    <span className="px-2 py-0.5 bg-primary-500/20 text-primary-400 border border-primary-500/40 text-xs font-mono font-bold flex items-center gap-1">
                                        <Crown size={12} /> VIP
                                    </span>
                                )}
                            </h1>
                        </div>
                    </div>

                    {cleanPhone && (
                        <a
                            href={`https://wa.me/${cleanPhone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 border border-green-500/50 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-black px-4 py-2 font-mono text-xs uppercase tracking-widest font-bold transition-all"
                        >
                            <MessageCircle size={14} /> OUVRIR WHATSAPP
                        </a>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ══════════════════════════════════════════════════
                        COLONNE GAUCHE (HISTORIQUE COMMANDES & LIVRABLES) - 8 COLS
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* LISTE DES COMMANDES */}
                        <div className="border border-gray-800 bg-[#0E0E0E] p-6 relative">
                            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary-500"></div>

                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-4 pb-2 border-b border-gray-800">
                                <Package size={14} />
                                <span>COMMANDES SOUSCRITES ({client.subscriptions?.length || 0})</span>
                            </div>

                            {client.subscriptions?.length === 0 ? (
                                <p className="text-gray-500 text-xs font-mono py-6 text-center">
                                    Ce client n'a pas encore passé de commande.
                                </p>
                            ) : (
                                <div className="divide-y divide-gray-800/60 border border-gray-800">
                                    {client.subscriptions?.map((sub) => {
                                        const item = sub.service_package || sub.service || {}
                                        return (
                                            <div key={sub.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#141414] transition-colors">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-bold text-primary-500 text-xs">#{sub.reference}</span>
                                                        <span className="text-xs font-bold text-white uppercase">{item.titre || item.nom || 'Sur-mesure'}</span>
                                                    </div>
                                                    <p className="text-[10px] font-mono text-gray-500 mt-1">
                                                        Commandé le {formatDate(sub.created_at)} • Montant : <strong className="text-gray-300">{formatPrix(sub.montant)}</strong>
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {sub.statut_production === 'termine' ? (
                                                        <span className="px-2 py-0.5 text-[9px] bg-green-500/10 text-green-400 border border-green-500/30 uppercase font-bold font-mono">
                                                            LIVRÉ ✓
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/30 uppercase font-bold font-mono">
                                                            {sub.statut_production}
                                                        </span>
                                                    )}

                                                    <Link
                                                        href={route('admin.souscriptions.show', sub.id)}
                                                        className="p-1.5 border border-gray-700 hover:border-primary-500 text-gray-300 hover:text-white transition-colors"
                                                    >
                                                        <ChevronRight size={14} />
                                                    </Link>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* COFFRE-FORT DES FICHIERS TRANSMIS */}
                        <div className="border border-gray-800 bg-[#0E0E0E] p-6 relative">
                            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary-500"></div>

                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-4 pb-2 border-b border-gray-800">
                                <Download size={14} />
                                <span>FICHIERS LIVRÉS À CE CLIENT ({client.livrables?.length || 0})</span>
                            </div>

                            {client.livrables?.length === 0 ? (
                                <p className="text-gray-500 text-xs font-mono py-6 text-center">
                                    Aucun livrable n'a encore été transmis à ce client.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {client.livrables?.map((liv) => (
                                        <div key={liv.id} className="p-3 border border-gray-800 bg-[#141414] flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <h5 className="text-xs font-bold text-white uppercase truncate">{liv.nom}</h5>
                                                <p className="text-[10px] font-mono text-gray-500">{liv.fichier_nom_original} • {liv.taille_formattee}</p>
                                            </div>
                                            <a
                                                href={`/storage/${liv.fichier_path}`}
                                                target="_blank"
                                                download
                                                className="p-1.5 border border-gray-700 hover:border-primary-500 text-gray-300 hover:text-white transition-colors shrink-0"
                                            >
                                                <Download size={12} />
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* ══════════════════════════════════════════════════
                        COLONNE DROITE (PROFIL & VALEUR LTV) - 4 COLS
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* CARTE PROFIL & LTV */}
                        <div className="border border-gray-800 bg-[#0E0E0E] p-5">
                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-4 pb-2 border-b border-gray-800">
                                <User size={14} />
                                <span>PROFIL & COORDONNÉES</span>
                            </div>

                            <div className="space-y-4 font-mono text-xs">
                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Adresse email</span>
                                    <a href={`mailto:${client.email}`} className="text-gray-300 hover:text-primary-500">
                                        {client.email}
                                    </a>
                                </div>

                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Téléphone</span>
                                    <span className="text-gray-300">{client.phone || client.whatsapp || '—'}</span>
                                </div>

                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Rôle système</span>
                                    <span className="px-2 py-0.5 bg-[#161616] border border-gray-800 text-white font-bold uppercase text-[10px]">
                                        {client.role}
                                    </span>
                                </div>

                                <div className="pt-3 border-t border-gray-800">
                                    <span className="text-[10px] text-gray-500 block uppercase">Valeur Totale Dépensée (LTV)</span>
                                    <span className="text-2xl font-bold font-display text-primary-500 block mt-1">
                                        {formatPrix(client.total_depense)}
                                    </span>
                                </div>

                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Date d'inscription</span>
                                    <span className="text-gray-400">{formatDate(client.created_at)}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </AdminLayout>
    )
}
