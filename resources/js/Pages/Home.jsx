// resources/js/Pages/Home.jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from '@inertiajs/react'
import {
    ArrowRight, ExternalLink, Sparkles, Eye,
    Layers, Palette, Zap, Award, ChevronDown,
    Star, ArrowUpRight, Mail, MessageSquare
} from 'lucide-react'
import MainLayout from '@/Layouts/MainLayout'
import SEOHead from '@/Components/SEOHead'

/* ══════════════════════════════════════════════════════════════
   HOOK – Intersection Observer pour animations au scroll
══════════════════════════════════════════════════════════════ */
function useInView(options = {}) {
    const ref = useRef(null)
    const [inView, setInView] = useState(false)
    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
            { threshold: 0.12, ...options }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])
    return [ref, inView]
}

/* ══════════════════════════════════════════════════════════════
   COMPOSANT – Compteur animé
══════════════════════════════════════════════════════════════ */
function AnimatedCounter({ value, suffix = '', duration = 1800 }) {
    const [count, setCount] = useState(0)
    const [ref, inView] = useInView()
    useEffect(() => {
        if (!inView) return
        let start = 0
        const end = parseInt(value)
        const step = end / (duration / 16)
        const timer = setInterval(() => {
            start += step
            if (start >= end) { setCount(end); clearInterval(timer) }
            else setCount(Math.floor(start))
        }, 16)
        return () => clearInterval(timer)
    }, [inView, value, duration])
    return <span ref={ref}>{count}{suffix}</span>
}

