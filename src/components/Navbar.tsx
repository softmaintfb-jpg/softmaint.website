'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

interface NavbarProps {
  isHomepage?: boolean
  backHref?: string
  backLabel?: string
}

export function Navbar({ isHomepage = false, backHref, backLabel }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { language, setLanguage } = useLanguage()
  const t = translations[language]
  const supremoDownloadUrl = 'https://softmaint.it/files/Supremo.exe'

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    const scrollToHashWithOffset = () => {
      if (pathname !== '/' || !window.location.hash) return

      const el = document.querySelector(window.location.hash)
      if (!el) return

      const navOffset = 96
      const y = el.getBoundingClientRect().top + window.scrollY - navOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
    }

    // Ensure hash navigation works after route transitions and hydration.
    const timer = window.setTimeout(scrollToHashWithOffset, 80)
    window.addEventListener('hashchange', scrollToHashWithOffset)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('hashchange', scrollToHashWithOffset)
    }
  }, [pathname])

  const navLinks = [
    { key: 'home', label: t.nav.home, href: '#home' },
    { key: 'servizi', label: t.nav.servizi, href: '#servizi' },
    { key: 'chi-siamo', label: t.nav.chiSiamo, href: '#chi-siamo' },
    { key: 'dove-siamo', label: t.nav.doveSiamo, href: '#dove-siamo' },
    { key: 'download', label: 'Download', href: '#servizi', hasMenu: true },
  ]

  const installSupremo = () => {
    setMobileOpen(false)
    window.location.href = supremoDownloadUrl
  }

  const scrollTo = (href: string) => {
    setMobileOpen(false)

    if (!href.startsWith('#')) {
      window.location.href = href
      return
    }

    const scrollWithOffset = () => {
      const el = document.querySelector(href)
      if (!el) return false

      const navOffset = 96
      const y = el.getBoundingClientRect().top + window.scrollY - navOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      return true
    }

    if (pathname === '/' && scrollWithOffset()) {
      return
    }

    // Se siamo in una pagina interna, vai alla sezione in home.
    // Usa history.pushState per una transizione più pulita
    if (pathname !== '/') {
      window.location.href = `/${href}`
      return
    }

    // Se siamo già in home ma l'elemento non è trovato, prova di nuovo dopo un breve delay
    setTimeout(scrollWithOffset, 100)
  }

  const goHome = () => {
    setMobileOpen(false)
    if (pathname === '/') {
      scrollTo('#home')
      return
    }
    window.location.href = '/#home'
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
          <div className="flex items-center gap-3">
            {backHref && backLabel && (
              <Link
                href={backHref}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isLightBg
                    ? 'border-blue-200 bg-white text-blue-700 hover:bg-blue-50'
                    : 'border-white/35 bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{backLabel}</span>
              </Link>
            )}

            <button onClick={goHome} className="flex items-center gap-2 group">
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
                <span className="hidden lg:inline">SOFTMAINT | Software House</span>
              </span>
            </button>
          </div>

          <div
            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 text-center font-semibold tracking-wide transition-colors duration-300 lg:hidden ${
              isLightBg ? 'text-blue-900' : 'text-white'
            }`}
          >
            <span className="text-[13px] sm:text-sm">Softmaint | Software House</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              link.hasMenu ? (
                <div key={link.key} className="relative group/download">
                  <button
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

                  <div className="pointer-events-none absolute left-1/2 top-full z-20 w-52 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover/download:pointer-events-auto group-hover/download:opacity-100 group-focus-within/download:pointer-events-auto group-focus-within/download:opacity-100">
                    <div className="rounded-xl border border-blue-100 bg-white p-2 shadow-lg">
                      <button
                        type="button"
                        onClick={installSupremo}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50"
                      >
                        Installa Supremo
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  key={link.key}
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
              )
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
            className={`lg:hidden p-2 rounded-lg transition-colors mr-5 ${
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
            className="lg:hidden bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="px-4 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors block"
                >
                  {link.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={installSupremo}
                className="text-left text-blue-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors block"
              >
                Installa Supremo
              </button>

              {/* Mobile Language Switch */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
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
                  type="button"
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
                type="button"
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
