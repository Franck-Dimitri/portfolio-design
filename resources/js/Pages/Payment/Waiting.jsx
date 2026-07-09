import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Clock, Shield, Smartphone, ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

export default function Waiting({ payment, reference, redirectUrl }) {
    const [status, setStatus] = useState('pending');
    const [countdown, setCountdown] = useState(120);
    const [checkCount, setCheckCount] = useState(0);
    const { flash } = usePage().props;

    // Vérifier le statut du paiement toutes les 5 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            setCheckCount(prev => prev + 1);
            
            axios.get(`/payment/check-status/${reference}`)
                .then(response => {
                    const newStatus = response.data.status;
                    setStatus(newStatus);
                    
                    if (newStatus === 'success') {
                        window.location.href = redirectUrl || '/payment/success';
                    } else if (newStatus === 'failed') {
                        window.location.href = '/payment/failed';
                    }
                })
                .catch(error => {
                    console.error('Erreur lors de la vérification:', error);
                });
        }, 5000);

        // Compte à rebours
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(interval);
            clearInterval(timer);
        };
    }, [reference, redirectUrl]);

    // Rediriger automatiquement après le compte à rebours si toujours en attente
    useEffect(() => {
        if (countdown === 0 && status === 'pending') {
            window.location.href = '/payment/failed';
        }
    }, [countdown, status]);

    const paymentMethodLabel = {
        momo: 'MTN Mobile Money',
        om: 'Orange Money',
        card: 'Carte Bancaire'
    }[payment.payment_method] || payment.payment_method;

    const getStatusIcon = () => {
        switch (status) {
            case 'pending':
                return <Clock className="w-16 h-16 text-yellow-500 animate-pulse" />;
            case 'success':
                return <CheckCircle className="w-16 h-16 text-green-500" />;
            case 'failed':
                return <XCircle className="w-16 h-16 text-red-500" />;
            default:
                return <AlertCircle className="w-16 h-16 text-gray-500" />;
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'pending':
                return {
                    title: 'Confirmation en cours',
                    description: 'Veuillez confirmer le paiement sur votre téléphone. Vous serez redirigé automatiquement.',
                    color: 'yellow'
                };
            case 'success':
                return {
                    title: 'Paiement réussi !',
                    description: 'Votre souscription a été activée avec succès.',
                    color: 'green'
                };
            case 'failed':
                return {
                    title: 'Paiement échoué',
                    description: 'Le paiement n\'a pas pu être traité. Veuillez réessayer.',
                    color: 'red'
                };
            default:
                return {
                    title: 'Vérification en cours',
                    description: 'Nous vérifions le statut de votre paiement...',
                    color: 'gray'
                };
        }
    };

    const statusInfo = getStatusMessage();

    return (
        <MainLayout>
            <Head title="Confirmation de paiement" />

            <div className="pt-24 min-h-screen bg-gradient-to-b from-muted/30 to-background">
                <div className="container-main max-w-2xl mx-auto px-4 py-8">
                    {/* Message flash */}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium text-center">
                            ❌ {flash.error}
                        </div>
                    )}

                    <div className="bg-elevated rounded-2xl shadow-lg overflow-hidden border border-base">
                        {/* En-tête */}
                        <div className="bg-gradient-to-r from-primary-500/10 to-primary-600/5 p-6 border-b border-base">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full">
                                    <Smartphone className="w-6 h-6 text-primary-500" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-base-primary">
                                        Confirmation de paiement
                                    </h1>
                                    <p className="text-base-muted">
                                        Vérification en cours
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Statut principal */}
                            <div className="text-center py-6">
                                <div className="flex justify-center mb-4">
                                    {getStatusIcon()}
                                </div>
                                <h2 className={`text-2xl font-bold mb-2 ${
                                    status === 'pending' ? 'text-yellow-600' :
                                    status === 'success' ? 'text-green-600' :
                                    status === 'failed' ? 'text-red-600' :
                                    'text-gray-600'
                                }`}>
                                    {statusInfo.title}
                                </h2>
                                <p className="text-base-muted max-w-md mx-auto">
                                    {statusInfo.description}
                                </p>
                            </div>

                            {/* Détails du paiement */}
                            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs text-base-muted">Référence</p>
                                        <p className="text-sm font-mono font-semibold text-base-primary">
                                            {reference}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-base-muted">Montant</p>
                                        <p className="text-sm font-bold text-primary-500">
                                            {payment.amount.toLocaleString()} {payment.currency}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-base-muted">Méthode</p>
                                        <p className="text-sm font-semibold text-base-primary">
                                            {paymentMethodLabel}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-base-muted">Statut</p>
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                                            status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            status === 'success' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {status === 'pending' ? 'En attente' :
                                             status === 'success' ? 'Réussi' :
                                             'Échoué'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Barre de progression (temps restant) */}
                            {status === 'pending' && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-base-muted">Temps restant</span>
                                        <span className="font-semibold text-base-primary">
                                            {countdown} secondes
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-1000 ease-linear rounded-full"
                                            style={{ width: `${(countdown / 120) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-base-muted text-center">
                                        {checkCount > 0 && `Vérification ${checkCount} fois`}
                                    </p>
                                </div>
                            )}

                            {/* Instructions */}
                            {status === 'pending' && (
                                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-blue-800 dark:text-blue-400">
                                            Instructions
                                        </p>
                                        <ul className="text-sm text-blue-700 dark:text-blue-500 space-y-1 list-disc list-inside">
                                            <li>Vérifiez votre téléphone pour confirmer le paiement</li>
                                            <li>Entrez votre code PIN Mobile Money</li>
                                            <li>Attendez la confirmation automatique</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Boutons d'action */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-base">
                                {status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => window.location.href = '/'}
                                            className="flex-1 btn btn-secondary"
                                        >
                                            <ArrowLeft size={18} className="mr-2" />
                                            Retour à l'accueil
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Forcer une vérification manuelle
                                                axios.get(`/payment/check-status/${reference}`)
                                                    .then(response => {
                                                        setStatus(response.data.status);
                                                    });
                                            }}
                                            className="flex-1 btn btn-primary"
                                        >
                                            <Clock size={18} className="mr-2" />
                                            Vérifier maintenant
                                        </button>
                                    </>
                                ) : status === 'success' ? (
                                    <button
                                        onClick={() => window.location.href = '/dashboard'}
                                        className="w-full btn btn-primary"
                                    >
                                        Voir mon tableau de bord
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="w-full btn btn-primary"
                                    >
                                        Réessayer
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-xs text-base-muted">
                            Une question ? Contactez notre support
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}