import { useState, useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import {
    ArrowRight, Mail, Phone, MapPin, Send, Clock,
    MessageCircle, CheckCircle, Github, Linkedin,
    Twitter, Instagram, AlertCircle, Focus, Box, Plus
} from 'lucide-react';
import MainLayout from '@/Layouts/MainLayout';
import SEOHead from '@/Components/SEOHead';

/* ══════════════════════════════════════════════════════════════
   COMPOSANT – Lignes structurelles (Design Canvas)
══════════════════════════════════════════════════════════════ */
function CanvasLines() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 flex justify-center overflow-hidden">
            {/* Motif de grille Blueprint subtil en fond */}
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
            
            {/* Repères de coupe design (Crop marks) */}
            <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-gray-400 dark:border-gray-600"></div>
            <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-gray-400 dark:border-gray-600"></div>
            <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-gray-400 dark:border-gray-600"></div>
            <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-gray-400 dark:border-gray-600"></div>
        </div>
    );
}

export default function Contact() {
    const { data, setData, post, processing, errors, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        service: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/contact', {
            onSuccess: () => {
                reset();
            }
        });
    };

    const contactInfo = [
        { icon: Mail, label: "ADRESSE EMAIL", value: "dims.creative.academy@gmail.com", link: "mailto:dims.creative.academy@gmail.com" },
        { icon: Phone, label: "LIGNE DIRECTE", value: "+237 676 383 986", link: "tel:+237676383986" },
        { icon: MapPin, label: "COORDONNÉES GÉO", value: "Yaoundé, Cameroun", link: null },
        { icon: Clock, label: "PLAGE OPÉRATIONNELLE", value: "LUN-SAM, 0900-1800", link: null },
    ];

    const socialLinks = [
        { icon: Twitter, name: "Twitter", url: "https://twitter.com/" },
        { icon: Instagram, name: "Instagram", url: "https://instagram.com/" },
        { icon: Github, name: "Github", url: "https://github.com/" },
        { icon: Linkedin, name: "LinkedIn", url: "https://linkedin.com/" },
    ];

    const services = [
        "Identité visuelle",
        "Direction artistique",
        "Motion design",
        "Web design",
        "Print & packaging",
        "Branding digital"
    ];

    return (
        <MainLayout>
            <SEOHead 
                title="Contact & Liaison | Dims Creative Academy"
                description="Initialisez la communication pour discuter de vos projets architecturaux de marque."
                url="/contact"
            />

            <CanvasLines />

            <div className="relative z-10">
                {/* ══════════════════════════════════════════════════
                    § 1 – HERO SECTION
                ══════════════════════════════════════════════════ */}
                <section className="pt-32 pb-16 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#0A0A0A]">
                    <div className="container-main px-4">
                        <div className="max-w-4xl">
                            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-6">
                                <Box size={12} />
                                <span>COMMUNICATION CENTER</span>
                                <span className="w-8 h-px bg-primary-500/50"></span>
                                <span className="text-gray-400 dark:text-gray-600">LIAISON SÉCURISÉE</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tighter text-gray-900 dark:text-white mb-6 leading-none">
                                INITIALISER <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-orange-400">LA LIAISON</span>
                            </h1>
                            
                            <p className="text-lg text-gray-500 leading-relaxed mb-6 font-sans">
                                Transmettez vos paramètres de projet. Notre équipe analysera les spécifications et vous recontactera sous 24h avec un plan d'action.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 2 – FORM & DATA SECTION
                ══════════════════════════════════════════════════ */}
                <section className="py-20 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800">
                    <div className="container-main px-4">
                        <div className="grid lg:grid-cols-12 gap-12">
                            
                            {/* PANNEAU LATÉRAL (COORDONNÉES) */}
                            <div className="lg:col-span-4 space-y-8">
                                
                                <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616]">
                                    <div className="border-b border-gray-200 dark:border-gray-800 p-4 font-mono text-[10px] uppercase tracking-widest font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                        <Focus size={12} /> PARAMÈTRES DE CONTACT
                                    </div>
                                    <div className="divide-y divide-gray-200 dark:divide-gray-800">
                                        {contactInfo.map((info, i) => {
                                            const Icon = info.icon;
                                            return (
                                                <div key={i} className="p-6">
                                                    <div className="flex items-center gap-3 mb-2 text-primary-500">
                                                        <Icon size={16} />
                                                        <p className="font-mono text-[10px] uppercase tracking-widest font-bold">{info.label}</p>
                                                    </div>
                                                    {info.link ? (
                                                        <a href={info.link} className="font-mono text-sm text-gray-900 dark:text-white hover:text-primary-500 transition-colors uppercase tracking-wider block">
                                                            {info.value}
                                                        </a>
                                                    ) : (
                                                        <p className="font-mono text-sm text-gray-900 dark:text-white uppercase tracking-wider">
                                                            {info.value}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] p-6 text-center">
                                    <h3 className="font-mono text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest mb-4">
                                        CANAUX SECONDAIRES
                                    </h3>
                                    <div className="flex justify-center gap-3">
                                        {socialLinks.map((social, i) => {
                                            const Icon = social.icon;
                                            return (
                                                <a
                                                    key={i}
                                                    href={social.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-10 h-10 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111] text-gray-500 flex items-center justify-center hover:bg-primary-500 hover:border-primary-500 hover:text-black transition-all duration-200"
                                                    aria-label={social.name}
                                                >
                                                    <Icon size={16} />
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="border border-green-500 bg-green-50 dark:bg-green-900/10 p-6 flex items-start gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mt-1.5 shrink-0" />
                                    <div>
                                        <p className="font-mono text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest mb-1">STATUT SYSTÈME : PRÊT</p>
                                        <p className="text-xs font-sans text-green-700 dark:text-green-500">Nous acceptons de nouvelles requêtes d'architecture.</p>
                                    </div>
                                </div>

                            </div>

                            {/* CONTENU PRINCIPAL (FORMULAIRE) */}
                            <div className="lg:col-span-8">
                                <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] p-8 md:p-12 relative overflow-hidden h-full">
                                    
                                    {/* Blueprint corners */}
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-500"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-500"></div>

                                    <h2 className="text-2xl font-display font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
                                        TRANSMETTRE UNE <span className="text-primary-500">REQUÊTE</span>
                                    </h2>
                                    
                                    {recentlySuccessful && (
                                        <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-500 text-green-600 dark:text-green-400 flex items-start gap-3">
                                            <CheckCircle size={18} className="mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-mono text-xs font-bold uppercase tracking-widest mb-1">TRANSMISSION RÉUSSIE</p>
                                                <p className="font-sans text-sm">Le paquet a été délivré. L'équipe d'ingénierie traitera la requête prochainement.</p>
                                            </div>
                                        </div>
                                    )}

                                    {errors.error && (
                                        <div className="mb-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-500 text-red-600 dark:text-red-400 flex items-start gap-3">
                                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                            <div>
                                                <p className="font-mono text-xs font-bold uppercase tracking-widest mb-1">ÉCHEC DE LA TRANSMISSION</p>
                                                <p className="font-sans text-sm">{errors.error}</p>
                                            </div>
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">IDENTIFIANT COMPLET [REQ]</label>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={(e) => setData('name', e.target.value)}
                                                    className="w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors"
                                                    required
                                                />
                                                {errors.name && <p className="text-red-500 text-[10px] font-mono mt-2">{errors.name}</p>}
                                            </div>
                                            <div>
                                                <label className="block font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">ADRESSE DE ROUTAGE EMAIL [REQ]</label>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors"
                                                    required
                                                />
                                                {errors.email && <p className="text-red-500 text-[10px] font-mono mt-2">{errors.email}</p>}
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">CANAL TÉLÉPHONIQUE [OPT]</label>
                                                <input
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={(e) => setData('phone', e.target.value)}
                                                    className="w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">MODULE D'INTERVENTION CIBLE [OPT]</label>
                                                <div className="relative">
                                                    <select
                                                        value={data.service}
                                                        onChange={(e) => setData('service', e.target.value)}
                                                        className="w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors appearance-none"
                                                    >
                                                        <option value="">-- SÉLECTIONNER UN MODULE --</option>
                                                        {services.map(service => (
                                                            <option key={service} value={service}>{service}</option>
                                                        ))}
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                                                        <Plus size={14} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">OBJET DE LA REQUÊTE [REQ]</label>
                                            <input
                                                type="text"
                                                value={data.subject}
                                                onChange={(e) => setData('subject', e.target.value)}
                                                className="w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors"
                                                required
                                            />
                                            {errors.subject && <p className="text-red-500 text-[10px] font-mono mt-2">{errors.subject}</p>}
                                        </div>

                                        <div>
                                            <label className="block font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">CORPS DE LA TRANSMISSION [REQ]</label>
                                            <textarea
                                                rows={6}
                                                value={data.message}
                                                onChange={(e) => setData('message', e.target.value)}
                                                className="w-full bg-white dark:bg-[#111] border border-gray-300 dark:border-gray-700 px-4 py-3 text-sm font-mono text-gray-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-primary-500 transition-colors resize-none"
                                                required
                                            />
                                            {errors.message && <p className="text-red-500 text-[10px] font-mono mt-2">{errors.message}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest py-4 group flex items-center justify-center gap-2 hover:bg-primary-400 transition-colors disabled:opacity-50"
                                        >
                                            {processing ? (
                                                "TRANSMISSION EN COURS..."
                                            ) : (
                                                <>
                                                    EXÉCUTER LA TRANSMISSION
                                                    <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 3 – CARTE GÉOGRAPHIQUE
                ══════════════════════════════════════════════════ */}
                <section className="py-20 bg-gray-50 dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-gray-800">
                    <div className="container-main px-4">
                        <div className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111] p-2 h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1629905.5208066536!2d10.376889559717772!3d3.848032761665932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x10a98b3f26be5e11%3A0x3cf8b563cc53d2ab!2sYaound%C3%A9%2C%20Cameroun!5e0!3m2!1sfr!2sfr!4v1699980000000!5m2!1sfr!2sfr"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(100%) contrast(1.2)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Localisation Géographique"
                            ></iframe>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════════════
                    § 4 – CTA RAPIDE
                ══════════════════════════════════════════════════ */}
                <section className="py-24 bg-white dark:bg-[#111] text-center">
                    <div className="container-main px-4">
                        <div className="inline-flex items-center justify-center p-4 border border-gray-200 dark:border-gray-800 mb-6 bg-gray-50 dark:bg-[#161616]">
                            <MessageCircle className="text-primary-500" size={24} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tight text-gray-900 dark:text-white mb-6">
                            LIAISON <span className="text-primary-500">DIRECTE</span>
                        </h2>
                        <p className="text-gray-500 font-mono text-sm max-w-lg mx-auto mb-10 leading-relaxed uppercase tracking-wide">
                            Contournez le formulaire. Appelez directement le quartier général pour une urgence absolue.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href="tel:+237676383986" 
                                className="inline-flex items-center justify-center gap-2 bg-primary-500 text-black font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-primary-400 transition-colors"
                            >
                                <Phone size={14} /> +237 676 383 986
                            </a>
                            <a 
                                href="mailto:dims.creative.academy@gmail.com" 
                                className="inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-white font-mono font-bold text-xs uppercase tracking-widest px-8 py-4 hover:bg-gray-50 dark:hover:bg-[#161616] transition-colors"
                            >
                                <Mail size={14} /> ENVOYER UN MAIL DIRECT
                            </a>
                        </div>
                    </div>
                </section>

            </div>
        </MainLayout>
    );
}