// resources/js/Layouts/MainLayout.jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from '@inertiajs/react'
import { ThemeSelector } from '@/Components/ThemeToggle'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
    { label: 'Accueil',   href: '/' },
    { label: 'Projets',   href: '/projets' },
    { label: 'À propos',  href: '/a-propos' },
    { label: 'Services',  href: '/services' },
    { label: 'Contact',   href: '/contact' },
]

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

export default function MainLayout({ children, currentRoute = '/' }) {
    const [scrolled,    setScrolled]    = useState(false)
    const [mobileOpen,  setMobileOpen]  = useState(false)
    const navRef = useRef(null)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    // Fermer le menu mobile si on clique en dehors
    useEffect(() => {
        const handleClick = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setMobileOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    return (
        <>
            <ReadingProgress />

            {/* ══════════════════════════════════════════════════
                NAVBAR
            ══════════════════════════════════════════════════ */}
            <header
                ref={navRef}
                className={`navbar transition-all duration-300 ${
                    scrolled ? 'scrolled shadow-dark-sm' : ''
                }`}
            >
                <div className="container-main h-full px-4 sm:px-6 flex items-center justify-between gap-8">

                    {/* ── Logo ──────────────────────────────────────── */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 group shrink-0"
                        aria-label="Accueil portfolio"
                    >
                        {/* Monogramme animé */}
                        <span className="relative w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-black text-sm leading-none select-none">VN</span>
                            <span className="absolute inset-0 bg-primary-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="absolute inset-0 flex items-center justify-center text-white font-black text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">VN</span>
                        </span>
                        <span className="font-display font-bold text-base-primary text-sm tracking-tight">
                            Votre <span className="text-gradient">Nom</span>
                        </span>
                    </Link>

                    {/* ── Navigation desktop ────────────────────────── */}
                    <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
                        {NAV_LINKS.map((link) => {
                            const isActive = currentRoute === link.href
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`relative px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 group
                                        ${isActive
                                            ? 'text-primary-500'
                                            : 'text-base-secondary hover:text-base-primary hover:bg-muted'
                                        }`}
                                >
                                    {link.label}
                                    {/* Indicateur actif */}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-500" />
                                    )}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* ── Actions droite ────────────────────────────── */}
                    <div className="flex items-center gap-2">
                        <ThemeSelector />

                        <Link
                            href="/contact"
                            className="hidden sm:inline-flex btn-primary btn-sm"
                        >
                            Travailler ensemble
                        </Link>

                        {/* Burger mobile */}
                        <button
                            className="md:hidden btn-ghost p-2 rounded-lg"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* ── Menu mobile ───────────────────────────────────── */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${
                    mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
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

            {/* ══════════════════════════════════════════════════
                CONTENU PRINCIPAL
            ══════════════════════════════════════════════════ */}
            <main className="pt-16">
                {children}
            </main>

            {/* ══════════════════════════════════════════════════
                FOOTER
            ══════════════════════════════════════════════════ */}
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
                                    <a href="mailto:hello@votreportfolio.com" className="hover:text-primary-500 transition-colors">
                                        franckdimitrio009@gmail.com
                                    </a>
                                </li>
                                <li>Yaoundé, Cameroun</li>
                                <li>Disponible pour projets freelance</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-base pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-base-subtle">
                            © {new Date().getFullYear()} Dim's Design. Tous droits réservés.
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