'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

interface NavbarProps {
  isHomepage?: boolean
}

export function Navbar({ isHomepage = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { language, setLanguage } = useLanguage()
  const t = translations[language]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.servizi, href: '#servizi' },
    { label: t.nav.chiSiamo, href: '#chi-siamo' },
    { label: t.nav.doveSiamo, href: '#dove-siamo' },
  ]

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else if (!href.startsWith('/')) {
      // Se l'elemento non esiste e il link è un anchor, vai alla home con l'anchor
      window.location.href = '/' + href
    }
  }

  // Determina lo stile in base se siamo sulla homepage o altrove
  const isLightBg = isHomepage ? scrolled : true

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLightBg
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-blue-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => scrollTo('#home')} className="flex items-center gap-2 group">
            <Image
              src="/assets/logo.jpg"
              alt="Logo Softmaint"
              width={170}
              height={50}
              priority
              className={`h-9 w-auto rounded-md transition-all duration-300 ${
                isLightBg ? 'bg-white p-0' : 'bg-white/95 p-1'
              }`}
            />
            <span
              className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                isLightBg ? 'text-blue-900' : 'text-white'
              }`}
            >
              SOFTMAINT | Software House
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`text-sm font-medium transition-all duration-200 hover:opacity-80 relative group ${
                  isLightBg ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                    isLightBg ? 'bg-blue-600' : 'bg-white'
                  }`}
                />
              </button>
            ))}

            {/* Language Switch */}
            <div
              className={`flex items-center gap-2 ml-4 pl-4 border-l ${
                isLightBg ? 'border-blue-200' : 'border-white/20'
              }`}
            >
              <button
                onClick={() => setLanguage('it')}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all duration-200 ${
                  language === 'it'
                    ? isLightBg
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-900'
                    : isLightBg
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                IT
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all duration-200 ${
                  language === 'en'
                    ? isLightBg
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-900'
                    : isLightBg
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                EN
              </button>
            </div>

            <Button
              onClick={() => scrollTo('#contatti')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full shadow-md transition-all duration-200 hover:scale-105"
            >
              {t.nav.contattaci}
            </Button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isLightBg ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {link.label}
                </button>
              ))}

              {/* Mobile Language Switch */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  onClick={() => setLanguage('it')}
                  className={`flex-1 text-sm font-semibold px-2 py-2 rounded-lg transition-all duration-200 ${
                    language === 'it'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  IT
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 text-sm font-semibold px-2 py-2 rounded-lg transition-all duration-200 ${
                    language === 'en'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  EN
                </button>
              </div>

              <Button
                onClick={() => scrollTo('#contatti')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full mt-1"
              >
                {t.nav.contattaci}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
