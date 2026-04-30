import { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
    FolderGit2,
    Eye,
    Pencil,
    Trash2,
    Image as ImageIcon,
    Users,
    TrendingUp,
    BarChart3,
    Plus,
    Settings,
    X, Plus, Trash2
    
} from 'lucide-react';
export default function ProjectModal({ show, onClose, project = null, onSuccess }) {
    const [images, setImages] = useState([]);
    const [tools, setTools] = useState(['']);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        titre: '',
        description: '',
        cathegorie: '',
        outils: [],
        prix: '',
        image: null,
        is_featured: false,
        is_published: false,
    });

    useEffect(() => {
        if (project) {
            setData({
                titre: project.titre || '',
                description: project.description || '',
                cathegorie: project.cathegorie || '',
                outils: project.outils || [],
                prix: project.prix || '',
                image: null,
                is_featured: project.is_featured || false,
                is_published: project.is_published || false,
            });
            setTools(project.outils?.length ? project.outils : ['']);
        } else {
            reset();
            setTools(['']);
        }
    }, [project, show]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('titre', data.titre);
        formData.append('description', data.description);
        formData.append('cathegorie', data.cathegorie);
        formData.append('outils', JSON.stringify(data.outils));
        formData.append('prix', data.prix);
        formData.append('is_featured', data.is_featured ? 1 : 0);
        formData.append('is_published', data.is_published ? 1 : 0);
        
        if (data.image) {
            formData.append('image', data.image);
        }

        if (project) {
            formData.append('_method', 'PUT');
            post(route('admin.projects.update', project.id), {
                data: formData,
                onSuccess: () => {
                    onSuccess();
                    onClose();
                    reset();
                },
            });
        } else {
            post(route('admin.projects.store'), {
                data: formData,
                onSuccess: () => {
                    onSuccess();
                    onClose();
                    reset();
                },
            });
        }
    };

    const addTool = () => {
        setTools([...tools, '']);
    };

    const removeTool = (index) => {
        const newTools = tools.filter((_, i) => i !== index);
        setTools(newTools);
        setData('outils', newTools.filter(tool => tool.trim()));
    };

    const updateTool = (index, value) => {
        const newTools = [...tools];
        newTools[index] = value;
        setTools(newTools);
        setData('outils', newTools.filter(tool => tool.trim()));
    };

    if (!show) return null;

    return (
        <div className="inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

                <div className="relative transform overflow-hidden rounded-lg bg-gradient-orange-soft text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-base-muted">
                                {project ? 'Edit Project' : 'Create New Project'}
                            </h3>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 ">
                            {/* Titre */}
                            @csrf
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.titre}
                                    onChange={(e) => setData('titre', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.titre && <p className="text-red-500 text-xs mt-1">{errors.titre}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows="4"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            {/* Catégorie */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category *
                                </label>
                                <select
                                    value={data.cathegorie}
                                    onChange={(e) => setData('cathegorie', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    <option value="Web Design">Web Design</option>
                                    <option value="Mobile App">Mobile App</option>
                                    <option value="Branding">Branding</option>
                                    <option value="E-commerce">E-commerce</option>
                                    <option value="CMS">CMS</option>
                                </select>
                                {errors.cathegorie && <p className="text-red-500 text-xs mt-1">{errors.cathegorie}</p>}
                            </div>

                            {/* Outils (Tools) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tools & Technologies
                                </label>
                                {tools.map((tool, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <input
                                            type="text"
                                            value={tool}
                                            onChange={(e) => updateTool(index, e.target.value)}
                                            placeholder="e.g., Laravel, React, Tailwind"
                                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                        {tools.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeTool(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addTool}
                                    className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mt-1"
                                >
                                    <Plus size={14} /> Add tool
                                </button>
                            </div>

                            {/* Prix */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price (FCFA)
                                </label>
                                <input
                                    type="number"
                                    value={data.prix}
                                    onChange={(e) => setData('prix', e.target.value)}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.prix && <p className="text-red-500 text-xs mt-1">{errors.prix}</p>}
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Featured Image
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                    accept="image/*"
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
                            </div>

                            {/* Checkboxes */}
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_featured}
                                        onChange={(e) => setData('is_featured', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Featured Project</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.is_published}
                                        onChange={(e) => setData('is_published', e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Published</span>
                                </label>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : (project ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}