// resources/js/Components/Footer.jsx
import { Link } from '@inertiajs/react';
import { LassoSelect } from 'lucide-react';

const NAV_LINKS = [
    { label: 'ACCUEIL',   href: '/' },
    { label: 'PROJETS',   href: '/projets' },
    { label: 'À PROPOS',  href: '/a-propos' },
    { label: 'SERVICES',  href: '/services' },
    { label: 'PACKS',     href: '/packages' },
    { label: 'BLOG',      href: '/blog' },
    { label: 'CONTACT',   href: '/contact' },
];

export default function Footer() {
    return (
        <footer className="relative bg-[#0A0A0A] border-t border-gray-800 mt-20 overflow-hidden text-gray-400">
            {/* Blueprint Grid Background */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none z-0"></div>
            
            {/* Massive Background Text */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none z-0 flex justify-center translate-y-1/4">
                <span className="text-[15vw] font-display font-black text-gray-800 opacity-20 whitespace-nowrap leading-none tracking-tighter">
                    MR DIM'S
                </span>
            </div>

            <div className="container-main px-4 sm:px-6 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="w-8 h-8 border border-primary-500 flex items-center justify-center bg-primary-500/10 text-primary-500">
                                <LassoSelect size={16} />
                            </span>
                            <span className="font-display font-bold text-white uppercase tracking-wider">DIM'S CREATIVE</span>
                        </div>
                        <p className="text-sm font-sans text-gray-500 leading-relaxed max-w-sm mb-6">
                            Système de design, architecture de marque et interfaces numériques. 
                            Conception structurée pour un impact maximal.
                        </p>
                        
                        <div className="flex flex-col gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-500">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary-500 shrink-0" />
                                +237 676 383 986
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary-500 shrink-0" />
                                dims.creative.academy@gmail.com
                            </span>
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-primary-500 shrink-0" />
                                Yaoundé, Cameroun
                            </span>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="text-[10px] font-mono font-bold text-white mb-6 uppercase tracking-widest border-b border-gray-800 pb-2">
                            Index Plateforme
                        </h3>
                        <ul className="space-y-3">
                            {NAV_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link 
                                        href={link.href} 
                                        className="text-xs font-mono text-gray-500 hover:text-primary-500 transition-colors uppercase tracking-widest flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-px bg-primary-500 group-hover:w-3 transition-all"></span>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Légal */}
                    <div>
                        <h3 className="text-[10px] font-mono font-bold text-white mb-6 uppercase tracking-widest border-b border-gray-800 pb-2">
                            Légal & Ressources
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/mentions-legales" className="text-xs font-mono text-gray-500 hover:text-primary-500 transition-colors uppercase tracking-widest flex items-center gap-2 group">
                                    <span className="w-0 h-px bg-primary-500 group-hover:w-3 transition-all"></span>
                                    Mentions légales
                                </Link>
                            </li>
                            <li>
                                <Link href="/politique-confidentialite" className="text-xs font-mono text-gray-500 hover:text-primary-500 transition-colors uppercase tracking-widest flex items-center gap-2 group">
                                    <span className="w-0 h-px bg-primary-500 group-hover:w-3 transition-all"></span>
                                    Confidentialité
                                </Link>
                            </li>
                            <li>
                                <span className="text-xs font-mono text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-3 h-px bg-gray-800"></span>
                                    Design System
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-widest text-gray-600">
                    <p>
                        © {new Date().getFullYear()} DIM'S CREATIVE ACADEMY. TOUS DROITS RÉSERVÉS.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            SYSTÈME OPÉRATIONNEL
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}