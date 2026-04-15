// resources/js/Layouts/MainLayout.jsx
import { useEffect, useRef, useState } from 'react'
import { Link } from '@inertiajs/react'
import Header from '@/Components/Header'
import Footer from '@/Components/Footer'



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
            <Header />
                <main className="pt-16">
                    {children}
                </main>
            <Footer/>
        </>
    )
}