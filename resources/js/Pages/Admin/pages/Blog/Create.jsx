import { Link, useForm } from '@inertiajs/react'
import AdminLayout from '@/Layouts/AdminLayout'
import { ArrowLeft, Save, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'

export default function BlogCreate() {
    const { data, setData, post, processing, errors } = useForm({
        titre: '',
        sous_titre: '',
        courte_description: '',
        contenue: '',
        image: null,
        cathegorie: '',
        temps_lecture: '',
        is_published: false,
    })

    const [imagePreview, setImagePreview] = useState(null)

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        setData('image', file)
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        } else {
            setImagePreview(null)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('admin.blogs.store'))
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6 pb-12">

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.blogs.index')} className="btn btn-ghost p-2 rounded-full">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Créer un article</h1>
                            <p className="text-sm text-base-muted">Rédigez un nouveau post pour votre blog</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleSubmit}
                        disabled={processing}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Save size={18} />
                        {processing ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Main Content Area */}
                    <div className="card p-6 space-y-6">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Titre de l'article *</label>
                            <input 
                                type="text" 
                                className="input text-lg font-medium"
                                placeholder="Titre principal..."
                                value={data.titre}
                                onChange={e => setData('titre', e.target.value)}
                            />
                            {errors.titre && <p className="text-sm text-red-500">{errors.titre}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Sous-titre</label>
                            <input 
                                type="text" 
                                className="input"
                                placeholder="Un sous-titre accrocheur..."
                                value={data.sous_titre}
                                onChange={e => setData('sous_titre', e.target.value)}
                            />
                            {errors.sous_titre && <p className="text-sm text-red-500">{errors.sous_titre}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Courte description (extrait)</label>
                            <textarea 
                                className="input min-h-[80px] resize-y"
                                placeholder="Sera affichée sur la page d'accueil du blog..."
                                value={data.courte_description}
                                onChange={e => setData('courte_description', e.target.value)}
                            />
                            {errors.courte_description && <p className="text-sm text-red-500">{errors.courte_description}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium flex items-center justify-between">
                                Contenu de l'article *
                                <span className="text-xs text-base-muted font-normal">Markdown ou texte enrichi supporté</span>
                            </label>
                            <div className="relative">
                                <textarea 
                                    className="input min-h-[400px] resize-y font-mono text-sm leading-relaxed bg-muted/30 focus:bg-transparent transition-colors"
                                    placeholder="Écrivez votre article ici... Vous pouvez utiliser la syntaxe Markdown (# Titre, **Gras**, *Italique*)."
                                    value={data.contenue}
                                    onChange={e => setData('contenue', e.target.value)}
                                />
                            </div>
                            {errors.contenue && <p className="text-sm text-red-500">{errors.contenue}</p>}
                        </div>
                    </div>

                    {/* Sidebar / Meta Information */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="card p-6 space-y-6">
                            <h3 className="font-semibold border-b border-base pb-3">Média</h3>
                            
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Image de couverture</label>
                                <div className="border-2 border-dashed border-base rounded-xl overflow-hidden relative group">
                                    {imagePreview ? (
                                        <div className="relative aspect-video">
                                            <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                <span className="text-white text-sm font-medium">Changer l'image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-muted flex flex-col items-center justify-center text-base-muted hover:text-primary-500 transition-colors cursor-pointer">
                                            <ImageIcon size={32} className="mb-2" />
                                            <span className="text-sm font-medium">Cliquez pour ajouter une image</span>
                                            <span className="text-xs mt-1">JPEG, PNG max 5MB (Redimensionnée auto)</span>
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
                            </div>
                        </div>

                        <div className="card p-6 space-y-6">
                            <h3 className="font-semibold border-b border-base pb-3">Paramètres</h3>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Catégories</label>
                                    <input 
                                        type="text" 
                                        className="input text-sm"
                                        placeholder="Design, Inspiration, UI/UX (séparées par virgule)"
                                        value={data.cathegorie}
                                        onChange={e => setData('cathegorie', e.target.value)}
                                    />
                                    {errors.cathegorie && <p className="text-sm text-red-500">{errors.cathegorie}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Temps de lecture estimé (min)</label>
                                    <input 
                                        type="number" 
                                        className="input text-sm"
                                        placeholder="Ex: 5"
                                        min="1"
                                        value={data.temps_lecture}
                                        onChange={e => setData('temps_lecture', e.target.value)}
                                    />
                                    {errors.temps_lecture && <p className="text-sm text-red-500">{errors.temps_lecture}</p>}
                                </div>

                                <div className="pt-4 border-t border-base">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className="relative">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only"
                                                checked={data.is_published}
                                                onChange={e => setData('is_published', e.target.checked)}
                                            />
                                            <div className={`block w-10 h-6 rounded-full transition-colors ${data.is_published ? 'bg-primary-500' : 'bg-muted border border-base'}`}></div>
                                            <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${data.is_published ? 'transform translate-x-4' : ''}`}></div>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium block">Publier l'article</span>
                                            <span className="text-xs text-base-muted">Si inactif, l'article sera en brouillon.</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
        </AdminLayout>
    )
}
