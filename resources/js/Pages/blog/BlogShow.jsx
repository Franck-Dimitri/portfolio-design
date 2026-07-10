import React, { useState, useEffect } from 'react';
import { Link, Head, useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import SEOHead from '@/Components/SEOHead';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
    Calendar, Clock, User, Share2, MessageSquare, 
    Link as LinkIcon, Linkedin, Twitter, ChevronRight, List,
    Heart, Eye, ArrowLeft, Focus, Box
} from 'lucide-react';
import axios from 'axios';

/* ══════════════════════════════════════════════════════════════
   COMPOSANT – Lignes structurelles (Design Canvas)
══════════════════════════════════════════════════════════════ */
function CanvasLines() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 flex justify-center overflow-hidden">
            <div 
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] text-black dark:text-white"
                style={{
                    backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            ></div>

            <div className="w-full max-w-7xl h-full relative border-x border-gray-200/50 dark:border-gray-800/50 flex">
                <div className="flex-1 border-r border-gray-200/30 dark:border-gray-800/30 hidden md:block"></div>
                <div className="flex-1 border-r border-gray-200/30 dark:border-gray-800/30 hidden lg:block"></div>
                <div className="flex-1 border-r border-gray-200/30 dark:border-gray-800/30 hidden lg:block"></div>
                <div className="flex-1 hidden md:block"></div>
            </div>
            
            <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-gray-400 dark:border-gray-600"></div>
            <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-gray-400 dark:border-gray-600"></div>
            <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-gray-400 dark:border-gray-600"></div>
            <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-gray-400 dark:border-gray-600"></div>
        </div>
    );
}

