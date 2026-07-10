import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { XCircle, RefreshCw, PhoneCall } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';

export default function Failed() {
    return (
        <MainLayout>
            <SEOHead title="Échec du Paiement | Console" />

            <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-800 dark:text-gray-300 transition-colors duration-300 flex flex-col justify-center">
                <div className="container-main max-w-2xl mx-auto px-4">
                    
                    <div className="bg-white dark:bg-[#111] rounded border border-red-500 relative shadow-2xl overflow-hidden">
                        {/* Blueprint Corner */}
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-red-500 z-10 m-2"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-red-500 z-10 m-2"></div>

                        <div className="p-10 text-center">
                            
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-red-500 blur-xl opacity-20 rounded-full"></div>
                                    <XCircle className="w-24 h-24 text-red-500 relative z-10" />
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white leading-tight mb-4 tracking-tight uppercase">
                                TRANSACTION REJETÉE
                            </h1>
                            
                            <div className="bg-red-50 dark:bg-[#161616] border border-red-100 dark:border-red-900/30 p-4 rounded mb-8 text-left max-w-md mx-auto">
                                <p className="text-xs font-mono text-red-800 dark:text-red-400 uppercase tracking-widest mb-2 font-bold">
                                    Causes Probables :
                                </p>
                                <ul className="text-[11px] font-mono text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
                                    <li>Délai de confirmation dépassé sur le mobile</li>
                                    <li>Fonds insuffisants sur le compte sélectionné</li>
                                    <li>Code PIN incorrect ou transaction annulée</li>
                                    <li>Instabilité temporaire du réseau opérateur</li>
                                </ul>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href="/services"
                                    className="flex items-center justify-center gap-2 bg-red-500 text-white dark:text-[#0A0A0A] py-4 px-6 rounded font-mono text-xs font-bold uppercase tracking-widest hover:bg-red-400 transition-colors"
                                >
                                    <RefreshCw size={16} />
                                    NOUVELLE TENTATIVE
                                </Link>
                                <Link
                                    href="/contact"
                                    className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-4 px-6 rounded font-mono text-xs font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <PhoneCall size={16} />
                                    SUPPORT TECHNIQUE
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
