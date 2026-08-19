import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm, router, Link } from '@inertiajs/react';
import {
    FolderGit2,
    Eye,
    Pencil,
    Trash2,
    Image as ImageIcon,
    Plus,
    X,
    Upload,
    Star,
    CheckCircle,
    Terminal,
    Crosshair,
    DollarSign,
    Box,
    Sparkles,
    Search,
    ExternalLink
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

export default function Projet({ projects = [], cathegories = CATEGORIES }) {
    const [showModal, setShowModal] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        titre: '',
        description: '',
        cathegorie: 'branding',
        prix: '',
        images: [],
        is_featured: false,
        is_published: true,
        outils: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
    });

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentProjectId(null);
        imagePreviews.forEach(preview => {
            if (preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        });
        setImagePreviews([]);
        reset();
        clearErrors();
        setData('outils', ['Adobe Illustrator', 'Adobe Photoshop', 'Figma']);
    };

    const openCreateModal = () => {
        setEditMode(false);
        setCurrentProjectId(null);
        reset();
        setData({
            titre: '',
            description: '',
            cathegorie: 'branding',
            prix: '',
            images: [],
            is_featured: false,
            is_published: true,
            outils: ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
        });
        setImagePreviews([]);
        setShowModal(true);
    };

    const openEditModal = (project) => {
        setEditMode(true);
        setCurrentProjectId(project.id);

        setData({
            titre: project.titre,
            description: project.description,
            cathegorie: project.cathegorie || 'branding',
            prix: project.prix || '',
            images: [],
            is_featured: !!project.is_featured,
            is_published: !!project.is_published,
            outils: project.outils && project.outils.length >= 3 ? project.outils : ['Adobe Illustrator', 'Adobe Photoshop', 'Figma'],
        });

        if (project.images && project.images.length > 0) {
            const previews = project.images.map(img => `/storage/${img.path}`);
            setImagePreviews(previews);
        } else {
            setImagePreviews([]);
        }

        setShowModal(true);
    };

    const handleToolChange = (index, val) => {
        const updated = [...data.outils];
        updated[index] = val;
        setData('outils', updated);
    };

    const addTool = () => {
        setData('outils', [...data.outils, '']);
    };

    const removeTool = (index) => {
        if (data.outils.length > 3) {
            const updated = data.outils.filter((_, i) => i !== index);
            setData('outils', updated);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const currentImages = data.images || [];
        const allImages = [...currentImages, ...files];
        setData('images', allImages);

        const newPreviews = allImages.map(file => {
            if (file instanceof File) {
                return URL.createObjectURL(file);
            }
            return file;
        });
        setImagePreviews(newPreviews);
        e.target.value = '';
    };

    const removeImage = (index) => {
        const newImages = data.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        if (imagePreviews[index] && imagePreviews[index].startsWith('blob:')) {
            URL.revokeObjectURL(imagePreviews[index]);
        }
        setData('images', newImages);
        setImagePreviews(newPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanTools = data.outils.filter(t => t && t.trim() !== '');

        if (cleanTools.length < 3) {
            alert('Veuillez renseigner au moins 3 outils / logiciels.');
            return;
        }

        if (!editMode && data.images.length < 4) {
            alert(`Veuillez sélectionner au moins 4 images (actuellement : ${data.images.length}).`);
            return;
        }

        const formData = new FormData();
        formData.append('titre', data.titre);
        formData.append('description', data.description);
        formData.append('cathegorie', data.cathegorie);
        formData.append('prix', data.prix || '');
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('is_published', data.is_published ? '1' : '0');
        formData.append('outils', JSON.stringify(cleanTools));

        for (let i = 0; i < data.images.length; i++) {
            formData.append('images[]', data.images[i]);
        }

        if (editMode) {
            formData.append('_method', 'PUT');
            post(route('admin.projects.update', currentProjectId), {
                data: formData,
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.projects.store'), {
                data: formData,
                forceFormData: true,
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer définitivement ce projet ?')) {
            router.delete(route('admin.projects.destroy', id), {
                preserveScroll: true
            });
        }
    };

    // Filtres
    const filteredProjects = projects.filter(p => {
        const matchesSearch = !searchTerm || p.titre?.toLowerCase().includes(searchTerm.toLowerCase()) || p.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = !categoryFilter || p.cathegorie === categoryFilter;
        return matchesSearch && matchesCat;
    });

    const totalProjects = projects.length;
    const publishedProjects = projects.filter(p => p.is_published).length;
    const featuredProjects = projects.filter(p => p.is_featured).length;
    const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);

    return (
        <AdminLayout title="Gestion du Portfolio & Projets">
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
                                <span>MODULE : ARCHIVES & PORTFOLIO CRÉATIF</span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white">
                                GESTION DES <span className="text-primary-500">PROJETS DE DESIGN</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-1">
                                Création, modification des fiches de projets, galerie d'images et mise en avant.
                            </p>
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="inline-flex items-center gap-2 bg-primary-500 text-black px-5 py-2.5 font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 transition-colors shrink-0"
                        >
                            <Plus size={14} /> NOUVEAU PROJET
                        </button>
                    </div>
                </div>

                {/* ── STATS BAR ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">TOTAL PROJETS</span>
                        <div className="text-2xl font-bold font-display text-white">{totalProjects}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">EN LIGNE</span>
                        <div className="text-2xl font-bold font-display text-green-400">{publishedProjects}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">FEATURED / VEDETTES</span>
                        <div className="text-2xl font-bold font-display text-amber-400">{featuredProjects}</div>
                    </div>
                    <div className="border border-gray-800 bg-[#0E0E0E] p-4">
                        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">VUES CUMULÉES</span>
                        <div className="text-2xl font-bold font-display text-primary-500">{totalViews.toLocaleString()}</div>
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
                            placeholder="Rechercher par titre, description..."
                            className="w-full bg-[#141414] border border-gray-800 text-white pl-9 pr-4 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none placeholder:text-gray-600"
                        />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-[#141414] border border-gray-800 text-gray-300 text-xs font-mono px-3 py-2 focus:border-primary-500 focus:outline-none"
                    >
                        <option value="">Toutes les catégories</option>
                        {cathegories.map((cat) => (
                            <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                {/* ── GRILLE DES PROJETS ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.length === 0 ? (
                        <div className="col-span-full border border-dashed border-gray-800 p-12 text-center bg-[#0E0E0E]">
                            <ImageIcon size={32} className="mx-auto text-gray-600 mb-3" />
                            <p className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-4">
                                AUCUN PROJET CORRESPONDANT
                            </p>
                            <button
                                onClick={openCreateModal}
                                className="px-4 py-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400"
                            >
                                CRÉER UN PROJET
                            </button>
                        </div>
                    ) : (
                        filteredProjects.map((project) => (
                            <article
                                key={project.id}
                                className="border border-gray-800 bg-[#0E0E0E] flex flex-col group hover:border-primary-500/60 transition-colors relative"
                            >
                                {/* Thumbnail */}
                                <div className="h-48 bg-[#141414] border-b border-gray-800 relative overflow-hidden">
                                    {project.images?.[0] ? (
                                        <img
                                            src={`/storage/${project.images[0].path}`}
                                            alt={project.titre}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700 font-mono text-xs">
                                            <Box size={24} className="mr-2" /> PAS D'IMAGE
                                        </div>
                                    )}

                                    <div className="absolute top-2 left-2 flex gap-1 z-10">
                                        <span className="px-2 py-0.5 bg-black/80 backdrop-blur-sm border border-gray-700 text-gray-300 font-mono text-[9px] uppercase tracking-wider">
                                            {project.cathegorie}
                                        </span>
                                    </div>

                                    <div className="absolute top-2 right-2 flex gap-1 z-10">
                                        {project.is_featured && (
                                            <span className="px-2 py-0.5 bg-yellow-500 text-black font-mono font-bold text-[9px] uppercase tracking-wider flex items-center gap-1">
                                                <Star size={9} /> VEDETTE
                                            </span>
                                        )}
                                        {project.is_published ? (
                                            <span className="px-2 py-0.5 bg-green-500/90 text-black font-mono font-bold text-[9px] uppercase tracking-wider">
                                                EN LIGNE
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-gray-700 text-white font-mono text-[9px] uppercase tracking-wider">
                                                BROUILLON
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                    <div>
                                        <h3 className="font-bold text-white uppercase text-base tracking-wider truncate mb-1">
                                            {project.titre}
                                        </h3>
                                        <p className="text-xs font-mono text-gray-400 line-clamp-2 leading-relaxed">
                                            {project.description}
                                        </p>
                                    </div>

                                    {/* Tools */}
                                    {project.outils && project.outils.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 pt-2">
                                            {project.outils.slice(0, 3).map((tool, idx) => (
                                                <span key={idx} className="text-[9px] font-mono px-1.5 py-0.5 bg-[#161616] border border-gray-800 text-gray-400 uppercase">
                                                    {tool}
                                                </span>
                                            ))}
                                            {project.outils.length > 3 && (
                                                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-[#161616] text-gray-500">
                                                    +{project.outils.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Footer card */}
                                    <div className="pt-3 border-t border-gray-800 flex items-center justify-between font-mono text-xs">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Eye size={12} className="text-primary-500" />
                                            <span>{project.views || 0} vues</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {project.slug && (
                                                <a
                                                    href={`/projects/${project.slug}`}
                                                    target="_blank"
                                                    className="p-1.5 border border-gray-800 hover:border-primary-500 text-gray-400 hover:text-white transition-colors"
                                                    title="Voir sur le site"
                                                >
                                                    <ExternalLink size={12} />
                                                </a>
                                            )}
                                            <button
                                                onClick={() => openEditModal(project)}
                                                className="p-1.5 border border-gray-800 hover:border-blue-500 text-gray-400 hover:text-blue-400 transition-colors"
                                                title="Modifier"
                                            >
                                                <Pencil size={12} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="p-1.5 border border-gray-800 hover:border-red-500 text-gray-400 hover:text-red-400 transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>

                {/* ══════════════════════════════════════════════════
                    MODAL : CRÉATION / ÉDITION DE PROJET
                ══════════════════════════════════════════════════ */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                        <div className="bg-[#0E0E0E] border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl">
                            
                            {/* Header modal */}
                            <div className="p-5 border-b border-gray-800 flex items-center justify-between sticky top-0 bg-[#0E0E0E] z-10">
                                <div>
                                    <div className="flex items-center gap-2 font-mono text-[10px] text-primary-500 uppercase tracking-widest font-bold">
                                        <Crosshair size={12} />
                                        <span>{editMode ? 'MODIFICATION DU PROJET' : 'NOUVELLE CRÉATION'}</span>
                                    </div>
                                    <h2 className="text-lg font-display font-bold uppercase text-white">
                                        {editMode ? data.titre : 'Enregistrer une réalisation'}
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
                                            Titre du projet *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={data.titre}
                                            onChange={(e) => setData('titre', e.target.value)}
                                            placeholder="Ex: Identité Visuelle EcoEnergy"
                                            className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Catégorie *
                                            </label>
                                            <select
                                                value={data.cathegorie}
                                                onChange={(e) => setData('cathegorie', e.target.value)}
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            >
                                                {cathegories.map((cat) => (
                                                    <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                                Valeur estimée / Prix (FCFA)
                                            </label>
                                            <input
                                                type="number"
                                                value={data.prix}
                                                onChange={(e) => setData('prix', e.target.value)}
                                                placeholder="Ex: 250000"
                                                className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-2 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                            Description & Contexte de conception *
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Expliquez la vision créative, le défi du client et la solution apportée..."
                                            className="w-full bg-[#141414] border border-gray-800 text-white p-3 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                        />
                                    </div>

                                    {/* Outils & Technologies */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">
                                                Logiciels & Outils (Min 3) *
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addTool}
                                                className="text-[10px] font-mono uppercase tracking-widest text-primary-500 hover:underline flex items-center gap-1"
                                            >
                                                <Plus size={12} /> AJOUTER UN OUTIL
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            {data.outils.map((tool, idx) => (
                                                <div key={idx} className="flex items-center gap-1">
                                                    <input
                                                        type="text"
                                                        value={tool}
                                                        onChange={(e) => handleToolChange(idx, e.target.value)}
                                                        placeholder={`Outil #${idx + 1}`}
                                                        className="w-full bg-[#141414] border border-gray-800 text-white px-3 py-1.5 text-xs font-mono focus:border-primary-500 focus:outline-none"
                                                    />
                                                    {data.outils.length > 3 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTool(idx)}
                                                            className="p-1 text-gray-500 hover:text-red-400"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Upload Images */}
                                    <div>
                                        <label className="block text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">
                                            Galerie d'images {!editMode && '(Min 4 requises)'}
                                        </label>
                                        <div className="border-2 border-dashed border-gray-800 p-4 text-center bg-[#141414]">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                id="project-images-input"
                                            />
                                            <label htmlFor="project-images-input" className="cursor-pointer flex flex-col items-center gap-1">
                                                <Upload size={20} className="text-gray-500" />
                                                <span className="text-xs font-mono text-primary-500 uppercase font-bold">Sélectionner des images</span>
                                                <span className="text-[10px] font-mono text-gray-500">Formats PNG, JPG, WEBP</span>
                                            </label>
                                        </div>

                                        {/* Previews */}
                                        {imagePreviews.length > 0 && (
                                            <div className="grid grid-cols-4 gap-2 mt-3">
                                                {imagePreviews.map((preview, idx) => (
                                                    <div key={idx} className="relative h-20 border border-gray-800 bg-gray-900 group overflow-hidden">
                                                        <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(idx)}
                                                            className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
                                            <span className="text-gray-300">Projet à la une (Featured)</span>
                                        </label>

                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={data.is_published}
                                                onChange={(e) => setData('is_published', e.target.checked)}
                                                className="accent-primary-500"
                                            />
                                            <span className="text-gray-300">Publié en ligne</span>
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
                                        {processing ? 'ENREGISTREMENT...' : (editMode ? 'METTRE À JOUR' : 'CRÉER LE PROJET')}
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