'use client'

import Link from 'next/link'
import { useState, useEffect, useId } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

function FlagIT({ className = 'w-6 h-4' }: { className?: string }) {
  return (
    <svg
      className={`${className} rounded-[3px] overflow-hidden shadow-xs ring-1 ring-black/15 shrink-0 block`}
      viewBox="0 0 30 20"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="10" height="20" fill="#009246" />
      <rect x="10" width="10" height="20" fill="#FFFFFF" />
      <rect x="20" width="10" height="20" fill="#CE2B37" />
    </svg>
  )
}

function FlagEN({ className = 'w-6 h-4' }: { className?: string }) {
  const id = useId()
  const clipS = `flag-uk-s-${id}`
  const clipT = `flag-uk-t-${id}`

  return (
    <svg
      className={`${className} rounded-[3px] overflow-hidden shadow-xs ring-1 ring-black/15 shrink-0 block`}
      viewBox="0 0 60 30"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <clipPath id={clipS}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={clipT}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${clipS})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${clipT})`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  )
}

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
    { key: 'download', label: 'Download', href: '/download', hasMenu: true },
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
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-stone-200'
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
                    ? 'border-amber-200 bg-white text-amber-700 hover:bg-amber-50'
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
                  isLightBg ? 'text-zinc-900' : 'text-white'
                }`}
              >
                <span className="hidden lg:inline">SOFTMAINT | Software House</span>
              </span>
            </button>
          </div>

          <div
            className={`pointer-events-none absolute left-1/2 -translate-x-1/2 text-center font-semibold tracking-wide transition-colors duration-300 lg:hidden ${
              isLightBg ? 'text-zinc-900' : 'text-white'
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
                        isLightBg ? 'bg-amber-500' : 'bg-white'
                      }`}
                    />
                  </button>

                  <div className="pointer-events-none absolute left-1/2 top-full z-20 w-52 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-hover/download:pointer-events-auto group-hover/download:opacity-100 group-focus-within/download:pointer-events-auto group-focus-within/download:opacity-100">
                    <div className="rounded-xl border border-stone-100 bg-white p-2 shadow-lg flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={installSupremo}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-amber-700 transition-colors hover:bg-amber-50 cursor-pointer"
                      >
                        {language === 'it' ? 'Installa Supremo' : 'Install Supremo'}
                      </button>
                      <button
                        type="button"
                        onClick={() => scrollTo('/download')}
                        className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 border-t border-slate-100 pt-2 cursor-pointer"
                      >
                        {language === 'it' ? 'Tutti i Download' : 'All Downloads'}
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
                      isLightBg ? 'bg-amber-500' : 'bg-white'
                    }`}
                  />
                </button>
              )
            ))}

            {/* Language Switch */}
            <div
              className={`flex items-center gap-1.5 ml-4 pl-4 border-l ${
                isLightBg ? 'border-stone-200' : 'border-white/20'
              }`}
            >
              <button
                type="button"
                onClick={() => setLanguage('it')}
                title="Italiano"
                aria-label="Italiano"
                className={`p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  language === 'it'
                    ? isLightBg
                      ? 'bg-amber-100/80 ring-2 ring-amber-500 shadow-xs'
                      : 'bg-white/20 ring-2 ring-amber-400 shadow-xs'
                    : isLightBg
                    ? 'opacity-60 hover:opacity-100 hover:bg-gray-100'
                    : 'opacity-60 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <FlagIT className="w-6 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                title="English"
                aria-label="English"
                className={`p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center cursor-pointer ${
                  language === 'en'
                    ? isLightBg
                      ? 'bg-amber-100/80 ring-2 ring-amber-500 shadow-xs'
                      : 'bg-white/20 ring-2 ring-amber-400 shadow-xs'
                    : isLightBg
                    ? 'opacity-60 hover:opacity-100 hover:bg-gray-100'
                    : 'opacity-60 hover:opacity-100 hover:bg-white/10'
                }`}
              >
                <FlagEN className="w-6 h-4" />
              </button>
            </div>

            <Button
              onClick={() => scrollTo('#contatti')}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-900 text-sm px-5 py-2 rounded-full shadow-md transition-all duration-200 hover:scale-105"
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
                  className="text-left text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 hover:text-amber-700 transition-colors block"
                >
                  {link.label}
                </Link>
              ))}

              <button
                type="button"
                onClick={installSupremo}
                className="text-left text-amber-700 font-medium py-2 px-3 rounded-lg hover:bg-amber-50 transition-colors block"
              >
                Installa Supremo
              </button>

              {/* Mobile Language Switch */}
              <div className="flex gap-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setLanguage('it')}
                  className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    language === 'it'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-amber-50'
                  }`}
                  aria-label="Italiano"
                >
                  <FlagIT className="w-5 h-3.5" />
                  <span>Italiano</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    language === 'en'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-amber-50'
                  }`}
                  aria-label="English"
                >
                  <FlagEN className="w-5 h-3.5" />
                  <span>English</span>
                </button>
              </div>

              <Button
                type="button"
                onClick={() => scrollTo('#contatti')}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-full mt-1"
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
