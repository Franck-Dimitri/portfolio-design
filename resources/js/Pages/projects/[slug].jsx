import { useState } from 'react'
import { Link } from '@inertiajs/react'
import {
    ArrowLeft, Eye, Calendar, DollarSign,
    Clock, Heart, Share2, Twitter, Linkedin, Mail,
    Camera, ZoomIn, ChevronLeft, ChevronRight, X,
    Code2, Star, MessageCircle, Layers
} from 'lucide-react'
import MainLayout from '@/Layouts/MainLayout'
import SEOHead from '@/Components/SEOHead'

export default function ProjectDetail({ project, relatedProjects = [] }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0)
    const [isLightboxOpen, setIsLightboxOpen] = useState(false)
    const [isLiked, setIsLiked] = useState(false)

    if (!project) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Projet non trouvé</h1>
                        <Link href="/projets" className="btn btn-primary">
                            Retour aux projets
                        </Link>
                    </div>
                </div>
            </MainLayout>
        )
    }

    const images = project.images || []
    const mainImage = images[activeImageIndex] || null
    const hasMultipleImages = images.length > 1

    const nextImage = () => {
        setActiveImageIndex((prev) => (prev + 1) % images.length)
    }

    const prevImage = () => {
        setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)
    }

    return (
        <MainLayout>
            <SEOHead 
                title={`${project.titre} | Projet de Design`}
                description={project.description?.substring(0, 160) || ''}
                url={`/projets/${project.slug}`}
            />

            <div className="pt-24 px-4">
                <div className="container-main">
                    <Link 
                        href="/projets"
                        className="inline-flex items-center gap-2 text-base-muted hover:text-primary-500 transition-colors group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Retour aux projets
                    </Link>
                </div>
            </div>

            <section className="py-8 pb-12">
                <div className="container-main px-4">
                    <div className="relative rounded-3xl overflow-hidden bg-muted mb-6">
                        {mainImage ? (
                            <>
                                <img
                                    src={`/storage/${mainImage.path}`}
                                    alt={project.titre}
                                    className="w-full h-auto max-h-[70vh] object-contain bg-gradient-to-br from-primary-500/10 to-primary-700/10 cursor-pointer"
                                    onClick={() => setIsLightboxOpen(true)}
                                />
                                <button
                                    onClick={() => setIsLightboxOpen(true)}
                                    className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-primary-500 transition-all"
                                >
                                    <ZoomIn size={18} />
                                </button>
                            </>
                        ) : (
                            <div className="w-full h-[50vh] flex items-center justify-center bg-gradient-to-br from-primary-500/10 to-primary-700/10 rounded-3xl">
                                <Camera size={64} className="text-primary-500/30" />
                            </div>
                        )}
                    </div>

                    {hasMultipleImages && (
                        <div className="flex gap-3 overflow-x-auto pb-4">
                            {images.map((image, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImageIndex(idx)}
                                    className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all
                                        ${activeImageIndex === idx 
                                            ? 'border-primary-500 shadow-orange-sm' 
                                            : 'border-transparent hover:border-primary-300'}`}
                                >
                                    <img
                                        src={`/storage/${image.path}`}
                                        alt={`${project.titre} - ${idx + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="py-8">
                <div className="container-main px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-base-primary mb-3">
                                            {project.titre}
                                        </h1>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 text-sm font-medium">
                                                {project.cathegorie}
                                            </span>
                                            {project.is_featured && (
                                                <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium flex items-center gap-1">
                                                    <Star size={14} /> Projet vedette
                                                </span>
                                            )}
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${project.is_published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {project.is_published ? 'Publié' : 'En cours'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsLiked(!isLiked)}
                                        className="p-3 rounded-full border border-base hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group"
                                    >
                                        <Heart 
                                            size={20} 
                                            className={`transition-colors ${isLiked ? 'fill-red-500 text-red-500' : 'text-base-muted group-hover:text-red-500'}`}
                                        />
                                    </button>
                                </div>
                                
                                <div className="prose prose-lg dark:prose-invert max-w-none">
                                    <p className="text-base-muted leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>
                            </div>

                            {project.outils && project.outils.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-base-primary mb-4 flex items-center gap-2">
                                        <Code2 size={20} className="text-primary-500" />
                                        Outils & Technologies
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        {project.outils.map((tool, idx) => (
                                            <span key={idx} className="px-4 py-2 rounded-xl bg-muted text-base-primary font-medium">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="p-4 rounded-xl bg-muted">
                                    <DollarSign size={18} className="text-primary-500 mb-2" />
                                    <div className="text-sm text-base-muted">Budget</div>
                                    <div className="text-lg font-bold text-base-primary">
                                        {parseInt(project.prix).toLocaleString()} FCFA
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted">
                                    <Calendar size={18} className="text-primary-500 mb-2" />
                                    <div className="text-sm text-base-muted">Date</div>
                                    <div className="text-lg font-bold text-base-primary">
                                        {new Date(project.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl bg-muted">
                                    <Layers size={18} className="text-primary-500 mb-2" />
                                    <div className="text-sm text-base-muted">Catégorie</div>
                                    <div className="text-lg font-bold text-base-primary">
                                        {project.cathegorie}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                                <h3 className="text-xl font-bold mb-3">Intéressé par ce projet ?</h3>
                                <p className="text-primary-100 text-sm mb-4">
                                    Contactez-moi pour discuter de vos besoins et créer ensemble quelque chose d'unique.
                                </p>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 bg-white text-primary-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-primary-50 transition-all w-full justify-center"
                                >
                                    <MessageCircle size={16} />
                                    Me contacter
                                </Link>
                            </div>

                            <div className="p-6 rounded-2xl border border-base">
                                <h3 className="font-semibold text-base-primary mb-4">Partager ce projet</h3>
                                <div className="flex gap-3">
                                    <button className="p-2 rounded-full bg-muted hover:bg-primary-500 hover:text-white transition-all">
                                        <Share2 size={18} />
                                    </button>
                                    <button className="p-2 rounded-full bg-muted hover:bg-primary-500 hover:text-white transition-all">
                                        <Twitter size={18} />
                                    </button>
                                    <button className="p-2 rounded-full bg-muted hover:bg-primary-500 hover:text-white transition-all">
                                        <Linkedin size={18} />
                                    </button>
                                    <button className="p-2 rounded-full bg-muted hover:bg-primary-500 hover:text-white transition-all">
                                        <Mail size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl border border-base">
                                <h3 className="font-semibold text-base-primary mb-4">Informations</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-base-muted">Vues</span>
                                        <span className="font-semibold text-base-primary">{project.views || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-base-muted">Outils utilisés</span>
                                        <span className="font-semibold text-base-primary">{project.outils?.length || 0}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-base-muted">Images</span>
                                        <span className="font-semibold text-base-primary">{images.length}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {relatedProjects.length > 0 && (
                <section className="py-16 bg-subtle">
                    <div className="container-main px-4">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold text-base-primary">
                                Projets similaires
                            </h2>
                            <Link href="/projets" className="text-primary-500 hover:text-primary-600 font-medium">
                                Voir tous →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedProjects.map((relatedProject) => (
                                <Link 
                                    key={relatedProject.id} 
                                    href={`/projets/${relatedProject.slug}`}
                                    className="group block"
                                >
                                    <div className="rounded-xl overflow-hidden bg-elevated border border-base hover:shadow-orange-md transition-all">
                                        <div className="h-48 overflow-hidden">
                                            {relatedProject.images && relatedProject.images[0] ? (
                                                <img
                                                    src={`/storage/${relatedProject.images[0].path}`}
                                                    alt={relatedProject.titre}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                                    <Camera size={32} className="text-base-muted" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-base-primary group-hover:text-primary-500 transition-colors">
                                                {relatedProject.titre}
                                            </h3>
                                            <p className="text-sm text-base-muted mt-1 line-clamp-2">
                                                {relatedProject.description}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {isLightboxOpen && mainImage && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setIsLightboxOpen(false)}>
                    <button
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                    >
                        <X size={24} />
                    </button>
                    {hasMultipleImages && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </>
                    )}
                    <img
                        src={`/storage/${mainImage.path}`}
                        alt={project.titre}
                        className="max-w-[90vw] max-h-[90vh] object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                    {hasMultipleImages && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                            {activeImageIndex + 1} / {images.length}
                        </div>
                    )}
                </div>
            )}
        </MainLayout>
    )
}   