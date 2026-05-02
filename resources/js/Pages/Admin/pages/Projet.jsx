import { useState, useEffect } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { useForm } from '@inertiajs/react';
import { Link, router } from '@inertiajs/react';
import {
    FolderGit2,
    Eye,
    Pencil,
    Trash2,
    Image as ImageIcon,
    Users,
    TrendingUp,
    Plus,
    X,
    AlertCircle,
    Upload,
    Hash,
    Tag,
    DollarSign,
    Code2,
    Star,
    Globe,
    CheckCircle,
    Loader2
} from 'lucide-react';

export default function Index({ projects = [], cathegories = [], editProject = null, isEditing = false }) {
    const [showModal, setShowModal] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProjectId, setCurrentProjectId] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        titre: '',
        description: '',
        cathegorie: '',
        prix: '',
        images: [],
        is_featured: false,
        is_published: false,
        outils: ['', '', ''],
    });

    // Fermer et reset le formulaire
    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentProjectId(null);
        // Nettoyer les previews
        imagePreviews.forEach(preview => {
            if (preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        });
        setImagePreviews([]);
        reset();
        clearErrors();
        setIsSubmitting(false);
        setData('outils', ['', '', '']);
    };

    // Ouvrir le modal en mode édition
    const openEditModal = (project) => {
        setEditMode(true);
        setCurrentProjectId(project.id);
        
        // Remplir le formulaire avec les données du projet
        setData({
            titre: project.titre,
            description: project.description,
            cathegorie: project.cathegorie,
            prix: project.prix || '',
            images: [],
            is_featured: project.is_featured,
            is_published: project.is_published,
            outils: project.outils && project.outils.length > 0 ? project.outils : ['', '', ''],
        });
        
        // Charger les previews des images existantes
        if (project.images && project.images.length > 0) {
            const previews = project.images.map(img => `/storage/${img.path}`);
            setImagePreviews(previews);
        }
        
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
        
        if (nonEmptyTools.length < 3) {
            alert('Please add at least 3 tools/technologies');
            return;
        }
        
        if (!editMode && data.images.length < 4) {
            alert(`Please select ${4 - data.images.length} more image(s). Minimum 4 images required.`);
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('titre', data.titre);
        formData.append('description', data.description);
        formData.append('cathegorie', data.cathegorie);
        formData.append('prix', data.prix || '');
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('is_published', data.is_published ? '1' : '0');
        formData.append('outils', JSON.stringify(nonEmptyTools));
        
        for (let i = 0; i < data.images.length; i++) {
            formData.append(`images[]`, data.images[i]);
        }

        if (editMode) {
            // Mise à jour
            put(route('admin.projects.update', currentProjectId), {
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Errors:', errors);
                    setIsSubmitting(false);
                },
            });
        } else {
            // Création
            post(route('admin.projects.store'), {
                data: formData,
                forceFormData: true,
                onSuccess: () => {
                    closeModal();
                    router.reload();
                },
                onError: (errors) => {
                    console.error('Errors:', errors);
                    setIsSubmitting(false);
                },
            });
        }
    };
    
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

    const handleImageChange = (e) => {
        const newFiles = Array.from(e.target.files);
        
        if (newFiles.length === 0) return;
        
        const currentImages = data.images || [];
        
        if (currentImages.length + newFiles.length > 10) {
            alert(`Maximum 10 images allowed. You have ${currentImages.length} already.`);
            e.target.value = '';
            return;
        }
        
        const allImages = [...currentImages, ...newFiles];
        
        setData('images', allImages);
        
        // Nettoyer les anciennes previews
        imagePreviews.forEach(preview => {
            if (preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        });
        
        // Créer les nouvelles previews
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

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            router.delete(route('admin.projects.destroy', id));
        }
    };

    const totalProjects = projects.length;
    const totalViews = projects.reduce((sum, p) => sum + (p.views || 0), 0);
    const featuredProjects = projects.filter(p => p.is_featured).length;

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-base-primary flex items-center gap-2">
                            <FolderGit2 size={26} />
                            Projects
                        </h1>
                        <p className="text-base-muted mt-1">
                            Manage your design portfolio projects
                        </p>
                    </div>

                    <button 
                        onClick={() => {
                            setEditMode(false);
                            setCurrentProjectId(null);
                            reset();
                            setData('outils', ['', '', '']);
                            setImagePreviews([]);
                            setShowModal(true);
                        }}
                        className="btn btn-primary btn-lg gap-2"
                    >
                        <Plus size={18} />
                        New Project
                    </button>
                </div>

                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        {
                            label: 'Total Projects',
                            value: totalProjects,
                            icon: FolderGit2,
                            trend: `${featuredProjects} featured`,
                            color: 'text-primary-500'
                        },
                        {
                            label: 'Total Views',
                            value: totalViews.toLocaleString(),
                            icon: Eye,
                            trend: '+12% increase',
                            color: 'text-green-500'
                        },
                        {
                            label: 'Visitors',
                            value: '3,847',
                            icon: Users,
                            trend: '+8% weekly',
                            color: 'text-blue-500'
                        },
                        {
                            label: 'Growth',
                            value: '4.2%',
                            icon: TrendingUp,
                            trend: '+0.5% boost',
                            color: 'text-emerald-500'
                        },
                    ].map((stat, i) => {
                        const Icon = stat.icon
                        return (
                            <div key={i} className="card p-5 hover-lift">
                                <div className="flex items-center justify-between">
                                    <Icon className={stat.color} size={22} />
                                    <span className="text-xs px-2 py-1 rounded-full bg-muted text-base-secondary">
                                        {stat.trend}
                                    </span>
                                </div>
                                <p className="text-base-muted text-sm mt-4">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold text-base-primary mt-1">
                                    {stat.value}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* PROJECTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {projects.length === 0 && (
                        <div className="card p-10 text-center col-span-full">
                            <ImageIcon className="mx-auto text-base-muted" size={40} />
                            <p className="mt-3 text-base-muted">
                                No projects yet. Create your first project.
                            </p>
                            <button 
                                onClick={() => {
                                    setEditMode(false);
                                    setShowModal(true);
                                }}
                                className="btn btn-primary mt-4"
                            >
                                <Plus size={16} />
                                Create Project
                            </button>
                        </div>
                    )}

                    {projects.map((project) => (
                        <div key={project.id} className="card overflow-hidden hover-lift">
                            <div className="h-48 bg-muted relative overflow-hidden">
                                {project.images && project.images.length > 0 ? (
                                    <img
                                        src={`/storage/${project.images[0].path}`}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                                        alt={project.titre}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <ImageIcon className="text-base-muted" size={40} />
                                    </div>
                                )}

                                <span className="absolute top-3 left-3 badge bg-primary-500 text-white">
                                    {project.cathegorie}
                                </span>

                                {project.is_featured && (
                                    <span className="absolute top-3 right-3 badge bg-yellow-500 text-white gap-1">
                                        <Star size={12} />
                                        Featured
                                    </span>
                                )}
                            </div>

                            <div className="p-5 space-y-3">
                                <h3 className="font-bold text-base-primary text-lg">
                                    {project.titre}
                                </h3>
                                <p className="text-sm text-base-muted line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="flex justify-between items-center text-xs text-base-muted pt-2">
                                    <div className="flex items-center gap-1">
                                        <DollarSign size={12} />
                                        <span>{project.prix ? `${Number(project.prix).toLocaleString()} FCFA` : 'Price on request'}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Code2 size={12} />
                                        <span>{project.outils?.length || 0} tools</span>
                                    </div>
                                    <div className={`flex items-center gap-1 ${project.is_published ? 'text-green-500' : 'text-red-500'}`}>
                                        {project.is_published ? <CheckCircle size={12} /> : <X size={12} />}
                                        <span>{project.is_published ? 'Published' : 'Draft'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-base">
                                    <Link
                                        href={route('admin.projects.show', project.id)}
                                        className="btn btn-ghost btn-sm"
                                    >
                                        <Eye size={14} />
                                        View
                                    </Link>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(project)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <Pencil size={14} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
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

                        <div className="inline-block transform overflow-hidden rounded-2xl bg-base text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:align-middle">
                            {/* Modal Header */}
                            <div className="bg-gradient-orange-soft border-b border-base px-6 py-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-bold text-base-primary flex items-center gap-2">
                                            <FolderGit2 size={24} className="text-primary-500" />
                                            {editMode ? 'Edit Project' : 'Create New Project'}
                                        </h3>
                                        <p className="text-base-muted text-sm mt-1">
                                            {editMode ? 'Modify your project details' : 'Fill in the details to add a new project to your portfolio'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={closeModal}
                                        className="text-base-muted hover:text-base-primary transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Left Column */}
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-base-primary mb-2">Title *</label>
                                                <div className="relative">
                                                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" size={18} />
                                                    <input type="text" value={data.titre} onChange={(e) => setData('titre', e.target.value)} className="input pl-10" placeholder="Enter project title" required />
                                                </div>
                                                {errors.titre && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} /> {errors.titre}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-base-primary mb-2">Category *</label>
                                                <div className="relative">
                                                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" size={18} />
                                                    <select value={data.cathegorie} onChange={(e) => setData('cathegorie', e.target.value)} className="input pl-10 appearance-none" required>
                                                        <option value="">Select a category</option>
                                                        {cathegories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                                    </select>
                                                </div>
                                                {errors.cathegorie && <p className="text-red-500 text-xs mt-1">{errors.cathegorie}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-base-primary mb-2">Price (FCFA)</label>
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" size={18} />
                                                    <input type="number" value={data.prix} onChange={(e) => setData('prix', e.target.value)} className="input pl-10" placeholder="Enter project price" />
                                                </div>
                                                {errors.prix && <p className="text-red-500 text-xs mt-1">{errors.prix}</p>}
                                            </div>

                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" checked={data.is_featured} onChange={(e) => setData('is_featured', e.target.checked)} className="w-4 h-4 rounded border-base text-primary-500 focus:ring-primary-500 focus:ring-offset-0" />
                                                    <span className="text-sm text-base-primary group-hover:text-primary-500 transition-colors flex items-center gap-2"><Star size={16} /> Featured Project</span>
                                                </label>

                                                <label className="flex items-center gap-3 cursor-pointer group">
                                                    <input type="checkbox" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)} className="w-4 h-4 rounded border-base text-primary-500 focus:ring-primary-500 focus:ring-offset-0" />
                                                    <span className="text-sm text-base-primary group-hover:text-primary-500 transition-colors flex items-center gap-2"><Globe size={16} /> Published</span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-sm font-medium text-base-primary mb-2">Description *</label>
                                                <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows="4" className="input resize-none" placeholder="Describe your project..." required />
                                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tools */}
                                    <div className="border-t border-base pt-5">
                                        <label className="block text-sm font-medium text-base-primary mb-3">Tools & Technologies (minimum 3) *</label>
                                        <div className="space-y-3">
                                            {data.outils.map((tool, index) => (
                                                <div key={index} className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 text-base-muted" size={18} />
                                                        <input type="text" value={tool} onChange={(e) => updateTool(index, e.target.value)} placeholder={`Tool ${index + 1} (e.g., Laravel, React, Tailwind)`} className="input pl-10" />
                                                    </div>
                                                    {data.outils.length > 3 && <button type="button" onClick={() => removeTool(index)} className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"><Trash2 size={16} /></button>}
                                                </div>
                                            ))}
                                            <button type="button" onClick={addTool} className="btn btn-secondary btn-sm gap-1"><Plus size={14} /> Add another tool</button>
                                        </div>
                                        {data.outils.filter(t => t && t.trim() !== '').length < 3 && <p className="text-yellow-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12} /> Please add at least {3 - data.outils.filter(t => t && t.trim() !== '').length} more tool(s)</p>}
                                    </div>

                                    {/* Images Upload */}
                                    <div className="border-t border-base pt-5">
                                        <label className="block text-sm font-medium text-base-primary mb-3">Project Images {!editMode && '(minimum 4) *'}</label>
                                        
                                        {imagePreviews.length > 0 && (
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-xl border border-base" />
                                                        <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"><X size={14} /></button>
                                                        <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">{index + 1}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="relative">
                                            <input type="file" multiple onChange={handleImageChange} accept="image/jpeg,image/png,image/jpg,image/gif,image/webp" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" id="image-upload" />
                                            <label htmlFor="image-upload" className="input flex items-center justify-center gap-2 cursor-pointer hover:border-primary-500 transition-colors min-h-[120px]">
                                                <Upload className="text-primary-500" size={24} />
                                                <div className="text-center">
                                                    <p className="text-base-primary font-medium">{editMode ? 'Click to add new images' : 'Click to upload images'}</p>
                                                    <p className="text-base-muted text-sm">PNG, JPG, GIF, WebP up to 2MB each</p>
                                                    <p className="text-primary-500 text-xs mt-1 font-semibold">{data.images.length} new image(s) selected</p>
                                                    {editMode && imagePreviews.length > 0 && <p className="text-base-muted text-xs mt-1">Current images: {imagePreviews.length - data.images.length} existing + {data.images.length} new</p>}
                                                </div>
                                            </label>
                                        </div>
                                        
                                        {errors.images && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={12} /> {errors.images}</p>}
                                    </div>

                                    {/* Modal Footer */}
                                    <div className="flex justify-end gap-3 pt-5 border-t border-base">
                                        <button type="button" onClick={closeModal} className="btn btn-secondary">Cancel</button>
                                        <button type="submit" disabled={processing || isSubmitting} className="btn btn-primary min-w-[120px] gap-2">
                                            {(processing || isSubmitting) ? (
                                                <><Loader2 size={16} className="animate-spin" /> {editMode ? 'Updating...' : 'Creating...'}</>
                                            ) : (
                                                <>{editMode ? <Pencil size={16} /> : <Plus size={16} />} {editMode ? 'Update Project' : 'Create Project'}</>
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