/* ══════════════════════════════════════════════════════════════
   COMPOSANT – Carte projet
══════════════════════════════════════════════════════════════ */
function ProjectCard({ project, index }) {
    const [ref, inView] = useInView()
    return (
        <article
            ref={ref}
            className={`group relative overflow-hidden rounded-2xl bg-elevated border border-base
                        transition-all duration-500 hover:shadow-orange-md hover:-translate-y-1
                        ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${index * 120}ms` }}
        >
            {/* Thumbnail */}
            <div className="relative h-56 bg-muted overflow-hidden">
                {/* Placeholder visuel gradient */}
                <div
                    className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-500"
                    style={{
                        background: project.gradient,
                    }}
                />
                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-neutral-950/0 group-hover:bg-neutral-950/30 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex gap-3">
                        <Link
                            href={`/projets/${project.slug}`}
                            className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-neutral-900 hover:bg-primary-500 hover:text-white transition-all duration-200"
                            aria-label="Voir le projet"
                        >
                            <Eye size={16} />
                        </Link>
                        {project.url && (
                            <a
                                href={project.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-neutral-900 hover:bg-primary-500 hover:text-white transition-all duration-200"
                                aria-label="Lien externe"
                            >
                                <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </div>
                {/* Badge catégorie */}
                <span className="absolute top-3 left-3 badge-primary text-xs z-10">
                    {project.category}
                </span>
                {/* Numéro */}
                <span className="absolute top-3 right-3 text-white/40 font-black text-4xl leading-none select-none">
                    {String(index + 1).padStart(2, '0')}
                </span>
            </div>

            {/* Contenu */}
            <div className="p-5">
                <h3 className="font-display font-semibold text-base-primary text-lg leading-snug mb-1 group-hover:text-primary-500 transition-colors duration-200">
                    {project.title}
                </h3>
                <p className="text-sm text-base-muted leading-relaxed mb-4">{project.description}</p>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded-md bg-muted text-base-muted font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Flèche CTA */}
            <Link
                href={`/projets/${project.slug}`}
                className="absolute bottom-5 right-5 w-8 h-8 rounded-full border border-base flex items-center justify-center text-base-muted
                           group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white transition-all duration-300"
                aria-label={`Voir ${project.title}`}
            >
                <ArrowUpRight size={14} />
            </Link>
        </article>
    )
}

/* ══════════════════════════════════════════════════════════════
   COMPOSANT – Carte service
══════════════════════════════════════════════════════════════ */
function ServiceCard({ service, index }) {
    const [ref, inView] = useInView()
    return (
        <div
            ref={ref}
            className={`group card-hover p-6 flex flex-col gap-4
                        ${inView ? 'animate-fade-in-up' : 'opacity-0'}`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center
                            bg-[var(--color-accent-subtle)] text-primary-500
                            group-hover:bg-primary-500 group-hover:text-white
                            transition-all duration-300`}>
                {service.icon}
            </div>
            <div>
                <h3 className="font-display font-semibold text-base-primary mb-2">{service.title}</h3>
                <p className="text-sm text-base-muted leading-relaxed">{service.description}</p>
            </div>
            <div className="mt-auto pt-2 flex items-center gap-1.5 text-xs font-medium text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                En savoir plus <ArrowRight size={12} />
            </div>
        </div>
    )
}

/* ══════════════════════════════════════════════════════════════
   DONNÉES
══════════════════════════════════════════════════════════════ */
const FEATURED_PROJECTS = [
    {
        slug: 'identite-maison-eleve',
        title: 'Identité Maison Élevée',
        description: "Refonte complète d'une marque de cosmétiques naturels — du logo au packaging.",
        category: 'Branding',
        tags: ['Logo', 'Packaging', 'Typography'],
        gradient: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #9a3412 100%)',
        url: null,
    },
    {
        slug: 'campagne-eclatante',
        title: 'Campagne Éclatante',
        description: 'Direction artistique d\'une campagne panafricaine pour une startup fintech.',
        category: 'Direction artistique',
        tags: ['Affiche', 'Digital', 'Motion'],
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
        url: 'https://example.com',
    },
    {
        slug: 'manifeste-editorial',
        title: 'Manifeste Éditorial',
        description: 'Conception d\'un magazine culturel indépendant, de la grille au dernier folio.',
        category: 'Éditorial',
        tags: ['Mise en page', 'Typographie', 'Print'],
        gradient: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #059669 100%)',
        url: null,
    }
]

const SERVICES = [
    {
        icon: <Palette size={20} />,
        title: 'Identité visuelle',
        description: 'Logo, charte graphique, système de marque cohérent du digital au print.',
    },
    {
        icon: <Layers size={20} />,
        title: 'Direction artistique',
        description: 'Concept créatif, casting visuel, supervision de production pour vos campagnes.',
    },
    {
        icon: <Zap size={20} />,
        title: 'Motion & Digital',
        description: 'Animations de marque, contenu social media, interfaces illustrées.',
    },
    {
        icon: <Award size={20} />,
        title: 'Conseil en image',
        description: 'Audit de marque, repositionnement stratégique, guide de communication.',
    },
]

const STATS = [
    { value: '47',  suffix: '+', label: 'Projets livrés' },
    { value: '28',  suffix: '',  label: 'Clients satisfaits' },
    { value: '3',   suffix: '+', label: 'Années d\'expérience' },
    { value: '12',  suffix: '',  label: 'Awards & mentions' },
]

const TESTIMONIALS = [
    {
        quote: "Un sens de l'esthétique rare. Notre identité de marque a été transformée, et nos clients le sentent immédiatement.",
        author: 'Kalebia Franck',
        role: 'Entrepreneur',
        avatar: 'JO',
    },
    {
        quote: "Livré en avance, au-delà des attentes. La direction artistique de notre campagne a dépassé nos KPIs de 40%.",
        author: 'Lucien Mensah',
        role: 'Marketing Director, PayCam',
        avatar: 'LM',
    },
    {
        quote: "Pas juste un designer — un vrai partenaire créatif. Il comprend les enjeux business autant que l'esthétique.",
        author: 'Mouaffo Ange',
        role: 'Founder, Heritage Stays',
        avatar: 'MA',
    },
]

/* ══════════════════════════════════════════════════════════════
   PAGE HOME
══════════════════════════════════════════════════════════════ */
export default function Home() {
    const [typedText, setTypedText] = useState('')
    const [heroVisible, setHeroVisible] = useState(false)
    const words = ['Designer Graphique', 'Directeur Artistique', 'Visual Storyteller']
    const wordIndex  = useRef(0)
    const charIndex  = useRef(0)
    const deleting   = useRef(false)
    const [statsRef, statsInView] = useInView()
    const [testimRef, testimInView] = useInView()

    /* ── Typer effect ──────────────────────────────────────────── */
    useEffect(() => {
        const tick = () => {
            const current = words[wordIndex.current]
            if (!deleting.current) {
                setTypedText(current.substring(0, charIndex.current + 1))
                charIndex.current++
                if (charIndex.current === current.length) {
                    deleting.current = true
                    setTimeout(tick, 1800)
                    return
                }
            } else {
                setTypedText(current.substring(0, charIndex.current - 1))
                charIndex.current--
                if (charIndex.current === 0) {
                    deleting.current = false
                    wordIndex.current = (wordIndex.current + 1) % words.length
                }
            }
            setTimeout(tick, deleting.current ? 60 : 85)
        }
        const t = setTimeout(tick, 600)
        return () => clearTimeout(t)
    }, [])

    /* ── Hero appear ───────────────────────────────────────────── */
    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 50)
        return () => clearTimeout(t)
    }, [])

    return (
        <MainLayout currentRoute="/">
            <SEOHead
                title={null}
                description="Designer graphique freelance spécialisé en identité visuelle, branding et direction artistique. Basé à Yaoundé, disponible partout dans le monde."
                url="/"
            />

            {/* ══════════════════════════════════════════════════
                § 1 – HERO
            ══════════════════════════════════════════════════ */}
            <section className="relative min-h-[calc(100svh-64px)] flex flex-col items-center justify-center overflow-hidden section">

                {/* ── Fond décoratif ─────────────────────────────── */}
                <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" aria-hidden="true" />

                {/* Orbe orange haut-droite */}
                <div
                    className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 pointer-events-none animate-blob"
                    style={{ background: 'radial-gradient(circle, #f97316 0%, #ea580c 60%, transparent 100%)' }}
                    aria-hidden="true"
                />
                {/* Orbe orange bas-gauche */}
                <div
                    className="absolute -bottom-48 -left-24 w-80 h-80 rounded-full opacity-8 pointer-events-none animate-blob"
                    style={{ animationDelay: '3s', background: 'radial-gradient(circle, #fb923c 0%, transparent 70%)' }}
                    aria-hidden="true"
                />

                <div className="container-main relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

                    {/* ── Colonne texte ─────────────────────────────── */}
                    <div className="flex-1 text-center lg:text-left">

                        {/* Badge disponibilité */}
                        <div className={`inline-flex items-center gap-2 mb-6 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            <span className="badge-primary">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Disponible pour projets
                            </span>
                        </div>

                        {/* Titre principal */}
                        <h1 className={`mb-4 transition-all duration-700 delay-100 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            Nous créeons des{' '}
                            <span className="text-gradient">identités</span>
                            <br />
                            qui marquent.
                        </h1>

                        {/* Sous-titre typer */}
                        <div className={`h-8 mb-6 transition-all duration-70000 delay-70000 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <p className="text-xl font-medium text-base-secondary">
                                {typedText}
                                <span className="animate-blink text-primary-500 ml-0.5">|</span>
                            </p>
                        </div>

                        {/* Description */}
                        <p className={`text-base text-base-muted leading-relaxed max-w-lg mx-auto lg:mx-0 mb-10 transition-all duration-700 delay-300 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            Nous transforme des idées en systèmes visuels percutants —
                            du logo au motion, du print au digital.
                            Chaque projet est une histoire à raconter visuellement.
                        </p>

                        {/* CTA */}
                        <div className={`flex flex-col sm:flex-row gap-3 justify-center lg:justify-start transition-all duration-700 delay-[400ms] ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <Link href="/projets" className="btn-primary btn-lg group">
                                Voir mes projets
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                            </Link>
                            <Link href="/contact" className="btn-secondary btn-lg">
                                Parlons de votre projet
                            </Link>
                        </div>

                        {/* Social proof rapide */}
                        <div className={`flex items-center gap-3 mt-8 justify-center lg:justify-start transition-all duration-700 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            {/* Avatars clients */}
                            <div className="flex -space-x-2">
                                {['MD','KM','SL','OT'].map((initials, i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full border-2 border-[var(--bg-base)] flex items-center justify-center text-xs font-bold text-white"
                                        style={{ backgroundColor: ['#f97316','#ea580c','#c2410c','#9a3412'][i] }}
                                    >
                                        {initials}
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={12} className="text-primary-500 fill-primary-500" />
                                    ))}
                                </div>
                                <span className="text-base-muted text-xs">28+ clients satisfaits</span>
                            </div>
                        </div>
                        <div className={`flex items-center gap-3 mt-8 justify-center lg:justify-start transition-all duration-700 delay-500 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            
                            <a href="mailto:dims.creative.academy@gmail.com" className="group hover:text-primary-500 transition-colors flex justify-center items-center gap-3">
                                <div className='border border-primary-400 p-2 rounded-md text-primary-400'>
                                    <Mail size={17}/>
                                </div>
                                dims.creative.academy@gmail.com
                            </a>


                            <a href="https://wa.me/676383986" className="group hover:text-primary-500 transition-colors flex justify-center items-center gap-3">
                                 <div className='border border-primary-400 p-2 rounded-md text-primary-400'>
                                    <MessageSquare size={17}/>
                                </div>
                                whatsApp
                            </a>
                           
                        </div>
                    </div>

                 {/* ── Colonne visuelle ──────────────────────────── */}
                    <div className={`relative shrink-0 transition-all duration-1000 delay-200 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                        {/* Cadre principal */}
                        <div className="relative w-72 h-72 sm:w-80 sm:h-80">

                            {/* Blob décoratif derrière */}
                            <div
                                className="absolute inset-0 opacity-20 animate-blob rounded-full"
                                style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
                                aria-hidden="true"
                            />

                            {/* Cadre photo corrigé */}
                            <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-2 border-[var(--border-base)] shadow-orange-lg bg-gradient-to-br from-primary-100 to-primary-50">
                                
                                {/* Si MonImage existe, on l'affiche en plein écran dans le cadre */}
                                
                                    <img 
                                        src="/image/brand-logo.jpg" 
                                        alt="Franck Dimitri" 
                                        className="w-full h-full object-cover object-center" 
                                    />
    
                            </div>

                            {/* Badge flottant – expérience */}
                            <div className="absolute -left-6 top-1/4 glass rounded-2xl px-3 py-2 shadow-dark-sm animate-float z-20">
                                <div className="flex items-center gap-2">
                                    <span className="text-primary-500"><Award size={14} /></span>
                                    <div>
                                        <p className="text-xs font-bold text-base-primary leading-none">Brand</p>
                                        <p className="text-[10px] text-base-muted whitespace-nowrap">d'expérience</p>
                                    </div>
                                </div>
                            </div>

                            {/* Badge flottant – projets */}
                            <div className="absolute -right-6 bottom-1/4 glass rounded-2xl px-3 py-2 shadow-dark-sm animate-float z-20" style={{ animationDelay: '1.5s' }}>
                                <div className="flex items-center gap-2">
                                    <span className="text-primary-500"><Sparkles size={14} /></span>
                                    <div>
                                        <p className="text-xs font-bold text-base-primary leading-none">47+</p>
                                        <p className="text-[10px] text-base-muted whitespace-nowrap">projets finis</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-base-subtle animate-bounce">
                    <span className="text-xs uppercase tracking-widest">Scroll</span>
                    <ChevronDown size={16} />
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                § 2 – STATS
            ══════════════════════════════════════════════════ */}
            <section className="section py-16" aria-label="Chiffres clés">
                <div className="container-main">
                    <div
                        ref={statsRef}
                        className={`grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--border-base)] rounded-2xl overflow-hidden border border-base
                                    ${statsInView ? 'animate-scale-in' : 'opacity-0'}`}
                    >
                        {STATS.map((stat, i) => (
                            <div key={i} className="bg-base flex flex-col items-center justify-center py-8 px-4 text-center">
                                <p className="text-4xl font-black text-gradient leading-none mb-2">
                                    {statsInView ? (
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    ) : '0'}
                                </p>
                                <p className="text-sm text-base-muted">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                § 3 – PROJETS SÉLECTIONNÉS
            ══════════════════════════════════════════════════ */}
            <section className="section" id="projets" aria-labelledby="projects-title">
                <div className="container-main">

                    {/* Header section */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="divider" />
                                <span className="text-sm font-medium text-primary-500 uppercase tracking-wider">Portfolio</span>
                            </div>
                            <h2 id="projects-title" className="mb-3">
                                Projets <span className="text-gradient">sélectionnés</span>
                            </h2>
                            <p className="text-base-muted max-w-md">
                                Une sélection de travaux représentatifs, du branding à la direction artistique.
                            </p>
                        </div>
                        <Link href="/projets" className="btn-secondary group shrink-0">
                            Tous les projets
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                        </Link>
                    </div>

                    {/* Grille projets */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURED_PROJECTS.map((project, i) => (
                            <ProjectCard key={project.slug} project={project} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                § 4 – SERVICES
            ══════════════════════════════════════════════════ */}
            <section className="section bg-subtle" id="services" aria-labelledby="services-title">
                <div className="container-main">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="divider" />
                            <span className="text-sm font-medium text-primary-500 uppercase tracking-wider">Expertise</span>
                            <span className="divider" />
                        </div>
                        <h2 id="services-title" className="mb-3">
                            Ce que je <span className="text-gradient">crée</span>
                        </h2>
                        <p className="text-base-muted max-w-lg mx-auto">
                            Des solutions créatives complètes, pensées pour votre image de marque
                            et l'impact que vous voulez avoir.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {SERVICES.map((service, i) => (
                            <ServiceCard key={i} service={service} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                § 5 – TÉMOIGNAGES
            ══════════════════════════════════════════════════ */}
            <section className="section" aria-labelledby="testimonials-title">
                <div className="container-main">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <span className="divider" />
                            <span className="text-sm font-medium text-primary-500 uppercase tracking-wider">Clients</span>
                            <span className="divider" />
                        </div>
                        <h2 id="testimonials-title">
                            Ils nous font <span className="text-gradient">confiance</span>
                        </h2>
                    </div>
                    <div
                        ref={testimRef}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {TESTIMONIALS.map((t, i) => (
                            <blockquote
                                key={i}
                                className={`card p-6 flex flex-col gap-4 transition-all duration-500
                                            ${testimInView ? 'animate-fade-in-up' : 'opacity-0'}`}
                                style={{ animationDelay: `${i * 150}ms` }}
                            >
                                {/* Étoiles */}
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, s) => (
                                        <Star key={s} size={14} className="text-primary-500 fill-primary-500" />
                                    ))}
                                </div>
                                <p className="text-sm text-base-secondary leading-relaxed italic flex-1">
                                    "{t.quote}"
                                </p>
                                <footer className="flex items-center gap-3 pt-2 border-t border-base">
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                                        style={{ backgroundColor: ['#f97316','#ea580c','#c2410c'][i] }}
                                    >
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <cite className="not-italic text-sm font-semibold text-base-primary">{t.author}</cite>
                                        <p className="text-xs text-base-muted">{t.role}</p>
                                    </div>
                                </footer>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════
                § 6 – CTA FINAL
            ══════════════════════════════════════════════════ */}
            <section className="section" aria-labelledby="cta-title">
                <div className="container-main">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 p-12 text-center">
                        {/* Déco */}
                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-20 -translate-y-1/2 translate-x-1/4 bg-white" aria-hidden="true" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 translate-y-1/2 -translate-x-1/4 bg-white" aria-hidden="true" />
                        <div className="absolute inset-0 bg-dots opacity-10" aria-hidden="true" />

                        <div className="relative z-10">
                            <span className="inline-flex items-center gap-2 text-primary-100 text-sm font-medium mb-4">
                                <Sparkles size={16} />
                                Prêt à commencer ?
                            </span>
                            <h2 id="cta-title" className="text-white mb-4">
                                Votre prochain projet,{' '}
                                <br className="hidden sm:block" />
                                notre prochaine collaboration.
                            </h2>
                            <p className="text-primary-100 max-w-md mx-auto mb-8 text-base leading-relaxed">
                                Partagez votre vision. Nous vous répondrons sous 24h
                                avec une première proposition créative.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 font-semibold
                                               px-8 py-4 rounded-2xl hover:bg-primary-50 transition-all duration-200 shadow-orange-lg
                                               group"
                                >
                                    Démarrer un projet
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
                                </Link>
                                <a
                                    href="https://wa.me/676383986"
                                    className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white
                                               font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all duration-200"
                                >
                                    Écrire directement
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}