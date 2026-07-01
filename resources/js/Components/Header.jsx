// resources/js/Components/Header.jsx
import { useEffect, useRef, useState } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { ThemeSelector } from '@/Components/ThemeToggle'
import { User } from 'lucide-react'
import {
    ArrowRight, ExternalLink, Sparkles, Eye,
    Layers, Palette, Zap, Award, ChevronDown,
    Star, ArrowUpRight, Menu, X, LucideSwatchBook, LassoSelect
} from 'lucide-react'

const NAV_LINKS = [
    { label: 'Accueil',   href: '/' },
    { label: 'Projets',   href: '/projects' },
    { label: 'À propos',  href: '/a-propos' },
    { label: 'Services',  href: '/services' },
    { label: 'Packs creation',  href: '/packages' },
    { label: 'Blog',      href: '/blog' },
    { label: 'Contact',   href: '/contact' },
]

function ReadingProgress() {
    const [progress, setProgress] = useState(0)
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement
            const max = el.scrollHeight - el.clientHeight
            setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])
    return (
        <div
            className="fixed top-0 left-0 z-[60] h-[2px] bg-gradient-to-r from-primary-600 via-primary-500 to-primary-300 transition-all duration-100"
            style={{ width: `${progress}%` }}
        />
    )
}

export default function Header() {
    const { url } = usePage()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const navRef = useRef(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const handleClick = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setMobileOpen(false)
            }
        } 
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    const isActive = (href) => {
        if (href === '/') {
            return url === '/'
        }
        return url.startsWith(href)
    }

    return (
        <>
            <ReadingProgress />

            <header ref={navRef} className={`navbar transition-all duration-300 ${scrolled ? 'scrolled shadow-dark-sm' : ''}`}>
                <div className="container-main h-full px-4 sm:px-6 flex items-center justify-between gap-4">
                    {/* Logo - Version responsive */}
                    <Link href="/" className="flex items-center gap-1 group shrink-0" aria-label="Accueil du site">
                        <span className="relative w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                            <span className='font-black text-sm text-primary-400 leading-none select-none'>
                                <LassoSelect size={18} />
                            </span>
                            <span className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="absolute inset-0 text-white flex items-center justify-center font-black text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                <LassoSelect size={18} />
                            </span>
                        </span>
                        {/* ✅ Texte responsive avec taille réduite sur mobile */}
                        <span className='font-display font-bold text-base-primary tracking-tight text-sm sm:text-base'>
                            Dim's <span className='text-gradient'>Creative Academy</span>
                        </span>
                    </Link>

                    {/* Navigation desktop - masquée sur mobile */}
                    <nav className='hidden lg:flex items-center gap-1' aria-label="navigation principale">
                        {NAV_LINKS.map((link) => {
                            const active = isActive(link.href)
                            return (
                                <Link 
                                    key={link.href} 
                                    href={link.href} 
                                    className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 group 
                                        ${active ? 'text-primary-500' : 'text-base-secondary hover:text-base-primary hover:bg-muted'}`}
                                >
                                    {link.label}
                                    {active && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500"/>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                    
                  
                    
                    {/* Actions de droite */}
                    <div className='flex items-center gap-2'>
                        <ThemeSelector />
                        <button
                            className='lg:hidden btn-ghost p-2 rounded-lg'
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="menu"
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                   
                </div>

                {/* ✅ Menu mobile - corrigé pour ne pas déborder */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                    mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="px-4 pb-6 pt-4 bg-base border-t border-base">
                        <nav className="flex flex-col gap-1">
                            {NAV_LINKS.map((link) => {
                                const active = isActive(link.href)
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                                            ${active 
                                                ? 'text-primary-500 bg-primary-500/10' 
                                                : 'text-base-secondary hover:text-primary-500 hover:bg-muted'
                                            }`}
                                    >
                                        {link.label}
                                    </Link>
                                )
                            })}
                            <Link 
                                href="/contact" 
                                className="btn-primary mt-3 text-center justify-center"
                                onClick={() => setMobileOpen(false)}
                            >
                                Travailler ensemble
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    )
}