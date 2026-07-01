'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

// ─── WebApp Page Content ──────────────────────────────────────────────────────
export default function WebAppPageContent() {
	const { language } = useLanguage()
	const t = translations[language]
	const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
	const [pdfPageCounts, setPdfPageCounts] = useState<Record<string, number>>({})
	const [activeSlideByApp, setActiveSlideByApp] = useState<Record<string, number>>({})
	const assetVersion = '20260402'

	const webApps = useMemo(() => [
		{
			id: 'smart-logistica',
			route: '/smartlogistica',
			image: `/assets/logistica.png?v=${assetVersion}`,
			pdfPath: '/assets/pdf/logistica.pdf',
			alt: 'Panoramica Smart Logistica con flussi OVC OAF, LP LPF e DDT RCF',
			name: t.webappPage.smartLogistica.name,
			subtitle: t.webappPage.smartLogistica.subtitle,
			description: t.webappPage.smartLogistica.description,
			highlights: [
				t.webappPage.smartLogistica.h1,
				t.webappPage.smartLogistica.h2,
				t.webappPage.smartLogistica.h3,
			],
		},
		{
			id: 'smart-agenti',
			route: '/smartagenti',
			image: `/assets/agenti.png?v=${assetVersion}`,
			pdfPath: '/assets/pdf/agenti.pdf',
			alt: 'Schermata Smart Agenti con ordini, CRM, storico e monitoraggio credito',
			name: t.webappPage.smartAgenti.name,
			subtitle: t.webappPage.smartAgenti.subtitle,
			description: t.webappPage.smartAgenti.description,
			highlights: [
				t.webappPage.smartAgenti.h1,
				t.webappPage.smartAgenti.h2,
				t.webappPage.smartAgenti.h3,
			],
		},
		{
			id: 'smart-mail',
			route: '/smartmail',
			image: `/assets/smartmail.png?v=${assetVersion}`,
			pdfPath: '/assets/pdf/mail.pdf',
			alt: 'Panoramica Smart Mail con regole automatiche, trigger e comunicazioni personalizzate',
			name: t.webappPage.smartMail.name,
			subtitle: t.webappPage.smartMail.subtitle,
			description: t.webappPage.smartMail.description,
			highlights: [
				t.webappPage.smartMail.h1,
				t.webappPage.smartMail.h2,
				t.webappPage.smartMail.h3,
			],
		},
		{
			id: 'smartb2b',
			route: '/smartb2b',
			image: `/assets/smartb2b.png?v=${assetVersion}`,
			pdfPath: '/assets/pdf/smartb2b.pdf',
			alt: 'Panoramica Smart B2B con ordini, CRM, storico e monitoraggio credito',
			name: t.webappPage.smartB2B.name,
			subtitle: t.webappPage.smartB2B.subtitle,
			description: t.webappPage.smartB2B.description,
			highlights: [
				t.webappPage.smartB2B.h1,
				t.webappPage.smartB2B.h2,
				t.webappPage.smartB2B.h3,
			],
		},
		{
			id: 'smart-produzione',
			route: '/smartproduzione',
			image: `/assets/smartproduzione.png?v=${assetVersion}`,
			pdfPath: '/assets/pdf/produzione.pdf',
			alt: 'Panoramica Smart Produzione con ODL, monitoraggio avanzamento e tracciabilita qualita',
			name: t.webappPage.smartProduzione.name,
			subtitle: t.webappPage.smartProduzione.subtitle,
			description: t.webappPage.smartProduzione.description,
			highlights: [
				t.webappPage.smartProduzione.h1,
				t.webappPage.smartProduzione.h2,
				t.webappPage.smartProduzione.h3,
			],
		},
		{
			id: 'smart-tentatavendita',
			route: '/smarttentatavendita',
			image: `/assets/tentata_vendita.png?v=${assetVersion}`,
			pdfPath: '/assets/pdf/tentata_vendita.pdf',
			alt: 'Panoramica Smart Tentata Vendita con ODL, monitoraggio avanzamento e tracciabilita qualita',
			name: t.webappPage.smartTentataVendita.name,
			subtitle: t.webappPage.smartTentataVendita.subtitle,
			description: t.webappPage.smartTentataVendita.description,
			highlights: [
				t.webappPage.smartTentataVendita.h1,
				t.webappPage.smartTentataVendita.h2,
				t.webappPage.smartTentataVendita.h3,
			],
		},
	], [assetVersion, t])

	const selectedApp = webApps.find((app) => app.id === selectedAppId) ?? null

	useEffect(() => {
		let cancelled = false

		const loadPdfPageCounts = async () => {
			const results = await Promise.all(
				webApps.map(async (app) => {
					try {
						const response = await fetch(app.pdfPath)
						if (!response.ok) throw new Error('PDF not available')

						const data = await response.arrayBuffer()
						const pdf = await PDFDocument.load(data, { ignoreEncryption: true })
						return [app.id, Math.max(1, pdf.getPageCount())] as const
					} catch {
						return [app.id, 1] as const
					}
				}),
			)

			if (cancelled) return

			const nextPageCounts = Object.fromEntries(results)
			setPdfPageCounts(nextPageCounts)
			setActiveSlideByApp((prev) => {
				const next = { ...prev }
				for (const app of webApps) {
					const totalSlides = 1 + (nextPageCounts[app.id] ?? 1)
					if ((next[app.id] ?? 0) >= totalSlides) next[app.id] = 0
				}
				return next
			})
		}

		void loadPdfPageCounts()

		return () => {
			cancelled = true
		}
	}, [webApps])

	const getTotalSlides = (appId: string) => 1 + (pdfPageCounts[appId] ?? 1)
	const getCurrentSlide = (appId: string) => activeSlideByApp[appId] ?? 0
	const goToSlide = (appId: string, index: number) => {
		setActiveSlideByApp((prev) => ({ ...prev, [appId]: index }))
	}

	useEffect(() => {
		if (!selectedAppId) return

		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setSelectedAppId(null)
		}

		const previousOverflow = document.body.style.overflow
		document.body.style.overflow = 'hidden'
		document.addEventListener('keydown', handleEscape)

		return () => {
			document.removeEventListener('keydown', handleEscape)
			document.body.style.overflow = previousOverflow
		}
	}, [selectedAppId])

	return (
		<>
			<Navbar backHref="/#servizi" backLabel={t.webappPage.tornaServizi} />
			<main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 text-slate-900 pt-16 lg:pt-20">
				<section className="relative overflow-hidden border-b border-slate-200">
					<div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-amber-100 blur-3xl" />
					<div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-yellow-100 blur-3xl" />
					<div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
						<h1 className="max-w-4xl text-3xl font-extrabold sm:text-5xl">
							{t.webappPage.title}
						</h1>
						<p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
							{t.webappPage.subtitle}
						</p>
					</div>
				</section>

				<section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{webApps.map((app) => {
							const totalSlides = 2
							const currentSlide = getCurrentSlide(app.id)
							const isImageSlide = currentSlide === 0
							const currentPdfPage = currentSlide

							return (
								<article
									key={app.id}
									className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
								>
									<div className="relative aspect-video w-full overflow-hidden border-b border-slate-200 bg-slate-50">
										{isImageSlide ? (
											<button
												type="button"
												onClick={() => setSelectedAppId(app.id)}
												className="group block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
												aria-label={`${t.webappPage.enlargeImage} ${app.name}`}
											>
												<Image
													src={app.image}
													alt={app.alt}
													width={1366}
													height={768}
													loading={app.id === 'smart-mail' ? 'lazy' : 'eager'}
													className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
												/>
											</button>
										) : (
											<iframe
												title={`${app.name} PDF page ${currentPdfPage}`}
												src={`${app.pdfPath}#page=${currentPdfPage}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
												className="h-full w-full bg-white"
											/>
										)}

										<div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-linear-to-b from-slate-900/20 to-transparent" />

										<div className="absolute left-3 top-3 rounded-full bg-slate-900/80 px-3 py-1 text-[11px] font-semibold text-white">
											{isImageSlide ? 'PNG' : `PDF ${currentPdfPage}/${totalSlides - 1}`}
										</div>

										<div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-white/95 p-1 shadow-sm">
											<button
												type="button"
												onClick={() =>
													goToSlide(app.id, currentSlide === 0 ? totalSlides - 1 : currentSlide - 1)
												}
												className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
												aria-label={language === 'it' ? 'Slide precedente' : 'Previous slide'}
											>
												<ChevronLeft className="h-4 w-4" />
											</button>
											<span className="px-2 text-xs font-semibold text-slate-700">
												{currentSlide + 1}/{totalSlides}
											</span>
											<button
												type="button"
												onClick={() => goToSlide(app.id, currentSlide === totalSlides - 1 ? 0 : currentSlide + 1)}
												className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-700 transition-colors hover:bg-slate-100"
												aria-label={language === 'it' ? 'Slide successiva' : 'Next slide'}
											>
												<ChevronRight className="h-4 w-4" />
											</button>
										</div>
									</div>

									<div className="px-6 pt-3 pb-4 text-xs font-medium text-slate-500">
										{isImageSlide ? t.webappPage.clickEnlarge : language === 'it' ? 'Scorri le pagine PDF con la rotellina del mouse' : 'Use the mouse wheel to scroll through PDF pages'}
									</div>

									<div className="px-6 pb-7 sm:pb-8 flex-1 flex flex-col">
										<p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-600">
											{t.webappPage.badge}
										</p>
										<h2 className="mt-2 text-xl font-bold text-slate-900">{app.name}</h2>
										<p className="mt-1 text-sm font-medium text-amber-600">{app.subtitle}</p>

										<p className="mt-4 text-sm leading-relaxed text-slate-600 flex-1">
											{app.description}
										</p>

										<ul className="mt-4 space-y-2">
											{app.highlights.map((item) => (
												<li key={item} className="flex items-start gap-2 text-xs text-slate-700">
													<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
													<span>{item}</span>
												</li>
											))}
										</ul>

										<div className="mt-6">
											<Link
												href={app.route}
												className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-amber-400"
											>
												{t.webappPage.requestQuote}
												<ArrowRight className="h-4 w-4" />
											</Link>
										</div>
									</div>
								</article>
							)
						})}
					</div>
				</section>

				{selectedApp && (
					<div
						onClick={() => setSelectedAppId(null)}
						className="fixed inset-0 z-120 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-sm sm:p-8"
					>
						<div
							onClick={(event) => event.stopPropagation()}
							className="relative w-full max-w-7xl"
						>
							<button
								type="button"
								onClick={() => setSelectedAppId(null)}
								className="absolute -top-11 right-0 rounded-full p-1 text-white/90 transition-colors hover:text-white"
								aria-label={t.webappPage.closeImage}
							>
								<X className="h-7 w-7" />
							</button>

							<div className="overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
								<Image
									src={selectedApp.image}
									alt={`${selectedApp.alt} - ${language === 'it' ? 'versione ingrandita' : 'enlarged version'}`}
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
