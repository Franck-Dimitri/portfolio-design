    import React, { useState, useEffect } from 'react'
import { Link, Head, useForm } from '@inertiajs/react'
import MainLayout from '@/Layouts/MainLayout'
import SEOHead from '@/Components/SEOHead'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
    Calendar, Clock, User, Share2, MessageSquare, 
    Link as LinkIcon, Linkedin, Twitter, ChevronRight, List,
    Heart, Eye
} from 'lucide-react'
import axios from 'axios'

export default function BlogShow({ post, relatedPosts }) {
    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    }

    // Extraction du sommaire (on essaie de capter ## ou ###)
    const [headings, setHeadings] = useState([])
    
    useEffect(() => {
        if (post.contenue) {
            // Supporte \r\n ou \n, prend tout ce qui commence par ## ou ###
            const matches = post.contenue.match(/^###?\s+(.+)$/gm)
            if (matches) {
                const extracted = matches.map((match) => {
                    const title = match.replace(/^###?\s+/, '').trim()
                    // Création d'un ID valide
                    const id = title.toLowerCase().replace(/[\s\W-]+/g, '-')
                    return { id, title }
                })
                setHeadings(extracted)
            }
        }
    }, [post.contenue])
    
    // Fonction utilitaire pour générer l'id des titres
    const generateId = (text) => {
        if (typeof text !== 'string') return Math.random().toString(36).substr(2, 9)
        return text.toLowerCase().replace(/[\s\W-]+/g, '-')
    }

    const [likes, setLikes] = useState(post.likes || 0)
    const [hasLiked, setHasLiked] = useState(false)
    const [isLiking, setIsLiking] = useState(false)

    const handleLike = async () => {
        if (hasLiked || isLiking) return
        setIsLiking(true)
        try {
            const res = await axios.post(`/blog/${post.id}/like`)
            setLikes(res.data.likes)
            setHasLiked(true)
        } catch (e) {
            console.error('Error liking post', e)
        } finally {
            setIsLiking(false)
        }
    }

    const { data, setData, post: postComment, processing, errors, reset } = useForm({
        nom: '',
        email: '',
        commentaire: ''
    })

    const submitComment = (e) => {
        e.preventDefault()
        postComment(`/blog/${post.id}/comment`, {
            preserveScroll: true,
            onSuccess: () => reset()
        })
    }

    return (
        <MainLayout>
            <SEOHead 
                title={`${post.titre} | Blog`}
                description={post.courte_description || `Découvrez l'article ${post.titre}`}
                url={`/blog/${post.slug}`}
                image={post.image ? `/storage/${post.image}` : undefined}
            />

            <article className="pt-24 pb-16 min-h-screen bg-[#0A0A0A] text-gray-300">
                <div className="container-main px-4 max-w-7xl">
                    
                    {/* Header Section */}
                    <header className="mb-8">
                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
                            <Link href="/" className="text-primary-500 hover:text-primary-400">ACCUEIL</Link>
                            <span className="text-gray-600">&gt;</span>
                            <Link href="/blog" className="text-gray-400 hover:text-white">BLOG</Link>
                            <span className="text-gray-600">&gt;</span>
                            <span className="text-gray-500">ARTICLE</span>
                        </div>

                        {/* Title & Subtitle */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display text-white leading-tight mb-4 tracking-tight">
                            {post.titre}
                        </h1>

                        {post.sous_titre && (
                            <p className="text-lg md:text-xl text-gray-400 font-light mb-6">
                                {post.sous_titre}
                            </p>
                        )}

                        {/* Meta Info */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 mb-6">
                            <span className="flex items-center gap-1.5 text-gray-300">
                                <User size={14} />
                                {post.auteur || "Franck Dims"}
                            </span>
                            <span className="text-gray-700">|</span>
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} />
                                {formatDate(post.published_at)}
                            </span>
                            <span className="text-gray-700">|</span>
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} />
                                {post.temps_lecture || 5} min de lecture
                            </span>
                        </div>

                        {/* Tags */}
                        {post.cathegorie && post.cathegorie.length > 0 && (
                            <div className="flex flex-wrap gap-3">
                                {post.cathegorie.map((cat, idx) => (
                                    <span key={idx} className="border border-gray-700 text-gray-400 text-[10px] uppercase font-mono tracking-widest px-3 py-1 rounded hover:border-primary-500 hover:text-primary-500 transition-colors cursor-pointer">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Layout 2 columns */}
                    <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start mt-10">
                        
                        {/* Main Content Column */}
                        <div className="w-full">
                            
                            {/* Cover Image */}
                            {post.image && (
                                <div className="mb-10 rounded border border-gray-800 overflow-hidden bg-gray-900 aspect-video relative group">
                                    <img 
                                        src={`/storage/${post.image}`} 
                                        alt={post.titre}
                                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            )}

                            {/* Markdown Content */}
                            <div className="prose prose-invert max-w-none 
                                            prose-headings:font-display prose-headings:font-bold prose-headings:text-white
                                            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-800
                                            prose-h3:text-2xl prose-h3:mt-8
                                            prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-[15px]
                                            prose-ul:text-gray-400 prose-li:my-2 prose-li:text-[15px]
                                            prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
                                            prose-blockquote:border-l-4 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-900/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:font-normal prose-blockquote:text-gray-300">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h2: ({node, children, ...props}) => {
                                            const text = String(children).replace(/,/g, '')
                                            return <h2 id={generateId(text)} {...props}>{children}</h2>
                                        },
                                        h3: ({node, children, ...props}) => {
                                            const text = String(children).replace(/,/g, '')
                                            return <h3 id={generateId(text)} {...props}>{children}</h3>
                                        }
                                    }}
                                >
                                    {post.contenue}
                                </ReactMarkdown>
                            </div>

                            {/* Stats & Share Section */}
                            <div className="mt-12 pt-8 border-t border-gray-800 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                                        <Eye size={16} /> {post.views || 0} vues
                                    </div>
                                    <button 
                                        onClick={handleLike}
                                        disabled={hasLiked || isLiking}
                                        className={`flex items-center gap-2 font-mono text-sm transition-colors ${hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                    >
                                        <Heart size={16} fill={hasLiked ? 'currentColor' : 'none'} /> 
                                        {likes} likes
                                    </button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-mono text-gray-500 uppercase tracking-widest hidden sm:inline">Partager :</span>
                                    <button className="flex items-center gap-2 border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 px-3 py-1.5 rounded text-xs font-mono transition-colors">
                                        <LinkIcon size={14} /> <span className="hidden sm:inline">Lien</span>
                                    </button>
                                    <button className="flex items-center gap-2 border border-gray-800 text-gray-400 hover:text-[#0A66C2] hover:border-[#0A66C2] px-3 py-1.5 rounded text-xs font-mono transition-colors">
                                        <Linkedin size={14} /> <span className="hidden sm:inline">LinkedIn</span>
                                    </button>
                                </div>
                            </div>

                            {/* Related Posts */}
                            {relatedPosts && relatedPosts.length > 0 && (
                                <div className="mt-16">
                                    <h3 className="font-display font-bold text-xl text-white uppercase tracking-wider mb-6 pb-2 border-b border-gray-800">
                                        Articles Similaires
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {relatedPosts.map((rp) => (
                                            <Link key={rp.id} href={route('blog.show', rp.slug)} className="group border border-gray-800 bg-[#111] p-4 rounded hover:border-primary-500 transition-colors">
                                                <div className="aspect-video bg-gray-900 mb-4 overflow-hidden rounded-sm">
                                                    {rp.image ? (
                                                        <img src={`/storage/${rp.image}`} alt={rp.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-700">NO_IMG</div>
                                                    )}
                                                </div>
                                                <h4 className="font-semibold text-gray-200 group-hover:text-primary-500 transition-colors text-sm line-clamp-2 mb-2">
                                                    {rp.titre}
                                                </h4>
                                                <p className="text-[10px] font-mono text-gray-500 uppercase">
                                                    {formatDate(rp.published_at)}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="mt-8 flex justify-end">
                                        <Link href="/blog" className="bg-primary-500 text-[#0A0A0A] px-6 py-2 rounded font-mono text-xs font-bold uppercase tracking-widest hover:bg-primary-400 transition-colors">
                                            Tous les articles &gt;
                                        </Link>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Sidebar Column */}
                        <aside className="space-y-8 sticky top-24">
                            
                            {/* Sommaire */}
                            <div className="border border-gray-800 bg-[#111] p-6 rounded relative overflow-hidden">
                                {/* Blueprint corner */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gray-700"></div>
                                
                                <h3 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary-500 mb-6">
                                    <List size={14} /> Sommaire
                                </h3>
                                
                                <nav className="space-y-3">
                                    {headings.length > 0 ? headings.map((h, i) => (
                                        <a 
                                            key={i} 
                                            href={`#${h.id}`} 
                                            className="block text-sm text-gray-400 hover:text-primary-500 transition-colors leading-tight"
                                        >
                                            {i + 1}. {h.title}
                                        </a>
                                    )) : (
                                        <p className="text-xs text-gray-600 font-mono">Aucun sommaire disponible.</p>
                                    )}
                                </nav>
                            </div>

                            {/* Commentaires */}
                            <div className="border border-gray-800 bg-[#111] p-6 rounded">
                                <h3 className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-widest text-primary-500 mb-6 pb-4 border-b border-gray-800">
                                    <MessageSquare size={14} /> Commentaires
                                    <span className="text-gray-500 font-normal ml-auto">{post.comments?.length || 0} discussion(s)</span>
                                </h3>
                                
                                <form onSubmit={submitComment} className="mb-8 space-y-4">
                                    <div>
                                        <input 
                                            type="text" 
                                            placeholder="Votre nom" 
                                            className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary-500 transition-colors"
                                            value={data.nom}
                                            onChange={e => setData('nom', e.target.value)}
                                            required
                                        />
                                        {errors.nom && <span className="text-red-500 text-xs">{errors.nom}</span>}
                                    </div>
                                    <div>
                                        <input 
                                            type="email" 
                                            placeholder="Votre email" 
                                            className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary-500 transition-colors"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                        />
                                        {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                                    </div>
                                    <div>
                                        <textarea 
                                            placeholder="Votre commentaire..." 
                                            className="w-full bg-gray-900 border border-gray-800 rounded px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-primary-500 transition-colors h-24 resize-none"
                                            value={data.commentaire}
                                            onChange={e => setData('commentaire', e.target.value)}
                                            required
                                        ></textarea>
                                        {errors.commentaire && <span className="text-red-500 text-xs">{errors.commentaire}</span>}
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="w-full bg-primary-500 text-[#0A0A0A] font-bold font-mono text-xs uppercase tracking-widest py-3 rounded flex items-center justify-center gap-2 hover:bg-primary-400 transition-colors disabled:opacity-50"
                                    >
                                        <MessageSquare size={14} />
                                        {processing ? 'Envoi...' : 'Envoyer'}
                                    </button>
                                </form>

                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                    {post.comments && post.comments.length > 0 ? (
                                        post.comments.map(comment => (
                                            <div key={comment.id} className="border border-gray-800 p-4 rounded bg-[#161616]">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-[10px] text-white font-bold">
                                                            {comment.nom.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-300">{comment.nom}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-600 font-mono">
                                                        {new Date(comment.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 whitespace-pre-wrap">{comment.commentaire}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-gray-500 italic text-center py-4">Soyez le premier à commenter !</p>
                                    )}
                                </div>
                            </div>

                        </aside>

                    </div>
                </div>
            </article>
        </MainLayout>
    )
}
