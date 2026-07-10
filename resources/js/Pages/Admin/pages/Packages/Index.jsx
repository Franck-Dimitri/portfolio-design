// resources/js/Pages/Admin/Packages/Index.jsx
import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    Plus, Pencil, Trash2, Star, ToggleLeft, ToggleRight,
    Package, CheckCircle2, X, GripVertical, Layers,
    Clock, RefreshCw, ChevronDown, ChevronUp, Eye, EyeOff,
    Zap, Crown, Sparkles
} from 'lucide-react'

// ── Helpers ───────────────────────────────────────────────────
const formatPrix = (prix) =>
    new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA'

const ICONES_DISPONIBLES = [
    { label: 'Éclair', value: 'Zap' },
    { label: 'Couronne', value: 'Crown' },
    { label: 'Étoile', value: 'Star' },
    { label: 'Fusée', value: 'Rocket' },
    { label: 'Diamant', value: 'Diamond' },
    { label: 'Magie', value: 'Sparkles' },
]

// ── PackageCard ───────────────────────────────────────────────
function PackageCard({ pkg, onEdit, onDelete, onToggle }) {
    return (
        <div className={`
            card relative overflow-hidden transition-all duration-300
            ${!pkg.is_active ? 'opacity-60' : ''}
            hover:shadow-orange-sm hover:-translate-y-0.5
        `}>
            {/* Badge populaire */}
            {pkg.is_populaire && (
                <div className="absolute top-3 right-3 badge badge-primary gap-1">
                    <Star size={10} fill="currentColor" /> Populaire
                </div>
            )}

            {/* Bande couleur en haut */}
            <div
                className="h-1.5 w-full rounded-t-2xl"
                style={{ background: pkg.couleur_badge || '#f97316' }}
            />

            <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: (pkg.couleur_badge || '#f97316') + '20' }}
                    >
                        <Layers size={18} style={{ color: pkg.couleur_badge || '#f97316' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-[var(--text-primary)] text-base leading-tight">{pkg.titre}</h3>
                        {pkg.description_courte && (
                            <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{pkg.description_courte}</p>
                        )}
                    </div>
                </div>

                {/* Prix */}
                <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-[var(--text-primary)]">
                            {formatPrix(pkg.prix)}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">/mois</span>
                    </div>
                    {pkg.prix_barre && (
                        <span className="text-xs text-[var(--text-muted)] line-through">
                            {formatPrix(pkg.prix_barre)}
                        </span>
                    )}
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                        { label: 'Designs', value: pkg.nombre_design ?? '∞' },
                        { label: 'Jours', value: pkg.delai_livraison ?? '—' },
                        { label: 'Révisions', value: pkg.nombre_revision ?? 0 },
                    ].map(({ label, value }) => (
                        <div key={label} className="text-center p-2 rounded-xl bg-[var(--bg-muted)]">
                            <div className="text-lg font-bold text-[var(--text-primary)]">{value}</div>
                            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Features preview */}
                {pkg.features?.length > 0 && (
                    <div className="space-y-1 mb-4">
                        {pkg.features.slice(0, 3).map((f, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                                <CheckCircle2 size={11} className="text-primary-500 flex-shrink-0" />
                                {f}
                            </div>
                        ))}
                        {pkg.features.length > 3 && (
                            <p className="text-xs text-[var(--text-muted)] pl-4">+{pkg.features.length - 3} autres</p>
                        )}
                    </div>
                )}

                {/* Statut */}
                <div className="flex items-center gap-2 mb-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                        pkg.is_active
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${pkg.is_active ? 'bg-green-500' : 'bg-[var(--text-subtle)]'}`} />
                        {pkg.is_active ? 'Visible' : 'Masqué'}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">Ordre #{pkg.ordre}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-[var(--border-base)]">
                    <button
                        onClick={() => onToggle(pkg)}
                        className="btn btn-ghost btn-sm flex-1 gap-1 text-xs"
                        title={pkg.is_active ? 'Masquer' : 'Afficher'}
                    >
                        {pkg.is_active
                            ? <><EyeOff size={13} /> Masquer</>
                            : <><Eye size={13} /> Afficher</>
                        }
                    </button>
                    <button
                        onClick={() => onEdit(pkg)}
                        className="btn btn-secondary btn-sm flex-1 gap-1 text-xs"
                    >
                        <Pencil size={13} /> Modifier
                    </button>
                    <button
                        onClick={() => onDelete(pkg)}
                        className="btn btn-sm gap-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-[var(--border-base)] rounded-xl px-3 py-1.5"
                    >
                        <Trash2 size={13} />
                    </button>
                </div>
            </div>
        </div>
    )
}

// ── TagInput – input pour les listes JSON ─────────────────────
function TagInput({ label, value = [], onChange, placeholder }) {
    const [input, setInput] = useState('')

    const add = () => {
        const v = input.trim()
        if (v && !value.includes(v)) {
            onChange([...value, v])
        }
        setInput('')
    }

    const remove = (i) => onChange(value.filter((_, idx) => idx !== i))

    return (
        <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">{label}</label>
            <div className="flex gap-2 mb-2">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
                    placeholder={placeholder}
                    className="input text-sm py-2 flex-1"
                />
                <button type="button" onClick={add} className="btn btn-primary btn-sm px-3">
                    <Plus size={14} />
                </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
                {value.map((item, i) => (
                    <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[var(--color-accent-light)] text-primary-700 dark:text-primary-300">
                        {item}
                        <button type="button" onClick={() => remove(i)} className="hover:text-red-500">
                            <X size={10} />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    )
}

// ── Modal Formulaire Pack ─────────────────────────────────────
function PackageModal({ isOpen, onClose, editPackage }) {
    const isEdit = !!editPackage

    const { data, setData, post, put, processing, errors, reset } = useForm({
        titre:              editPackage?.titre ?? '',
        description:        editPackage?.description ?? '',
        description_courte: editPackage?.description_courte ?? '',
        prix:               editPackage?.prix ?? '',
        prix_barre:         editPackage?.prix_barre ?? '',
        nombre_design:      editPackage?.nombre_design ?? '',
        delai_livraison:    editPackage?.delai_livraison ?? '',
        nombre_revision:    editPackage?.nombre_revision ?? 2,
        features:           editPackage?.features ?? [],
        livrables:          editPackage?.livrables ?? [],
        services:           editPackage?.services ?? [],
        non_inclus:         editPackage?.non_inclus ?? [],
        couleur_badge:      editPackage?.couleur_badge ?? '#f97316',
        icone:              editPackage?.icone ?? 'Zap',
        is_populaire:       editPackage?.is_populaire ?? false,
        is_active:          editPackage?.is_active ?? true,
        ordre:              editPackage?.ordre ?? 0,
    })

    const submit = (e) => {
        e.preventDefault()
        if (isEdit) {
            put(route('admin.packages.update', editPackage.id), {
                onSuccess: () => { reset(); onClose() }
            })
        } else {
            post(route('admin.packages.store'), {
                onSuccess: () => { reset(); onClose() }
            })
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto card rounded-2xl animate-scale-in-bounce">

                {/* Header modal */}
                <div className="sticky top-0 z-10 glass px-6 py-4 border-b border-[var(--border-base)] flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-lg text-[var(--text-primary)]">
                            {isEdit ? 'Modifier le pack' : 'Nouveau pack'}
                        </h2>
                        <p className="text-xs text-[var(--text-muted)]">
                            {isEdit ? `Édition de "${editPackage.titre}"` : 'Créer un nouveau pack de design'}
                        </p>
                    </div>
                    <button onClick={onClose} className="btn btn-ghost btn-sm w-8 h-8 p-0 rounded-xl">
                        <X size={16} />
                    </button>
                </div>

                <form onSubmit={submit} className="p-6 space-y-5">

                    {/* Titre + Couleur */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2">
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                                Nom du pack <span className="text-red-500">*</span>
                            </label>
                            <input
                                value={data.titre}
                                onChange={e => setData('titre', e.target.value)}
                                className="input"
                                placeholder="Ex : Pack Starter, Pack Pro..."
                            />
                            {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Couleur accent</label>
                            <input
                                type="color"
                                value={data.couleur_badge}
                                onChange={e => setData('couleur_badge', e.target.value)}
                                className="w-full h-[42px] rounded-xl border border-[var(--border-base)] cursor-pointer bg-[var(--bg-muted)] p-1"
                            />
                        </div>
                    </div>

                    {/* Description courte */}
                    <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Description courte</label>
                        <input
                            value={data.description_courte}
                            onChange={e => setData('description_courte', e.target.value)}
                            className="input"
                            placeholder="Résumé affiché sur la carte (max 200 car.)"
                            maxLength={200}
                        />
                    </div>

                    {/* Description longue */}
                    <div>
                        <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Description complète</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            className="input resize-none"
                            rows={3}
                            placeholder="Description détaillée du pack..."
                        />
                    </div>

                    {/* Prix */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                                Prix mensuel (FCFA) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.prix}
                                onChange={e => setData('prix', e.target.value)}
                                className="input"
                                placeholder="Ex: 50000"
                                min={0}
                            />
                            {errors.prix && <p className="text-red-500 text-xs mt-1">{errors.prix}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Prix barré (optionnel)</label>
                            <input
                                type="number"
                                value={data.prix_barre}
                                onChange={e => setData('prix_barre', e.target.value)}
                                className="input"
                                placeholder="Ancien prix"
                                min={0}
                            />
                        </div>
                    </div>

                    {/* Caractéristiques */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Nbre designs/mois</label>
                            <input
                                type="number"
                                value={data.nombre_design}
                                onChange={e => setData('nombre_design', e.target.value)}
                                className="input"
                                placeholder="Vide = illimité"
                                min={1}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Délai (jours)</label>
                            <input
                                type="number"
                                value={data.delai_livraison}
                                onChange={e => setData('delai_livraison', e.target.value)}
                                className="input"
                                placeholder="Ex: 5"
                                min={1}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Révisions</label>
                            <input
                                type="number"
                                value={data.nombre_revision}
                                onChange={e => setData('nombre_revision', e.target.value)}
                                className="input"
                                placeholder="Ex: 2"
                                min={0}
                            />
                        </div>
                    </div>

                    {/* Tags */}
                    <TagInput
                        label="Features incluses"
                        value={data.features}
                        onChange={v => setData('features', v)}
                        placeholder="Ex: Logo HD, Fichiers source... (Entrée)"
                    />
                    <TagInput
                        label="Types de design inclus"
                        value={data.services}
                        onChange={v => setData('services', v)}
                        placeholder="Ex: Logo, Flyer, Bannière... (Entrée)"
                    />
                    <TagInput
                        label="Livrables fournis"
                        value={data.livrables}
                        onChange={v => setData('livrables', v)}
                        placeholder="Ex: PNG HD, PDF, Fichiers AI... (Entrée)"
                    />
                    <TagInput
                        label="Non inclus (optionnel)"
                        value={data.non_inclus}
                        onChange={v => setData('non_inclus', v)}
                        placeholder="Ex: Impression, Hébergement... (Entrée)"
                    />

                    {/* Options */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">Ordre d'affichage</label>
                            <input
                                type="number"
                                value={data.ordre}
                                onChange={e => setData('ordre', e.target.value)}
                                className="input"
                                min={0}
                            />
                        </div>
                        <div className="flex flex-col gap-2 justify-end pb-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.is_populaire}
                                    onChange={e => setData('is_populaire', e.target.checked)}
                                    className="w-4 h-4 accent-primary-500"
                                />
                                <span className="text-sm text-[var(--text-secondary)]">Marquer comme "Populaire"</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="w-4 h-4 accent-primary-500"
                                />
                                <span className="text-sm text-[var(--text-secondary)]">Visible sur le site</span>
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-2 border-t border-[var(--border-base)]">
                        <button type="button" onClick={onClose} className="btn btn-secondary flex-1">
                            Annuler
                        </button>
                        <button type="submit" disabled={processing} className="btn btn-primary flex-1 gap-2">
                            {processing
                                ? <><RefreshCw size={15} className="animate-spin" /> Enregistrement...</>
                                : <><CheckCircle2 size={15} /> {isEdit ? 'Mettre à jour' : 'Créer le pack'}</>
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── Modal Confirmation suppression ────────────────────────────
function DeleteModal({ pkg, onClose, onConfirm }) {
    const { delete: destroy, processing } = useForm()

    const handleDelete = () => {
        destroy(route('admin.packages.destroy', pkg.id), {
            onSuccess: onClose
        })
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative card p-6 max-w-sm w-full animate-scale-in">
                <div className="text-center mb-5">
                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-3">
                        <Trash2 size={20} className="text-red-500" />
                    </div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)]">Supprimer ce pack ?</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Le pack <strong>"{pkg?.titre}"</strong> sera définitivement supprimé.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="btn btn-secondary flex-1">Annuler</button>
                    <button
                        onClick={handleDelete}
                        disabled={processing}
                        className="btn flex-1 bg-red-500 hover:bg-red-600 text-white gap-2"
                    >
                        {processing ? <RefreshCw size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    )
}

// ══════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ══════════════════════════════════════════════════════════════
export default function PackagesIndex({ packages }) {
    const [showModal, setShowModal]       = useState(false)
    const [editPackage, setEditPackage]   = useState(null)
    const [deleteTarget, setDeleteTarget] = useState(null)
    const { patch } = useForm()

    const handleEdit = (pkg) => { setEditPackage(pkg); setShowModal(true) }
    const handleNew  = ()    => { setEditPackage(null); setShowModal(true) }
    const handleToggle = (pkg) => {
        patch(route('admin.packages.toggle', pkg.id))
    }

    const actifs   = packages.filter(p => p.is_active)
    const inactifs = packages.filter(p => !p.is_active)

    return (
        <AdminLayout title="Packs de design">

            {/* ── Header ─────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-xl bg-primary-500/10 flex items-center justify-center">
                            <Package size={16} className="text-primary-500" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-[var(--text-primary)]">Packs de design</h1>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                        {packages.length} pack{packages.length > 1 ? 's' : ''} ·{' '}
                        <span className="text-green-500">{actifs.length} actif{actifs.length > 1 ? 's' : ''}</span>
                    </p>
                </div>
                <button onClick={handleNew} className="btn btn-primary gap-2 self-start">
                    <Plus size={16} />
                    Nouveau pack
                </button>
            </div>

            {/* ── Stats rapides ───────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {[
                    { label: 'Total packs', value: packages.length, icon: Package, color: 'primary' },
                    { label: 'Actifs', value: actifs.length, icon: Eye, color: 'green' },
                    { label: 'Masqués', value: inactifs.length, icon: EyeOff, color: 'neutral' },
                    { label: 'Populaires', value: packages.filter(p=>p.is_populaire).length, icon: Star, color: 'amber' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="card p-4 flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            color === 'primary' ? 'bg-primary-500/10' :
                            color === 'green'   ? 'bg-green-500/10'   :
                            color === 'amber'   ? 'bg-amber-500/10'   :
                            'bg-[var(--bg-muted)]'
                        }`}>
                            <Icon size={15} className={
                                color === 'primary' ? 'text-primary-500' :
                                color === 'green'   ? 'text-green-500'   :
                                color === 'amber'   ? 'text-amber-500'   :
                                'text-[var(--text-muted)]'
                            } />
                        </div>
                        <div>
                            <div className="text-xl font-extrabold text-[var(--text-primary)]">{value}</div>
                            <div className="text-[11px] text-[var(--text-muted)]">{label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Grille des packs ───────────────────────────── */}
            {packages.length === 0 ? (
                <div className="card p-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4">
                        <Package size={28} className="text-primary-500" />
                    </div>
                    <h3 className="font-bold text-lg text-[var(--text-primary)] mb-1">Aucun pack créé</h3>
                    <p className="text-sm text-[var(--text-muted)] mb-5">Créez votre premier pack de design graphique.</p>
                    <button onClick={handleNew} className="btn btn-primary mx-auto gap-2">
                        <Plus size={16} /> Créer un pack
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {packages.map(pkg => (
                        <PackageCard
                            key={pkg.id}
                            pkg={pkg}
                            onEdit={handleEdit}
                            onDelete={setDeleteTarget}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>
            )}

            {/* ── Modals ─────────────────────────────────────── */}
            <PackageModal
                key={showModal ? (editPackage ? `edit-${editPackage.id}` : 'create') : 'hidden'}
                isOpen={showModal}
                onClose={() => { setShowModal(false); setEditPackage(null) }}
                editPackage={editPackage}
            />
            {deleteTarget && (
                <DeleteModal
                    pkg={deleteTarget}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={() => setDeleteTarget(null)}
                />
            )}
        </AdminLayout>
    )
}