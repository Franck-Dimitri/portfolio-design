import { Link, Head, useForm } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    ArrowLeft,
    Clock,
    CheckCircle2,
    DownloadCloud,
    Send,
    Paperclip,
    Receipt,
    HelpCircle,
    User,
    Calendar,
    FolderDown,
    ExternalLink
} from 'lucide-react'
import { useState, useRef } from 'react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'
const formatDateTime = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

export default function Show({
    subscription = {},
    livrables = [],
    messages = [],
    whatsappNumber = "237690112233"
}) {
    const fileInputRef = useRef(null)
    const [fileName, setFileName] = useState('')

    const { data, setData, post, processing, reset } = useForm({
        message: '',
        attachment: null,
    })

    const title = subscription.servicePackage?.titre || subscription.service?.titre || 'Design sur mesure'
    const price = subscription.payment?.amount || subscription.montant || subscription.servicePackage?.prix || subscription.service?.prix

    const steps = [
        { key: 'attente_brief', label: '1. Brief validé', desc: 'Cahier des charges' },
        { key: 'en_cours', label: '2. En création', desc: 'Direction artistique' },
        { key: 'en_revision', label: '3. Révisions', desc: 'Ajustements & retours' },
        { key: 'termine', label: '4. Livré & Clôturé', desc: 'Fichiers finaux HD' },
    ]

    const getStepIndex = (status) => {
        if (!status || status === 'attente_brief') return 0
        if (status === 'en_cours') return 1
        if (status === 'en_revision') return 2
        if (status === 'termine') return 3
        return 0
    }

    const currentStepIdx = getStepIndex(subscription.statut_production)

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!data.message.trim() && !data.attachment) return

        post(route('client.souscriptions.message', subscription.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                setFileName('')
                if (fileInputRef.current) fileInputRef.current.value = ''
            }
        })
    }

    return (
        <ClientLayout title={`Commande #${subscription.reference}`}>
            <Head title={`Commande #${subscription.reference} — Espace Client`} />

            <div className="w-full space-y-8">

                {/* ══════════════════════════════════════════════════
                    § 1 – RETOUR & EN-TÊTE COMMANDE
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <Link
                            href="/client/souscriptions"
                            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-500 font-semibold transition-colors mb-2"
                        >
                            <ArrowLeft size={14} />
                            <span>Retour à mes commandes</span>
                        </Link>
                        <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            {title}
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Référence : <span className="font-mono text-primary-500 font-bold">#{subscription.reference}</span> • Commandé le {formatDate(subscription.created_at)}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={`https://wa.me/${whatsappNumber}?text=Bonjour%20Franck,%20je%20vous%20contacte%20concernant%20ma%20commande%20%23${subscription.reference}.`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white border border-emerald-500/20 text-xs font-bold transition-all"
                        >
                            <span>Assistance WhatsApp</span>
                        </a>

                        <a
                            href={`/invoices/${subscription.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors"
                        >
                            <Receipt size={14} />
                            <span>Facture</span>
                        </a>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – STEPPER DE PRODUCTION
                ══════════════════════════════════════════════════ */}
                <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                        Progression de la Création
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {steps.map((st, idx) => {
                            const isDone = idx <= currentStepIdx
                            const isCurrent = idx === currentStepIdx

                            return (
                                <div
                                    key={st.key}
                                    className={`p-4 rounded-2xl border transition-all ${
                                        isCurrent
                                            ? 'bg-primary-500/10 border-primary-500/40 text-primary-600 dark:text-primary-400'
                                            : isDone
                                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800 text-neutral-400'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 mb-1.5">
                                        {isDone ? (
                                            <CheckCircle2 size={16} className={isCurrent ? 'text-primary-500' : 'text-emerald-500'} />
                                        ) : (
                                            <Clock size={16} />
                                        )}
                                        <span className="text-xs font-bold">{st.label}</span>
                                    </div>
                                    <p className="text-[11px] opacity-80">{st.desc}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 3 – GRILLE 2 COLONNES : LIVRABLES & DISCUSSION
                ══════════════════════════════════════════════════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Colonne 1 : Fichiers Livrables */}
                    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
                        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                                Fichiers Livrables ({livrables.length})
                            </h3>
                            <span className="text-xs text-neutral-500">Haute Définition</span>
                        </div>

                        {livrables.length === 0 ? (
                            <div className="p-8 text-center rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-dashed border-neutral-200 dark:border-neutral-800 space-y-2">
                                <FolderDown size={28} className="mx-auto text-neutral-400" />
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                                    Vos fichiers finaux seront téléchargeables ici dès validation des maquettes.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {livrables.map((l) => (
                                    <div
                                        key={l.id}
                                        className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">{l.nom}</p>
                                            {l.message && (
                                                <p className="text-[11px] text-neutral-500 italic truncate mt-0.5">
                                                    "{l.message}"
                                                </p>
                                            )}
                                        </div>

                                        <a
                                            href={`/storage/${l.fichier_path}`}
                                            download
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs shadow-sm transition-all shrink-0"
                                        >
                                            <DownloadCloud size={13} />
                                            <span>Télécharger</span>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Colonne 2 : Fil de Discussion / Tchat Studio */}
                    <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-6">
                        <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
                            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                                Échanges & Retours Studio
                            </h3>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                                Discutez directement avec Franck Dims
                            </p>
                        </div>

                        {/* Liste des messages */}
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2 flex-1">
                            {messages.length === 0 ? (
                                <div className="p-6 text-center text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl">
                                    Aucun message pour le moment. Vous pouvez poser une question ou envoyer vos remarques ci-dessous.
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isAdmin = msg.sender_type === 'admin'
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'} space-y-1`}
                                        >
                                            <span className="text-[10px] text-neutral-400 px-1">
                                                {isAdmin ? "Franck Dims (Designer)" : "Vous"} • {formatDateTime(msg.created_at)}
                                            </span>

                                            <div
                                                className={`p-3.5 rounded-2xl max-w-sm text-xs leading-relaxed ${
                                                    isAdmin
                                                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-tl-none'
                                                        : 'bg-primary-500 text-white font-medium rounded-tr-none shadow-md shadow-primary-500/20'
                                                }`}
                                            >
                                                <p>{msg.message}</p>
                                                {msg.attachment_path && (
                                                    <a
                                                        href={`/storage/${msg.attachment_path}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={`mt-2 inline-flex items-center gap-1 text-[11px] underline font-bold ${
                                                            isAdmin ? 'text-primary-500' : 'text-white'
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

                        {/* Formulaire réponse */}
                        <form onSubmit={handleSendMessage} className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <textarea
                                rows={2}
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                placeholder="Votre message ou retour..."
                                className="w-full p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-primary-500 text-neutral-900 dark:text-white text-xs placeholder-neutral-400 focus:ring-0 transition-colors"
                            />

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
                                        id="sub-file-input"
                                    />
                                    <label
                                        htmlFor="sub-file-input"
                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs font-semibold cursor-pointer transition-colors"
                                    >
                                        <Paperclip size={13} />
                                        <span>Fichier</span>
                                    </label>
                                    {fileName && (
                                        <span className="text-[11px] text-primary-500 font-medium truncate max-w-xs">
                                            {fileName}
                                        </span>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || (!data.message.trim() && !data.attachment)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-primary-500/20"
                                >
                                    <Send size={13} />
                                    <span>Envoyer</span>
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

            </div>
        </ClientLayout>
    )
}
