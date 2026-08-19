import { useState, useRef } from 'react'
import { useForm, Link } from '@inertiajs/react'
import ClientLayout from '@/Layouts/ClientLayout'
import {
    ArrowLeft, Download, FileText, Send, Paperclip, X,
    CheckCircle2, Clock, Sparkles, Terminal, Printer,
    MessageSquare, AlertCircle, Package, Shield, Check, MessageCircle
} from 'lucide-react'

const formatPrix = (v) => new Intl.NumberFormat('fr-FR').format(v || 0) + ' FCFA'
const formatDateTime = (d) => d ? new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
}) : '—'
const formatDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric' }) : '—'

export default function Show({ souscription }) {
    if (!souscription) return null

    const item = souscription.service_package || souscription.service || {}
    const [filePreview, setFilePreview] = useState(null)
    const fileRef = useRef()

    const messageForm = useForm({
        message: '',
        attachment: null,
    })

    const handleMsgSubmit = (e) => {
        e.preventDefault()
        messageForm.post(route('client.souscriptions.message', souscription.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                messageForm.reset()
                setFilePreview(null)
            }
        })
    }

    // Calcul de l'étape de production actuelle
    const getStepIndex = (status) => {
        switch (status) {
            case 'termine': return 4;
            case 'en_revision': return 3;
            case 'en_cours': return 2;
            default: return 1;
        }
    }
    const currentStep = getStepIndex(souscription.statut_production)

    return (
        <ClientLayout title={`Suivi Commande ${souscription.reference}`}>
            <div className="space-y-8">

                {/* ── HEADER ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('client.souscriptions.index')}
                            className="p-2 border border-gray-800 hover:border-primary-500 text-gray-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] text-primary-500 uppercase tracking-widest font-bold">
                                <Terminal size={12} />
                                <span>SUIVI EN TEMPS RÉEL // RÉF. {souscription.reference}</span>
                            </div>
                            <h1 className="text-2xl font-display font-bold uppercase text-white tracking-tight">
                                {item.titre || item.nom || 'Prestation de Design'}
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <a
                            href={route('invoices.show', souscription.id)}
                            target="_blank"
                            className="inline-flex items-center gap-2 border border-gray-700 hover:border-primary-500 text-gray-300 hover:text-white px-4 py-2 font-mono text-xs uppercase tracking-widest bg-[#141414] transition-colors"
                        >
                            <Printer size={14} /> MA FACTURE PDF
                        </a>

                        {souscription.status === 'active' ? (
                            <span className="px-3 py-1.5 bg-green-500/10 text-green-400 border border-green-500/30 text-xs font-mono font-bold uppercase tracking-widest">
                                COMMANDE PAYÉE ✓
                            </span>
                        ) : (
                            <span className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 text-xs font-mono font-bold uppercase tracking-widest">
                                {souscription.status}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── FRONTIÈRE D'AVANCEMENT & PIPELINE ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-6 relative">
                    <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary-500"></div>

                    <h2 className="font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-6 flex items-center gap-2">
                        <Clock size={14} />
                        <span>PIPELINE D'AVANCEMENT DE VOTRE COMMANDE</span>
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
                        {[
                            { num: '01', title: 'PAIEMENT & BRIEF', desc: 'Commande enregistrée', done: currentStep >= 1 },
                            { num: '02', title: 'CONCEPTION', desc: 'Création des maquettes', done: currentStep >= 2 },
                            { num: '03', title: 'RÉVISIONS', desc: 'Ajustements & retouches', done: currentStep >= 3 },
                            { num: '04', title: 'LIVRAISON FINALE', desc: 'Fichiers sources & HD', done: currentStep >= 4 },
                        ].map((step, idx) => (
                            <div
                                key={idx}
                                className={`p-4 border font-mono text-xs transition-colors ${
                                    step.done
                                        ? 'border-primary-500 bg-primary-500/5 text-white'
                                        : 'border-gray-800 bg-[#121212] text-gray-500'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] font-bold ${step.done ? 'text-primary-500' : 'text-gray-600'}`}>
                                        STEP {step.num}
                                    </span>
                                    {step.done && <Check size={14} className="text-primary-500" />}
                                </div>
                                <h3 className="font-bold uppercase text-[11px] mb-1">{step.title}</h3>
                                <p className="text-[10px] text-gray-400">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* ══════════════════════════════════════════════════
                        COLONNE GAUCHE (LIVRABLES & MESSAGES) - 8 COLS
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* COFFRE-FORT DES LIVRABLES */}
                        <div className="border border-gray-800 bg-[#0E0E0E] p-6 relative">
                            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary-500"></div>

                            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-6">
                                <h2 className="font-mono text-xs uppercase tracking-widest text-primary-500 font-bold flex items-center gap-2">
                                    <Download size={14} />
                                    <span>FICHIERS SOURCES & LIVRABLES ({souscription.livrables?.length || 0})</span>
                                </h2>
                            </div>

                            {souscription.livrables?.length === 0 ? (
                                <div className="p-8 border border-dashed border-gray-800 text-center bg-[#121212]">
                                    <FileText size={28} className="mx-auto text-gray-600 mb-2" />
                                    <p className="text-xs font-mono text-gray-400 uppercase font-bold mb-1">
                                        CONCEPTION EN COURS
                                    </p>
                                    <p className="text-[10px] font-mono text-gray-500">
                                        Vos livrables et fichiers vectoriels seront déposés ici par Franck Dims. Vous recevrez une alerte instantanée par WhatsApp & Email.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-800/60 border border-gray-800">
                                    {souscription.livrables?.map((liv) => (
                                        <div key={liv.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#141414] transition-colors">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-10 h-10 border border-primary-500/40 bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
                                                    <FileText size={18} />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-xs font-bold text-white uppercase truncate">{liv.nom}</h4>
                                                        <span className="px-1.5 py-0.2 text-[9px] font-mono bg-primary-500/20 text-primary-400 border border-primary-500/30 uppercase">
                                                            {liv.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] font-mono text-gray-400 mt-0.5 truncate">
                                                        {liv.fichier_nom_original} • {liv.taille_formattee} • Remis le {formatDate(liv.created_at)}
                                                    </p>
                                                    {liv.message && (
                                                        <p className="text-[10px] font-mono text-gray-500 mt-1 italic">
                                                            "{liv.message}"
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <a
                                                href={`/storage/${liv.fichier_path}`}
                                                target="_blank"
                                                download
                                                className="px-4 py-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors shrink-0 flex items-center gap-1.5"
                                            >
                                                <Download size={12} /> TÉLÉCHARGER
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* MESSAGERIE DIRECTE & RETOUCHES */}
                        <div className="border border-gray-800 bg-[#0E0E0E] p-6 relative">
                            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t-2 border-l-2 border-primary-500"></div>

                            <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-6">
                                <h2 className="font-mono text-xs uppercase tracking-widest text-primary-500 font-bold flex items-center gap-2">
                                    <MessageSquare size={14} />
                                    <span>ÉCHANGES & DEMANDES DE RETOUCHES ({souscription.messages?.length || 0})</span>
                                </h2>
                            </div>

                            {/* Liste des messages */}
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2 mb-6 divide-y divide-gray-800/40">
                                {souscription.messages?.length === 0 ? (
                                    <p className="text-gray-500 text-xs font-mono py-6 text-center">
                                        Vous pouvez poser des questions, faire vos retours ou soumettre des modifications ci-dessous.
                                    </p>
                                ) : (
                                    souscription.messages?.map((msg) => {
                                        const isClient = msg.sender_type === 'client'
                                        return (
                                            <div key={msg.id} className={`pt-4 flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
                                                <div className="flex items-center gap-2 mb-1 font-mono text-[10px] text-gray-500">
                                                    <span className={`font-bold ${isClient ? 'text-primary-500' : 'text-green-400'}`}>
                                                        {isClient ? 'VOUS' : 'FRANCK DIMS (DESIGNER DCA)'}
                                                    </span>
                                                    <span>• {formatDateTime(msg.created_at)}</span>
                                                </div>
                                                <div className={`p-4 border max-w-xl text-xs font-mono leading-relaxed ${
                                                    isClient 
                                                        ? 'bg-[#161616] border-primary-500/40 text-white' 
                                                        : 'bg-[#121212] border-green-500/30 text-gray-200'
                                                }`}>
                                                    <p className="whitespace-pre-wrap">{msg.message}</p>
                                                    {msg.attachment_path && (
                                                        <div className="mt-3 pt-2 border-t border-gray-800 flex items-center justify-between gap-2 text-[10px] text-primary-400">
                                                            <span className="flex items-center gap-1 truncate">
                                                                <Paperclip size={12} /> {msg.attachment_name || 'Fichier joint'}
                                                            </span>
                                                            <a
                                                                href={`/storage/${msg.attachment_path}`}
                                                                target="_blank"
                                                                download
                                                                className="underline hover:text-white"
                                                            >
                                                                Télécharger
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>

                            {/* Formulaire d'envoi Client */}
                            <form onSubmit={handleMsgSubmit} className="space-y-3 pt-4 border-t border-gray-800">
                                <textarea
                                    required
                                    rows={3}
                                    value={messageForm.data.message}
                                    onChange={(e) => messageForm.setData('message', e.target.value)}
                                    placeholder="Écrivez vos retours, précisions ou demandes de retouches pour Franck Dims..."
                                    className="w-full bg-[#141414] border border-gray-800 text-white p-3 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                />

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files[0]
                                                if (file) {
                                                    messageForm.setData('attachment', file)
                                                    setFilePreview(file.name)
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileRef.current?.click()}
                                            className="px-3 py-1.5 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white font-mono text-[10px] uppercase flex items-center gap-1"
                                        >
                                            <Paperclip size={12} /> {filePreview ? filePreview : 'JOINDRE UNE CAPTURE OU UN DOCUMENT'}
                                        </button>
                                        {filePreview && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFilePreview(null)
                                                    messageForm.setData('attachment', null)
                                                }}
                                                className="text-gray-500 hover:text-red-400"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={messageForm.processing || !messageForm.data.message}
                                        className="px-6 py-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors disabled:opacity-50 flex items-center gap-2 self-end"
                                    >
                                        <Send size={12} /> ENVOYER LE MESSAGE
                                    </button>
                                </div>
                            </form>
                        </div>

                    </div>

                    {/* ══════════════════════════════════════════════════
                        COLONNE DROITE (DÉTAILS COMMANDE & BRIEF) - 4 COLS
                    ══════════════════════════════════════════════════ */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* RÉCAPITULATIF DE LA PRESTATION */}
                        <div className="border border-gray-800 bg-[#0E0E0E] p-5">
                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-4 pb-2 border-b border-gray-800">
                                <Package size={14} />
                                <span>RÉCAPITULATIF COMMANDE</span>
                            </div>

                            <div className="space-y-3 font-mono text-xs">
                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Prestation</span>
                                    <span className="font-bold text-white text-sm">{item.titre || item.nom || 'Sur-mesure'}</span>
                                </div>

                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Montant réglé</span>
                                    <span className="font-bold text-primary-500 text-lg">{formatPrix(souscription.montant)}</span>
                                </div>

                                {souscription.date_livraison_estimee && (
                                    <div>
                                        <span className="text-[10px] text-gray-500 block uppercase">Date estimée de livraison</span>
                                        <span className="text-white font-bold">{formatDate(souscription.date_livraison_estimee)}</span>
                                    </div>
                                )}

                                <div>
                                    <span className="text-[10px] text-gray-500 block uppercase">Date de validation</span>
                                    <span className="text-gray-400">{formatDateTime(souscription.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* BRIEF / CONSIGNES FOURNIES */}
                        {souscription.besoins && (
                            <div className="border border-gray-800 bg-[#0E0E0E] p-5">
                                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-primary-500 font-bold mb-3 pb-2 border-b border-gray-800">
                                    <FileText size={14} />
                                    <span>VOS CONSIGNES (BRIEF)</span>
                                </div>
                                <p className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {souscription.besoins}
                                </p>
                            </div>
                        )}

                        {/* ASSISTANCE DCA DIRECTE */}
                        <div className="border border-gray-800 bg-[#0E0E0E] p-5 space-y-3">
                            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-green-500 font-bold pb-2 border-b border-gray-800">
                                <MessageCircle size={14} />
                                <span>SUPPORT DESIGNER DIRECT</span>
                            </div>
                            <p className="text-xs font-mono text-gray-400 leading-relaxed">
                                Vous avez une question urgente concernant votre commande ? Contactez directement Franck Dims.
                            </p>
                            <a
                                href="https://wa.me/237690000000"
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full text-center py-2.5 border border-green-500/40 text-green-400 hover:bg-green-500 hover:text-black font-mono font-bold text-xs uppercase tracking-widest transition-all"
                            >
                                CHATTER SUR WHATSAPP
                            </a>
                        </div>

                    </div>

                </div>

            </div>
        </ClientLayout>
    )
}
