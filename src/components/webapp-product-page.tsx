'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Send, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type ProductPageData = {
  name: string
  subtitle: string
  image: string
  pdfPath: string
  alt: string
  description: string
  highlights: string[]
}

type QuoteStatus = 'idle' | 'loading' | 'success' | 'error'

type ProductFormState = {
  nome: string
  email: string
  telefono: string
  azienda: string
  messaggio: string
}

export function WebAppProductPage({
  name,
  subtitle,
  image,
  pdfPath,
  alt,
  description,
  highlights
}: ProductPageData) {
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
        messaggio: `Richiesta preventivo prodotto: ${name}\nAzienda: ${formData.azienda || 'Non indicata'}\n\n${formData.messaggio}`
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
    <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 text-slate-900">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Link
            href="/webapp"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Torna alle Web Application
          </Link>

          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Web Application</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-5xl">{name}</h1>
            <p className="mt-3 text-base font-medium text-blue-700 sm:text-lg">{subtitle}</p>
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
              aria-label={`Ingrandisci immagine ${name}`}
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
                Clicca per ingrandire
              </span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Descrizione prodotto</h2>
            <p className="mt-3 leading-relaxed text-slate-600">{description}</p>

            <ul className="mt-6 space-y-3">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 sm:text-lg">Presentazione applicativo</h3>
                  <p className="text-sm text-slate-600">Consulta il PDF per una panoramica approfondita del prodotto.</p>
                </div>
                <a
                  href={pdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                >
                  Apri PDF in nuova scheda
                </a>
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
                <iframe
                  title={`Presentazione PDF ${name}`}
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
              <h2 className="text-lg font-bold text-slate-900">Richiedi un preventivo</h2>
              <p className="text-sm text-slate-600">Compila il form per ricevere una proposta su misura.</p>
            </div>
          </div>

          {status === 'success' ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-800">
              Richiesta inviata con successo. Ti ricontatteremo presto con un preventivo per {name}.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                placeholder="Nome e cognome"
                required
                className="border-blue-100 bg-white"
              />
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email aziendale"
                required
                className="border-blue-100 bg-white"
              />
              <Input
                name="telefono"
                type="tel"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="Telefono"
                className="border-blue-100 bg-white"
              />
              <Input
                name="azienda"
                value={formData.azienda}
                onChange={handleChange}
                placeholder="Azienda"
                className="border-blue-100 bg-white"
              />
              <Textarea
                name="messaggio"
                value={formData.messaggio}
                onChange={handleChange}
                placeholder={`Descrivi la tua esigenza su ${name}`}
                required
                rows={5}
                className="border-blue-100 bg-white"
              />

              {status === 'error' && (
                <p className="text-sm text-red-600">Controlla i campi obbligatori e riprova.</p>
              )}

              <Button
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-full bg-blue-700 text-white hover:bg-blue-800"
              >
                {status === 'loading' ? 'Invio in corso...' : 'Invia richiesta di preventivo'}
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
              aria-label="Chiudi immagine ingrandita"
            >
              <X className="h-7 w-7" />
            </button>
            <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
              <Image
                src={image}
                alt={`${alt} - versione ingrandita`}
                width={1920}
                height={1080}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
