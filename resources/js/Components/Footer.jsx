// resources/js/Layouts/MainLayout.jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from '@inertiajs/react'
import Header from '@/Components/Header'


const NAV_LINKS = [
    { label: 'Accueil',   href: '/' },
    { label: 'Projets',   href: '/projets' },
    { label: 'À propos',  href: '/a-propos' },
    { label: 'Services',  href: '/services' },
    { label: 'Contact',   href: '/contact' },
]

export default function Footer(){
    return (
        <>
                        <footer className="bg-subtle border-t border-base mt-32">
                            <div className="container-main px-4 sm:px-6 py-12">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            
                                    {/* Brand */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="w-7 h-7 rounded-lg bg-primary-500 flex items-center justify-center">
                                                <span className="text-white font-black text-xs">VN</span>
                                            </span>
                                            <span className="font-display font-bold text-base-primary">Franck Dimitri</span>
                                        </div>
                                        <p className="text-sm text-base-muted leading-relaxed max-w-xs">
                                            Designer graphique freelance, passionné par les identités visuelles
                                            qui racontent une histoire.
                                        </p>
                                    </div>
            
                                    {/* Navigation */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-base-primary mb-4 uppercase tracking-wider">Navigation</h3>
                                        <ul className="space-y-2">
                                            {NAV_LINKS.map((link) => (
                                                <li key={link.href}>
                                                    <Link href={link.href} className="text-sm text-base-muted hover:text-primary-500 transition-colors">
                                                        {link.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
            
                                    {/* Contact */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-base-primary mb-4 uppercase tracking-wider">Contact</h3>
                                        <ul className="space-y-2 text-sm text-base-muted">
                                            <li>
                                                <a href="mailto:dims.creative.academy@gmail.com" className="hover:text-primary-500 transition-colors">
                                                    dims.creative.academy@gmail.com
                                                </a>
                                            </li>
                                            <li>Yaoundé, Cameroun</li>
                                            <li>Disponible pour projets freelance</li>
                                        </ul>
                                    </div>
                                </div>
            
                                <div className="border-t border-base pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <p className="text-xs text-base-subtle">
                                        © {new Date().getFullYear()} Dim's Creative Academy. Tous droits réservés.
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-base-subtle">
                                        <Link href="/mentions-legales" className="hover:text-primary-500 transition-colors">Mentions légales</Link>
                                        <Link href="/politique-confidentialite" className="hover:text-primary-500 transition-colors">Confidentialité</Link>
                                    </div>
                                </div>
                            </div>
                        </footer>
        </>
    )
}