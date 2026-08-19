// resources/js/Pages/Admin/pages/Packages/SouscriptionDetail.jsx
import { useState, useRef } from 'react'
import { useForm, Link, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    ArrowLeft, User, Mail, Phone, MessageCircle, Building2,
    Package, CreditCard, Clock, CheckCircle2, Upload, FileText,
    Download, Send, AlertCircle, Calendar, RefreshCw, X,
    Paperclip, MessageSquare, Star, Zap, Terminal, Focus, ChevronRight, Shield
} from 'lucide-react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDateTime = (d) => d ? new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
}) : '—'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'

const STATUTS_PROD = [
    { value: 'non_demarre', label: 'Non démarré' },
    { value: 'en_cours',    label: 'En cours' },
    { value: 'en_revision', label: 'En révision' },
    { value: 'termine',     label: 'Terminé' },
    { value: 'archive',     label: 'Archivé' },
]

export default function SouscriptionDetail({ souscription }) {
    if (!souscription) return null

    const item = souscription.service_package || souscription.service || {}
    const clientNom = souscription.client_nom || souscription.user?.name || 'Client'
    const clientEmail = souscription.client_email || souscription.user?.email || '—'
    const clientPhone = souscription.client_telephone || '—'
    const clientWhatsApp = souscription.client_whatsapp || souscription.client_telephone

    // ── Formulaire Statut Production ──
    const statutForm = useForm({
        statut_production: souscription.statut_production || 'non_demarre',
        notes_admin: souscription.notes_admin || '',
        date_livraison_estimee: souscription.date_livraison_estimee ? souscription.date_livraison_estimee.substring(0, 10) : '',
    })

    const handleStatutSubmit = (e) => {
        e.preventDefault()
        statutForm.patch(route('admin.souscriptions.statut', souscription.id))
    }

    // ── Formulaire Upload Livrable ──
    const fileRef = useRef()
    const [filePreview, setFilePreview] = useState(null)
    const livrableForm = useForm({
        fichier: null,
        nom: '',
        message: '',
        type: 'livrable',
    })

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        livrableForm.setData('fichier', file)
        if (!livrableForm.data.nom) {
            livrableForm.setData('nom', file.name.replace(/\.[^.]+$/, ''))
        }
        setFilePreview(file.name)
    }

    const handleLivrableSubmit = (e) => {
        e.preventDefault()
        livrableForm.post(route('admin.souscriptions.livrable', souscription.id), {
            forceFormData: true,
            onSuccess: () => {
                livrableForm.reset()
                setFilePreview(null)
            }
        })
    }

    return (
        <AdminLayout title={`Commande ${souscription.reference}`}>
            <div className="space-y-8">

                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('admin.souscriptions.index')}
                            className="p-2 border border-gray-800 hover:border-primary-500 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] text-primary-500 uppercase tracking-widest font-bold">
                                <Terminal size={12} />
                                <span>COMMANDE #{souscription.reference}</span>
                            </div>
                            <h1 className="text-2xl font-display font-bold uppercase text-white tracking-tight">
                                {clientNom} // <span className="text-primary-500">{item.titre || item.nom || 'Prestation'}</span>
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {souscription.status === 'active' ? (
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-mono font-bold uppercase tracking-widest">
                                PAYÉ ✓ ({formatPrix(souscription.montant)})
                            </span>
                        ) : (
                            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-xs font-mono font-bold uppercase tracking-widest">
                                {souscription.status} ({formatPrix(souscription.montant)})
                            </span>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ══════════════════════════════════════════════════
                        COLONNE GAUCHE (INFOS & PRODUCTION) - 8 COLS
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* SECTION STATUT PRODUCTION & ÉCHÉANCES */}
                        <div className="border border-gray-800 bg-[#0E0E0E] p-6 relative">
                            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary-500"></div>
                            
                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-4 pb-2 border-b border-gray-800">
                                <Clock size={14} />
                                <span>PILOTAGE DE LA PRODUCTION</span>
                            </div>

                            <form onSubmit={handleStatutSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                                            Statut d'avancement
                                        </label>
                                        <select
                                            value={statutForm.data.statut_production}
                                            onChange={(e) => statutForm.setData('statut_production', e.target.value)}
                                            className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                        >
                                            {STATUTS_PROD.map((s) => (
                                                <option key={s.value} value={s.value}>{s.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                                            Date de livraison estimée
                                        </label>
                                        <input
                                            type="date"
                                            value={statutForm.data.date_livraison_estimee}
                                            onChange={(e) => statutForm.setData('date_livraison_estimee', e.target.value)}
                                            className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">
                                        Notes internes & Instructions administratives
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={statutForm.data.notes_admin}
                                        onChange={(e) => statutForm.setData('notes_admin', e.target.value)}
                                        placeholder="Notes de production, remarques du designer, exigences particulières..."
                                        className="w-full bg-[#141414] border border-gray-800 text-white p-3 text-xs font-mono focus:border-primary-500 focus:outline-none placeholder:text-gray-600"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={statutForm.processing}
                                        className="px-5 py-2.5 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors disabled:opacity-50"
                                    >
                                        {statutForm.processing ? 'ENREGISTREMENT...' : 'METTRE À JOUR LE STATUT'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* SECTION LIVRABLES & EXPÉDITION */}
                        <div className="border border-gray-800 bg-[#0E0E0E] p-6 relative">
                            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary-500"></div>

                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-4 pb-2 border-b border-gray-800">
                                <Upload size={14} />
                                <span>EXPÉDIER UN LIVRABLE (MAX 50 MO)</span>
                            </div>

                            <form onSubmit={handleLivrableSubmit} className="space-y-4">
                                <div
                                    onClick={() => fileRef.current?.click()}
                                    className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                                        filePreview 
                                            ? 'border-primary-500 bg-primary-500/5' 
                                            : 'border-gray-800 hover:border-gray-700 bg-[#121212]'
                                    }`}
                                >
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                    {filePreview ? (
                                        <div className="flex items-center justify-center gap-2 font-mono text-xs text-primary-400">
                                            <Paperclip size={16} />
                                            <span className="font-bold">{filePreview}</span>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setFilePreview(null)
                                                    livrableForm.setData('fichier', null)
                                                }}
                                                className="text-gray-500 hover:text-red-400 ml-2"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <Upload size={24} className="mx-auto text-gray-500 mb-2" />
                                            <p className="text-xs font-mono text-gray-300 uppercase tracking-wider font-bold">
                                                CLIQUEZ OU GLISSEZ LE FICHIER LIVRABLE ICI
                                            </p>
                                            <p className="text-[10px] font-mono text-gray-500">
                                                Formats acceptés : ZIP, PDF, PNG, JPG, AI, PSD, FIGMA (Jusqu'à 50 Mo)
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {livrableForm.errors.fichier && (
                                    <p className="text-red-400 font-mono text-xs">{livrableForm.errors.fichier}</p>
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                            Nom du livrable
                                        </label>
                                        <input
                                            type="text"
                                            value={livrableForm.data.nom}
                                            onChange={(e) => livrableForm.setData('nom', e.target.value)}
                                            placeholder="Ex: Identité Visuelle Finale v1.0"
                                            className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                            Type de fichier
                                        </label>
                                        <select
                                            value={livrableForm.data.type}
                                            onChange={(e) => livrableForm.setData('type', e.target.value)}
                                            className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                        >
                                            <option value="livrable">Livrable Final (Marque la commande terminée)</option>
                                            <option value="apercu">Aperçu / Prototype / Maquette</option>
                                            <option value="revision">Révision intermédiaire</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                        Message au client (inclus dans l'Email & WhatsApp)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={livrableForm.data.message}
                                        onChange={(e) => livrableForm.setData('message', e.target.value)}
                                        placeholder="Message accompagnant la livraison..."
                                        className="w-full bg-[#141414] border border-gray-800 text-white p-3 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={livrableForm.processing || !livrableForm.data.fichier}
                                        className="px-6 py-2.5 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Send size={14} />
                                        {livrableForm.processing ? 'TÉLÉVERSEMENT...' : 'ENVOYER LE LIVRABLE'}
                                    </button>
                                </div>
                            </form>

                            {/* HISTORIQUE DES LIVRABLES */}
                            <div className="mt-8 pt-6 border-t border-gray-800">
                                <h3 className="font-mono text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">
                                    HISTORIQUE DES LIVRABLES TRANSMIS ({souscription.livrables?.length || 0})
                                </h3>

                                {souscription.livrables?.length === 0 ? (
                                    <p className="text-gray-500 text-xs font-mono py-4 text-center">
                                        Aucun livrable transmis pour cette commande.
                                    </p>
                                ) : (
                                    <div className="divide-y divide-gray-800/60 border border-gray-800">
                                        {souscription.livrables?.map((liv) => (
                                            <div key={liv.id} className="p-3.5 flex items-center justify-between gap-4 hover:bg-[#141414] transition-colors">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-8 h-8 border border-gray-800 bg-[#161616] text-primary-500 flex items-center justify-center shrink-0">
                                                        <FileText size={14} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-xs font-bold text-white uppercase truncate">{liv.nom}</p>
                                                        <p className="text-[10px] font-mono text-gray-500">
                                                            {liv.fichier_nom_original} • {liv.taille_formattee} • {formatDate(liv.created_at)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono">
                                                        {liv.notifie_email && (
                                                            <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/30">MAIL ✓</span>
                                                        )}
                                                        {liv.notifie_whatsapp && (
                                                            <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/30">WHATSAPP ✓</span>
                                                        )}
                                                    </div>
                                                    <a
                                                        href={`/storage/${liv.fichier_path}`}
                                                        target="_blank"
                                                        download
                                                        className="p-1.5 border border-gray-700 hover:border-primary-500 text-gray-300 hover:text-white transition-colors"
                                                        title="Télécharger"
                                                    >
                                                        <Download size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    {/* ══════════════════════════════════════════════════
                        COLONNE DROITE (COORDONNÉES & DÉTAILS) - 4 COLS
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* COORDONNÉES CLIENT */}
                        <div className="border border-gray-800 bg-[#0E0E0E] p-5">
                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-4 pb-2 border-b border-gray-800">
                                <User size={14} />
                                <span>COORDONNÉES CLIENT</span>
                            </div>

                            <div className="space-y-3 font-mono text-xs">
                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Nom complet</span>
                                    <span className="font-bold text-white">{clientNom}</span>
                                </div>

                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Adresse email</span>
                                    <a href={`mailto:${clientEmail}`} className="text-gray-300 hover:text-primary-500 transition-colors">
                                        {clientEmail}
                                    </a>
                                </div>

                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Téléphone</span>
                                    <a href={`tel:${clientPhone}`} className="text-gray-300 hover:text-primary-500 transition-colors">
                                        {clientPhone}
                                    </a>
                                </div>

                                {clientWhatsApp && (
                                    <div>
                                        <span className="text-[10px] text-gray-500 block uppercase">Ligne WhatsApp</span>
                                        <a
                                            href={`https://wa.me/${clientWhatsApp.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1 text-green-400 hover:underline"
                                        >
                                            <MessageCircle size={12} /> {clientWhatsApp}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DÉTAILS PRESTATION */}
                        <div className="border border-gray-800 bg-[#0E0E0E] p-5">
                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-4 pb-2 border-b border-gray-800">
                                <Package size={14} />
                                <span>PRESTATION SOUSCRITE</span>
                            </div>

                            <div className="space-y-3 font-mono text-xs">
                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Désignation</span>
                                    <span className="font-bold text-white text-sm">{item.titre || item.nom || 'Sur-mesure'}</span>
                                </div>

                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Montant total</span>
                                    <span className="font-bold text-primary-500 text-lg">{formatPrix(souscription.montant)}</span>
                                </div>

                                {souscription.duration_months && (
                                    <div>
                                        <span className="text-[10px] text-gray-500 block uppercase">Durée d'engagement</span>
                                        <span className="text-gray-300">{souscription.duration_months} mois</span>
                                    </div>
                                )}

                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Date de création</span>
                                    <span className="text-gray-400">{formatDateTime(souscription.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* BRIEF / BESOINS EXPRIMÉS */}
                        {souscription.besoins && (
                            <div className="border border-gray-800 bg-[#0E0E0E] p-5">
                                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-3 pb-2 border-b border-gray-800">
                                    <MessageSquare size={14} />
                                    <span>BRIEF DU CLIENT</span>
                                </div>
                                <p className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {souscription.besoins}
                                </p>
                            </div>
                        )}

                    </div>

                </div>

            </div>
        </AdminLayout>
    )
}