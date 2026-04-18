import { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import {
    ArrowLeft, Calendar, User, Clock, Eye, Heart, Share2,
    Bookmark, MessageCircle, Twitter, Linkedin, Facebook,
    ChevronRight, Tag, Sparkles, ArrowRight
} from 'lucide-react'
import MainLayout from '@/Layouts/MainLayout'
import SEOHead from '@/Components/SEOHead'

// Données fictives (en attendant la base de données)
const MOCK_ARTICLES = {
    "tendances-design-2024": {
        id: 1,
        titre: "Les tendances design 2024 : entre minimalisme et maximalisme",
        slug: "tendances-design-2024",
        sous_titre: "Découvrez les courants qui façonnent le design graphique cette année",
        courte_description: "Le design graphique évolue constamment...",
        contenu: `
            <p class="lead">Le monde du design graphique est en perpétuelle évolution. En 2024, nous assistons à un fascinant paradoxe : la coexistence du minimalisme épuré et du maximalisme expressif.</p>
            
            <h2>Le retour du maximalisme assumé</h2>
            <p>Après des années de design ultra-minimaliste, on observe un retour en force des compositions riches, des couleurs vives et des typographies audacieuses. Les designers n'ont plus peur d'en faire trop, au contraire !</p>
            <p>Cette tendance se manifeste par :</p>
            <ul>
                <li>Des palettes de couleurs explosives</li>
                <li>Des superpositions d'éléments graphiques</li>
                <li>Des typographies éclectiques et personnalisées</li>
                <li>Des textures et motifs complexes</li>
            </ul>
            
            <h2>La persistance du minimalisme fonctionnel</h2>
            <p>Parallèlement, le minimalisme n'a pas dit son dernier mot. Il évolue vers une version plus fonctionnelle où chaque élément a une raison d'être. L'accent est mis sur la lisibilité, l'accessibilité et l'expérience utilisateur.</p>
            
            <div class="bg-gradient-to-r from-primary-500/10 to-primary-700/10 p-6 rounded-2xl my-8">
                <p class="italic text-base-primary">"Le meilleur design est celui qui passe inaperçu parce qu'il fonctionne parfaitement."</p>
                <p class="text-sm text-base-muted mt-2">— Dieter Rams</p>
            </div>
            
            <h2>L'impact de l'IA sur le design graphique</h2>
            <p>L'intelligence artificielle bouleverse également nos pratiques. Loin de remplacer les designers, elle devient un outil puissant pour générer des idées, automatiser des tâches répétitives et explorer des directions créatives inattendues.</p>
            
            <h2>Conclusion</h2>
            <p>2024 s'annonce comme une année passionnante où la créativité n'a pas de limites. Que vous soyez adepte du "less is more" ou du "more is more", l'essentiel est de créer des designs qui racontent une histoire et qui connectent avec votre audience.</p>
        `,
        image: null,
        temps_lecture: 5,
        is_published: true,
        published_at: "2024-01-15",
        category: "Inspiration",
        tags: ["Design", "Tendances", "2024", "Créativité"],
        author: "Franck Dimitri",
        author_bio: "Designer graphique freelance passionné par la création d'identités visuelles percutantes. Basé à Yaoundé, disponible dans le monde entier.",
        author_avatar: "FD",
        views: 1247,
        likes: 89,
        comments: 12
    },
    "creer-identite-marque-memorables": {
        id: 2,
        titre: "Comment créer une identité de marque mémorable",
        slug: "creer-identite-marque-memorables",
        sous_titre: "Les clés pour une marque qui marque les esprits",
        courte_description: "Une identité visuelle forte est essentielle...",
        contenu: `
            <p class="lead">Dans un monde saturé d'images et de messages, comment faire en sorte que votre marque soit non seulement remarquée, mais aussi mémorisée ?</p>
            
            <h2>1. Comprendre l'essence de votre marque</h2>
            <p>Avant même de penser au logo ou aux couleurs, il faut définir qui vous êtes, ce que vous défendez et ce qui vous rend unique. Cette étape fondamentale est trop souvent négligée.</p>
            
            <h2>2. Créer une histoire cohérente</h2>
            <p>Une identité de marque forte raconte une histoire cohérente à travers tous les points de contact. Du site web aux réseaux sociaux, en passant par les emballages et les communications internes.</p>
            
            <h2>3. Oser la différence</h2>
            <p>Ne copiez pas ce qui se fait ailleurs. Les marques les plus mémorables sont celles qui assument leur singularité et ne cherchent pas à plaire à tout le monde.</p>
            
            <h2>4. La constance dans le temps</h2>
            <p>Une identité de marque ne se construit pas en un jour. C'est un travail de longue haleine qui demande de la rigueur et de la constance dans l'application des règles graphiques.</p>
        `,
        image: null,
        temps_lecture: 8,
        is_published: true,
        published_at: "2024-01-28",
        category: "Branding",
        tags: ["Branding", "Identité", "Marketing", "Stratégie"],
        author: "Franck Dimitri",
        author_bio: "Designer graphique freelance spécialisé en branding et identité visuelle.",
        author_avatar: "FD",
        views: 2341,
        likes: 156,
        comments: 23
    }
}

export default function BlogShow() {
    const { slug } = usePage().props
    const [article, setArticle] = useState(null)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)

    useEffect(() => {
        // Récupérer l'article depuis les données fictives
        const foundArticle = MOCK_ARTICLES[slug]
        if (foundArticle) {
            setArticle(foundArticle)
            setLikesCount(foundArticle.likes)
        }
    }, [slug])

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    const handleLike = () => {
        if (isLiked) {
            setLikesCount(likesCount - 1)
        } else {
            setLikesCount(likesCount + 1)
        }
        setIsLiked(!isLiked)
    }

    if (!article) {
        return (
            <MainLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Sparkles className="mx-auto text-base-muted mb-4" size={48} />
                        <h2 className="text-2xl font-bold mb-2">Article non trouvé</h2>
                        <p className="text-base-muted mb-6">L'article que vous recherchez n'existe pas.</p>
                        <Link href="/blog" className="btn-primary">
                            Retour au blog
                        </Link>
                    </div>
                </div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <SEOHead 
                title={article.titre}
                description={article.sous_titre}
                url={`/blog/${article.slug}`}
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-16 bg-gradient-to-b from-primary-50/30 to-transparent dark:from-primary-950/20">
                <div className="container-main px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Back button */}
                        <Link 
                            href="/blog"
                            className="inline-flex items-center gap-2 text-base-muted hover:text-primary-500 transition-colors mb-6 group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Retour au blog
                        </Link>

                        {/* Category */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="badge-primary">
                                {article.category}
                            </span>
                            <span className="text-sm text-base-muted flex items-center gap-1">
                                <Clock size={14} />
                                {article.temps_lecture} min de lecture
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            {article.titre}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-xl text-base-secondary mb-6">
                            {article.sous_titre}
                        </p>

                        {/* Meta info */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-base-muted border-b border-base pb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold">
                                    {article.author_avatar}
                                </div>
                                <div>
                                    <p className="font-medium text-base-primary">{article.author}</p>
                                    <p className="text-xs">Designer graphique</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(article.published_at)}
                            </div>
                            <div className="flex items-center gap-1">
                                <Eye size={14} />
                                {article.views} vues
                            </div>
                            <div className="flex items-center gap-1">
                                <MessageCircle size={14} />
                                {article.comments} commentaires
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="section pt-0">
                <div className="container-main px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary-500/20 to-primary-700/20 min-h-[400px] flex items-center justify-center">
                            {article.image ? (
                                <img 
                                    src={`/storage/${article.image}`}
                                    alt={article.titre}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center py-20">
                                    <Sparkles size={64} className="text-primary-500/30 mx-auto mb-4" />
                                    <p className="text-base-muted">Illustration de l'article</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Article Content */}
            <section className="section pt-0">
                <div className="container-main px-4">
                    <div className="grid lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                        {/* Main Content */}
                        <article className="lg:col-span-3 prose prose-lg dark:prose-invert max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: article.contenu }} />
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Actions */}
                                <div className="card p-4">
                                    <h3 className="font-semibold mb-3">Interactions</h3>
                                    <div className="flex justify-around">
                                        <button 
                                            onClick={handleLike}
                                            className="flex flex-col items-center gap-1 group"
                                        >
                                            <div className={`p-2 rounded-full transition-all duration-200 ${isLiked ? 'bg-red-500/10' : 'hover:bg-muted'}`}>
                                                <Heart 
                                                    size={20} 
                                                    className={isLiked ? 'fill-red-500 text-red-500' : 'text-base-muted group-hover:text-red-500'} 
                                                />
                                            </div>
                                            <span className="text-xs text-base-muted">{likesCount}</span>
                                        </button>
                                        
                                        <button className="flex flex-col items-center gap-1 group">
                                            <div className="p-2 rounded-full hover:bg-muted transition-colors">
                                                <Bookmark 
                                                    size={20} 
                                                    className={isBookmarked ? 'fill-primary-500 text-primary-500' : 'text-base-muted group-hover:text-primary-500'} 
                                                />
                                            </div>
                                            <span className="text-xs text-base-muted">Sauvegarder</span>
                                        </button>
                                        
                                        <button className="flex flex-col items-center gap-1 group">
                                            <div className="p-2 rounded-full hover:bg-muted transition-colors">
                                                <Share2 size={20} className="text-base-muted group-hover:text-primary-500" />
                                            </div>
                                            <span className="text-xs text-base-muted">Partager</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="card p-4">
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <Tag size={16} />
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {article.tags.map((tag, idx) => (
                                            <span 
                                                key={idx}
                                                className="text-xs px-2 py-1 rounded-full bg-muted text-base-muted"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Author Card */}
                                <div className="card p-4 text-center">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                                        {article.author_avatar}
                                    </div>
                                    <h3 className="font-semibold">{article.author}</h3>
                                    <p className="text-xs text-base-muted mb-3">Designer graphique</p>
                                    <p className="text-sm text-base-muted mb-4">
                                        {article.author_bio}
                                    </p>
                                    <Link href="/contact" className="text-primary-500 text-sm font-medium hover:underline">
                                        Me contacter →
                                    </Link>
                                </div>

                                {/* Share */}
                                <div className="card p-4">
                                    <h3 className="font-semibold mb-3">Partager cet article</h3>
                                    <div className="flex gap-2 justify-center">
                                        <button className="p-2 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white transition-all">
                                            <Twitter size={18} />
                                        </button>
                                        <button className="p-2 rounded-full bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5] hover:text-white transition-all">
                                            <Linkedin size={18} />
                                        </button>
                                        <button className="p-2 rounded-full bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2] hover:text-white transition-all">
                                            <Facebook size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Comments Section */}
            <section className="section bg-subtle">
                <div className="container-main px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">
                            Commentaires ({article.comments})
                        </h2>
                        
                        {/* Comment Form */}
                        <div className="card p-6 mb-8">
                            <h3 className="font-semibold mb-4">Laisser un commentaire</h3>
                            <form className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" placeholder="Votre nom" className="input" />
                                    <input type="email" placeholder="Votre email" className="input" />
                                </div>
                                <textarea rows="4" placeholder="Votre commentaire..." className="input resize-none" />
                                <button className="btn-primary">
                                    Publier le commentaire
                                </button>
                            </form>
                        </div>

                        {/* Comments List */}
                        <div className="space-y-4">
                            {[1, 2].map((_, i) => (
                                <div key={i} className="card p-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold">
                                            JD
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <p className="font-semibold text-base-primary">Jean Dupont</p>
                                                    <p className="text-xs text-base-muted">Il y a 2 jours</p>
                                                </div>
                                                <button className="text-xs text-primary-500 hover:underline">
                                                    Répondre
                                                </button>
                                            </div>
                                            <p className="text-sm text-base-muted">
                                                Super article ! Très instructif, merci pour ces précieuses informations.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            <section className="section">
                <div className="container-main px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">Articles similaires</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {Object.values(MOCK_ARTICLES)
                                .filter(a => a.id !== article.id)
                                .slice(0, 2)
                                .map(related => (
                                    <Link 
                                        key={related.id}
                                        href={`/blog/${related.slug}`}
                                        className="card p-6 hover:shadow-orange-md transition-all group"
                                    >
                                        <h3 className="font-semibold text-base-primary mb-2 group-hover:text-primary-500 transition-colors">
                                            {related.titre}
                                        </h3>
                                        <p className="text-sm text-base-muted line-clamp-2 mb-3">
                                            {related.courte_description}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs text-base-muted">
                                            <Clock size={12} />
                                            {related.temps_lecture} min de lecture
                                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section bg-subtle">
                <div className="container-main px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-500 p-12 text-center">
                        <div className="relative z-10">
                            <h2 className="text-white mb-4">Vous avez aimé cet article ?</h2>
                            <p className="text-primary-100 max-w-md mx-auto mb-8">
                                Inscrivez-vous à ma newsletter pour ne rien manquer des prochains articles.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <input 
                                    type="email" 
                                    placeholder="Votre email" 
                                    className="input bg-white/10 border-white/20 text-white placeholder:text-white/50"
                                />
                                <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all">
                                    S'abonner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}