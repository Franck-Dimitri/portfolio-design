import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, router, Link } from '@inertiajs/react';
import {
    PenTool,
    Plus,
    Pencil,
    Trash2,
    Eye,
    BadgeCheck,
    Clock,
    X,
    Star,
    Terminal,
    Crosshair,
    DollarSign,
    Layers,
    Search,
    CheckCircle2,
    ExternalLink,
    Box
} from 'lucide-react';

const CATEGORIES = [
    'logo design',
    'branding',
    'flyer design',
    'poster design',
    'social media design',
    'ui/ux design',
    'illustration',
    'autre'
];

export default function Services({ services = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentServiceId, setCurrentServiceId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        titre: '',
        description: '',
        cathegorie: 'branding',
        prix: '',
        starting_price: '',
        delaie_livraison: '',
        outils: ['Adobe Illustrator', 'Photoshop'],
        livrables: ['Fichiers sources (AI, PSD)', 'Exports HD (PNG, JPG, PDF)'],
        features: ['2 Propositions de concept', 'Révisions illimitées', 'Cession des droits'],
        is_featured: false,
        is_active: true,
    });

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentServiceId(null);
        reset();
        clearErrors();
    };

    const openCreateModal = () => {
        setEditMode(false);
        setCurrentServiceId(null);
        reset();
        setData({
            titre: '',
            description: '',
            cathegorie: 'branding',
            prix: '',
            starting_price: '',
            delaie_livraison: '3-5 jours',
            outils: ['Adobe Illustrator', 'Photoshop'],
            livrables: ['Fichiers sources (AI, PSD)', 'Exports HD (PNG, JPG, PDF)'],
            features: ['2 Propositions de concept', 'Révisions illimitées', 'Cession des droits'],
            is_featured: false,
            is_active: true,
        });
        setShowModal(true);
    };

    const openEditModal = (service) => {
        setEditMode(true);
        setCurrentServiceId(service.id);

        setData({
            titre: service.titre || '',
            description: service.description || '',
            cathegorie: service.cathegorie || 'branding',
            prix: service.prix || '',
            starting_price: service.starting_price || '',
            delaie_livraison: service.delaie_livraison || '',
            outils: Array.isArray(service.outils) && service.outils.length > 0 ? service.outils : ['Adobe Illustrator'],
            livrables: Array.isArray(service.livrables) && service.livrables.length > 0 ? service.livrables : ['Fichiers HD'],
            features: Array.isArray(service.features) && service.features.length > 0 ? service.features : ['Accompagnement'],
            is_featured: !!service.is_featured,
            is_active: !!service.is_active,
        });

        setShowModal(true);
    };

    // Handlers pour listes dynamiques
    const handleArrayChange = (field, index, value) => {
        const updated = [...data[field]];
        updated[index] = value;
        setData(field, updated);
    };

    const addArrayItem = (field) => {
        setData(field, [...data[field], '']);
    };

    const removeArrayItem = (field, index) => {
        if (data[field].length > 1) {
            const updated = data[field].filter((_, i) => i !== index);
            setData(field, updated);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...data,
            outils: data.outils.filter(i => i && i.trim() !== ''),
            livrables: data.livrables.filter(i => i && i.trim() !== ''),
            features: data.features.filter(i => i && i.trim() !== ''),
        };

        if (editMode) {
            put(route('admin.services.update', currentProjectId || currentServiceId), {
                data: payload,
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.services.store'), {
                data: payload,
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
            router.delete(route('admin.services.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    const filteredServices = services.filter(s => {
        const matchesSearch = !searchTerm || s.titre?.toLowerCase().includes(searchTerm.toLowerCase()) || s.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = !categoryFilter || s.cathegorie === categoryFilter;
        return matchesSearch && matchesCat;
    });

    const totalServices = services.length;
    const activeServices = services.filter(s => s.is_active).length;
    const featuredServices = services.filter(s => s.is_featured).length;

    return (
        <AdminLayout title="Gestion des Services">
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
                                <span>MODULE : CATALOGUE DES SERVICES & PRESTATIONS</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                                GESTION DES <span className="text-primary-500">SERVICES DE DESIGN</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-1">
                                Définition des prestations à la carte, tarification, livrables inclus et délais d'exécution.
                            </p>
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 bg-primary-500 text-black px-5 py-2.5 font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors shrink-0"
                        >
                            <Plus size={14} /> NOUVEAU SERVICE
                        </button>
                    </div>
                </div>

                {/* ── STATS BAR ── */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">TOTAL SERVICES</span>
                        <div className="text-2xl font-bold font-display text-white">{totalServices}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">SERVICES ACTIFS</span>
                        <div className="text-2xl font-bold font-display text-green-400">{activeServices}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">MIS EN AVANT (FEATURED)</span>
                        <div className="text-2xl font-bold font-display text-amber-400">{featuredServices}</div>
                    </div>
                </div>

                {/* ── FILTRES ── */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-4 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher un service par titre ou description..."
                            className="w-full bg-[#141414] border border-gray-800 text-white pl-9 pr-4 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none placeholder:text-gray-600"
                        />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-[#141414] border border-gray-800 text-gray-300 text-xs font-mono px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                        <option value="">Toutes les catégories</option>
                        {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                {/* ── GRILLE DES SERVICES ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.length === 0 ? (
                        <div className="col-span-full border border-dashed border-gray-800 p-12 text-center bg-[#0E0E0E]">
                            <PenTool size={32} className="mx-auto text-gray-600 mb-3" />
                            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4">
                                AUCUN SERVICE ENREGISTRÉ
                            </p>
                            <button
                                onClick={openCreateModal}
                                className="px-4 py-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400"
                            >
                                CRÉER UN SERVICE
                            </button>
                        </div>
                    ) : (
                        filteredServices.map((service) => (
                            <article
                                key={service.id}
                                className={`border bg-[#0E0E0E] flex flex-col justify-between p-5 relative group hover:border-primary-500 transition-colors ${
                                    service.is_active ? 'border-gray-800' : 'border-gray-800/40 opacity-60'
                                }`}
                            >
                                <div className="space-y-4">
                                    {/* Header card */}
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <span className="px-2 py-0.5 bg-[#141414] border border-gray-800 text-[9px] font-mono uppercase text-gray-400">
                                                {service.cathegorie}
                                            </span>
                                            <h3 className="font-bold text-white uppercase text-base tracking-wider mt-2">
                                                {service.titre}
                                            </h3>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            {service.is_featured && (
                                                <span className="px-1.5 py-0.5 bg-yellow-500 text-black font-mono font-bold text-[9px] uppercase">
                                                    VEDETTE
                                                </span>
                                            )}
                                            {service.is_active ? (
                                                <span className="px-1.5 py-0.5 bg-green-500/10 text-green-400 border border-green-500/30 font-mono text-[9px] uppercase">
                                                    ACTIF
                                                </span>
                                            ) : (
                                                <span className="px-1.5 py-0.5 bg-gray-800 text-gray-400 font-mono text-[9px] uppercase">
                                                    INACTIF
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xs font-mono text-gray-400 line-clamp-3 leading-relaxed">
                                        {service.description}
                                    </p>

                                    {/* Prix & Délais */}
                                    <div className="p-3 bg-[#141414] border border-gray-800/80 font-mono text-xs space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 text-[10px] uppercase">TARIF FIXE</span>
                                            <span className="font-bold text-primary-500">
                                                {service.prix ? `${parseInt(service.prix).toLocaleString()} FCFA` : 'Sur devis'}
                                            </span>
                                        </div>
                                        {service.starting_price && (
                                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                <span>À PARTIR DE</span>
                                                <span>{parseInt(service.starting_price).toLocaleString()} FCFA</span>
                                            </div>
                                        )}
                                        {service.delaie_livraison && (
                                            <div className="flex justify-between items-center text-[10px] text-gray-400">
                                                <span>DÉLAI ESTIMÉ</span>
                                                <span>{service.delaie_livraison}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Features preview */}
                                    {Array.isArray(service.features) && service.features.length > 0 && (
                                        <div className="space-y-1 pt-1">
                                            {service.features.slice(0, 3).map((f, i) => (
                                                <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono text-gray-300">
                                                    <CheckCircle2 size={11} className="text-primary-500 shrink-0" />
                                                    <span className="truncate">{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer actions */}
                                <div className="pt-4 mt-4 border-t border-gray-800 flex items-center justify-between font-mono text-xs">
                                    {service.slug ? (
                                        <a
                                            href={`/services/${service.slug}`}
                                            target="_blank"
                                            className="text-[10px] text-gray-400 hover:text-primary-500 flex items-center gap-1 uppercase tracking-wider"
                                        >
                                            <ExternalLink size={12} /> VOIR EN LIGNE
                                        </a>
                                    ) : <div />}

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => openEditModal(service)}
                                            className="p-1.5 border border-gray-800 hover:border-blue-500 text-gray-400 hover:text-blue-400 transition-colors"
                                            title="Modifier"
                                        >
                                            <Pencil size={12} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service.id)}
                                            className="p-1.5 border border-gray-800 hover:border-red-500 text-gray-400 hover:text-red-400 transition-colors"
                                            title="Supprimer"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {/* ══════════════════════════════════════════════════
                    MODAL : CRÉATION / ÉDITION DE SERVICE
                ══════════════════════════════════════════════════ */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="bg-[#0E0E0E] border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
                            
                            {/* Header modal */}
                            <div className="p-5 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#0E0E0E] z-10">
                                <div>
                                    <div className="flex items-center gap-2 font-mono text-[10px] text-primary-500 uppercase tracking-widest font-bold">
                                        <Crosshair size={12} />
                                        <span>{editMode ? 'MODIFICATION DU SERVICE' : 'NOUVELLE PRESTATION'}</span>
                                    </div>
                                    <h2 className="text-lg font-display font-bold uppercase text-white">
                                        {editMode ? data.titre : 'Enregistrer un service'}
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
                                    <div>
                                        <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                            Titre du service *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.titre}
                                            onChange={(e) => setData('titre', e.target.value)}
                                            placeholder="Ex: Création de Logo Premium & Charte Graphique"
                                            className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Catégorie *
                                            </label>
                                            <select
                                                value={data.cathegorie}
                                                onChange={(e) => setData('cathegorie', e.target.value)}
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            >
                                                {CATEGORIES.map((cat) => (
                                                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Prix standard (FCFA)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.prix}
                                                onChange={(e) => setData('prix', e.target.value)}
                                                placeholder="Ex: 75000"
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Délai de livraison
                                            </label>
                                            <input
                                                type="text"
                                                value={data.delaie_livraison}
                                                onChange={(e) => setData('delaie_livraison', e.target.value)}
                                                placeholder="Ex: 3-5 jours"
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                            Description détaillée *
                                        </label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Détaillez le contenu de la prestation, ce qu'elle comprend et les bénéfices..."
                                            className="w-full bg-[#141414] border border-gray-800 text-white p-3 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                        />
                                    </div>

                                    {/* Features dynamiques */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                                                Points forts & Inclusions (Features)
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => addArrayItem('features')}
                                                className="text-[10px] font-mono uppercase tracking-widest text-primary-500 hover:underline flex items-center gap-1"
                                            >
                                                <Plus size={12} /> AJOUTER
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {data.features.map((feat, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={feat}
                                                        onChange={(e) => handleArrayChange('features', idx, e.target.value)}
                                                        placeholder="Ex: Fichiers vectoriels inclus"
                                                        className="flex-1 bg-[#141414] border border-gray-800 text-white px-3 py-1.5 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                                    />
                                                    {data.features.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeArrayItem('features', idx)}
                                                            className="p-1 text-gray-500 hover:text-red-400"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Livrables dynamiques */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                                                Livrables remis au client
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => addArrayItem('livrables')}
                                                className="text-[10px] font-mono uppercase tracking-widest text-primary-500 hover:underline flex items-center gap-1"
                                            >
                                                <Plus size={12} /> AJOUTER
                                            </button>
                                        </div>
                                        <div className="space-y-2">
                                            {data.livrables.map((liv, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={liv}
                                                        onChange={(e) => handleArrayChange('livrables', idx, e.target.value)}
                                                        placeholder="Ex: Fichiers sources .AI + PDF HD"
                                                        className="flex-1 bg-[#141414] border border-gray-800 text-white px-3 py-1.5 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                                    />
                                                    {data.livrables.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeArrayItem('livrables', idx)}
                                                            className="p-1 text-gray-500 hover:text-red-400"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Switches */}
                                    <div className="flex flex-wrap items-center gap-6 pt-2 font-mono text-xs border-t border-gray-800">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_featured}
                                                onChange={(e) => setData('is_featured', e.target.checked)}
                                                className="accent-primary-500"
                                            />
                                            <span className="text-gray-300">Mettre en avant (Featured)</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={(e) => setData('is_active', e.target.checked)}
                                                className="accent-primary-500"
                                            />
                                            <span className="text-gray-300">Service actif pour les commandes</span>
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
                                        disabled={processing}
                                        className="px-6 py-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 disabled:opacity-50"
                                    >
                                        {processing ? 'ENREGISTREMENT...' : (editMode ? 'METTRE À JOUR' : 'CRÉER LE SERVICE')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}