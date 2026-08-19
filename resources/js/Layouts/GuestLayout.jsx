import { Link } from '@inertiajs/react'
import { Terminal, Shield, ArrowLeft } from 'lucide-react'

export default function GuestLayout({ children, title = 'AUTHENTIFICATION' }) {
    return (
        <div className="min-h-screen bg-[#080808] text-gray-200 flex flex-col justify-center items-center p-4 sm:p-6 font-sans relative selection:bg-primary-500 selection:text-black">
            
            {/* Grille d'arrière plan subtile */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

            {/* Bouton Retour Accueil */}
            <div className="w-full max-w-md mb-6 flex justify-between items-center relative z-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 hover:text-primary-500 transition-colors"
                >
                    <ArrowLeft size={14} /> RETOUR AU SITE
                </Link>

                <div className="flex items-center gap-1.5 font-mono text-[9px] text-gray-600 uppercase tracking-widest">
                    <Shield size={12} className="text-primary-500" />
                    <span>PORTAIL SÉCURISÉ DCA</span>
                </div>
            </div>

            {/* Logo & Titre DCA */}
            <div className="text-center mb-8 relative z-10">
                <Link href="/" className="inline-flex items-center gap-3 group">
                    <div className="w-12 h-12 border border-primary-500 bg-primary-500/10 text-primary-500 flex items-center justify-center font-mono font-bold text-sm shrink-0 group-hover:bg-primary-500 group-hover:text-black transition-all">
                        DCA
                    </div>
                    <div className="text-left">
                        <span className="font-display font-bold text-base tracking-wider uppercase text-white block">
                            DIM'S <span className="text-primary-500 font-mono text-xs">// CREATIVE</span>
                        </span>
                        <span className="text-[9px] font-mono text-gray-500 tracking-widest uppercase block">
                            STUDIO DE DESIGN & IDENTITÉ VISUELLE
                        </span>
                    </div>
                </Link>
            </div>

            {/* Boîte Principale Auth Blueprint */}
            <div className="w-full max-w-md relative z-10">
                <div className="relative border border-gray-800 bg-[#0E0E0E] p-6 sm:p-8 shadow-2xl">
                    {/* Repères techniques aux coins */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary-500"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary-500"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary-500"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary-500"></div>

                    {children}
                </div>

                <p className="text-center font-mono text-[10px] text-gray-600 mt-6 uppercase tracking-widest">
                    DIM'S CREATIVE ACADEMY • FRANCK DIMS • TOUS DROITS RÉSERVÉS
                </p>
            </div>

        </div>
    )
}
