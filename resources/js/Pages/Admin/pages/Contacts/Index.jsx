// resources/js/Pages/Admin/pages/Contacts/Index.jsx
import { useState } from 'react'
import { router, Link } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    Mail, Search, Trash2, CheckCircle2, AlertCircle,
    Clock, Phone, MessageSquare, Tag, Terminal, ChevronRight, Inbox
} from 'lucide-react'

const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
}) : '—'

export default function Index({ contacts = { data: [] }, filters = {}, stats = {} }) {
    const [search, setSearch] = useState(filters.search || '')
    const [status, setStatus] = useState(filters.status || '')
    const [selectedMessage, setSelectedMessage] = useState(null)

    const applyFilters = (newFilters = {}) => {
        const merged = {
            search: search || undefined,
            status: status || undefined,
            ...newFilters
        }
        router.get(route('admin.contacts.index'), merged, {
            preserveState: true,
            replace: true,
        })
    }

    const toggleRead = (id) => {
        router.patch(route('admin.contacts.toggle-read', id), {}, {
            preserveScroll: true,
        })
    }

    const deleteMessage = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
            router.delete(route('admin.contacts.destroy', id), {
                preserveScroll: true,
                onSuccess: () => setSelectedMessage(null)
            })
        }
    }

    return (
        <AdminLayout title="Messages de Contact">
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
                                <span>COMMUNICATIONS ENTRANTES</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                                MESSAGES & <span className="text-primary-500">CONTACTS</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-1">
                                Consulter et traiter les requêtes soumises via le formulaire de contact public.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── STATS BAR ── */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">TOTAL MESSAGES</span>
                        <div className="text-2xl font-bold font-display text-white">{stats.total ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">NON LUS</span>
                        <div className="text-2xl font-bold font-display text-primary-500">{stats.unread ?? 0}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">TRAITÉS / LUS</span>
                        <div className="text-2xl font-bold font-display text-green-400">{stats.read ?? 0}</div>
                    </div>
                </div>

                {/* ── FILTRES & RECHERCHE ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                            placeholder="Rechercher par nom, email, sujet..."
                            className="w-full bg-[#141414] border border-gray-800 text-white pl-9 pr-4 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none placeholder:text-gray-600"
                        />
                    </div>

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value)
                            applyFilters({ status: e.target.value || undefined })
                        }}
                        className="bg-[#141414] border border-gray-800 text-gray-300 text-xs font-mono px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                        <option value="">Tous les messages</option>
                        <option value="unread">Non lus uniquement</option>
                        <option value="read">Lus uniquement</option>
                    </select>
                </div>

                {/* ── LISTE DES MESSAGES ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className={`${selectedMessage ? 'lg:col-span-6' : 'lg:col-span-12'} border border-gray-800 bg-[#0E0E0E] overflow-hidden`}>
                        <div className="divide-y divide-gray-800/60">
                            {contacts.data?.length === 0 ? (
                                <div className="p-12 text-center text-gray-500 font-mono text-xs">
                                    <Inbox size={32} className="mx-auto mb-3 opacity-40" />
                                    AUCUN MESSAGE REÇU
                                </div>
                            ) : (
                                contacts.data?.map((contact) => {
                                    const isSelected = selectedMessage?.id === contact.id
                                    return (
                                        <div
                                            key={contact.id}
                                            onClick={() => {
                                                setSelectedMessage(contact)
                                                if (!contact.is_read) toggleRead(contact.id)
                                            }}
                                            className={`p-4 cursor-pointer transition-colors ${
                                                isSelected 
                                                    ? 'bg-primary-500/10 border-l-2 border-l-primary-500' 
                                                    : 'hover:bg-[#141414]'
                                            } ${!contact.is_read ? 'font-bold bg-[#141414]/40' : 'opacity-80'}`}
                                        >
                                            <div className="flex items-center justify-between gap-2 mb-1.5">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    {!contact.is_read && (
                                                        <span className="w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                                                    )}
                                                    <span className="text-xs text-white uppercase truncate font-bold font-mono">
                                                        {contact.name}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-mono text-gray-500 shrink-0">
                                                    {formatDate(contact.created_at)}
                                                </span>
                                            </div>

                                            <p className="text-xs text-primary-400 font-mono truncate mb-1">
                                                {contact.subject || 'Sans objet'}
                                            </p>
                                            <p className="text-xs text-gray-400 line-clamp-2 font-mono text-[11px]">
                                                {contact.message}
                                            </p>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    {/* PANNEAU DE LECTURE DU MESSAGE */}
                    {selectedMessage && (
                        <div className="lg:col-span-6 border border-gray-800 bg-[#0E0E0E] p-6 space-y-6 relative sticky top-24">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                                <div>
                                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">DE</span>
                                    <h3 className="text-lg font-bold text-white uppercase font-display">{selectedMessage.name}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => toggleRead(selectedMessage.id)}
                                        className="p-2 border border-gray-800 hover:border-primary-500 text-gray-400 hover:text-white transition-colors"
                                        title={selectedMessage.is_read ? "Marquer non lu" : "Marquer lu"}
                                    >
                                        <CheckCircle2 size={14} className={selectedMessage.is_read ? "text-green-500" : ""} />
                                    </button>
                                    <button
                                        onClick={() => deleteMessage(selectedMessage.id)}
                                        className="p-2 border border-gray-800 hover:border-red-500 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 font-mono text-xs border-b border-gray-800 pb-4">
                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">EMAIL</span>
                                    <a href={`mailto:${selectedMessage.email}`} className="text-primary-500 hover:underline">
                                        {selectedMessage.email}
                                    </a>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">TÉLÉPHONE</span>
                                    <span className="text-gray-300">{selectedMessage.phone || 'Non renseigné'}</span>
                                </div>
                                {selectedMessage.service && (
                                    <div className="col-span-2">
                                        <span className="text-[10px] text-gray-500 block uppercase">SERVICE CONCERNÉ</span>
                                        <span className="text-white font-bold">{selectedMessage.service}</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <span className="text-[10px] font-mono text-gray-500 block uppercase mb-1">SUJET</span>
                                <h4 className="text-sm font-bold text-white font-mono">{selectedMessage.subject}</h4>
                            </div>

                            <div>
                                <span className="text-[10px] font-mono text-gray-500 block uppercase mb-2">CORPS DU MESSAGE</span>
                                <div className="p-4 bg-[#141414] border border-gray-800 text-xs font-mono text-gray-200 whitespace-pre-wrap leading-relaxed">
                                    {selectedMessage.message}
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=RE: ${encodeURIComponent(selectedMessage.subject || 'Votre demande DCA')}`}
                                    className="flex-1 text-center py-2.5 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors"
                                >
                                    RÉPONDRE PAR EMAIL
                                </a>
                                {selectedMessage.phone && (
                                    <a
                                        href={`https://wa.me/${selectedMessage.phone.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="py-2.5 px-4 border border-gray-700 hover:border-green-500 text-gray-300 hover:text-green-400 font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5"
                                    >
                                        <MessageSquare size={14} /> WHATSAPP
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </AdminLayout>
    )
}
