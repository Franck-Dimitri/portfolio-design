import { useState, useEffect } from 'react'
import { Link, useForm } from '@inertiajs/react'
import {
    ArrowRight, Mail, Phone, MapPin, Send, Clock,
    MessageCircle, CheckCircle, Github, Linkedin,
    Twitter, Instagram, Sparkles, AlertCircle,
} from 'lucide-react'
import MainLayout from '@/Layouts/MainLayout'
import SEOHead from '@/Components/SEOHead'

export default function Contact() {
    const [heroVisible, setHeroVisible] = useState(false)
    
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        service: ''
    })

    useEffect(() => {
        const t = setTimeout(() => setHeroVisible(true), 50)
        return () => clearTimeout(t)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        post('/contact', {
            onSuccess: () => {
                reset()
            }
        })
    }

    const contactInfo = [
        { icon: Mail, label: "Email", value: "dims.creative.academy@gmail.com", link: "mailto:dims.creative.academy@gmail.com" },
        { icon: Phone, label: "Téléphone", value: "+237 676 383 986", link: "tel:+237676383986" },
        { icon: MapPin, label: "Localisation", value: "Yaoundé, Cameroun", link: null },
        { icon: Clock, label: "Disponibilité", value: "Lun-Sam, 9h-18h", link: null },
    ]

    const socialLinks = [
        { icon: Twitter, name: "Twitter", url: "https://twitter.com/" },
        { icon: Instagram, name: "Instagram", url: "https://instagram.com/" },
        { icon: Github, name: "Github", url: "https://github.com/" },
        { icon: Linkedin, name: "LinkedIn", url: "https://linkedin.com/" },
    ]

    const services = [
        "Identité visuelle",
        "Direction artistique",
        "Motion design",
        "Web design",
        "Print & packaging",
        "Branding digital"
    ]

    return (
        <MainLayout>
            <SEOHead 
                title="Contact | Dim's Creative Academy"
                description="Contactez-moi pour discuter de votre projet. Disponible pour des collaborations créatives dans le monde entier."
                url="/contact"
            />

            {/* Hero */}
            <section className="relative pt-32 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
                <div className="container-main px-4 text-center max-w-4xl mx-auto">
                    <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="divider" />
                            <span className="text-sm font-medium text-primary-500 uppercase tracking-wider">Contact</span>
                            <span className="divider" />
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Commençons{' '}
                            <span className="text-gradient">quelque chose</span>
                            <br />de grand
                        </h1>
                        <p className="text-lg text-base-muted max-w-2xl mx-auto">
                            Vous avez un projet en tête ? Une collaboration à discuter ?
                            Je suis à votre écoute. Réponse sous 24h.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="section pb-20">
                <div className="container-main px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <div className="space-y-6">
                                {contactInfo.map((info, i) => {
                                    const Icon = info.icon
                                    return (
                                        <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-muted/30">
                                            <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                                                <Icon size={20} className="text-primary-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-base-muted uppercase tracking-wider">{info.label}</p>
                                                {info.link ? (
                                                    <a href={info.link} className="text-base-primary font-medium hover:text-primary-500 transition-colors">
                                                        {info.value}
                                                    </a>
                                                ) : (
                                                    <p className="text-base-primary font-medium">{info.value}</p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Social Links */}
                            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-primary-500/5 to-primary-700/5 border border-primary-500/20">
                                <h3 className="font-semibold mb-4">Suivez-moi</h3>
                                <div className="flex gap-3">
                                    {socialLinks.map((social, i) => {
                                        const Icon = social.icon
                                        return (
                                            <a
                                                key={i}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full border border-base flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all duration-200"
                                                aria-label={social.name}
                                            >
                                                <Icon size={16} />
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Availability Badge */}
                            <div className="mt-6 flex items-center gap-2 text-sm text-green-500 bg-green-500/10 px-4 py-2 rounded-full w-fit">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Disponible pour nouveaux projets
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="card p-6 md:p-8">
                            <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
                            
                            {recentlySuccessful && (
                                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 flex items-center gap-2">
                                    <CheckCircle size={18} />
                                    Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                                </div>
                            )}

                            {errors.error && (
                                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
                                    <AlertCircle size={18} />
                                    {errors.error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Nom complet *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="input"
                                            required
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email *</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="input"
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Service souhaité</label>
                                        <select
                                            value={data.service}
                                            onChange={(e) => setData('service', e.target.value)}
                                            className="input"
                                        >
                                            <option value="">Sélectionnez un service</option>
                                            {services.map(service => (
                                                <option key={service} value={service}>{service}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Sujet *</label>
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        className="input"
                                        required
                                    />
                                    {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Message *</label>
                                    <textarea
                                        rows={5}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        className="input resize-none"
                                        required
                                    />
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-primary w-full py-3 group flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        "Envoi en cours..."
                                    ) : (
                                        <>
                                            Envoyer le message
                                            <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="section bg-subtle">
                <div className="container-main px-4">
                    <div className="rounded-2xl overflow-hidden h-80 bg-muted relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1629905.5208066536!2d10.376889559717772!3d3.848032761665932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10a98b3f26be5e11%3A0x3cf8b563cc53d2ab!2sYaound%C3%A9%2C%20Cameroun!5e0!3m2!1sfr!2sfr!4v1699980000000!5m2!1sfr!2sfr"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Localisation"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* FAQ CTA */}
            <section className="section">
                <div className="container-main px-4">
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-500 p-12 text-center">
                        <div className="relative z-10">
                            <MessageCircle className="mx-auto text-white/80 mb-4" size={40} />
                            <h2 className="text-white text-2xl md:text-3xl font-bold mb-4">
                                Vous préférez discuter directement ?
                            </h2>
                            <p className="text-primary-100 max-w-md mx-auto mb-8">
                                Appelez-moi ou envoyez-moi un message, je vous répondrai dans la journée.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="tel:+237676383986" className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-semibold hover:bg-primary-50 transition-all">
                                    <Phone size={18} />
                                    +237 676 383 986
                                </a>
                                <a href="mailto:dims.creative.academy@gmail.com" className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:text-white px-8 py-4 rounded-2xl hover:bg-white/10 transition-all">
                                    <Mail size={18} />
                                    dims.creative.academy@gmail.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    )
}