// resources/js/Pages/Admin/Packages/SouscriptionDetail.jsx
import { useState, useRef } from 'react'
import { useForm, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    ArrowLeft, User, Mail, Phone, MessageCircle, Building2,
    Package, CreditCard, Clock, CheckCircle2, Upload, FileText,
    Download, Send, AlertCircle, Calendar, RefreshCw, X,
    Paperclip, MessageSquare, Star, Zap
} from 'lucide-react'

const formatPrix     = (v) => new Intl.NumberFormat('fr-FR').format(v) + ' FCFA'
const formatDateTime = (d) => d ? new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
}) : '—'

const STATUTS_PROD = [
    { value: 'non_demarre', label: 'Non démarré', color: 'text-[var(--text-muted)]' },
    { value: 'en_cours',    label: 'En cours',    color: 'text-blue-500'            },
    { value: 'en_revision', label: 'En révision', color: 'text-amber-500'           },
    { value: 'termine',     label: 'Terminé',     color: 'text-green-500'           },
    { value: 'archive',     label: 'Archivé',     color: 'text-[var(--text-subtle)]'},
]

// ── Section card ──────────────────────────────────────────────
function Section({ title, icon: Icon, children, className = '' }) {
    return (
        <div className={`card p-5 ${className}`}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--border-base)]">
                <div className="w-7 h-7 rounded-lg bg-primary-500/10 flex items-center justify-center">
                    <Icon size={14} className="text-primary-500" />
                </div>
                <h2 className="font-semibold text-sm text-[var(--text-primary)]">{title}</h2>
            </div>
            {children}
        </div>
    )
}

// ── Info row ──────────────────────────────────────────────────
function InfoRow({ label, value, mono = false }) {
    return (
        <div className="flex justify-between items-start gap-4 py-2 border-b border-[var(--border-base)] last:border-0">
            <span className="text-xs text-[var(--text-muted)] flex-shrink-0">{label}</span>
            <span className={`text-xs font-medium text-[var(--text-primary)] text-right ${mono ? 'font-mono' : ''}`}>
                {value || '—'}
            </span>
        </div>
    )
}

// ── Upload livrable ───────────────────────────────────────────
function UploadLivrable({ souscriptionId }) {
    const fileRef = useRef()
    const { data, setData, post, processing, errors, reset } = useForm({
        fichier: null,
        nom: '',
        message: '',
        type: 'livrable',
    })

    const [preview, setPreview] = useState(null)

    const handleFile = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setData('fichier', file)
        if (!data.nom) setData('nom', file.name.replace(/\.[^.]+$/, ''))
        setPreview(file.name)
    }

    const submit = (e) => {
        e.preventDefault()
        post(route('admin.souscriptions.livrable', souscriptionId), {
            forceFormData: true,
            onSuccess: () => { reset(); setPreview(null) }
        })
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            {/* Zone drop fichier */}
            <div
                onClick={() => fileRef.current?.click()}
                className={`
                    border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all
                    ${preview
                        ? 'border-primary-500 bg-[var(--color-accent-subtle)]'
                        : 'border-[var(--border-strong)] hover:border-primary-400 hover:bg-[var(--bg-muted)]'
                    }
                `}
            >
                <input ref={fileRef} type="file" className="hidden" onChange={handleFile} />
                {preview ? (
                    <div className="flex items-center justify-center gap-2">
                        <Paperclip size={16} className="text-primary-500" />
                        <span className="text-sm font-medium text-primary-500">{preview}</span>
                        <button type="button" onClick={e => { e.stopPropagation(); setPreview(null); setData('fichier', null) }}>
                            <X size={14} className="text-[var(--text-muted)] hover:text-red-500" />
                        </button>
                    </div>
                ) : (
                    <>
                        <Upload size={20} className="text-[var(--text-muted)] mx-auto mb-2" />
                        <p className="text-sm text-[var(--text-muted)]">Cliquez pour choisir un fichier</p>
                        <p className="text-xs text-[var(--text-subtle)] mt-0.5">PNG, PDF, ZIP, AI, PSD... max 50Mo</p>
                    </>
                )}
            </div>

            {/* Nom affiché */}
            <input
                value={data.nom}
                onChange={e => setData('nom', e.target.value)}
                placeholder="Nom du livrable (affiché au client)"
                className="input text-sm"
                required
            />

            {/* Type */}
            <select
                value={data.type}
                onChange={e => setData('type', e.target.value)}
                className="input text-sm"
            >
                <option value="livrable">📦 Livrable final</option>
                <option value="apercu">👁️ Aperçu / preview</option>
                <option value="revision">🔄 Fichier de révision</option>
            </select>

            {/* Message */}
            <textarea
                value={data.message}
                onChange={e => setData('message', e.target.value)}
                placeholder="Message accompagnant le livrable (optionnel)"
                className="input text-sm resize-none"
                rows={2}
            />

            <button
                type="submit"
                disabled={processing || !data.fichier || !data.nom}
                className="btn btn-primary w-full gap-2"
            >
                {processing
                    ? <><RefreshCw size={15} className="animate-spin" /> Envoi en cours...</>
                    : <><Send size={15} /> Envoyer au client</>
                }
            </button>
            {Object.keys(errors).length > 0 && (
                <p className="text-red-500 text-xs">{Object.values(errors)[0]}</p>
            )}
        </form>
    )
}

