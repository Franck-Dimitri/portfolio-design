// resources/js/Components/Header.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ThemeSelector } from '@/Components/ThemeToggle';
import { Menu, X, LassoSelect, ChevronRight } from 'lucide-react';

const NAV_LINKS = [
    { label: 'ACCUEIL',   href: '/' },
    { label: 'PROJETS',   href: '/projets' },
    { label: 'À PROPOS',  href: '/a-propos' },
    { label: 'SERVICES',  href: '/services' },
    { label: 'PACKS',     href: '/packages' },
    { label: 'BLOG',      href: '/blog' },
];

function ReadingProgress() {
    const [progress, setProgress] = useState(0);
    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const max = el.scrollHeight - el.clientHeight;
            setProgress(max > 0 ? (el.scrollTop / max) * 100 : 0);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);
    return (
        <div
            className="fixed top-0 left-0 z-[60] h-[2px] bg-primary-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
        />
    );
}

export default function Header() {
    const { url } = usePage();
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handleClick = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setMobileOpen(false);
            }
        }; 
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const isActive = (href) => {
        if (href === '/') {
            return url === '/';
        }
        return url.startsWith(href);
    };

    return (
        <>
            <ReadingProgress />

            <header ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${scrolled ? 'bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-gray-200 dark:border-gray-800 shadow-sm' : 'bg-transparent border-transparent'}`}>
                <div className="container-main h-16 px-4 sm:px-6 flex items-center justify-between">
                    
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group shrink-0" aria-label="Accueil">
                        <span className="w-8 h-8 border border-primary-500 flex items-center justify-center bg-primary-500/10 text-primary-500 group-hover:bg-primary-500 group-hover:text-black transition-colors">
                            <LassoSelect size={16} />
                        </span>
                        <span className='font-display font-bold text-gray-900 dark:text-white uppercase tracking-wider text-sm sm:text-base'>
                            DIM'S <span className='text-primary-500 font-mono font-normal text-xs'>// CREATIVE</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className='hidden lg:flex items-center gap-1 h-full' aria-label="Navigation principale">
                        {NAV_LINKS.map((link) => {
                            const active = isActive(link.href);
                            return (
                                <Link 
                                    key={link.href} 
                                    href={link.href} 
                                    className={`relative px-4 h-full flex items-center text-[10px] font-mono font-bold tracking-widest transition-colors uppercase group ${
                                        active ? 'text-primary-500' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                                    }`}
                                >
                                    {link.label}
                                    {/* Tech indicator */}
                                    {active && (
                                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-500" />
                                    )}
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary-500/50 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                                </Link>
                            );
                        })}
                        <Link 
                            href="/contact" 
                            className="ml-4 px-4 py-2 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] text-gray-900 dark:text-white text-[10px] font-mono font-bold tracking-widest uppercase hover:border-primary-500 transition-colors flex items-center gap-2 group"
                        >
                            CONTACT <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </nav>
                    
                    {/* Right Actions */}
                    <div className='flex items-center gap-3'>
                        <ThemeSelector />
                        <button
                            className='lg:hidden flex items-center justify-center w-10 h-10 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#161616] text-gray-900 dark:text-white'
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label="Menu"
                        >
                            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
                        </button>
                    </div>
                   
                </div>

                {/* Mobile Menu */}
                <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-gray-800 ${
                    mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0 border-transparent'
                }`}>
                    <div className="px-4 py-6">
                        <nav className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => {
                                const active = isActive(link.href);
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={`px-4 py-3 text-[10px] font-mono font-bold tracking-widest uppercase border transition-colors flex items-center justify-between ${
                                            active 
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 text-primary-500' 
                                                : 'border-transparent text-gray-500 hover:bg-gray-50 dark:hover:bg-[#161616] hover:text-gray-900 dark:hover:text-white'
                                        }`}
                                    >
                                        {link.label}
                                        {active && <span className="w-1.5 h-1.5 bg-primary-500"></span>}
                                    </Link>
                                );
                            })}
                            <Link 
                                href="/contact" 
                                className="mt-4 px-4 py-3 bg-primary-500 text-black text-[10px] font-mono font-bold tracking-widest uppercase flex items-center justify-between"
                                onClick={() => setMobileOpen(false)}
                            >
                                TRANSMETTRE UNE REQUÊTE <ChevronRight size={14} />
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
        </>
    );
}