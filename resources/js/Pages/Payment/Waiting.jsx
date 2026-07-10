import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Clock, Shield, Smartphone, ArrowLeft, CheckCircle, XCircle, AlertCircle, Terminal, RefreshCw } from 'lucide-react';
import axios from 'axios';

export default function Waiting({ payment, reference, redirectUrl }) {
    const [status, setStatus] = useState('pending');
    const [countdown, setCountdown] = useState(120);
    const [checkCount, setCheckCount] = useState(0);
    const { flash } = usePage().props;

    useEffect(() => {
        const interval = setInterval(() => {
            setCheckCount(prev => prev + 1);
            
            axios.get(`/payment/check/${reference}`)
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
                return <RefreshCw className="w-16 h-16 text-yellow-500 animate-spin-slow" />;
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
                    title: 'ATTENTE DE CONFIRMATION',
                    description: 'Veuillez valider le prompt USSD sur votre appareil mobile. Le système interroge la passerelle...',
                    color: 'yellow'
                };
            case 'success':
                return {
                    title: 'TRANSACTION VALIDÉE',
                    description: 'Votre paiement a été traité avec succès. Initialisation des services...',
                    color: 'green'
                };
            case 'failed':
                return {
                    title: 'ÉCHEC DE LA TRANSACTION',
                    description: 'Le paiement n\'a pas pu être traité ou a expiré.',
                    color: 'red'
                };
            default:
                return {
                    title: 'DIAGNOSTIC EN COURS',
                    description: 'Analyse du statut de la transaction...',
                    color: 'gray'
                };
        }
    };

    const statusInfo = getStatusMessage();

    return (
        <MainLayout>
            <Head title="Traitement du Paiement | Console" />

            <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-800 dark:text-gray-300 transition-colors duration-300">
                <div className="container-main max-w-3xl mx-auto px-4 py-8">
                    
                    {/* Header */}
                    <header className="mb-8">
                        <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest mb-6">
                            <span className="text-gray-400 dark:text-gray-600">SYS &gt;</span>
                            <span className="text-primary-500">PAIEMENT</span>
                            <span className="text-gray-400 dark:text-gray-600">&gt;</span>
                            <span className="text-gray-500 animate-pulse">ATTENTE</span>
                        </div>
                        <h1 className="text-4xl font-bold font-display text-gray-900 dark:text-white leading-tight mb-2 tracking-tight uppercase">
                            TRAITEMENT EN COURS
                        </h1>
                        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">
                            Ne fermez pas cette fenêtre
                        </p>
                    </header>

                    {flash?.error && (
                        <div className="mb-6 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/10 text-red-700 dark:text-red-400 font-mono text-xs uppercase tracking-wider">
                            [ERREUR] {flash.error}
                        </div>
                    )}
                    {flash?.info && (
                        <div className="mb-6 p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-400 font-mono text-xs uppercase tracking-wider">
                            [SYSTÈME] {flash.info}
                        </div>
                    )}

                    <div className="bg-white dark:bg-[#111] rounded border border-gray-200 dark:border-gray-800 relative shadow-xl overflow-hidden">
                        {/* Blueprint Corner */}
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-primary-500 z-10 m-2"></div>
                        
                        <div className="p-8">
                            
                            {/* Main Status Display */}
                            <div className="text-center py-8 border-b border-gray-200 dark:border-gray-800">
                                <div className="flex justify-center mb-6">
                                    {getStatusIcon()}
                                </div>
                                <h2 className={`text-2xl font-bold font-display uppercase tracking-wider mb-3 ${
                                    status === 'pending' ? 'text-yellow-600 dark:text-yellow-500' :
                                    status === 'success' ? 'text-green-600 dark:text-green-500' :
                                    status === 'failed' ? 'text-red-600 dark:text-red-500' :
                                    'text-gray-600 dark:text-gray-400'
                                }`}>
                                    {statusInfo.title}
                                </h2>
                                <p className="text-sm font-mono text-gray-500 max-w-md mx-auto uppercase leading-relaxed">
                                    {statusInfo.description}
                                </p>
                            </div>

                            {/* Data Table (Terminal Style) */}
                            <div className="py-8 grid gap-4">
                                <h3 className="flex items-center gap-2 text-[10px] font-mono font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-2">
                                    <Terminal size={14} className="text-primary-500" />
                                    Données de Transaction
                                </h3>
                                
                                <div className="bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 p-4 rounded font-mono text-xs">
                                    <div className="grid grid-cols-2 gap-y-4">
                                        <div className="text-gray-500 uppercase tracking-widest">Référence ID:</div>
                                        <div className="text-gray-900 dark:text-white font-bold">{reference}</div>
                                        
                                        <div className="text-gray-500 uppercase tracking-widest">Opérateur:</div>
                                        <div className="text-gray-900 dark:text-white">{paymentMethodLabel.toUpperCase()}</div>
                                        
                                        <div className="text-gray-500 uppercase tracking-widest">Montant Autorisé:</div>
                                        <div className="text-primary-500 font-bold">{payment.amount.toLocaleString()} {payment.currency}</div>
                                        
                                        <div className="text-gray-500 uppercase tracking-widest">Statut Logique:</div>
                                        <div>
                                            <span className={`px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded ${
                                                status === 'pending' ? 'text-yellow-600 dark:text-yellow-500' :
                                                status === 'success' ? 'text-green-600 dark:text-green-500' :
                                                'text-red-600 dark:text-red-500'
                                            }`}>
                                                {status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress & Countdown */}
                            {status === 'pending' && (
                                <div className="space-y-4 py-4 border-t border-gray-200 dark:border-gray-800">
                                    <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest">
                                        <span className="text-gray-500">Timeout Requis</span>
                                        <span className="font-bold text-primary-500">
                                            {countdown} SECONDES
                                        </span>
                                    </div>
                                    <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                        <div 
                                            className="h-full bg-primary-500 transition-all duration-1000 ease-linear"
                                            style={{ width: `${(countdown / 120) * 100}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                        <span>Ping: {checkCount}</span>
                                        <span className="animate-pulse">ÉCOUTE DU RÉSEAU...</span>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                                {status === 'pending' ? (
                                    <>
                                        <button
                                            onClick={() => window.location.href = '/'}
                                            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded font-mono text-xs font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <ArrowLeft size={14} />
                                            ANNULER
                                        </button>
                                        <button
                                            onClick={() => {
                                                axios.get(`/payment/check/${reference}`)
                                                    .then(response => {
                                                        setStatus(response.data.status);
                                                    });
                                            }}
                                            className="flex-1 flex items-center justify-center gap-2 bg-primary-500 text-[#0A0A0A] py-3 px-4 rounded font-mono text-xs font-bold uppercase tracking-widest hover:bg-primary-400 transition-colors"
                                        >
                                            <RefreshCw size={14} />
                                            FORCER ACTUALISATION
                                        </button>
                                    </>
                                ) : status === 'success' ? (
                                    <button
                                        onClick={() => window.location.href = '/admin/dashboard'}
                                        className="w-full bg-primary-500 text-[#0A0A0A] py-3 px-4 rounded font-mono text-xs font-bold uppercase tracking-widest hover:bg-primary-400 transition-colors text-center block"
                                    >
                                        ACCÉDER AU TABLEAU DE BORD
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="w-full border border-primary-500 text-primary-500 py-3 px-4 rounded font-mono text-xs font-bold uppercase tracking-widest hover:bg-primary-500 hover:text-[#0A0A0A] transition-colors"
                                    >
                                        RECOMMENCER LA PROCÉDURE
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
            
            <style jsx global>{`
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
            `}</style>
        </MainLayout>
    );
}