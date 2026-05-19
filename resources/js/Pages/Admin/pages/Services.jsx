import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Link, router, useForm } from '@inertiajs/react';
import {
    PenTool,
    Plus,
    Pencil,
    Trash2,
    Eye,
    BadgeCheck,
    Clock,
    Banknote,
    X,
    Code2,
    Package,
    Star,
    Globe,
    AlertCircle,
    Loader2,
    Tag
} from 'lucide-react';

export default function Index({ services = [] }) {
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentServiceId, setCurrentServiceId] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        titre: '',
        description: '',
        cathegorie: '',
        prix: '',
        starting_price: '',
        delaie_livraison: '',
        outils: ['', '', ''],
        livrables: ['', ''],
        features: ['', '', ''],
        is_featured: false,
        is_active: true,
    });

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentServiceId(null);
        reset();
        clearErrors();
        setIsSubmitting(false);
    };

    const openEditModal = (service) => {
        setEditMode(true);
        setCurrentServiceId(service.id);

        setData({
            titre: service.titre,
            description: service.description,
            cathegorie: service.cathegorie || '',
            prix: service.prix || '',
            starting_price: service.starting_price || '',
            delaie_livraison: service.delaie_livraison || '',
            outils: service.outils && service.outils.length > 0 ? service.outils : ['', '', ''],
            livrables: service.livrables && service.livrables.length > 0 ? service.livrables : ['', ''],
            features: service.features && service.features.length > 0 ? service.features : ['', '', ''],
            is_featured: service.is_featured || false,
            is_active: service.is_active !== undefined ? service.is_active : true,
        });

        setShowModal(true);
    };

    useEffect(() => {
        if (!showModal) {
            closeModal();
        }
    }, [showModal]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nonEmptyTools = data.outils.filter(tool => tool && tool.trim() !== '');
        const nonEmptyLivrables = data.livrables.filter(livrable => livrable && livrable.trim() !== '');
        const nonEmptyFeatures = data.features.filter(feature => feature && feature.trim() !== '');

        if (nonEmptyTools.length < 3) {
            alert('Veuillez ajouter au moins 3 outils/technologies');
            return;
        }
        if (nonEmptyLivrables.length < 2) {
            alert('Veuillez ajouter au moins 2 livrables');
            return;
        }
        if (nonEmptyFeatures.length < 3) {
            alert('Veuillez ajouter au moins 3 fonctionnalités');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('titre', data.titre);
        formData.append('description', data.description);
        formData.append('cathegorie', data.cathegorie);
        formData.append('prix', data.prix || '');
        formData.append('starting_price', data.starting_price || '');
        formData.append('delaie_livraison', data.delaie_livraison || '');
        formData.append('outils', JSON.stringify(nonEmptyTools));
        formData.append('livrables', JSON.stringify(nonEmptyLivrables));
        formData.append('features', JSON.stringify(nonEmptyFeatures));
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('is_active', data.is_active ? '1' : '0');

        if (editMode) {
            formData.append('_method', 'PUT');
            post(route('admin.services.update', currentServiceId), {
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                    router.reload();
                },
                onError: (err) => {
                    console.error('Errors:', err);
                    setIsSubmitting(false);
                },
            });
        } else {
            post(route('admin.services.store'), {
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                    router.reload();
                },
                onError: (err) => {
                    console.error('Errors:', err);
                    setIsSubmitting(false);
                },
            });
        }
    };

    // Tools functions
    const addTool = () => {
        setData('outils', [...data.outils, '']);
    };

    const removeTool = (index) => {
        if (data.outils.length > 3) {
            const newTools = data.outils.filter((_, i) => i !== index);
            setData('outils', newTools);
        }
    };

    const updateTool = (index, value) => {
        const newTools = [...data.outils];
        newTools[index] = value;
        setData('outils', newTools);
    };

    // Livrables functions
    const addLivrable = () => {
        setData('livrables', [...data.livrables, '']);
    };

    const removeLivrable = (index) => {
        if (data.livrables.length > 2) {
            const newLivrables = data.livrables.filter((_, i) => i !== index);
            setData('livrables', newLivrables);
        }
    };

    const updateLivrable = (index, value) => {
        const newLivrables = [...data.livrables];
        newLivrables[index] = value;
        setData('livrables', newLivrables);
    };

    // Features functions
    const addFeature = () => {
        setData('features', [...data.features, '']);
    };

    const removeFeature = (index) => {
        if (data.features.length > 3) {
            const newFeatures = data.features.filter((_, i) => i !== index);
            setData('features', newFeatures);
        }
    };

    const updateFeature = (index, value) => {
        const newFeatures = [...data.features];
        newFeatures[index] = value;
        setData('features', newFeatures);
    };

    const handleDelete = (id) => {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
            router.delete(route('admin.services.destroy', id));
        }
    };

    // Catégories disponibles
    const categories = [
        'logo design',
        'branding',
        'flyer design',
        'poster design',
        'social media design',
        'ui/ux design',
        'illustration',
        'autre'
    ];

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-base-primary flex items-center gap-2">
                            <PenTool size={26} />
                            Services
                        </h1>
                        <p className="text-base-muted mt-1">
                            Gérez vos services et offres de design
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setEditMode(false);
                            setCurrentServiceId(null);
                            reset();
                            setData('outils', ['', '', '']);
                            setData('livrables', ['', '']);
                            setData('features', ['', '', '']);
                            setData('is_published', true);
                            setShowModal(true);
                        }}
                        className="btn btn-primary btn-lg gap-2"
                    >
                        <Plus size={18} />
                        Nouveau Service
                    </button>
                </div>

                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {services.length === 0 && (
                        <div className="card p-10 text-center col-span-full">
                            <PenTool className="mx-auto text-base-muted" size={40} />
                            <p className="mt-3 text-base-muted">
                                Aucun service pour le moment. Créez votre premier service.
                            </p>
                            <button
                                onClick={() => {
                                    setEditMode(false);
                                    setShowModal(true);
                                }}
                                className="btn btn-primary mt-4"
                            >
                                <Plus size={16} />
                                Créer un service
                            </button>
                        </div>
                    )}

                    {services.map((service) => (
                        <div key={service.id} className="card p-5 hover-lift space-y-4">
                            <div className="flex items-start justify-between">
                                <h2 className="font-bold text-base-primary text-lg">
                                    {service.titre}
                                </h2>
                                {service.is_featured && (
                                    <span className="badge bg-primary-500 text-white">
                                        <Star size={12} className="inline mr-1" />
                                        Featured
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-base-muted line-clamp-3">
                                {service.description}
                            </p>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-base-muted flex items-center gap-2">
                                        <Banknote size={14} /> Prix
                                    </span>
                                    <span className="font-semibold text-primary-500">
                                        {service.prix ? `${service.prix.toLocaleString()} FCFA` : 'Sur devis'}
                                    </span>
                                </div>

                                {service.starting_price && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-base-muted">À partir de</span>
                                        <span>{service.starting_price.toLocaleString()} FCFA</span>
                                    </div>
                                )}

                                {service.delaie_livraison && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-base-muted flex items-center gap-2">
                                            <Clock size={14} /> Délai
                                        </span>
                                        <span>{service.delaie_livraison} jours</span>
                                    </div>
                                )}
                            </div>

                            {service.features?.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {service.features.slice(0, 3).map((f, i) => (
                                        <span key={i} className="badge bg-base-muted text-base-secondary flex items-center gap-1">
                                            <BadgeCheck size={12} />
                                            {f}
                                        </span>
                                    ))}
                                    {service.features.length > 3 && (
                                        <span className="badge bg-base-muted text-base-secondary">
                                            +{service.features.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-base">
                                <Link
                                    href={`/admin/services/${service.id}`}
                                    className="btn btn-ghost btn-sm gap-1"
                                >
                                    <Eye size={14} />
                                    Voir
                                </Link>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(service)}
                                        className="btn btn-secondary btn-sm"
                                    >
                                        <Pencil size={14} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODAL FORM */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" onClick={closeModal}>
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
                        </div>

                        <div className="inline-block transform overflow-hidden rounded-2xl bg-base text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:align-middle">
                            <div className="bg-gradient-orange-soft border-b border-base px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-base-primary flex items-center gap-2">
                                            <PenTool size={24} className="text-primary-500" />
                                            {editMode ? 'Modifier le service' : 'Nouveau service'}
                                        </h3>
                                        <p className="text-base-muted text-sm mt-1">
                                            {editMode ? 'Modifiez les détails de votre service' : 'Remplissez les informations pour créer un nouveau service'}
                                        </p>
                                    </div>
                                    <button onClick={closeModal} className="text-base-muted hover:text-base-primary transition-colors">
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Colonne gauche */}
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-base-primary mb-2">
                                                    Titre du service *
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.titre}
                                                    onChange={(e) => setData('titre', e.target.value)}
                                                    className="input"
                                                    placeholder="Ex: Création de logo professionnel"
                                                    required
                                                />
                                                {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-base-primary mb-2">
                                                    Catégorie *
                                                </label>
                                                <select
                                                    value={data.cathegorie}
                                                    onChange={(e) => setData('cathegorie', e.target.value)}
                                                    className="input"
                                                    required
                                                >
                                                    <option value="">Sélectionnez une catégorie</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat} value={cat}>
                                                            {cat}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.cathegorie && <p className="text-red-500 text-xs mt-1">{errors.cathegorie}</p>}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm font-medium text-base-primary mb-2">
                                                        Prix (FCFA)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={data.prix}
                                                        onChange={(e) => setData('prix', e.target.value)}
                                                        className="input"
                                                        placeholder="0"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-base-primary mb-2">
                                                        Prix à partir de
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={data.starting_price}
                                                        onChange={(e) => setData('starting_price', e.target.value)}
                                                        className="input"
                                                        placeholder="0"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-base-primary mb-2">
                                                    Délai de livraison (jours)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.delaie_livraison}
                                                    onChange={(e) => setData('delaie_livraison', e.target.value)}
                                                    className="input"
                                                    placeholder="7-14"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.is_featured}
                                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                                        className="w-4 h-4 rounded border-base text-primary-500"
                                                    />
                                                    <span className="text-sm text-base-primary flex items-center gap-2">
                                                        <Star size={16} />
                                                        Service en vedette
                                                    </span>
                                                </label>

                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.is_published}
                                                        onChange={(e) => setData('is_published', e.target.checked)}
                                                        className="w-4 h-4 rounded border-base text-primary-500"
                                                    />
                                                    <span className="text-sm text-base-primary flex items-center gap-2">
                                                        <Globe size={16} />
                                                        Publié
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Colonne droite */}
                                        <div>
                                            <label className="block text-sm font-medium text-base-primary mb-2">
                                                Description complète *
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                rows="8"
                                                className="input resize-none"
                                                placeholder="Décrivez votre service en détail..."
                                                required
                                            />
                                            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                        </div>
                                    </div>

                                    {/* Outils & Technologies */}
                                    <div className="border-t border-base pt-5">
                                        <label className="block text-sm font-medium text-base-primary mb-3">
                                            Outils & Technologies (minimum 3) *
                                        </label>
                                        <div className="space-y-3">
                                            {data.outils.map((tool, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" size={18} />
                                                        <input
                                                            type="text"
                                                            value={tool}
                                                            onChange={(e) => updateTool(index, e.target.value)}
                                                            placeholder={`Outil ${index + 1}`}
                                                            className="input pl-10"
                                                        />
                                                    </div>
                                                    {data.outils.length > 3 && (
                                                        <button type="button" onClick={() => removeTool(index)} className="btn btn-ghost btn-sm text-red-500">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={addTool} className="btn btn-secondary btn-sm gap-1">
                                                <Plus size={14} /> Ajouter un outil
                                            </button>
                                        </div>
                                        {errors.outils && <p className="text-red-500 text-xs mt-1">{errors.outils}</p>}
                                    </div>

                                    {/* Livrables */}
                                    <div className="border-t border-base pt-5">
                                        <label className="block text-sm font-medium text-base-primary mb-3">
                                            Livrables (minimum 2) *
                                        </label>
                                        <div className="space-y-3">
                                            {data.livrables.map((livrable, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" size={18} />
                                                        <input
                                                            type="text"
                                                            value={livrable}
                                                            onChange={(e) => updateLivrable(index, e.target.value)}
                                                            placeholder={`Livrable ${index + 1}`}
                                                            className="input pl-10"
                                                        />
                                                    </div>
                                                    {data.livrables.length > 2 && (
                                                        <button type="button" onClick={() => removeLivrable(index)} className="btn btn-ghost btn-sm text-red-500">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={addLivrable} className="btn btn-secondary btn-sm gap-1">
                                                <Plus size={14} /> Ajouter un livrable
                                            </button>
                                        </div>
                                        {errors.livrables && <p className="text-red-500 text-xs mt-1">{errors.livrables}</p>}
                                    </div>

                                    {/* Features */}
                                    <div className="border-t border-base pt-5">
                                        <label className="block text-sm font-medium text-base-primary mb-3">
                                            Fonctionnalités (minimum 3) *
                                        </label>
                                        <div className="space-y-3">
                                            {data.features.map((feature, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" size={18} />
                                                        <input
                                                            type="text"
                                                            value={feature}
                                                            onChange={(e) => updateFeature(index, e.target.value)}
                                                            placeholder={`Fonctionnalité ${index + 1}`}
                                                            className="input pl-10"
                                                        />
                                                    </div>
                                                    {data.features.length > 3 && (
                                                        <button type="button" onClick={() => removeFeature(index)} className="btn btn-ghost btn-sm text-red-500">
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button type="button" onClick={addFeature} className="btn btn-secondary btn-sm gap-1">
                                                <Plus size={14} /> Ajouter une fonctionnalité
                                            </button>
                                        </div>
                                        {errors.features && <p className="text-red-500 text-xs mt-1">{errors.features}</p>}
                                    </div>

                                    {/* Boutons */}
                                    <div className="flex justify-end gap-3 pt-5 border-t border-base">
                                        <button type="button" onClick={closeModal} className="btn btn-secondary">
                                            Annuler
                                        </button>
                                        <button type="submit" disabled={processing || isSubmitting} className="btn btn-primary min-w-[140px] gap-2">
                                            {(processing || isSubmitting) ? (
                                                <><Loader2 size={16} className="animate-spin" /> {editMode ? 'Mise à jour...' : 'Création...'}</>
                                            ) : (
                                                <>{editMode ? 'Mettre à jour' : 'Créer le service'}</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}