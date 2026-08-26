'use client'

import Image from 'next/image'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

export function Footer() {
  const { language } = useLanguage()
  const t = translations[language]
  const year = new Date().getFullYear()

  const scrollTo = (href: string) => {
    if (href.startsWith('/')) {
      window.location.href = href
      return
    }
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = `/${href}`
    }
  }

  const navLinks = [
    { label: t.nav.home, href: '#home' },
    { label: t.nav.servizi, href: '#servizi' },
    { label: t.nav.chiSiamo, href: '#chi-siamo' },
    { label: t.nav.contattaci, href: '#contatti' },
    { label: 'Download', href: '/download' },
    { label: 'WebTicket', href: '/webticket' },
  ]

  const solutions = [
    { label: 'DocFinance', href: '/pages/docFinance' },
    { label: 'Gestionale ERP', href: '#servizi' },
    { label: 'Web Application', href: '/pages/webapp' },
    { label: language === 'it' ? 'Azienda 4.0 | 5.0' : 'Industry 4.0 | 5.0', href: '/pages/azienda4' },
    { label: 'Smart BI', href: '/pages/smartbi' },
  ]

  const googleMapsUrl = 'https://maps.google.com/maps?q=40.9321462,14.5257608'

  return (
    <footer className="bg-zinc-950 text-stone-400 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-zinc-800/80">
          {/* Brand & Dati Principali */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/logo.jpg"
                alt="Logo Softmaint"
                width={170}
                height={50}
                className="h-10 w-auto rounded-md bg-white p-1"
              />
              <span className="text-xl font-bold text-white tracking-tight">
                Softmaint | Software House
              </span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400 max-w-sm">
              {t.footer.descrizione}
            </p>
            {/* <div className="pt-2 text-xs text-zinc-500 font-medium">
              <span>{t.footer.piva}</span>
            </div> */}
          </div>

          {/* Dati Anagrafici & Contatti */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider">
              {t.footer.contattiTitle}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-zinc-300 hover:text-amber-400 transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-colors shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-xs text-zinc-500 block uppercase font-medium">
                      {language === 'it' ? 'Sede' : 'Location'}
                    </span>
                    <span className="leading-snug block">{t.footer.indirizzo}</span>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="tel:+390818232059"
                  className="flex items-center gap-3 text-zinc-300 hover:text-amber-400 transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-colors shrink-0">
                    <Phone className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-xs text-zinc-500 block uppercase font-medium">
                      {language === 'it' ? 'Telefono' : 'Phone'}
                    </span>
                    <span className="font-medium">{t.footer.telefono}</span>
                  </div>
                </a>
              </li>

              <li>
                <a
                  href="mailto:info@softmaint.it"
                  className="flex items-center gap-3 text-zinc-300 hover:text-amber-400 transition-colors group"
                >
                  <span className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500 group-hover:border-amber-500/40 group-hover:bg-amber-500/10 transition-colors shrink-0">
                    <Mail className="w-4 h-4" />
                  </span>
                  <div>
                    <span className="text-xs text-zinc-500 block uppercase font-medium">Email</span>
                    <span className="font-medium">{t.footer.email}</span>
                  </div>
                </a>
              </li>

              <li className="flex items-center gap-3 text-zinc-400 pt-1">
                <span className="w-8 h-8 rounded-lg bg-zinc-900/50 border border-zinc-800/60 flex items-center justify-center text-zinc-500 shrink-0">
                  <Clock className="w-4 h-4" />
                </span>
                <span className="text-xs">{t.footer.orari}</span>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t.footer.navigazione}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Soluzioni */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t.footer.soluzioni}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {solutions.map((s) => (
                <li key={s.label}>
                  <button
                    onClick={() => scrollTo(s.href)}
                    className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                  >
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>&copy; {year} {t.footer.copyright}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-amber-400 transition-colors">{t.footer.privacy}</a>
            <a href="#" className="hover:text-amber-400 transition-colors">{t.footer.cookie}</a>
            <span className="text-zinc-600 border-l border-zinc-800 pl-4">{t.footer.piva}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