// ── Formulaire statut ─────────────────────────────────────────
function StatutForm({ souscription }) {
    const { data, setData, patch, processing } = useForm({
        statut_production:      souscription.statut_production,
        notes_admin:            souscription.notes_admin || '',
        date_livraison_estimee: souscription.date_livraison_estimee?.slice(0, 10) || '',
    })

    const submit = (e) => {
        e.preventDefault()
        patch(route('admin.souscriptions.statut', souscription.id))
    }

    return (
        <form onSubmit={submit} className="space-y-3">
            <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5">Statut production</label>
                <select
                    value={data.statut_production}
                    onChange={e => setData('statut_production', e.target.value)}
                    className="input text-sm"
                >
                    {STATUTS_PROD.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5">Livraison estimée</label>
                <input
                    type="date"
                    value={data.date_livraison_estimee}
                    onChange={e => setData('date_livraison_estimee', e.target.value)}
                    className="input text-sm"
                />
            </div>
            <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1.5">Notes internes</label>
                <textarea
                    value={data.notes_admin}
                    onChange={e => setData('notes_admin', e.target.value)}
                    className="input text-sm resize-none"
                    rows={3}
                    placeholder="Notes visibles uniquement par l'admin..."
                />
            </div>
            <button type="submit" disabled={processing} className="btn btn-primary w-full gap-2">
                {processing
                    ? <><RefreshCw size={14} className="animate-spin" /> Mise à jour...</>
                    : <><CheckCircle2 size={14} /> Enregistrer</>
                }
            </button>
        </form>
    )
}

// ══════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ══════════════════════════════════════════════════════════════
export default function SouscriptionDetail({ souscription }) {
    const s = souscription
    const pack = s.service_package

    const statutProd = STATUTS_PROD.find(x => x.value === s.statut_production)

    return (
        <AdminLayout title={`Commande ${s.reference}`}>

            {/* ── Header ─────────────────────────────────────── */}
            <div className="flex items-center gap-3 mb-6">
                <a
                    href={route('admin.souscriptions.index')}
                    className="w-8 h-8 rounded-xl border border-[var(--border-base)] flex items-center justify-center hover:border-primary-500 hover:text-primary-500 transition-colors"
                >
                    <ArrowLeft size={15} />
                </a>
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-extrabold text-[var(--text-primary)]">{s.reference}</h1>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            s.statut_paiement === 'paye'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                        }`}>
                            {s.statut_paiement === 'paye' ? '✓ Payé' : s.statut_paiement}
                        </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">Souscrit le {formatDateTime(s.created_at)}</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-5">

                {/* ── Colonne principale ──────────────────────── */}
                <div className="lg:col-span-2 space-y-5">

                    {/* Client */}
                    <Section title="Informations client" icon={User}>
                        <div className="grid sm:grid-cols-2 gap-x-6">
                            <InfoRow label="Nom complet"  value={s.client_nom} />
                            <InfoRow label="Email"        value={s.client_email} />
                            <InfoRow label="Téléphone"    value={s.client_telephone} />
                            <InfoRow label="WhatsApp"     value={s.client_whatsapp} />
                            <InfoRow label="Entreprise"   value={s.client_entreprise} />
                        </div>
                        {s.besoins && (
                            <div className="mt-3 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-base)]">
                                <p className="text-xs text-[var(--text-muted)] mb-1 font-medium">Besoins exprimés</p>
                                <p className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">{s.besoins}</p>
                            </div>
                        )}
                    </Section>

                    {/* Pack + paiement */}
                    <Section title="Pack & paiement" icon={CreditCard}>
                        <div className="grid sm:grid-cols-2 gap-x-6">
                            <InfoRow label="Pack souscrit"  value={pack?.titre} />
                            <InfoRow label="Montant payé"   value={formatPrix(s.montant)} />
                            <InfoRow label="Statut"         value={s.statut_paiement_label} />
                            <InfoRow label="Payé le"        value={formatDateTime(s.paye_le)} />
                            <InfoRow label="Transaction ID" value={s.cinetpay_transaction_id} mono />
                        </div>
                    </Section>

                    {/* Livrables */}
                    <Section title={`Livrables envoyés (${s.livrables?.length || 0})`} icon={FileText}>
                        {(!s.livrables || s.livrables.length === 0) ? (
                            <div className="text-center py-6">
                                <Upload size={24} className="text-[var(--text-muted)] mx-auto mb-2" />
                                <p className="text-sm text-[var(--text-muted)]">Aucun livrable envoyé</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {s.livrables.map(l => (
                                    <div key={l.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-muted)] border border-[var(--border-base)]">
                                        <div className="w-9 h-9 rounded-xl bg-primary-500/10 flex items-center justify-center flex-shrink-0">
                                            <FileText size={15} className="text-primary-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">{l.nom}</p>
                                            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                                <span>{l.taille_formate}</span>
                                                <span>·</span>
                                                <span>{l.type}</span>
                                                <span>·</span>
                                                <span>{formatDateTime(l.created_at)}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            {l.notifie_email    && <span title="Email envoyé"    className="text-xs text-green-500">✉</span>}
                                            {l.notifie_whatsapp && <span title="WhatsApp envoyé" className="text-xs text-green-500">📱</span>}
                                            <a
                                                href={`/storage/${l.fichier_path}`}
                                                target="_blank"
                                                className="btn btn-ghost btn-sm p-1.5 rounded-lg"
                                                title="Télécharger"
                                            >
                                                <Download size={13} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Section>
                </div>

                {/* ── Colonne latérale ────────────────────────── */}
                <div className="space-y-5">

                    {/* Statut production */}
                    <Section title="Statut production" icon={Zap}>
                        <div className="flex items-center gap-2 mb-4 p-3 rounded-xl bg-[var(--bg-muted)]">
                            <span className={`w-2.5 h-2.5 rounded-full ${
                                s.statut_production === 'termine'    ? 'bg-green-500' :
                                s.statut_production === 'en_cours'   ? 'bg-blue-500'  :
                                s.statut_production === 'en_revision' ? 'bg-amber-500' :
                                'bg-[var(--text-subtle)]'
                            }`} />
                            <span className="text-sm font-medium text-[var(--text-primary)]">
                                {statutProd?.label || s.statut_production}
                            </span>
                        </div>
                        <StatutForm souscription={s} />
                    </Section>

                    {/* Upload livrable */}
                    <Section title="Envoyer un livrable" icon={Upload}>
                        <UploadLivrable souscriptionId={s.id} />
                    </Section>

                    {/* Timeline */}
                    <Section title="Historique" icon={Clock}>
                        <div className="space-y-3">
                            {[
                                { label: 'Souscription créée',  date: s.created_at,             show: true                 },
                                { label: 'Paiement confirmé',   date: s.paye_le,                 show: !!s.paye_le          },
                                { label: 'Production démarrée', date: s.date_debut_production,   show: !!s.date_debut_production },
                                { label: 'Livraison estimée',   date: s.date_livraison_estimee,  show: !!s.date_livraison_estimee, estimate: true },
                                { label: 'Livré le',            date: s.livre_le,                show: !!s.livre_le         },
                            ].filter(e => e.show).map((e, i) => (
                                <div key={i} className="flex gap-3 items-start text-xs">
                                    <div className={`w-2 h-2 rounded-full mt-0.5 flex-shrink-0 ${
                                        e.estimate ? 'border-2 border-primary-500' : 'bg-primary-500'
                                    }`} />
                                    <div>
                                        <div className={`font-medium ${e.estimate ? 'text-[var(--text-muted)]' : 'text-[var(--text-secondary)]'}`}>
                                            {e.label}
                                        </div>
                                        <div className="text-[var(--text-subtle)]">{formatDateTime(e.date)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>
            </div>
        </AdminLayout>
    )
}