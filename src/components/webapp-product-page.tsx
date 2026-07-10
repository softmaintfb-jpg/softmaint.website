'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Send, X } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'
import { phonePattern } from '@/lib/validators'

type ProductKey = 'smartLogistica' | 'smartAgenti' | 'smartMail' | 'smartProduzione' | 'smartB2B' | 'smartTentataVendita'

type ProductPageData = {
  productKey: ProductKey
  image: string
  pdfPath?: string
  videoPath?: string
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

// ─── WebAppProductPage ────────────────────────────────────────────────────────
export function WebAppProductPage({
  productKey,
  image,
  pdfPath,
  videoPath,
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
      <Navbar backHref="/webapp" backLabel={ui.tornaWebApp} />
      <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 text-slate-900 pt-16 lg:pt-20">
        <section className="relative overflow-hidden border-b border-slate-200 bg-white">
          <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-amber-100 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-yellow-100 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">{ui.badge}</p>
              <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-5xl">{product.name}</h1>
              <p className="mt-3 max-w-4xl text-base font-medium text-amber-600 sm:text-lg">{product.subtitle}</p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-12 lg:items-start lg:px-8">
          <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:col-span-8">
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
                <span className="mt-2 inline-block text-xs font-medium text-slate-500 transition-colors group-hover:text-amber-600">
                  {ui.clickEnlarge}
                </span>
              </button>
            </div>

            {videoPath && (
              <div className="border-b border-slate-200 bg-white p-4 sm:p-6">
                <div className="mb-3">
                  <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{ui.videoLabel}</h2>
                  <p className="mt-1 text-sm text-slate-600">{ui.videoDesc}</p>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-950">
                  <video
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-video w-full"
                  >
                    <source src={videoPath} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}

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

              {pdfPath && (
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
                      className="inline-flex items-center justify-center rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-50"
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
              )}
            </div>
          </article>

          <aside className="rounded-3xl border border-amber-100 bg-linear-to-br from-amber-50 to-yellow-50 p-6 shadow-sm sm:p-8 lg:col-span-4 lg:sticky lg:top-24">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
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
                  className="border-amber-100 bg-white"
                />
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={ui.formEmail}
                  required
                  className="border-amber-100 bg-white"
                />
                <Input
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder={ui.formTelefono}
                  pattern={phonePattern}
                  className="border-amber-100 bg-white"
                />
                <Input
                  name="azienda"
                  value={formData.azienda}
                  onChange={handleChange}
                  placeholder={ui.formAzienda}
                  className="border-amber-100 bg-white"
                />
                <Textarea
                  name="messaggio"
                  value={formData.messaggio}
                  onChange={handleChange}
                  placeholder={`${ui.formMessaggioPre} ${product.name}`}
                  required
                  rows={5}
                  className="border-amber-100 bg-white"
                />

                {status === 'error' && (
                  <p className="text-sm text-red-600">{ui.formError}</p>
                )}

                <Button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-full bg-amber-500 text-zinc-900 hover:bg-amber-400"
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
