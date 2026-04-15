// resources/js/Pages/Home.jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from '@inertiajs/react'
import { ThemeSelector } from '@/Components/ThemeToggle'

import {
    ArrowRight, ExternalLink, Sparkles, Eye,
    Layers, Palette, Zap, Award, ChevronDown,
    Star, ArrowUpRight, Menu, X, LucideSwatchBook, LassoSelect
} from 'lucide-react'


const NAV_LINKS = [
    { label: 'Accueil',   href: '/' },
    { label: 'Projets',   href: '/projets' },
    { label: 'À propos',  href: '/a-propos' },
    { label: 'Services',  href: '/services' },
    { label: 'Blog',  href: '/blog' },
    { label: 'Contact',   href: '/contact' },
]

const currentRoute = '/'
/* ── Indicateur de progression de lecture ──────────────────────── */
function ReadingProgress() {
    const [progress, setProgress] = useState(0)
    useEffect(() => {
        const onScroll = () => {
            const el  = document.documentElement
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
 
export default function Header(){
    //
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    const navRef = useRef(null)

    useEffect(() =>{
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // fermer le mobile si on clique en dehors 
    useEffect(() => {
        const handleClick = (e) => {
            if (navRef.current  && !navRef.current.contains(e.target)){
                setMobileOpen(false)
            }
        } 
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <>
            <ReadingProgress />

            <header ref={navRef} className={`navbar transition-all duration-300 ${scrolled ? 'scrolled shadow-dark-sm' : ''}`}>
                <div className="container-main h-full px-4 sm:px-6 flex items-center justify-between gap-8">
                    <Link href="/" className="flex items-center gap-1 group shrink-0" arial-label ="Acceuil du site">
                        {/* Monograme */}
                        <span className="relative w-8 h-8 rounded-lg  flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                            <span className='font-black text-sm text-primary-400 leading-none select-none'><LassoSelect/></span>
                            <span className="absolute inset-0 bg-primary-500 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="absolute inset-0  text-white flex items-center justify-center font-black text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 text-gradient"><LassoSelect/></span>
                        </span>
                        <span className='font-display font-bold text-base-primary tracking-tight'>
                            Dim's <span className='text-gradient'>Design</span>
                        </span>
                    </Link>

                    {/*Navigation desktop*/}
                    <nav className='hidden md:flex items-center gap-1 ' arial-label="navigation principale">
                        {NAV_LINKS.map((link) => {
                            const isActive = currentRoute === link.href
                            return (
                                <Link key={link.href} href={link.href} className={`relative px-3 py-1.5 text-sm font-meduim rounded-lg transition-all duration-200 group ${isActive ? 'text-primary-500' : 'text-base-secondary hover:text-base-primary hover:bg-muted'}`}>
                                    {link.label}

                                    {isActive && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500"/>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                    {/* action de droite */}
                    <div className='flex items-center gap-2'>
                        <ThemeSelector />
                        <button
                            className='md:hidden btn-gost p-s rounded-lg'
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="menu"
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20}/> }
                            
                        </button>
                    </div>
                </div>

                 <div className={`md:hidden transition-all duration-300 overflow-hidden ${
                    mobileOpen ? 'max-h-96 opacity-100 bg-[var(--bg-muted)]' : 'max-h-0 opacity-0'
                }`}>
                    <nav className="px-4 pb-4 pt-2 flex flex-col gap-1 border-t border-base">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-3 py-2.5 text-sm font-medium text-base-secondary hover:text-primary-500 rounded-lg hover:bg-muted transition-all duration-200"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link href="/contact" className="btn-primary mt-2 text-center">
                            Travailler ensemble
                        </Link>
                    </nav>
                </div>
            </header>
        </>
    )
}