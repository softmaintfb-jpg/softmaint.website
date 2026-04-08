'use client'

import Image from 'next/image'
import { ExternalLink, Globe, Mail } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

export function Footer() {
  const { language } = useLanguage()
  const t = translations[language]
  const year = new Date().getFullYear()

  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const navLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.servizi, href: '#servizi' },
    { label: t.nav.chiSiamo, href: '#chi-siamo' },
    { label: t.nav.contattaci, href: '#contatti' },
  ]

  const solutions = [
    'DocFinance',
    'ERP',
    'Web Application',
    language === 'it' ? 'Azienda 4.0 | 5.0' : 'Industry 4.0 | 5.0',
  ]

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/assets/logo.jpg"
                alt="Logo Softmaint"
                width={170}
                height={50}
                className="h-10 w-auto rounded-md bg-white p-1"
              />
              <span className="text-xl font-bold text-white">
                Softmaint | Software House
              </span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              {t.footer.descrizione}
            </p>
            <div className="flex gap-3 mt-5">
              {[ExternalLink, Globe, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.navigazione}</h4>
            <ul className="space-y-2 text-sm">
              {navLinks.map(link => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Soluzioni */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.soluzioni}</h4>
            <ul className="space-y-2 text-sm">
              {solutions.map(s => (
                <li key={s}>
                  <button
                    onClick={() => scrollTo('#servizi')}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {year} {t.footer.copyright}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-400 transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-blue-400 transition-colors">{t.footer.cookie}</a>
            <span className="text-gray-600">{t.footer.piva}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
