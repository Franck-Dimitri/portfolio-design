import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import {
    ArrowRight, Palette, Layers, Zap, Award, Sparkles,
    PenTool, Video, Globe, Smartphone, Package, Star,
    CheckCircle, Mail, Clock, Shield
} from 'lucide-react'
import MainLayout from '@/Layouts/MainLayout'
import SEOHead from '@/Components/SEOHead'

const SERVICES_LIST = [
    {
        icon: Palette,
        title: "Identité Visuelle",
        description: "Logo, charte graphique, système de marque cohérent du digital au print.",
        features: ["Logo design", "Palette de couleurs", "Typographie", "Papeterie", "Guide de marque"],
        price: "À partir de 500€",
        duration: "2-3 semaines"
    },
    {
        icon: Layers,
        title: "Direction Artistique",
        description: "Concept créatif, casting visuel, supervision de production pour vos campagnes.",
        features: ["Concept créatif", "Direction photo", "Supervision", "Post-production", "Brand content"],
        price: "Sur devis",
        duration: "Variable"
    },
    {
        icon: Zap,
        title: "Motion & Digital",
        description: "Animations de marque, contenu social media, interfaces illustrées.",
        features: ["Motion design", "Animation 2D/3D", "Contenu social", "Interfaces", "Publicités"],
        price: "À partir de 800€",
        duration: "2-4 semaines"
    },
    {
        icon: PenTool,
        title: "Print & Packaging",
        description: "Design d'emballage, édition, supports print haut de gamme.",
        features: ["Packaging", "Brochures", "Affiches", "Catalogues", "Signalétique"],
        price: "À partir de 400€",
        duration: "2-3 semaines"
    },
    {
        icon: Globe,
        title: "Web Design",
        description: "Sites web responsives, landing pages, interfaces utilisateur.",
        features: ["UI/UX Design", "Landing pages", "Dashboard", "Prototypage", "Design system"],
        price: "À partir de 1000€",
        duration: "3-5 semaines"
    },
    {
        icon: Smartphone,
        title: "Branding Digital",
        description: "Identité pour réseaux sociaux, templates, assets digitaux.",
        features: ["Réseaux sociaux", "Email marketing", "Bannières", "Templates", "Assets"],
        price: "À partir de 300€",
        duration: "1-2 semaines"
    }
]

const PROCESS_STEPS = [
    {
        step: "01",
        title: "Découverte",
        description: "Nous échangeons sur votre projet, vos objectifs et votre vision.",
        icon: Mail
    },
    {
        step: "02",
        title: "Recherche",
        description: "Analyse du marché, benchmark et définition de la direction créative.",
        icon: Award
    },
    {
        step: "03",
        title: "Création",
        description: "Développement des concepts et propositions créatives.",
        icon: Palette
    },
    {
        step: "04",
        title: "Itération",
        description: "Ajustements et affinage selon vos retours.",
        icon: Sparkles
    },
    {
        step: "05",
        title: "Livraison",
        description: "Finalisation et livraison des fichiers organisés et prêts à l'emploi.",
        icon: Package
    },
    {
        step: "06",
        title: "Support",
        description: "Accompagnement post-livraison et évolutions si nécessaires.",
        icon: Shield
    }
]

export default function Service() {
    const [heroVisible, setHeroVisible] = useState(false)
    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 50)
        return () => clearTimeout(t)
    }, [])

    return (
        <MainLayout>
            <SEOHead 
                title="Services"
                description="Découvrez mes prestations en design graphique : identité visuelle, direction artistique, motion design et plus."
                url="/services"
            />

            {/* Hero */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
                <div className="container-main px-4 text-center max-w-4xl mx-auto">
                    <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="divider" />
                            <span className="text-sm font-medium text-primary-500 uppercase tracking-wider">Prestations</span>
                            <span className="divider" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Des services créatifs pour
                            <br />
                            <span className="text-gradient">donner vie</span> à vos idées
                        </h1>
                        <p className="text-lg text-base-muted max-w-2xl mx-auto">
                            Des solutions sur mesure adaptées à vos besoins, votre budget et vos objectifs.
                            Chaque projet est unique et mérite une approche personnalisée.
                        </p>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section">
                <div className="container-main px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {SERVICES_LIST.map((service, i) => {
                            const Icon = service.icon
                            return (
                                <div key={i} className="card-hover p-6 group animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500 transition-colors">
                                        <Icon className="text-primary-500 group-hover:text-white transition-colors" size={22} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                    <p className="text-base-muted text-sm mb-4">{service.description}</p>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {service.features.slice(0, 3).map((feature, f) => (
                                            <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-muted text-base-muted">
                                                {feature}
                                            </span>
                                        ))}
                                        {service.features.length > 3 && (
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-base-muted">
                                                +{service.features.length - 3}
                                            </span>
                                        )}
                                    </div>
                                    <div className="pt-4 border-t border-base flex justify-between items-center">
                                        <div>
                                            <p className="text-xs text-base-muted">À partir de</p>
                                            <p className="font-semibold text-primary-500">{service.price}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-base-muted">Délai</p>
                                            <p className="text-sm font-medium">{service.duration}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="section bg-subtle">
                <div className="container-main px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="divider" />
                            <span className="text-sm font-medium text-primary-500 uppercase tracking-wider">Processus</span>
                            <span className="divider" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Comment je{' '}
                            <span className="text-gradient">travaille</span>
                        </h2>
                        <p className="text-base-muted">
                            Une méthodologie claire et transparente pour vous accompagner
                            de l'idée à la réalisation.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PROCESS_STEPS.map((step, i) => {
                            const Icon = step.icon
                            return (
                                <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                                    <div className="text-3xl font-black text-primary-500/30">{step.step}</div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Icon size={16} className="text-primary-500" />
                                            <h3 className="font-semibold">{step.title}</h3>
                                        </div>
                                        <p className="text-sm text-base-muted">{step.description}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="section">
                <div className="container-main px-4">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold mb-4">
                            Questions{' '}
                            <span className="text-gradient">fréquentes</span>
                        </h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {[
                            {
                                q: "Quels sont vos tarifs ?",
                                a: "Les tarifs varient selon la complexité du projet. Je propose des devis personnalisés après avoir discuté de vos besoins."
                            },
                            {
                                q: "Quels sont les délais de livraison ?",
                                a: "En moyenne, comptez 2 à 4 semaines selon l'ampleur du projet. Je m'engage à respecter les délais convenus."
                            },
                            {
                                q: "Comment se passe la collaboration ?",
                                a: "Je travaille en étroite collaboration avec vous, avec des points réguliers et des livraisons itératives."
                            },
                            {
                                q: "Fournissez-vous les fichiers sources ?",
                                a: "Oui, vous recevez tous les fichiers sources organisés et prêts à l'emploi."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="card p-6">
                                <h3 className="font-semibold mb-2">{faq.q}</h3>
                                <p className="text-sm text-base-muted">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section">
                <div className="container-main px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-500 p-12 text-center">
                        <div className="relative z-10">
                            <h2 className="text-white mb-4">Prêt à concrétiser votre projet ?</h2>
                            <p className="text-primary-100 max-w-md mx-auto mb-8">
                                Discutons de vos besoins et trouvons ensemble la meilleure solution.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold hover:bg-primary-50 transition-all group">
                                    Demander un devis
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="mailto:franckdimitrio009@gmail.com" className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:text-white px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
                                    <Mail size={18} />
                                    franckdimitrio009@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}