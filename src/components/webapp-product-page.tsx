'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ExternalLink, Globe, Mail, Menu, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

type ProductKey = 'smartLogistica' | 'smartAgenti' | 'smartMail'

type ProductPageData = {
  productKey: ProductKey
  image: string
  pdfPath: string
  alt: string
}

type QuoteStatus = 'idle' | 'loading' | 'success' | 'error'

type ProductFormState = {
  nome: string
  email: string
  telefono: string
  azienda: string
  messaggio: string
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
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
    { label: t.nav.home, href: '/' },
    { label: t.nav.servizi, href: '/#servizi' },
    { label: t.nav.chiSiamo, href: '/#chi-siamo' },
    { label: t.nav.doveSiamo, href: '/#dove-siamo' },
  ]

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-blue-100'
          : 'bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/assets/logo.jpg"
              alt="Logo Softmaint"
              width={170}
              height={50}
              priority
              className="h-9 w-auto rounded-md bg-white p-0"
            />
            <span className="text-xl font-bold tracking-tight text-blue-900">
              SOFT<span className="text-blue-600">MAINT</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 transition-all duration-200 hover:opacity-80 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}

            {/* Language Switch */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-blue-200">
              <button
                onClick={() => setLanguage('it')}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all duration-200 ${
                  language === 'it'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                IT
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`text-xs font-semibold px-2.5 py-1.5 rounded-md transition-all duration-200 ${
                  language === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                EN
              </button>
            </div>

            <Link
              href="/#contatti"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full shadow-md transition-all duration-200 hover:scale-105"
            >
              {t.nav.contattaci}
            </Link>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg transition-colors text-gray-800 hover:bg-gray-100"
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
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-left text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {link.label}
                </Link>
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

              <Link
                href="/#contatti"
                onClick={() => setMobileOpen(false)}
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white rounded-full mt-1 px-4 py-2 font-medium transition-colors"
              >
                {t.nav.contattaci}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const { language } = useLanguage()
  const t = translations[language]
  const year = new Date().getFullYear()

  const navLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.servizi, href: '/#servizi' },
    { label: t.nav.chiSiamo, href: '/#chi-siamo' },
    { label: t.nav.contattaci, href: '/#contatti' },
  ]

  const solutions = [
    'DocFinance',
    'WMS',
    'Web Application',
    'Green Project',
    language === 'it' ? 'Azienda 4.0' : 'Industry 4.0',
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
                SOFT<span className="text-blue-400">MAINT</span>
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
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-blue-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="text-white font-semibold mb-4">{t.footer.soluzioni}</h4>
            <ul className="space-y-2 text-sm">
              {solutions.map((s) => (
                <li key={s}>
                  <Link href="/#servizi" className="hover:text-blue-400 transition-colors">
                    {s}
                  </Link>
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

// ─── WebAppProductPage ────────────────────────────────────────────────────────
export function WebAppProductPage({
  productKey,
  image,
  pdfPath,
  alt,
}: ProductPageData) {
  const { language } = useLanguage()
  const t = translations[language]
  const ui = t.productPageUI
  const product = t.productDetail[productKey]

  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [status, setStatus] = useState<QuoteStatus>('idle')
  const [formData, setFormData] = useState<ProductFormState>({
    nome: '',
    email: '',
    telefono: '',
    azienda: '',
    messaggio: ''
  })

  useEffect(() => {
    if (!isImageModalOpen) return

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsImageModalOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleEscape)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = previousOverflow
    }
  }, [isImageModalOpen])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!formData.nome || !formData.email || !formData.messaggio) {
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const payload = {
        nome: formData.nome,
        email: formData.email,
        telefono: formData.telefono,
        messaggio: `${ui.payloadMsgPre}: ${product.name}\n${ui.payloadAziendaLabel}: ${formData.azienda || ui.payloadAziendaFallback}\n\n${formData.messaggio}`
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        setStatus('error')
        return
      }

      setStatus('success')
      setFormData({ nome: '', email: '', telefono: '', azienda: '', messaggio: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 text-slate-900 pt-16 lg:pt-20">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
              href="/webapp"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              {ui.tornaWebApp}
            </Link>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{ui.badge}</p>
              <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-5xl">{product.name}</h1>
              <p className="mt-3 text-base font-medium text-blue-700 sm:text-lg">{product.subtitle}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-5 lg:px-8">
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:col-span-3">
            <div className="border-b border-slate-200 bg-slate-50 p-3">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="group block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={`${ui.ingrandisciPre} ${product.name}`}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white">
                  <Image
                    src={image}
                    alt={alt}
                    width={1366}
                    height={768}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="mt-2 inline-block text-xs font-medium text-slate-500 transition-colors group-hover:text-blue-700">
                  {ui.clickEnlarge}
                </span>
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{ui.descrizioneLabel}</h2>
              <p className="mt-3 leading-relaxed text-slate-600">{product.description}</p>

              <ul className="mt-6 space-y-3">
                {product.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">{ui.presentazioneLabel}</h3>
                    <p className="text-sm text-slate-600">{ui.presentazioneDesc}</p>
                  </div>
                  <a
                    href={pdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                  >
                    {ui.apriPDF}
                  </a>
                </div>

                <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <iframe
                    title={`${ui.presentazioneLabel} ${product.name}`}
                    src={pdfPath}
                    className="h-135 w-full"
                  />
                </div>
              </div>
            </div>
          </article>

          <aside className="rounded-3xl border border-blue-100 bg-linear-to-br from-blue-50 to-cyan-50 p-6 shadow-sm lg:col-span-2 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">{ui.preventivoTitle}</h2>
                <p className="text-sm text-slate-600">{ui.preventivoDesc}</p>
              </div>
            </div>

            {status === 'success' ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
                {ui.successPre} {product.name}.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <Input
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder={ui.formNome}
                  required
                  className="border-blue-100 bg-white"
                />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={ui.formEmail}
                  required
                  className="border-blue-100 bg-white"
                />
                <Input
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder={ui.formTelefono}
                  className="border-blue-100 bg-white"
                />
                <Input
                  name="azienda"
                  value={formData.azienda}
                  onChange={handleChange}
                  placeholder={ui.formAzienda}
                  className="border-blue-100 bg-white"
                />
                <Textarea
                  name="messaggio"
                  value={formData.messaggio}
                  onChange={handleChange}
                  placeholder={`${ui.formMessaggioPre} ${product.name}`}
                  required
                  rows={5}
                  className="border-blue-100 bg-white"
                />

                {status === 'error' && (
                  <p className="text-sm text-red-600">{ui.formError}</p>
                )}

                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-full bg-blue-700 text-white hover:bg-blue-800"
                >
                  {status === 'loading' ? ui.formLoading : ui.formBtn}
                </Button>
              </form>
            )}
          </aside>
        </section>

        {isImageModalOpen && (
          <div
            onClick={() => setIsImageModalOpen(false)}
            className="fixed inset-0 z-120 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm sm:p-8"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-7xl"
            >
              <button
                type="button"
                onClick={() => setIsImageModalOpen(false)}
                className="absolute -top-11 right-0 rounded-full p-1 text-white/90 transition-colors hover:text-white"
                aria-label={ui.chiudiImmagine}
              >
                <X className="h-7 w-7" />
              </button>
              <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
                <Image
                  src={image}
                  alt={`${alt} - ${ui.ingranditaSuffix}`}
                  width={1920}
                  height={1080}
                  className="h-auto w-full object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
