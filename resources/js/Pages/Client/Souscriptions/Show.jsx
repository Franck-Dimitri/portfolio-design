import { Link, Head, useForm } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    ArrowLeft,
    DownloadCloud,
    FileText,
    MessageSquareText,
    Send,
    Paperclip,
    Sparkles,
    CheckCircle2,
    Clock,
    AlertCircle,
    Calendar,
    Receipt,
    ExternalLink,
    HelpCircle
} from 'lucide-react'
import { useState, useRef } from 'react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const formatDateTime = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

export default function Show({
    souscription = {},
    whatsappNumber = "237690112233"
}) {
    const fileInputRef = useRef(null)
    const [fileName, setFileName] = useState('')

    const { data, setData, post, processing, reset } = useForm({
        message: '',
        attachment: null,
    })

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!data.message.trim() && !data.attachment) return

        post(route('client.souscriptions.message', souscription.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                setFileName('')
                if (fileInputRef.current) fileInputRef.current.value = ''
            }
        })
    }

    const title = souscription.servicePackage?.titre || souscription.service?.titre || 'Prestation de Design'
    const price = souscription.payment?.amount || souscription.montant || souscription.servicePackage?.prix || souscription.service?.prix
    const livrables = souscription.livrables || []
    const messages = souscription.messages || []

    const getStatusBadge = (status) => {
        switch (status) {
            case 'termine':
                return <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">✓ Livré & Validé</span>
            case 'en_cours':
                return <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">🎨 En cours de création</span>
            case 'en_revision':
                return <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">⚡ En révision</span>
            default:
                return <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-700/40 text-slate-300 border border-slate-700">⏳ En attente</span>
        }
    }

    return (
        <ClientLayout title={`Commande #${souscription.reference}`}>
            <Head title={`Commande #${souscription.reference} — Espace Client`} />

            <div className="space-y-8">

                {/* ══════════════════════════════════════════════════
                    § 1 – TOP BAR NAVIGATION & HEADER
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/client/souscriptions"
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                            title="Retour à mes commandes"
                        >
                            <ArrowLeft size={18} />
                        </Link>

                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                                    {title}
                                </h1>
                                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                                    #{souscription.reference}
                                </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Commandé le {formatDate(souscription.created_at)} • Montant : <strong className="text-amber-400">{formatPrix(price)}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=Bonjour%20Franck,%20je%20vous%20contacte%20au%20sujet%20de%20ma%20commande%20%23${souscription.reference}.`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black font-semibold text-xs border border-emerald-500/30 transition-all"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            <span>WhatsApp Designer</span>
                        </a>

                        <a
                            href={`/invoices/${souscription.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
                        >
                            <FileText size={14} />
                            <span>Facture officielle</span>
                        </a>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – STEPPER DE PRODUCTION
                ══════════════════════════════════════════════════ */}
                <div className="p-6 md:p-8 rounded-3xl bg-[#14171F] border border-slate-800/90 shadow-md space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-white">
                            État d'Avancement de la Création
                        </h2>
                        {getStatusBadge(souscription.statut_production)}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                        {[
                            { step: 1, label: '1. Briefing', desc: 'Commande validée', done: true },
                            { step: 2, label: '2. Création', desc: 'Recherches & Design', done: ['en_cours', 'en_revision', 'termine'].includes(souscription.statut_production) },
                            { step: 3, label: '3. Révisions', desc: 'Retouches & Ajustements', done: ['en_revision', 'termine'].includes(souscription.statut_production) },
                            { step: 4, label: '4. Finalisation', desc: 'Exports HD disponibles', done: souscription.statut_production === 'termine' },
                        ].map((s) => (
                            <div key={s.step} className={`p-4 rounded-2xl border transition-all ${
                                s.done
                                    ? 'bg-emerald-500/5 border-emerald-500/30 text-emerald-300'
                                    : 'bg-slate-900/60 border-slate-800 text-slate-500'
                            }`}>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                        s.done ? 'bg-emerald-500 text-black' : 'bg-slate-800 text-slate-400'
                                    }`}>
                                        {s.done ? '✓' : s.step}
                                    </div>
                                    <span className="font-bold text-xs">{s.label}</span>
                                </div>
                                <p className="text-[11px] text-slate-400">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 3 – GRILLE : LIVRABLES ET BRIEFING
                ══════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Colonne Gauche : Livrables & Téléchargements (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Livrables Prêts */}
                        <div className="p-6 rounded-3xl bg-[#14171F] border border-slate-800/80 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DownloadCloud size={18} className="text-emerald-400" />
                                    <h3 className="text-base font-bold text-white">Livrables & Fichiers Finaux</h3>
                                </div>
                                <span className="text-xs font-semibold text-slate-400">
                                    {livrables.length} fichier(s)
                                </span>
                            </div>

                            {livrables.length === 0 ? (
                                <div className="p-8 text-center rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs space-y-2">
                                    <p>Les fichiers finaux (Logos, exports vectoriels AI/SVG/PNG, maquettes Figma) seront déposés ici dès la fin de la production.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {livrables.map((livrable) => (
                                        <div
                                            key={livrable.id}
                                            className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                                        >
                                            <div className="space-y-1">
                                                <h4 className="text-sm font-bold text-white">
                                                    {livrable.nom}
                                                </h4>
                                                {livrable.message && (
                                                    <p className="text-xs text-slate-300">
                                                        "{livrable.message}"
                                                    </p>
                                                )}
                                                <p className="text-[11px] text-slate-500">
                                                    Déposé le {formatDate(livrable.created_at)}
                                                </p>
                                            </div>

                                            <a
                                                href={`/storage/${livrable.fichier_path}`}
                                                download
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition-all shrink-0"
                                            >
                                                <DownloadCloud size={15} />
                                                <span>Télécharger</span>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Fil de Discussion Studio */}
                        <div className="p-6 rounded-3xl bg-[#14171F] border border-slate-800/80 space-y-6">
                            <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
                                <MessageSquareText size={18} className="text-amber-400" />
                                <h3 className="text-base font-bold text-white">
                                    Échanges & Retours avec le Designer
                                </h3>
                            </div>

                            {/* Messages Stream */}
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {messages.length === 0 ? (
                                    <div className="p-6 text-center text-xs text-slate-400 bg-slate-900/60 rounded-2xl">
                                        Posez une question ou formulez vos retours ci-dessous. Franck Dims vous répondra dans les plus brefs délais.
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isAdmin = msg.sender_type === 'admin'
                                        return (
                                            <div
                                                key={msg.id}
                                                className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'} space-y-1`}
                                            >
                                                <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                                                    <span>{isAdmin ? "Franck Dims (Studio)" : "Vous"}</span>
                                                    <span>•</span>
                                                    <span>{formatDateTime(msg.created_at)}</span>
                                                </div>

                                                <div
                                                    className={`p-4 rounded-2xl max-w-md text-xs leading-relaxed ${
                                                        isAdmin
                                                            ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                                                            : 'bg-amber-400 text-slate-950 font-medium rounded-tr-none shadow-md'
                                                    }`}
                                                >
                                                    <p>{msg.message}</p>

                                                    {msg.attachment_path && (
                                                        <a
                                                            href={`/storage/${msg.attachment_path}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold underline ${
                                                                isAdmin ? 'text-amber-300' : 'text-slate-900'
                                                            }`}
                                                        >
                                                            <Paperclip size={12} />
                                                            <span>{msg.attachment_name || 'Pièce jointe'}</span>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            {/* Formulaire Réponse */}
                            <form onSubmit={handleSendMessage} className="space-y-3 pt-4 border-t border-slate-800">
                                <div className="relative">
                                    <textarea
                                        rows={3}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Écrivez votre message ou vos retours sur le design..."
                                        className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-amber-400 text-white text-xs placeholder-slate-500 focus:ring-0 transition-colors"
                                    />
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                setData('attachment', file)
                                                setFileName(file ? file.name : '')
                                            }}
                                            className="hidden"
                                            id="chat-file"
                                        />
                                        <label
                                            htmlFor="chat-file"
                                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
                                        >
                                            <Paperclip size={14} />
                                            <span>Joindre un fichier</span>
                                        </label>

                                        {fileName && (
                                            <span className="text-[11px] text-amber-300 font-medium truncate max-w-xs">
                                                {fileName}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || (!data.message.trim() && !data.attachment)}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs disabled:opacity-40 transition-all cursor-pointer shadow-md"
                                    >
                                        <Send size={14} />
                                        <span>{processing ? 'Envoi...' : 'Envoyer'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Colonne Droite : Détails Commande & Brief (1 col) */}
                    <div className="space-y-6">

                        {/* Briefing du Client */}
                        <div className="p-6 rounded-3xl bg-[#14171F] border border-slate-800/80 space-y-4">
                            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                                Récapitulatif du Brief
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div>
                                    <span className="text-slate-500 font-medium block">Nom du client :</span>
                                    <span className="text-slate-200 font-semibold">{souscription.client_nom}</span>
                                </div>

                                <div>
                                    <span className="text-slate-500 font-medium block">Email :</span>
                                    <span className="text-slate-200">{souscription.client_email}</span>
                                </div>

                                <div>
                                    <span className="text-slate-500 font-medium block">Téléphone / WhatsApp :</span>
                                    <span className="text-slate-200">{souscription.client_telephone || '—'}</span>
                                </div>

                                {souscription.besoins && (
                                    <div className="pt-2 border-t border-slate-800/80">
                                        <span className="text-slate-500 font-medium block mb-1">Besoins exprimés :</span>
                                        <p className="text-slate-300 bg-slate-900/80 p-3 rounded-xl leading-relaxed">
                                            {souscription.besoins}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Assistance Rapide */}
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-[#14171F] border border-slate-800 text-center space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                                <HelpCircle size={20} />
                            </div>
                            <h4 className="text-sm font-bold text-white">Une question urgente ?</h4>
                            <p className="text-xs text-slate-400">
                                Contactez directement votre directeur artistique sur WhatsApp.
                            </p>
                            <a
                                href={`https://wa.me/${whatsappNumber}?text=Bonjour%20Franck,%20je%20souhaite%20des%20pr%C3%A9cisions%20sur%20ma%20commande%20%23${souscription.reference}.`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-md transition-all"
                            >
                                <span>Ouvrir WhatsApp</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>

                    </div>

                </div>

            </div>
        </ClientLayout>
    )
}