export default function BlogShow({ post, relatedPosts }) {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const [headings, setHeadings] = useState([]);
    
    useEffect(() => {
        if (post.contenue) {
            const matches = post.contenue.match(/^###?\s+(.+)$/gm);
            if (matches) {
                const extracted = matches.map((match) => {
                    const title = match.replace(/^###?\s+/, '').trim();
                    const id = title.toLowerCase().replace(/[\s\W-]+/g, '-');
                    return { id, title };
                });
                setHeadings(extracted);
            }
        }
    }, [post.contenue]);
    
    const generateId = (text) => {
        if (typeof text !== 'string') return Math.random().toString(36).substr(2, 9);
        return text.toLowerCase().replace(/[\s\W-]+/g, '-');
    };

    const [likes, setLikes] = useState(post.likes || 0);
    const [hasLiked, setHasLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);

    const handleLike = async () => {
        if (hasLiked || isLiking) return;
        setIsLiking(true);
        try {
            const res = await axios.post(`/blog/${post.id}/like`);
            setLikes(res.data.likes);
            setHasLiked(true);
        } catch (e) {
            console.error('Error liking post', e);
        } finally {
            setIsLiking(false);
        }
    };

    const { data, setData, post: postComment, processing, errors, reset } = useForm({
        nom: '',
        email: '',
        commentaire: ''
    });

    const submitComment = (e) => {
        e.preventDefault();
        postComment(`/blog/${post.id}/comment`, {
            preserveScroll: true,
            onSuccess: () => reset()
        });
    };

    if (!post) return null;

    return (
        <MainLayout>
            <SEOHead 
                title={`${post.titre} | Blog | Dims Creative Academy`}
                description={post.courte_description || `Découvrez l'article ${post.titre}`}
                url={`/blog/${post.slug}`}
                image={post.image ? `/storage/${post.image}` : undefined}
            />

            <CanvasLines />

            <div className="relative z-10 pt-24 pb-8 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A]">
                <div className="container-main px-4">
                    <Link 
                        href="/blog"
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 font-mono text-[10px] uppercase tracking-widest transition-colors group mb-8"
                    >
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        RETOUR AUX ARCHIVES
                    </Link>

                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-6">
                            <Box size={12} />
                            <span>DOCUMENT TECHNIQUE : #{post.id.toString().padStart(3, '0')}</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                            {post.titre}
                        </h1>

                        {post.sous_titre && (
                            <p className="text-lg font-mono text-gray-500 uppercase tracking-widest mb-6">
                                {post.sous_titre}
                            </p>
                        )}

                        <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                            <span className="flex items-center gap-2 text-gray-900 dark:text-white">
                                <User size={12} className="text-primary-500" />
                                {post.auteur || "FRANCK DIMS"}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar size={12} className="text-primary-500" />
                                {formatDate(post.published_at)}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock size={12} className="text-primary-500" />
                                {post.temps_lecture || 5} MIN
                            </span>
                            <span className="flex items-center gap-2 text-primary-500">
                                <Eye size={12} />
                                {post.views || 0} VUES
                            </span>
                        </div>

                        {post.cathegorie && post.cathegorie.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-6">
                                {post.cathegorie.map((cat, idx) => (
                                    <span key={idx} className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] text-gray-500 text-[10px] uppercase font-mono tracking-widest px-3 py-1">
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <article className="py-16 relative z-10 bg-white dark:bg-transparent">
                <div className="container-main px-4">
                    <div className="grid lg:grid-cols-[1fr_320px] gap-12 items-start">
                        
                        {/* ══════════════════════════════════════════════════
                            § 1 – MAIN CONTENT
                        ══════════════════════════════════════════════════ */}
                        <div className="w-full">
                            
                            {post.image && (
                                <div className="mb-12 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] p-2 relative group">
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary-500 z-10 pointer-events-none"></div>
                                    <img 
                                        src={`/storage/${post.image}`} 
                                        alt={post.titre}
                                        className="w-full aspect-video object-cover filter grayscale-[10%] group-hover:grayscale-0 transition-all duration-700"
                                    />
                                    <div className="absolute bottom-4 left-4 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white font-mono text-[10px] font-bold px-3 py-1 uppercase tracking-widest">
                                        FIG.01
                                    </div>
                                </div>
                            )}

                            <div className="prose prose-lg dark:prose-invert max-w-none 
                                            prose-headings:font-display prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:uppercase prose-headings:tracking-wider
                                            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-800
                                            prose-h3:text-2xl prose-h3:mt-8
                                            prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-6 prose-p:font-sans
                                            prose-ul:text-gray-600 dark:prose-ul:text-gray-400 prose-li:my-2
                                            prose-a:text-primary-500 prose-a:no-underline hover:prose-a:underline
                                            prose-blockquote:border-l-2 prose-blockquote:border-primary-500 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-[#161616] prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:my-8 prose-blockquote:font-mono prose-blockquote:text-sm prose-blockquote:text-gray-500">
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h2: ({node, children, ...props}) => {
                                            const text = String(children).replace(/,/g, '');
                                            return <h2 id={generateId(text)} {...props}>{children}</h2>;
                                        },
                                        h3: ({node, children, ...props}) => {
                                            const text = String(children).replace(/,/g, '');
                                            return <h3 id={generateId(text)} {...props}>{children}</h3>;
                                        }
                                    }}
                                >
                                    {post.contenue}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 flex flex-wrap items-center justify-between gap-4">
                                <button 
                                    onClick={handleLike}
                                    disabled={hasLiked || isLiking}
                                    className={`flex items-center gap-2 font-mono font-bold text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
                                        hasLiked 
                                            ? 'border-red-500 bg-red-50 text-red-500 dark:bg-red-900/10' 
                                            : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] text-gray-500 hover:border-red-500 hover:text-red-500'
                                    }`}
                                >
                                    <Heart size={14} fill={hasLiked ? 'currentColor' : 'none'} /> 
                                    {likes} APPROBATIONS
                                </button>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest hidden sm:inline mr-2">DISTRIBUER :</span>
                                    <button className="flex items-center justify-center w-8 h-8 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] text-gray-500 hover:text-primary-500 hover:border-primary-500 transition-colors">
                                        <LinkIcon size={12} />
                                    </button>
                                    <button className="flex items-center justify-center w-8 h-8 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] text-gray-500 hover:text-primary-500 hover:border-primary-500 transition-colors">
                                        <Linkedin size={12} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* ══════════════════════════════════════════════════
                            § 2 – SIDEBAR (SOMMAIRE & COMM)
                        ══════════════════════════════════════════════════ */}
                        <aside className="space-y-6 sticky top-24">
                            
                            <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                                <div className="border-b border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-[#161616] flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400">
                                    <List size={12} /> INDEX_DOCUMENT
                                </div>
                                <div className="p-6">
                                    <nav className="space-y-3">
                                        {headings.length > 0 ? headings.map((h, i) => (
                                            <a 
                                                key={i} 
                                                href={`#${h.id}`} 
                                                className="block text-xs font-mono text-gray-500 hover:text-primary-500 transition-colors uppercase tracking-wide"
                                            >
                                                {String(i + 1).padStart(2, '0')} — {h.title}
                                            </a>
                                        )) : (
                                            <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">Aucune indexation.</p>
                                        )}
                                    </nav>
                                </div>
                            </div>

                            <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111]">
                                <div className="border-b border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-[#161616] flex items-center justify-between font-mono text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400">
                                    <span className="flex items-center gap-2"><MessageSquare size={12} /> TERMINAL COMMS</span>
                                    <span className="text-primary-500">{post.comments?.length || 0} MSG</span>
                                </div>
                                
                                <div className="p-6">
                                    <form onSubmit={submitComment} className="space-y-4 mb-8">
                                        <input 
                                            type="text" 
                                            placeholder="IDENTIFIANT (NOM)" 
                                            className="w-full bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 px-3 py-2 text-xs font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors"
                                            value={data.nom}
                                            onChange={e => setData('nom', e.target.value)}
                                            required
                                        />
                                        {errors.nom && <span className="text-red-500 text-[10px] font-mono">{errors.nom}</span>}
                                        
                                        <input 
                                            type="email" 
                                            placeholder="ADRESSE EMAIL" 
                                            className="w-full bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 px-3 py-2 text-xs font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            required
                                        />
                                        {errors.email && <span className="text-red-500 text-[10px] font-mono">{errors.email}</span>}
                                        
                                        <textarea 
                                            placeholder="SAISIR MESSAGE..." 
                                            className="w-full bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 px-3 py-2 text-xs font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors h-24 resize-none"
                                            value={data.commentaire}
                                            onChange={e => setData('commentaire', e.target.value)}
                                            required
                                        ></textarea>
                                        {errors.commentaire && <span className="text-red-500 text-[10px] font-mono">{errors.commentaire}</span>}
                                        
                                        <button 
                                            type="submit" 
                                            disabled={processing}
                                            className="w-full bg-primary-500 text-black font-bold font-mono text-[10px] uppercase tracking-widest py-3 flex items-center justify-center gap-2 hover:bg-primary-400 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? 'TRANSMISSION...' : 'TRANSMETTRE'}
                                        </button>
                                    </form>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {post.comments && post.comments.length > 0 ? (
                                            post.comments.map(comment => (
                                                <div key={comment.id} className="border border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-[#161616]">
                                                    <div className="flex items-center justify-between mb-3 border-b border-gray-200 dark:border-gray-800 pb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-[8px] text-gray-900 dark:text-white font-bold font-mono">
                                                                {comment.nom.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-[10px] font-bold text-gray-900 dark:text-white font-mono uppercase tracking-widest">{comment.nom}</span>
                                                        </div>
                                                        <span className="text-[8px] text-gray-400 font-mono">
                                                            {new Date(comment.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 font-sans whitespace-pre-wrap leading-relaxed">{comment.commentaire}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[10px] text-gray-400 text-center font-mono uppercase tracking-widest py-4">AUCUNE TRANSMISSION REÇUE.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </aside>

                    </div>
                </div>
            </article>

            {/* ══════════════════════════════════════════════════
                § 3 – DOCUMENTS CONNEXES
            ══════════════════════════════════════════════════ */}
            {relatedPosts && relatedPosts.length > 0 && (
                <section className="py-20 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A] relative z-10">
                    <div className="container-main px-4">
                        <div className="flex items-center justify-between mb-10 border-b border-gray-200 dark:border-gray-800 pb-4">
                            <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                DOCUMENTS <span className="text-primary-500">CONNEXES</span>
                            </h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {relatedPosts.map((rp) => (
                                <Link key={rp.id} href={route('blog.show', rp.slug)} className="group border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] p-4 hover:border-primary-500 transition-colors block">
                                    <div className="aspect-video bg-gray-50 dark:bg-[#161616] mb-4 overflow-hidden">
                                        {rp.image ? (
                                            <img src={`/storage/${rp.image}`} alt={rp.titre} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-gray-400">NO_IMG</div>
                                        )}
                                    </div>
                                    <h4 className="font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider group-hover:text-primary-500 transition-colors text-sm line-clamp-2 mb-3">
                                        {rp.titre}
                                    </h4>
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest border-t border-gray-200 dark:border-gray-800 pt-3">
                                        {formatDate(rp.published_at)}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </MainLayout>
    );
}
