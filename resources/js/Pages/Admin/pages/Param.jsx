import AdminLayout from '@/Layouts/AdminLayout'
import { Head, useForm } from '@inertiajs/react'
import {
    Sliders,
    Building2,
    MessageSquare,
    DollarSign,
    Share2,
    Globe,
    Save,
    CheckCircle2,
    Terminal,
    ExternalLink,
    ShieldAlert,
    HelpCircle,
    Copy,
    Check
} from 'lucide-react'
import { useState } from 'react'

export default function Param({ settings = {} }) {
    const [activeTab, setActiveTab] = useState('general')
    const [copiedKey, setCopiedKey] = useState(null)

    const { data, setData, post, processing, recentlySuccessful, isDirty } = useForm({
        // Général & Identité
        agency_name: settings.agency_name || "Dim's Creative Academy",
        agency_tagline: settings.agency_tagline || "Studio de Design Graphique, UI/UX & Identité de Marque",
        contact_email: settings.contact_email || "contact@dimscreative.com",
        contact_phone: settings.contact_phone || "+237 690 11 22 33",
        office_address: settings.office_address || "Douala & Yaoundé, Cameroun",

        // WhatsApp & Communication
        whatsapp_number: settings.whatsapp_number || "237690112233",
        whatsapp_auto_msg: settings.whatsapp_auto_msg || "Bonjour Franck, je vous contacte depuis votre portfolio Dim's Creative Academy.",
        notification_email_admin: settings.notification_email_admin || "admin@dimscreative.com",

        // Finance & Facturation
        default_currency: settings.default_currency || "FCFA",
        tax_rate: settings.tax_rate ?? 0,
        invoice_prefix: settings.invoice_prefix || "DCA-FAC-",
        bank_info: settings.bank_info || "Orange Money: +237 690 11 22 33\nMTN Mobile Money: +237 677 88 99 00\nBénéficiaire: Franck Dimitri Kouongme",

        // Réseaux Sociaux
        social_behance: settings.social_behance || "https://behance.net/franckdimitri",
        social_dribbble: settings.social_dribbble || "https://dribbble.com/franckdimitri",
        social_linkedin: settings.social_linkedin || "https://linkedin.com/in/franckdimitri",
        social_instagram: settings.social_instagram || "https://instagram.com/dimscreative",
        social_github: settings.social_github || "https://github.com/mr-dims-tech",

        // SEO & Système
        meta_default_title: settings.meta_default_title || "Dim's Creative Academy — Design Graphique & Direction Artistique",
        meta_default_desc: settings.meta_default_desc || "Portfolio & Studio de Design spécialisé en UI/UX, identité visuelle, branding et accompagnement créatif sur mesure.",
        maintenance_mode: Boolean(settings.maintenance_mode),
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        post(route('settings.update'), {
            preserveScroll: true,
        })
    }

    const copyToClipboard = (text, key) => {
        navigator.clipboard.writeText(text)
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    const tabs = [
        { id: 'general', label: '1. AGENCE & IDENTITÉ', icon: Building2 },
        { id: 'communication', label: '2. WHATSAPP & EMAILS', icon: MessageSquare },
        { id: 'financial', label: '3. FACTURATION & FINANCE', icon: DollarSign },
        { id: 'social', label: '4. RÉSEAUX SOCIAUX', icon: Share2 },
        { id: 'system', label: '5. SEO & SYSTÈME', icon: Globe },
    ]

    return (
        <AdminLayout title="Configuration Globale">
            <Head title="Paramètres Globaux — DCA Admin" />

            <form onSubmit={handleSubmit} className="space-y-8 pb-16">

                {/* ══════════════════════════════════════════════════
                    § 1 – HEADER BLUEPRINT
                ══════════════════════════════════════════════════ */}
                <div className="relative border border-gray-800 bg-[#0E0E0E] p-6 md:p-8 overflow-hidden">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary-500"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary-500"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary-500"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary-500"></div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-primary-500 font-bold mb-2">
                                <Terminal size={13} />
                                <span>CONFIG_MODULE // SYS_SETTINGS</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-white">
                                PARAMÈTRES <span className="text-primary-500">GLOBAUX DU STUDIO</span>
                            </h1>
                            <p className="text-xs font-mono text-gray-400 mt-2 max-w-xl">
                                Coordonnées de l'agence, devise de facturation, passerelles de messagerie, intégration WhatsApp et métadonnées SEO.
                            </p>
                        </div>

                        {/* Action Sauvegarde */}
                        <div className="flex items-center gap-3">
                            {recentlySuccessful && (
                                <span className="flex items-center gap-1.5 text-xs font-mono text-green-400 bg-green-500/10 border border-green-500/30 px-3 py-2">
                                    <CheckCircle2 size={14} /> SAUVEGARDÉ AVEC SUCCÈS
                                </span>
                            )}

                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 bg-primary-500 text-black px-6 py-3 font-mono font-bold text-xs uppercase tracking-widest hover:bg-primary-400 disabled:opacity-50 transition-colors cursor-pointer"
                            >
                                <Save size={15} />
                                {processing ? 'ENREGISTREMENT...' : 'ENREGISTRER LES MODIFICATIONS'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════════════════
                    § 2 – ONGLETS DE CONFIGURATION
                ══════════════════════════════════════════════════ */}
                <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider transition-all border
                                    ${isActive
                                        ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                                        : 'border-gray-800 text-gray-400 hover:text-white hover:bg-[#141414]'
                                    }
                                `}
                            >
                                <Icon size={14} className={isActive ? 'text-primary-500' : 'text-gray-500'} />
                                <span>{tab.label}</span>
                            </button>
                        )
                    })}
                </div>

                {/* ══════════════════════════════════════════════════
                    § 3 – CONTENU DES ONGLETS
                ══════════════════════════════════════════════════ */}
                <div className="border border-gray-800 bg-[#0E0E0E] p-6 md:p-8 space-y-6">

                    {/* ──── TAB 1 : AGENCE & IDENTITÉ ──── */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div className="border-b border-gray-800 pb-4">
                                <h2 className="text-lg font-display font-bold uppercase text-white tracking-wide">
                                    Identité & Coordonnées Officielles
                                </h2>
                                <p className="text-xs font-mono text-gray-400 mt-1">
                                    Ces informations apparaissent dans les en-têtes, le pied de page et les factures émises.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Nom de l'Agence / Raison Sociale
                                    </label>
                                    <input
                                        type="text"
                                        value={data.agency_name}
                                        onChange={(e) => setData('agency_name', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="Dim's Creative Academy"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Email Public de Contact
                                    </label>
                                    <input
                                        type="email"
                                        value={data.contact_email}
                                        onChange={(e) => setData('contact_email', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="contact@dimscreative.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Téléphone Direct
                                    </label>
                                    <input
                                        type="text"
                                        value={data.contact_phone}
                                        onChange={(e) => setData('contact_phone', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="+237 690 11 22 33"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Siège / Ville d'exercice
                                    </label>
                                    <input
                                        type="text"
                                        value={data.office_address}
                                        onChange={(e) => setData('office_address', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="Douala, Cameroun"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                    Slogan / Baseline de Marque
                                </label>
                                <input
                                    type="text"
                                    value={data.agency_tagline}
                                    onChange={(e) => setData('agency_tagline', e.target.value)}
                                    className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                    placeholder="Studio de Design Graphique, UI/UX & Identité de Marque"
                                />
                            </div>
                        </div>
                    )}

                    {/* ──── TAB 2 : WHATSAPP & EMAILS ──── */}
                    {activeTab === 'communication' && (
                        <div className="space-y-6">
                            <div className="border-b border-gray-800 pb-4">
                                <h2 className="text-lg font-display font-bold uppercase text-white tracking-wide">
                                    Passerelles WhatsApp & Alertes Administrateur
                                </h2>
                                <p className="text-xs font-mono text-gray-400 mt-1">
                                    Configurez les intégrations WhatsApp pour les clients et l'adresse recevant les alertes de commandes.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Numéro WhatsApp Officiel (Format International sans +)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.whatsapp_number}
                                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="237690112233"
                                        required
                                    />
                                    <p className="text-[10px] font-mono text-gray-500">
                                        Exemple : <span className="text-primary-400">237690112233</span> pour le Cameroun.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Email de Notification Administrateur
                                    </label>
                                    <input
                                        type="email"
                                        value={data.notification_email_admin}
                                        onChange={(e) => setData('notification_email_admin', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="admin@dimscreative.com"
                                        required
                                    />
                                    <p className="text-[10px] font-mono text-gray-500">
                                        Reçoit les alertes de nouveaux paiements, messages clients et soumissions contact.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                    Message d'accueil WhatsApp par défaut
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.whatsapp_auto_msg}
                                    onChange={(e) => setData('whatsapp_auto_msg', e.target.value)}
                                    className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                    placeholder="Bonjour Franck, je vous contacte depuis votre portfolio Dim's Creative Academy."
                                />
                            </div>

                            {/* Aperçu du lien WhatsApp */}
                            <div className="p-4 bg-[#141414] border border-gray-800 flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <span className="text-[10px] font-mono uppercase text-gray-400 tracking-wider block">
                                        Aperçu du lien direct client :
                                    </span>
                                    <span className="font-mono text-xs text-primary-400 truncate block mt-0.5">
                                        https://wa.me/{data.whatsapp_number}?text={encodeURIComponent(data.whatsapp_auto_msg)}
                                    </span>
                                </div>
                                <a
                                    href={`https://wa.me/${data.whatsapp_number}?text=${encodeURIComponent(data.whatsapp_auto_msg)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-2 bg-green-500/10 border border-green-500/30 text-green-400 hover:bg-green-500 hover:text-black font-mono text-xs font-bold uppercase transition-colors shrink-0 flex items-center gap-1.5"
                                >
                                    <ExternalLink size={13} /> TESTER LE LIEN
                                </a>
                            </div>
                        </div>
                    )}

                    {/* ──── TAB 3 : FACTURATION & FINANCE ──── */}
                    {activeTab === 'financial' && (
                        <div className="space-y-6">
                            <div className="border-b border-gray-800 pb-4">
                                <h2 className="text-lg font-display font-bold uppercase text-white tracking-wide">
                                    Finance, Facturation & Modalités de Paiement
                                </h2>
                                <p className="text-xs font-mono text-gray-400 mt-1">
                                    Définition de la devise principale, taux de taxe applicable et mentions légales sur les factures émises.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Devise par Défaut
                                    </label>
                                    <select
                                        value={data.default_currency}
                                        onChange={(e) => setData('default_currency', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                    >
                                        <option value="FCFA">FCFA (XAF)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="USD">USD ($)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Taux de TVA Applicable (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        value={data.tax_rate}
                                        onChange={(e) => setData('tax_rate', parseFloat(e.target.value) || 0)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="0"
                                    />
                                    <p className="text-[10px] font-mono text-gray-500">Indiquez 0 pour exonération fiscale.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Préfixe de Numérotation Facture
                                    </label>
                                    <input
                                        type="text"
                                        value={data.invoice_prefix}
                                        onChange={(e) => setData('invoice_prefix', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="DCA-FAC-"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                    Coordonnées Bancaires / Mobile Money (Affichées sur les reçus officiels)
                                </label>
                                <textarea
                                    rows={4}
                                    value={data.bank_info}
                                    onChange={(e) => setData('bank_info', e.target.value)}
                                    className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                    placeholder="Orange Money: +237 690 11 22 33&#10;MTN MoMo: +237 677 88 99 00&#10;Titulaire: Franck Dimitri Kouongme"
                                />
                            </div>
                        </div>
                    )}

                    {/* ──── TAB 4 : RÉSEAUX SOCIAUX ──── */}
                    {activeTab === 'social' && (
                        <div className="space-y-6">
                            <div className="border-b border-gray-800 pb-4">
                                <h2 className="text-lg font-display font-bold uppercase text-white tracking-wide">
                                    Liens Sociaux & Portfolios Externes
                                </h2>
                                <p className="text-xs font-mono text-gray-400 mt-1">
                                    Ces liens sont injectés automatiquement dans le footer, la barre de navigation et les fiches de contact.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Behance Portfolio URL
                                    </label>
                                    <input
                                        type="url"
                                        value={data.social_behance}
                                        onChange={(e) => setData('social_behance', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="https://behance.net/franckdimitri"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Dribbble URL
                                    </label>
                                    <input
                                        type="url"
                                        value={data.social_dribbble}
                                        onChange={(e) => setData('social_dribbble', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="https://dribbble.com/franckdimitri"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        LinkedIn URL
                                    </label>
                                    <input
                                        type="url"
                                        value={data.social_linkedin}
                                        onChange={(e) => setData('social_linkedin', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="https://linkedin.com/in/franckdimitri"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        Instagram URL
                                    </label>
                                    <input
                                        type="url"
                                        value={data.social_instagram}
                                        onChange={(e) => setData('social_instagram', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="https://instagram.com/dimscreative"
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                        GitHub Developer URL
                                    </label>
                                    <input
                                        type="url"
                                        value={data.social_github}
                                        onChange={(e) => setData('social_github', e.target.value)}
                                        className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                        placeholder="https://github.com/mr-dims-tech"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ──── TAB 5 : SEO & SYSTÈME ──── */}
                    {activeTab === 'system' && (
                        <div className="space-y-6">
                            <div className="border-b border-gray-800 pb-4">
                                <h2 className="text-lg font-display font-bold uppercase text-white tracking-wide">
                                    Référencement SEO & État Système
                                </h2>
                                <p className="text-xs font-mono text-gray-400 mt-1">
                                    Configuration des balises méta globales et statut d'indexation pour Google et les moteurs de recherche.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                    Méta Titre SEO par Défaut (Page d'accueil & Partages)
                                </label>
                                <input
                                    type="text"
                                    value={data.meta_default_title}
                                    onChange={(e) => setData('meta_default_title', e.target.value)}
                                    className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                    placeholder="Dim's Creative Academy — Design Graphique & Direction Artistique"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-mono font-bold uppercase text-gray-300">
                                    Méta Description SEO par Défaut
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.meta_default_desc}
                                    onChange={(e) => setData('meta_default_desc', e.target.value)}
                                    className="w-full bg-[#141414] border border-gray-800 focus:border-primary-500 focus:ring-0 text-white font-mono text-xs p-3 transition-colors"
                                    placeholder="Studio créatif spécialisé en UI/UX Design, Branding & Identité de marque."
                                />
                            </div>

                            {/* Raccourcis SEO Sitemap & Robots */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                                <div className="p-4 bg-[#141414] border border-gray-800 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-mono font-bold uppercase text-white block">
                                            Sitemap XML Dynamique
                                        </span>
                                        <span className="text-[10px] font-mono text-gray-400">
                                            Indexation Google des projets, services et blogs
                                        </span>
                                    </div>
                                    <a
                                        href="/sitemap.xml"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1.5 border border-primary-500/50 text-primary-400 hover:bg-primary-500 hover:text-black font-mono text-[10px] font-bold uppercase transition-colors flex items-center gap-1"
                                    >
                                        <ExternalLink size={12} /> OUVRIR SITEMAP
                                    </a>
                                </div>

                                <div className="p-4 bg-[#141414] border border-gray-800 flex items-center justify-between">
                                    <div>
                                        <span className="text-xs font-mono font-bold uppercase text-white block">
                                            Fichier Robots.txt
                                        </span>
                                        <span className="text-[10px] font-mono text-gray-400">
                                            Directives de crawl pour les robots d'indexation
                                        </span>
                                    </div>
                                    <a
                                        href="/robots.txt"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="px-3 py-1.5 border border-gray-700 text-gray-300 hover:border-white hover:text-white font-mono text-[10px] font-bold uppercase transition-colors flex items-center gap-1"
                                    >
                                        <ExternalLink size={12} /> OUVRIR ROBOTS.TXT
                                    </a>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

            </form>
        </AdminLayout>
    )
}
