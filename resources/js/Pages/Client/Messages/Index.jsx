import { Link, Head, useForm, router } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    MessageSquareText,
    Send,
    Paperclip,
    ArrowRight
} from 'lucide-react'
import { useState, useRef } from 'react'

const formatDateTime = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'

export default function Index({
    subscriptions = [],
    selectedSubscription = null,
    whatsappNumber = "237690112233",
    adminEmail = "contact@dimscreative.com"
}) {
    const fileInputRef = useRef(null)
    const [fileName, setFileName] = useState('')

    const { data, setData, post, processing, reset } = useForm({
        message: '',
        attachment: null,
    })

    const handleSelectSub = (subId) => {
        router.get(route('client.messages.index'), { sub_id: subId }, { preserveState: true })
    }

    const handleSendMessage = (e) => {
        e.preventDefault()
        if (!selectedSubscription || (!data.message.trim() && !data.attachment)) return

        post(route('client.souscriptions.message', selectedSubscription.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                setFileName('')
                if (fileInputRef.current) fileInputRef.current.value = ''
            }
        })
    }

    const messages = selectedSubscription?.messages || []

    return (
        <ClientLayout title="Messagerie & Support Studio">
            <Head title="Messagerie — Espace Client" />

            <div className="w-full space-y-6">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Messagerie Studio & Support
                        </h1>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            Échangez directement avec Franck Dims sur chacune de vos commandes.
                        </p>
                    </div>

                    <a
                        href={`https://wa.me/${whatsappNumber}?text=Bonjour%20Franck,%20je%20vous%20contacte%20depuis%20la%20messagerie%20de%20mon%20espace%20client.`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 dark:text-emerald-400 hover:text-white font-semibold text-xs border border-emerald-500/20 transition-all shrink-0"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Assistance WhatsApp Directe</span>
                    </a>
                </div>

                {subscriptions.length === 0 ? (
                    <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto">
                            <MessageSquareText size={24} />
                        </div>
                        <h3 className="text-base font-bold text-neutral-900 dark:text-white">Aucune discussion en cours</h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                            Passez une commande pour ouvrir un fil de discussion direct avec votre designer.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Liste des conversations (1 col) */}
                        <div className="p-4 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 space-y-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-2">
                                Discussions par Commande
                            </h3>

                            <div className="space-y-1.5">
                                {subscriptions.map((sub) => {
                                    const isSelected = selectedSubscription?.id === sub.id
                                    const title = sub.servicePackage?.titre || sub.service?.titre || 'Prestation'

                                    return (
                                        <button
                                            key={sub.id}
                                            type="button"
                                            onClick={() => handleSelectSub(sub.id)}
                                            className={`
                                                w-full text-left p-3.5 rounded-2xl transition-all block cursor-pointer
                                                ${isSelected
                                                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20 font-semibold'
                                                    : 'bg-neutral-50 dark:bg-neutral-900/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800'
                                                }
                                            `}
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-bold truncate">
                                                    {title}
                                                </span>
                                                <span className={`text-[10px] font-mono ${isSelected ? 'text-white/80' : 'text-neutral-400'}`}>
                                                    #{sub.reference}
                                                </span>
                                            </div>
                                            <p className={`text-[11px] mt-1 truncate ${isSelected ? 'text-white/80' : 'text-neutral-500 dark:text-neutral-400'}`}>
                                                {sub.messages?.length ? `${sub.messages.length} message(s)` : 'Nouveau fil'}
                                            </p>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Zone de discussion (2 cols) */}
                        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#121212] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-6">
                            {selectedSubscription ? (
                                <>
                                    {/* Header fil */}
                                    <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                                        <div>
                                            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                                                {selectedSubscription.servicePackage?.titre || selectedSubscription.service?.titre}
                                            </h3>
                                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                Commande #{selectedSubscription.reference}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/client/souscriptions/${selectedSubscription.id}`}
                                            className="text-xs text-primary-500 hover:underline font-semibold flex items-center gap-1"
                                        >
                                            <span>Fiche commande</span>
                                            <ArrowRight size={13} />
                                        </Link>
                                    </div>

                                    {/* Flux des messages */}
                                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2 flex-1">
                                        {messages.length === 0 ? (
                                            <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl">
                                                Démarrez la conversation ci-dessous pour transmettre vos questions ou retours.
                                            </div>
                                        ) : (
                                            messages.map((msg) => {
                                                const isAdmin = msg.sender_type === 'admin'
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex flex-col ${isAdmin ? 'items-start' : 'items-end'} space-y-1`}
                                                    >
                                                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 px-1">
                                                            <span>{isAdmin ? "Franck Dims (Designer)" : "Vous"}</span>
                                                            <span>•</span>
                                                            <span>{formatDateTime(msg.created_at)}</span>
                                                        </div>

                                                        <div
                                                            className={`p-4 rounded-2xl max-w-md text-xs leading-relaxed ${
                                                                isAdmin
                                                                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-tl-none border border-neutral-200 dark:border-neutral-700'
                                                                    : 'bg-primary-500 text-white font-medium rounded-tr-none shadow-md shadow-primary-500/20'
                                                            }`}
                                                        >
                                                            <p>{msg.message}</p>

                                                            {msg.attachment_path && (
                                                                <a
                                                                    href={`/storage/${msg.attachment_path}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className={`mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold underline ${
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
                                            rows={3}
                                            value={data.message}
                                            onChange={(e) => setData('message', e.target.value)}
                                            placeholder="Écrivez votre message à Franck Dims..."
                                            className="w-full p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 focus:border-primary-500 text-neutral-900 dark:text-white text-xs placeholder-neutral-400 focus:ring-0 transition-colors"
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
                                                    id="msg-hub-file"
                                                />
                                                <label
                                                    htmlFor="msg-hub-file"
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold cursor-pointer transition-colors"
                                                >
                                                    <Paperclip size={14} />
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
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold text-xs disabled:opacity-40 transition-all cursor-pointer shadow-md shadow-primary-500/20"
                                            >
                                                <Send size={14} />
                                                <span>Envoyer</span>
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="p-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
                                    Sélectionnez une commande à gauche pour afficher la discussion.
                                </div>
                            )}
                        </div>

                    </div>
                )}

            </div>
        </ClientLayout>
    )
}
