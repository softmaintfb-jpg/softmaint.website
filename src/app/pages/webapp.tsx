'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

import { ArrowLeft, ArrowRight, CheckCircle2, X, Menu, Globe, Mail, ExternalLink } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

// ─── Navbar (reused from home) ───────────────────────────────────────────────
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

// ─── Footer (reused from home) ────────────────────────────────────────────────
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

// ─── WebApp Page Content ──────────────────────────────────────────────────────
export default function WebAppPageContent() {
	const { language } = useLanguage()
	const t = translations[language]
	const [selectedAppId, setSelectedAppId] = useState<string | null>(null)

	const webApps = [
		{
			id: 'smart-logistica',
			route: '/smartlogistica',
			image: '/assets/logistica.png',
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
			image: '/assets/agenti.png',
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
			image: '/assets/smartmail.png',
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
	]

	const selectedApp = webApps.find((app) => app.id === selectedAppId) ?? null

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
			<Navbar />
			<main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 text-slate-900 pt-16 lg:pt-20">
				<section className="relative overflow-hidden border-b border-slate-200">
					<div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
					<div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />
					<div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
						<Link
							href="/#servizi"
							className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
						>
							<ArrowLeft className="h-4 w-4" />
							{t.webappPage.tornaServizi}
						</Link>

						<h1 className="mt-6 max-w-4xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
							{t.webappPage.title}
						</h1>
						<p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
							{t.webappPage.subtitle}
						</p>
					</div>
				</section>

				<section className="mx-auto max-w-7xl space-y-10 px-4 py-14 sm:px-6 lg:px-8">
					{webApps.map((app) => (
						<article
							key={app.id}
							className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
						>
							<div className="grid grid-cols-1 gap-0 lg:grid-cols-2">
								<div className="border-b border-slate-200 bg-slate-50 lg:border-r lg:border-b-0">
									<button
										type="button"
										onClick={() => setSelectedAppId(app.id)}
										className="group block w-full cursor-zoom-in p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
										aria-label={`${t.webappPage.enlargeImage} ${app.name}`}
									>
										<div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white">
											<Image
												src={app.image}
												alt={app.alt}
												width={1366}
												height={768}
												className="h-full w-full object-contain"
											/>
										</div>
										<span className="mt-2 inline-block text-xs font-medium text-slate-500 transition-colors group-hover:text-blue-700">
											{t.webappPage.clickEnlarge}
										</span>
									</button>
								</div>

								<div className="p-7 sm:p-10">
									<p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
										{t.webappPage.badge}
									</p>
									<h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{app.name}</h2>
									<p className="mt-2 text-base font-medium text-blue-700">{app.subtitle}</p>

									<p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">
										{app.description}
									</p>

									<ul className="mt-6 space-y-3">
										{app.highlights.map((item) => (
											<li key={item} className="flex items-start gap-2 text-sm text-slate-700 sm:text-base">
												<CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
												<span>{item}</span>
											</li>
										))}
									</ul>

									<div className="mt-8">
										<Link
											href={app.route}
											className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
										>
											{t.webappPage.requestQuote}
											<ArrowRight className="h-4 w-4" />
										</Link>
									</div>
								</div>
							</div>
						</article>
					))}
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
