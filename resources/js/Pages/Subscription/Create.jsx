// resources/js/Pages/Subscription/Create.jsx

import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { CreditCard, Shield, Zap, Package } from 'lucide-react';

export default function Create({ type, item, durations, title, flash }) {
    // On garde uniquement 'step' en état indépendant si tu prévois plusieurs étapes plus tard
    const [step, setStep] = useState(1); 

    // Toutes les données du formulaire sont maintenant centralisées dans useForm
    const { data, setData, post, processing, errors } = useForm({
        duration_months: durations[0] || 1,
        phone_number: '',
        operator: 'MTN',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Dynamisme de l'URL selon le type (package ou service)
        const url = type === 'package' 
            ? `/packages/${item.slug}/souscrire` 
            : `/services/${item.slug}/souscrire`;
        
        post(url, {
            preserveScroll: true,
            onSuccess: () => {
                // Redirigé vers le paiement automatiquement par le backend
            },
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
            <div className="pt-24 min-h-screen bg-gradient-to-b from-muted/30 to-background">
                <div className="container-main max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-elevated rounded-2xl shadow-lg overflow-hidden border border-base">
                        {/* En-tête */}
                        <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/5 p-6 border-b border-base">
                            <div className="flex items-center gap-4">
                                {getIcon()}
                                <div>
                                    <h1 className="text-2xl font-bold text-base-primary">{title}</h1>
                                    <p className="text-base-muted">
                                        {type === 'package' ? 'Pack de design' : 'Service de design'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Détails du pack/service */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                                <div>
                                    <p className="text-sm text-base-muted">Nom</p>
                                    <p className="font-semibold text-base-primary">{item.titre || item.nom}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-base-muted">Prix unitaire</p>
                                    <p className="font-semibold text-primary-500">
                                        {item.prix.toLocaleString()} FCFA
                                        {type === 'package' && <span className="text-sm font-normal text-base-muted"> / mois</span>}
                                    </p>
                                </div>
                            </div>

                            {/* Sélection de la durée (pour les packs) */}
                            {type === 'package' && durations.length > 1 && (
                                <div>
                                    <label className="block text-sm font-medium text-base-primary mb-2">
                                        Durée de la souscription
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {durations.map((duration) => {
                                            const isSelected = data.duration_months === duration;
                                            const total = item.prix * duration;
                                            
                                            return (
                                                <button
                                                    key={duration}
                                                    type="button"
                                                    onClick={() => setData('duration_months', duration)}
                                                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                                                        isSelected
                                                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 ring-2 ring-primary-500/20 animate-bounce'
                                                            : 'border-base hover:border-primary-300'
                                                    }`}
                                                >
                                                    <div className="font-semibold text-base-primary">
                                                        {duration} mois
                                                    </div>
                                                    <div className="text-sm text-base-muted"> 
                                                        {total.toLocaleString()} FCFA
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Résumé */}
                            <div className="p-4 bg-primary-50 dark:bg-primary-950/20 rounded-xl border border-primary-200 dark:border-primary-800">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-sm text-base-muted">Total à payer</p>
                                        <p className="text-2xl font-bold text-primary-500">
                                            {totalAmount.toLocaleString()} FCFA
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-base-muted">
                                            {type === 'package' ? `${data.duration_months} mois` : 'Service unique'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Formulaire de paiement */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                               {/* AJOUTE CE BLOC ICI : */}
                                {flash?.error && (
                                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium animate-pulse text-center">
                                        ❌ {flash.error}
                                    </div>
                                )}
                                {flash?.info && (
                                    <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm font-medium">
                                        ℹ️ {flash.info}
                                    </div>
                                )}
                                <div className="border-t border-base pt-4">
                                    <h3 className="font-semibold text-base-primary mb-3">
                                        Informations de paiement
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-base-primary mb-1">
                                                Opérateur Mobile Money
                                            </label>
                                            <select
                                                value={data.operator}
                                                onChange={(e) => setData('operator', e.target.value)}
                                                className="w-full rounded-xl border border-base bg-background px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                                                required
                                            >
                                                <option value="MTN">MTN Mobile Money</option>
                                                <option value="ORANGE">Orange Money</option>
                                            </select>
                                            {errors.operator && <p className="text-sm text-red-500 mt-1">{errors.operator}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-base-primary mb-1">
                                                Numéro de téléphone
                                            </label>
                                            <input
                                                type="tel"
                                                value={data.phone_number}
                                                onChange={(e) => setData('phone_number', e.target.value)}
                                                placeholder="6XXXXXXXX"
                                                className="w-full rounded-xl border border-base bg-background px-4 py-2 focus:border-primary-500 focus:ring-primary-500"
                                                required
                                            />
                                            <p className="text-xs text-base-muted mt-1">
                                                Format: 6XXXXXXXX (9 chiffres)
                                            </p>
                                            {errors.phone_number && <p className="text-sm text-red-500 mt-1">{errors.phone_number}</p>}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                                    <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                                            Paiement sécurisé
                                        </p>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-500">
                                            Vous recevrez un prompt sur votre téléphone pour confirmer le paiement.
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full btn btn-primary py-4 text-base font-semibold transition-all duration-300 hover:scale-[1.02]"
                                >
                                    {processing ? (
                                        <span className="flex items-center gap-2 justify-center">
                                            <span className="animate-spin">⏳</span>
                                            Traitement en cours...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            <CreditCard size={18} />
                                            Payer {totalAmount.toLocaleString()} FCFA
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}