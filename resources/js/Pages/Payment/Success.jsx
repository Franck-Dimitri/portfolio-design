import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { CheckCircle, ArrowRight, LayoutDashboard } from 'lucide-react';
import SEOHead from '@/Components/SEOHead';

export default function Success() {
    return (
        <MainLayout>
            <SEOHead title="Paiement Réussi | Console" />

            <div className="pt-24 pb-16 min-h-screen bg-gray-50 dark:bg-[#0A0A0A] text-gray-800 dark:text-gray-300 transition-colors duration-300 flex flex-col justify-center">
                <div className="container-main max-w-2xl mx-auto px-4">
                    
                    <div className="bg-white dark:bg-[#111] rounded border border-green-500 relative shadow-2xl overflow-hidden">
                        {/* Blueprint Corner */}
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-green-500 z-10 m-2"></div>
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-green-500 z-10 m-2"></div>

                        <div className="p-10 text-center">
                            
                            <div className="flex justify-center mb-8">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-green-500 blur-xl opacity-20 rounded-full"></div>
                                    <CheckCircle className="w-24 h-24 text-green-500 relative z-10" />
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold font-display text-gray-900 dark:text-white leading-tight mb-4 tracking-tight uppercase">
                                TRANSACTION VALIDÉE
                            </h1>
                            
                            <p className="text-sm font-mono text-gray-500 max-w-md mx-auto uppercase leading-relaxed mb-10">
                                Le paiement a été traité avec succès par la passerelle. Vos services sont désormais actifs et configurés dans votre espace.
                            </p>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href="/admin/dashboard"
                                    className="flex items-center justify-center gap-2 bg-green-500 text-white dark:text-[#0A0A0A] py-4 px-6 rounded font-mono text-xs font-bold uppercase tracking-widest hover:bg-green-400 transition-colors"
                                >
                                    <LayoutDashboard size={16} />
                                    ESPACE D'ADMINISTRATION
                                </Link>
                                <Link
                                    href="/"
                                    className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 py-4 px-6 rounded font-mono text-xs font-bold uppercase tracking-widest hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    RETOUR À L'ACCUEIL
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
