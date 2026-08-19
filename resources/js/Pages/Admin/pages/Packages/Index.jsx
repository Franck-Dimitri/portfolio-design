// resources/js/Pages/Admin/pages/Packages/Index.jsx
import { useState } from 'react'
import { useForm, router } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import {
    Plus, Pencil, Trash2, Star,
    Package, CheckCircle2, X,
    Clock, RefreshCw, Zap, Crown, Sparkles, Terminal, Crosshair, DollarSign,
    Check, MinusCircle, Layers, ExternalLink
} from 'lucide-react'

const formatPrix = (prix) =>
    new Intl.NumberFormat('fr-FR').format(prix || 0) + ' FCFA'

const ICONES_MAP = {
    Zap: Zap,
    Crown: Crown,
    Star: Star,
    Sparkles: Sparkles,
    Package: Package,
}

export default function Index({ packages = [] }) {
    const [modalOpen, setModalOpen] = useState(false)
    const [editingPkg, setEditingPkg] = useState(null)

    const form = useForm({
        titre: '',
        description: '',
        description_courte: '',
        prix: '',
        prix_barre: '',
        nombre_design: 1,
        delai_livraison: 3,
        nombre_revision: 2,
        services: ['Logo vectoriel HD', 'Charte graphique essentielle', 'Export PNG, PDF, SVG'],
        non_inclus: ['Animation 3D complexe'],
        couleur_badge: '#F97316',
        icone: 'Zap',
        is_populaire: false,
        is_active: true,
        ordre: 1,
    })

    const openCreate = () => {
        setEditingPkg(null)
        form.reset()
        form.setData({
            titre: '',
            description: '',
            description_courte: '',
            prix: '',
            prix_barre: '',
            nombre_design: 1,
            delai_livraison: 3,
            nombre_revision: 2,
            services: ['Logo vectoriel HD', 'Charte graphique essentielle', 'Export PNG, PDF, SVG'],
            non_inclus: ['Animation 3D complexe'],
            couleur_badge: '#F97316',
            icone: 'Zap',
            is_populaire: false,
            is_active: true,
            ordre: packages.length + 1,
        })
        setModalOpen(true)
    }

    const openEdit = (pkg) => {
        setEditingPkg(pkg)
        form.setData({
            titre: pkg.titre || '',
            description: pkg.description || '',
            description_courte: pkg.description_courte || '',
            prix: pkg.prix || '',
            prix_barre: pkg.prix_barre || '',
            nombre_design: pkg.nombre_design || 1,
            delai_livraison: pkg.delai_livraison || 3,
            nombre_revision: pkg.nombre_revision ?? 2,
            services: Array.isArray(pkg.services) && pkg.services.length > 0 ? pkg.services : ['Design inclus'],
            non_inclus: Array.isArray(pkg.non_inclus) ? pkg.non_inclus : [],
            couleur_badge: pkg.couleur_badge || '#F97316',
            icone: pkg.icone || 'Zap',
            is_populaire: !!pkg.is_populaire,
            is_active: !!pkg.is_active,
            ordre: pkg.ordre || 1,
        })
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditingPkg(null)
        form.reset()
        form.clearErrors()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const payload = {
            ...form.data,
            services: form.data.services.filter(s => s && s.trim() !== ''),
            non_inclus: form.data.non_inclus.filter(s => s && s.trim() !== ''),
        }

        if (editingPkg) {
            form.put(route('admin.packages.update', editingPkg.id), {
                data: payload,
                onSuccess: () => closeModal(),
            })
        } else {
            form.post(route('admin.packages.store'), {
                data: payload,
                onSuccess: () => closeModal(),
            })
        }
    }

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce pack ?')) {
            router.delete(route('admin.packages.destroy', id), {
                preserveScroll: true,
            })
        }
    }

    const handleToggle = (id) => {
        router.patch(route('admin.packages.toggle', id), {}, {
            preserveScroll: true,
        })
    }

    // Handlers inclusions / exclusions
    const handleArrayChange = (field, index, value) => {
        const updated = [...form.data[field]]
        updated[index] = value
        form.setData(field, updated)
    }

    const addArrayItem = (field) => {
        form.setData(field, [...form.data[field], ''])
    }

    const removeArrayItem = (field, index) => {
        const updated = form.data[field].filter((_, i) => i !== index)
        form.setData(field, updated)
    }

    const totalPacks = packages.length
    const activePacks = packages.filter(p => p.is_active).length
    const popularPacks = packages.filter(p => p.is_populaire).length

    return (
        <AdminLayout title="Gestion des Packs & Tarifs">
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
                                <span>MODULE : GRILLES TARIFAIRES & OFFRES PACKAGÉES</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                                PACKS & <span className="text-primary-500">OFFRES DE DESIGN</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-1">
                                Configurez les formules complètes, abonnements, quotas de visuels et conditions de livraison.
                            </p>
                        </div>

                        <button
                            onClick={openCreate}
                            className="inline-flex items-center gap-2 bg-primary-500 text-black px-5 py-2.5 font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors shrink-0"
                        >
                            <Plus size={14} /> NOUVEAU PACK
                        </button>
                    </div>
                </div>

                {/* ── STATS BAR ── */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">TOTAL PACKS</span>
                        <div className="text-2xl font-bold font-display text-white">{totalPacks}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">PACKS ACTIFS</span>
                        <div className="text-2xl font-bold font-display text-green-400">{activePacks}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">FORMULES POPULAIRES</span>
                        <div className="text-2xl font-bold font-display text-primary-500">{popularPacks}</div>
                    </div>
                </div>

                {/* ── GRILLE DES PACKS ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.length === 0 ? (
                        <div className="col-span-full border border-dashed border-gray-800 p-12 text-center bg-[#0E0E0E]">
                            <Package size={32} className="mx-auto text-gray-600 mb-3" />
                            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4">
                                AUCUN PACK CRÉÉ POUR LE MOMENT
                            </p>
                            <button
                                onClick={openCreate}
                                className="px-4 py-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400"
                            >
                                CRÉER LE PREMIER PACK
                            </button>
                        </div>
                    ) : (
                        packages.map((pkg) => {
                            const IconComponent = ICONES_MAP[pkg.icone] || Package

                            return (
                                <article
                                    key={pkg.id}
                                    className={`border bg-[#0E0E0E] flex flex-col justify-between relative group hover:border-primary-500 transition-colors ${
                                        pkg.is_active ? 'border-gray-800' : 'border-gray-800/40 opacity-60'
                                    }`}
                                >
                                    {/* Accent Top Bar */}
                                    <div
                                        className="h-1 w-full"
                                        style={{ backgroundColor: pkg.couleur_badge || '#F97316' }}
                                    />

                                    <div className="p-6 space-y-5">
                                        {/* Header Card */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 border border-gray-800 flex items-center justify-center shrink-0"
                                                    style={{ color: pkg.couleur_badge || '#F97316', backgroundColor: `${pkg.couleur_badge || '#F97316'}10` }}
                                                >
                                                    <IconComponent size={18} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-white uppercase text-base tracking-wider">
                                                        {pkg.titre}
                                                    </h3>
                                                    <span className="text-[10px] font-mono text-gray-500">
                                                        ORDRE D'AFFICHAGE #{pkg.ordre || 1}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1">
                                                {pkg.is_populaire && (
                                                    <span className="px-2 py-0.5 bg-primary-500 text-black font-mono font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
                                                        <Star size={9} fill="currentColor" /> POPULAIRE
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => handleToggle(pkg.id)}
                                                    className={`px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                                                        pkg.is_active
                                                            ? 'bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20'
                                                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {pkg.is_active ? 'ACTIF ✓' : 'INACTIF'}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Prix */}
                                        <div className="p-4 bg-[#141414] border border-gray-800 space-y-1">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-2xl font-display font-bold text-white">
                                                    {formatPrix(pkg.prix)}
                                                </span>
                                                {pkg.prix_barre && (
                                                    <span className="text-xs font-mono text-gray-500 line-through">
                                                        {formatPrix(pkg.prix_barre)}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] font-mono text-gray-400">
                                                {pkg.description_courte || pkg.description || 'Formule complète'}
                                            </p>
                                        </div>

                                        {/* Specs techniques */}
                                        <div className="grid grid-cols-3 gap-2 text-center font-mono text-xs">
                                            <div className="p-2 border border-gray-800 bg-[#121212]">
                                                <span className="text-[9px] text-gray-500 block uppercase">DESIGNS</span>
                                                <span className="font-bold text-white">{pkg.nombre_design || 1}</span>
                                            </div>
                                            <div className="p-2 border border-gray-800 bg-[#121212]">
                                                <span className="text-[9px] text-gray-500 block uppercase">DÉLAI</span>
                                                <span className="font-bold text-white">{pkg.delai_livraison || 3} j</span>
                                            </div>
                                            <div className="p-2 border border-gray-800 bg-[#121212]">
                                                <span className="text-[9px] text-gray-500 block uppercase">RÉVISIONS</span>
                                                <span className="font-bold text-white">
                                                    {pkg.nombre_revision === 0 ? 'Illimitées' : `${pkg.nombre_revision}`}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Inclusions */}
                                        {Array.isArray(pkg.services) && pkg.services.length > 0 && (
                                            <div className="space-y-1.5 pt-1 font-mono text-xs">
                                                <span className="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">
                                                    PRESTATIONS INCLUSES
                                                </span>
                                                {pkg.services.map((srv, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-gray-300 text-[11px]">
                                                        <Check size={12} className="text-primary-500 shrink-0" />
                                                        <span className="truncate">{srv}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Non inclus */}
                                        {Array.isArray(pkg.non_inclus) && pkg.non_inclus.length > 0 && (
                                            <div className="space-y-1 pt-1 font-mono text-xs opacity-75">
                                                {pkg.non_inclus.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-gray-500 text-[11px] line-through">
                                                        <MinusCircle size={12} className="shrink-0" />
                                                        <span className="truncate">{item}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer actions */}
                                    <div className="p-4 border-t border-gray-800 flex items-center justify-between font-mono text-xs bg-[#0c0c0c]">
                                        {pkg.slug ? (
                                            <a
                                                href={`/packages/${pkg.slug}`}
                                                target="_blank"
                                                className="text-[10px] text-gray-400 hover:text-primary-500 flex items-center gap-1 uppercase tracking-wider"
                                            >
                                                <ExternalLink size={12} /> VOIR EN LIGNE
                                            </a>
                                        ) : <div />}

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEdit(pkg)}
                                                className="p-1.5 border border-gray-800 hover:border-blue-500 text-gray-400 hover:text-blue-400 transition-colors"
                                                title="Modifier"
                                            >
                                                <Pencil size={12} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(pkg.id)}
                                                className="p-1.5 border border-gray-800 hover:border-red-500 text-gray-400 hover:text-red-400 transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            )
                        })
                    )}
                </div>

                {/* ══════════════════════════════════════════════════
                    MODAL : CRÉATION / ÉDITION DE PACK
                ══════════════════════════════════════════════════ */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="bg-[#0E0E0E] border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
                            
                            {/* Header modal */}
                            <div className="p-5 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#0E0E0E] z-10">
                                <div>
                                    <div className="flex items-center gap-2 font-mono text-[10px] text-primary-500 uppercase tracking-widest font-bold">
                                        <Crosshair size={12} />
                                        <span>{editingPkg ? 'MODIFICATION DU PACK' : 'NOUVELLE FORMULE TARIFAIRE'}</span>
                                    </div>
                                    <h2 className="text-lg font-display font-bold uppercase text-white">
                                        {editingPkg ? form.data.titre : 'Configurer un Pack'}
                                    </h2>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="p-2 border border-gray-800 hover:border-red-500 text-gray-400 hover:text-red-400 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Formulaire */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Titre du Pack *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={form.data.titre}
                                                onChange={(e) => form.setData('titre', e.target.value)}
                                                placeholder="Ex: Pack Starter"
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Accroche / Description courte
                                            </label>
                                            <input
                                                type="text"
                                                value={form.data.description_courte}
                                                onChange={(e) => form.setData('description_courte', e.target.value)}
                                                placeholder="Ex: Idéal pour lancer votre marque avec impact"
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Prix (FCFA) *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={form.data.prix}
                                                onChange={(e) => form.setData('prix', e.target.value)}
                                                placeholder="150000"
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Prix barré (FCFA)
                                            </label>
                                            <input
                                                type="number"
                                                value={form.data.prix_barre}
                                                onChange={(e) => form.setData('prix_barre', e.target.value)}
                                                placeholder="200000"
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Nb Designs
                                            </label>
                                            <input
                                                type="number"
                                                value={form.data.nombre_design}
                                                onChange={(e) => form.setData('nombre_design', e.target.value)}
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Délai (jours)
                                            </label>
                                            <input
                                                type="number"
                                                value={form.data.delai_livraison}
                                                onChange={(e) => form.setData('delai_livraison', e.target.value)}
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Révisions (0 = illimitées)
                                            </label>
                                            <input
                                                type="number"
                                                value={form.data.nombre_revision}
                                                onChange={(e) => form.setData('nombre_revision', e.target.value)}
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Icône
                                            </label>
                                            <select
                                                value={form.data.icone}
                                                onChange={(e) => form.setData('icone', e.target.value)}
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            >
                                                <option value="Zap">Zap (Éclair)</option>
                                                <option value="Crown">Crown (Couronne)</option>
                                                <option value="Star">Star (Étoile)</option>
                                                <option value="Sparkles">Sparkles (Brillant)</option>
                                                <option value="Package">Package (Colis)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Couleur Accent Badge
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={form.data.couleur_badge}
                                                    onChange={(e) => form.setData('couleur_badge', e.target.value)}
                                                    className="w-10 h-8 border border-gray-800 bg-transparent cursor-pointer p-0"
                                                />
                                                <input
                                                    type="text"
                                                    value={form.data.couleur_badge}
                                                    onChange={(e) => form.setData('couleur_badge', e.target.value)}
                                                    className="flex-1 bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Services inclus */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                                                Prestations incluses dans le Pack
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => addArrayItem('services')}
                                                className="text-[10px] font-mono uppercase tracking-widest text-primary-500 hover:underline flex items-center gap-1"
                                            >
                                                <Plus size={12} /> AJOUTER
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {form.data.services.map((srv, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={srv}
                                                        onChange={(e) => handleArrayChange('services', idx, e.target.value)}
                                                        placeholder="Ex: 3 Propositions créatives"
                                                        className="flex-1 bg-[#141414] border border-gray-800 text-white px-3 py-1.5 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('services', idx)}
                                                        className="p-1 text-gray-500 hover:text-red-400"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Non inclus */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                                                Prestations non incluses (exclusions claires)
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => addArrayItem('non_inclus')}
                                                className="text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-white flex items-center gap-1"
                                            >
                                                <Plus size={12} /> AJOUTER
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {form.data.non_inclus.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={item}
                                                        onChange={(e) => handleArrayChange('non_inclus', idx, e.target.value)}
                                                        placeholder="Ex: Modélisation 3D"
                                                        className="flex-1 bg-[#141414] border border-gray-800 text-white px-3 py-1.5 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeArrayItem('non_inclus', idx)}
                                                        className="p-1 text-gray-500 hover:text-red-400"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Switches */}
                                    <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-xs border-t border-gray-800">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.data.is_populaire}
                                                onChange={(e) => form.setData('is_populaire', e.target.checked)}
                                                className="accent-primary-500"
                                            />
                                            <span className="text-gray-300">Marquer comme Pack Populaire / Recommandé</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.data.is_active}
                                                onChange={(e) => form.setData('is_active', e.target.checked)}
                                                className="accent-primary-500"
                                            />
                                            <span className="text-gray-300">Pack actif & visible aux clients</span>
                                        </label>
                                    </div>

                                </div>

                                {/* Footer actions */}
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-700 text-gray-300 font-mono text-xs uppercase tracking-widest hover:border-gray-600"
                                    >
                                        ANNULER
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="px-6 py-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 disabled:opacity-50"
                                    >
                                        {form.processing ? 'ENREGISTREMENT...' : (editingPkg ? 'METTRE À JOUR LE PACK' : 'CRÉER LE PACK')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    )
}