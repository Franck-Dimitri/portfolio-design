import { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import SEOHead from '@/Components/SEOHead';
import { CreditCard, Shield, Zap, Package, ArrowLeft, Terminal } from 'lucide-react';

export default function Create({ type, item, durations, title, flash }) {
    const { data, setData, post, processing, errors } = useForm({
        duration_months: durations[0] || 1,
        phone_number: '',
        operator: 'MTN',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const url = type === 'package' 
            ? `/packages/${item.slug}/souscrire` 
            : `/services/${item.slug}/souscrire`;
        
        post(url, {
            preserveScroll: true,
        });
    };

    const totalAmount = type === 'package' 
        ? item.prix * data.duration_months 
        : item.prix;

    const getIcon = () => {
        if (type === 'package') return <Package className="w-12 h-12 text-primary-500" />;
        return <Zap className="w-12 h-12 text-primary-500" />;
    };

    return (
        <MainLayout>
            <SEOHead 
                title={title}
                description={`Souscrivez à notre ${type === 'package' ? 'pack' : 'service'} ${item.titre || item.nom}`}
            />
            
            <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-800 dark:text-gray-300 transition-colors duration-300">
                <div className="container-main max-w-4xl mx-auto px-4 py-8">
                    
                    {/* Header Section */}
                    <header className="mb-8">
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
                            <Link href="/" className="text-primary-500 hover:text-primary-400">ACCUEIL</Link>
                            <span className="text-gray-400 dark:text-gray-600">&gt;</span>
                            <span className="text-gray-500">SOUSCRIPTION</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold font-display text-gray-900 dark:text-white leading-tight mb-4 tracking-tight uppercase">
                            PROCÉDURE DE SOUSCRIPTION
                        </h1>
                    </header>

                    {/* Main Container */}
                    <div className="bg-white dark:bg-[#111] rounded border border-gray-200 dark:border-gray-800 relative overflow-hidden shadow-xl">
                        {/* Blueprint Corner */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary-500 z-10"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary-500 z-10"></div>

                        {/* Top Bar */}
                        <div className="bg-gray-100 dark:bg-[#161616] p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4">
                            {getIcon()}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">{title}</h2>
                                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mt-1">
                                    {type === 'package' ? 'MODULE: PACK' : 'MODULE: SERVICE'}
                                </p>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Détails de l'élément */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="border border-gray-200 dark:border-gray-800 p-4 rounded bg-gray-50 dark:bg-[#161616]">
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Désignation</p>
                                    <p className="font-bold text-gray-900 dark:text-white uppercase">{item.titre || item.nom}</p>
                                </div>
                                <div className="border border-gray-200 dark:border-gray-800 p-4 rounded bg-gray-50 dark:bg-[#161616]">
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Valeur Unitaire</p>
                                    <p className="font-bold text-primary-500">
                                        {item.prix.toLocaleString()} FCFA
                                        {type === 'package' && <span className="text-xs font-mono text-gray-500 ml-1">/ MOIS</span>}
                                    </p>
                                </div>
                            </div>

                            {/* Sélection de la durée */}
                            {type === 'package' && durations.length > 1 && (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                    <label className="flex items-center gap-2 text-xs font-mono font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-4">
                                        <Terminal size={14} className="text-primary-500" />
                                        Durée d'engagement
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {durations.map((duration) => {
                                            const isSelected = data.duration_months === duration;
                                            const total = item.prix * duration;
                                            
                                            return (
                                                <button
                                                    key={duration}
                                                    type="button"
                                                    onClick={() => setData('duration_months', duration)}
                                                    className={`p-4 rounded border transition-all text-left relative overflow-hidden ${
                                                        isSelected
                                                            ? 'border-primary-500 bg-primary-500/5 dark:bg-primary-900/20'
                                                            : 'border-gray-200 dark:border-gray-800 hover:border-primary-400/50'
                                                    }`}
                                                >
                                                    {isSelected && <div className="absolute top-0 right-0 w-2 h-full bg-primary-500" />}
                                                    <div className="font-bold text-lg text-gray-900 dark:text-white uppercase">
                                                        {duration} MOIS
                                                    </div>
                                                    <div className="text-xs font-mono text-gray-500 mt-1"> 
                                                        {total.toLocaleString()} FCFA
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Formulaire & Résumé */}
                            <form onSubmit={handleSubmit} className="pt-8 border-t border-gray-200 dark:border-gray-800">
                                
                                {/* Messages */}
                                {flash?.error && (
                                    <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 font-mono text-xs uppercase tracking-wider">
                                        [ERREUR] {flash.error}
                                    </div>
                                )}
                                {flash?.info && (
                                    <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 font-mono text-xs uppercase tracking-wider">
                                        [INFO] {flash.info}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-[1fr_300px] gap-8">
                                    
                                    {/* Inputs */}
                                    <div className="space-y-6">
                                        <h3 className="flex items-center gap-2 text-xs font-mono font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-4">
                                            <CreditCard size={14} className="text-primary-500" />
                                            Données de Facturation
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                                                    Réseau Mobile Money
                                                </label>
                                                <select
                                                    value={data.operator}
                                                    onChange={(e) => setData('operator', e.target.value)}
                                                    className="w-full bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors uppercase font-mono"
                                                    required
                                                >
                                                    <option value="MTN">MTN Mobile Money</option>
                                                    <option value="ORANGE">Orange Money</option>
                                                </select>
                                                {errors.operator && <p className="text-xs text-red-500 mt-1 font-mono uppercase">{errors.operator}</p>}
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                                                    Numéro de Compte
                                                </label>
                                                <input
                                                    type="tel"
                                                    value={data.phone_number}
                                                    onChange={(e) => setData('phone_number', e.target.value)}
                                                    placeholder="6XXXXXXXX"
                                                    className="w-full bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors font-mono"
                                                    required
                                                />
                                                <p className="text-[10px] text-gray-500 mt-2 font-mono uppercase tracking-wider">
                                                    Format Requis: 6XXXXXXXX (9 Chiffres)
                                                </p>
                                                {errors.phone_number && <p className="text-xs text-red-500 mt-1 font-mono uppercase">{errors.phone_number}</p>}
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-gray-800 rounded">
                                            <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-1">
                                                    Protocole Sécurisé
                                                </p>
                                                <p className="text-[11px] font-mono text-gray-500 uppercase leading-relaxed">
                                                    Une notification push sera envoyée sur votre appareil mobile. Entrez votre code PIN pour valider la transaction de manière sécurisée.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Résumé & Bouton */}
                                    <div className="bg-gray-100 dark:bg-[#0A0A0A] p-6 rounded border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
                                        <div>
                                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Montant Total Évalué</p>
                                            <p className="text-3xl font-bold text-primary-500 font-display">
                                                {totalAmount.toLocaleString()} <span className="text-xl">FCFA</span>
                                            </p>
                                            <p className="text-[10px] font-mono text-gray-500 uppercase mt-4 border-t border-gray-200 dark:border-gray-800 pt-4">
                                                Engagement: {type === 'package' ? `${data.duration_months} MOIS` : 'SERVICE UNIQUE'}
                                            </p>
                                        </div>
                                        
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="mt-8 w-full bg-primary-500 text-[#0A0A0A] font-bold font-mono text-sm uppercase tracking-widest py-4 px-4 rounded flex items-center justify-center gap-2 hover:bg-primary-400 transition-colors disabled:opacity-50 group"
                                        >
                                            {processing ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"></span>
                                                    TRAITEMENT...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2 group-hover:scale-105 transition-transform">
                                                    <Zap size={16} />
                                                    SOUMETTRE
                                                </span>
                                            )}
                                        </button>
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}