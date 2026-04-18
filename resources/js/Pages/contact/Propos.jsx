import { useEffect, useRef, useState, } from 'react'
import { Link } from '@inertiajs/react'
import {
    ArrowRight, Award, Coffee, Heart, Users, Target,
    Sparkles, Code, Palette, Zap, Mail, Github, Linkedin,
    Twitter, MapPin, Briefcase, GraduationCap, Star
} from 'lucide-react'
import MainLayout from '@/Layouts/MainLayout'
import SEOHead from '@/Components/SEOHead'

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

export default function Propos() {
    const [heroVisible, setHeroVisible] = useState(false)
    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 50)
        return () => clearTimeout(t)
    }, [])

    const stats = [
        { value: '3', suffix: '+', label: "Années d'expérience", icon: Briefcase },
        { value: '47', suffix: '+', label: "Projets livrés", icon: Award },
        { value: '28', suffix: '', label: "Clients satisfaits", icon: Users },
        { value: '12', suffix: '', label: "Awards & mentions", icon: Star },
    ]

    const values = [
        { icon: Heart, title: "Passion", description: "Je mets tout mon cœur dans chaque projet pour créer des designs qui racontent une histoire." },
        { icon: Target, title: "Précision", description: "Chaque détail compte. Une approche méticuleuse pour des résultats impeccables." },
        { icon: Coffee, title: "Dévouement", description: "Je m'investis pleinement jusqu'à ce que vous soyez totalement satisfait." },
        { icon: Sparkles, title: "Créativité", description: "Des solutions originales qui font la différence et marquent les esprits." },
    ]

    const skills = [
        { name: "Branding & Identité", level: 95, color: "bg-primary-500" },
        { name: "Direction Artistique", level: 90, color: "bg-primary-500" },
        { name: "UI/UX Design", level: 85, color: "bg-primary-500" },
        { name: "Motion Design", level: 75, color: "bg-primary-500" },
        { name: "Print & Packaging", level: 88, color: "bg-primary-500" },
        { name: "Typography", level: 92, color: "bg-primary-500" },
    ]

    return (
        <MainLayout>
            <SEOHead 
                title="À propos"
                description="Designer graphique freelance passionné par la création d'identités visuelles percutantes. Découvrez mon parcours et ma philosophie."
                url="/a-propos"
            />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10 animate-blob" 
                     style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />
                
                <div className="container-main px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="divider" />
                                <span className="text-sm font-medium text-primary-500 uppercase tracking-wider">À propos</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                Je crée des identités qui{' '}
                                <span className="text-gradient">racontent</span>
                                <br />votre histoire
                            </h1>
                            <p className="text-lg text-base-muted leading-relaxed mb-6">
                                Designer graphique freelance basé à Yaoundé, je transforme des idées en 
                                systèmes visuels percutants depuis plus de 6 ans. Mon approche allie 
                                créativité audacieuse et stratégie de marque.
                            </p>
                            <p className="text-base text-base-muted mb-8">
                                Chaque projet est unique, chaque histoire mérite d'être racontée visuellement.
                                Je collabore avec des entrepreneurs, des marques et des agences pour créer 
                                des designs qui ne passent pas inaperçus.
                            </p>
                            <div className="flex gap-4">
                                <Link href="/contact" className="btn-primary btn-lg group">
                                    Collaborer
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link href="/projets" className="btn-secondary btn-lg">
                                    Voir mon travail
                                </Link>
                            </div>
                        </div>
                        
                        <div className={`relative transition-all duration-700 delay-200 ${heroVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                            <div className="relative w-full aspect-square max-w-md mx-auto">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary-500/20 to-primary-300/20 animate-pulse" />
                                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-2 border-primary-500/30 shadow-orange-lg">
                                    <img src="/image/moi1.JPG" alt="Franck Dimitri" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-6 -right-6 glass rounded-2xl px-4 py-3 z-20">
                                    <div className="flex items-center gap-3">
                                        <Award className="text-primary-500" size={24} />
                                        <div>
                                            <p className="text-sm font-bold">3+ années</p>
                                            <p className="text-xs text-base-muted">d'expérience</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="section bg-subtle py-16">
                <div className="container-main px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, i) => {
                            const Icon = stat.icon
                            return (
                                <div key={i} className="text-center p-6 rounded-2xl bg-elevated border border-base">
                                    <Icon className="mx-auto text-primary-500 mb-3" size={28} />
                                    <p className="text-3xl font-bold text-gradient mb-1">
                                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                                    </p>
                                    <p className="text-sm text-base-muted">{stat.label}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Philosophy & Values */}
            <section className="section">
                <div className="container-main px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="divider" />
                            <span className="text-sm font-medium text-primary-500 uppercase tracking-wider">Ma philosophie</span>
                            <span className="divider" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Créer avec{' '}
                            <span className="text-gradient">sens</span>
                            {' '}et intention
                        </h2>
                        <p className="text-base-muted">
                            Chaque projet est une opportunité de créer quelque chose de significatif.
                            Voici les valeurs qui guident mon travail au quotidien.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, i) => {
                            const Icon = value.icon
                            return (
                                <div key={i} className="card-hover p-6 text-center group">
                                    <div className="w-14 h-14 rounded-xl bg-primary-500/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500 transition-colors">
                                        <Icon className="text-primary-500 group-hover:text-white transition-colors" size={24} />
                                    </div>
                                    <h3 className="font-semibold text-base-primary mb-2">{value.title}</h3>
                                    <p className="text-sm text-base-muted">{value.description}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Skills Section */}
            <section className="section bg-subtle">
                <div className="container-main px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">
                                Compétences &{' '}
                                <span className="text-gradient">Expertise</span>
                            </h2>
                            <p className="text-base-muted mb-8">
                                Des compétences variées pour répondre à tous vos besoins créatifs,
                                du concept à la réalisation finale.
                            </p>
                            <div className="space-y-6">
                                {skills.map((skill, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-sm font-medium">{skill.name}</span>
                                            <span className="text-sm text-base-muted">{skill.level}%</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div className={`h-full ${skill.color} rounded-full transition-all duration-1000`} 
                                                 style={{ width: `${skill.level}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="bg-gradient-to-br from-primary-500/10 to-primary-700/10 rounded-3xl p-8 border border-primary-500/20">
                                <h3 className="text-2xl font-bold mb-4">Pourquoi collaborer avec moi ?</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Une approche personnalisée pour chaque projet",
                                        "Respect des délais et communication transparente",
                                        "Design pensé pour vos objectifs business",
                                        "Support et accompagnement continu",
                                        "Livrables prêts à l'emploi"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Sparkles size={18} className="text-primary-500 mt-0.5 shrink-0" />
                                            <span className="text-base-muted">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 pt-6 border-t border-base">
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {['MD','KM','SL','OT'].map((initials, i) => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-base flex items-center justify-center text-xs font-bold text-white"
                                                     style={{ backgroundColor: ['#f97316','#ea580c','#c2410c','#9a3412'][i] }}>
                                                    {initials}
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} size={12} className="text-primary-500 fill-primary-500" />
                                                ))}
                                            </div>
                                            <span className="text-xs text-base-muted">28+ clients satisfaits</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="container-main px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-500 p-12 text-center">
                        <div className="relative z-10">
                            <h2 className="text-white mb-4">Parlons de votre projet</h2>
                            <p className="text-primary-100 max-w-md mx-auto mb-8">
                                Vous avez une idée ? Je suis là pour la concrétiser.
                            </p>
                            <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold hover:bg-primary-50 transition-all group">
                                Me contacter
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}