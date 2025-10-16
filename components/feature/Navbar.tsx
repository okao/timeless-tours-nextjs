// components/feature/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import LanguagePicker from '@/components/base/LanguagePicker';
import { useLanguage } from '@/contexts/LanguageContext';

const mobileMenuVariants = {
  hidden: { opacity: 0, y: -16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.28, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.97,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5, transition: { duration: 0.22, ease: 'easeOut' as const } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: 'easeIn' as const } },
};

const menuContentStagger = {
  hidden: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const menuItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.24, ease: 'easeOut' as const },
  },
};

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<Array<{ key: string; path: string; label: string; isCta: boolean }>>([]);
  const pathname = usePathname();
  const { getText, currentLanguage, setCurrentLanguage } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadNavigation() {
      try {
        const res = await fetch('/api/navigation');
        if (!res.ok) throw new Error('Failed to load navigation');
        const data = await res.json();
        if (isMounted) {
          const mapped = data.map((i: { key: string; path: string; label?: string; isCta?: boolean }) => ({ 
            key: i.key, 
            path: i.path, 
            label: i.label ?? i.key, 
            isCta: !!i.isCta 
          }));
          setNavItems(mapped);
        }
      } catch {
        if (!isMounted) return;
        setNavItems([
          { key: 'home', path: '/', label: 'Home', isCta: false },
          { key: 'tours', path: '/tours', label: 'Tours', isCta: false },
          { key: 'about', path: '/about', label: 'About', isCta: false },
          { key: 'testimonials', path: '/testimonials', label: 'Testimonials', isCta: false },
          { key: 'faq', path: '/faq', label: 'FAQ', isCta: false },
          { key: 'contact', path: '/contact', label: 'Contact', isCta: false },
          { key: 'book_now', path: '/contact', label: 'Book Now', isCta: true },
        ]);
      }
    }

    loadNavigation();
    return () => {
      isMounted = false;
    };
  }, []);

  const regularItems = navItems.filter(i => !i.isCta);
  const ctaItem = navItems.find(i => i.isCta);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2 hover:scale-105 transition-transform">
            <span style={{ fontFamily: 'Pacifico, serif' }} className={`text-2xl font-bold transition-all duration-500 ${
              isScrolled ? 'text-slate-800' : 'text-white'
            } font-pacifico`}>
              Timeless Tours
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {regularItems.map((item) => (
              <Link
                key={item.key}
                href={item.path}
                className={`font-medium transition-all duration-300 hover:text-teal-600 hover:scale-105 ${
                  pathname === item.path
                    ? 'text-teal-600'
                    : isScrolled
                    ? 'text-slate-700'
                    : 'text-white'
                }`}
              >
                {getText(`navbar.${item.key}`, item.label)}
              </Link>
            ))}
            
            <div className="flex items-center">
              <LanguagePicker />
            </div>
            
            {ctaItem && (
              <Link
                href={ctaItem.path}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 hover:-translate-y-1 hover:shadow-lg whitespace-nowrap ${
                  isScrolled
                    ? 'bg-teal-600 text-white hover:bg-teal-700'
                    : 'bg-white text-slate-800 hover:bg-gray-100'
                }`}
              >
                {getText(`navbar.${ctaItem.key}`, ctaItem.label)}
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-200 ${
              isScrolled
                ? 'border-slate-300 bg-transparent text-slate-800 hover:bg-slate-100/60'
                : 'border-white/70 bg-transparent text-white hover:bg-white/10'
            }`}
            aria-label="Toggle navigation"
          >
            <i className={`ri-${isMobileMenuOpen ? 'close' : 'menu'}-line text-lg`}></i>
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence initial={false}>
          {isMobileMenuOpen && (
            <>
              <motion.button
                type="button"
                aria-label="Close navigation overlay"
                className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm md:hidden"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setIsMobileMenuOpen(false);
                }}
              />
              <motion.div
                className="md:hidden fixed z-50 -translate-x-1/2 left-1/2 rounded-[24px] border border-white/60 bg-white/95 backdrop-blur-[22px] shadow-[0_28px_70px_rgba(15,23,42,0.18)] overflow-hidden"
                style={{
                  top: isScrolled ? 68 : 104,
                  width: 'min(24rem, calc(100vw - 2.5rem))',
                  boxShadow: '0 24px 70px rgba(15,23,42,0.18)',
                }}
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <motion.div variants={menuContentStagger} initial="hidden" animate="visible" exit="hidden">
                  <motion.div
                    className="px-5 py-4 border-b border-slate-200 bg-white/90"
                    variants={menuItemVariants}
                  >
                    <div className="text-sm font-medium text-slate-500 mb-3">Language</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { code: 'en', name: 'EN', flag: '🇺🇸' },
                        { code: 'zh', name: '中文', flag: '🇨🇳' },
                        { code: 'it', name: 'IT', flag: '🇮🇹' },
                        { code: 'es', name: 'ES', flag: '🇪🇸' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setCurrentLanguage(lang.code);
                            localStorage.setItem('selectedLanguage', lang.code);
                            window.dispatchEvent(new CustomEvent('languageChanged', { 
                              detail: { language: lang.code } 
                            }));
                            setIsMobileMenuOpen(false);
                          }}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            currentLanguage === lang.code
                              ? 'bg-teal-100 text-teal-700 shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={menuContentStagger} className="py-2 bg-white/80">
                    {regularItems.map((item) => (
                      <motion.div key={item.key} variants={menuItemVariants}>
                        <Link
                          href={item.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`block px-5 py-3 text-slate-700 hover:text-teal-600 hover:bg-slate-100 transition-all duration-300 ${
                            pathname === item.path ? 'text-teal-600 bg-slate-100' : ''
                          }`}
                        >
                          {getText(`navbar.${item.key}`, item.label)}
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>

                  {ctaItem && (
                    <motion.div className="px-5 pb-5 pt-1 bg-white/90" variants={menuItemVariants}>
                      <Link
                        href={ctaItem.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full px-6 py-3 bg-teal-500 text-white text-center rounded-full hover:bg-teal-400 transition-all duration-300 whitespace-nowrap shadow-[0_12px_24px_rgba(13,148,136,0.35)]"
                      >
                        {getText(`navbar.${ctaItem.key}`, ctaItem.label)}
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
