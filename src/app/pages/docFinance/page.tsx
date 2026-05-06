'use client'

import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { TrendingUp, Building2, PiggyBank, Lock, Gauge } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

export default function DocFinancePage() {
	const { language } = useLanguage()
	const t = translations[language]?.docfinancePage || translations['it'].docfinancePage

	const features = [
		{
			icon: TrendingUp,
			title: t.feature1Title,
			description: t.feature1Desc,
		},
		{
			icon: Lock,
			title: t.feature2Title,
			description: t.feature2Desc,
		},
		{
			icon: Building2,
			title: t.feature3Title,
			description: t.feature3Desc,
		},
	]

	const integrations = [
		{ label: '300+', desc: t.statsERP },
		{ label: 'Italia + Estero', desc: t.statsBanks },
		{ label: 'Singole o Gruppi', desc: t.statsCompanies },
	]

	return (
		<>
			<Navbar backHref="/#servizi" backLabel={t.tornaServizi} />
			<main className="min-h-screen bg-white text-slate-900 pt-20">
				{/* Hero Section */}
				<section className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-800 to-blue-800 py-24 sm:py-32">
					<div className="absolute inset-0 opacity-10">
						<div className="absolute -top-40 right-0 h-80 w-80 rounded-full bg-white blur-3xl" />
						<div className="absolute -bottom-40 left-0 h-80 w-80 rounded-full bg-white blur-3xl" />
					</div>

					<div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
						<p className="text-sm font-semibold uppercase tracking-wider text-blue-100 mb-4">
							{t.heroBadge}
						</p>
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
							{t.heroTitle}
						</h1>
						<p className="text-lg sm:text-xl text-blue-50 max-w-2xl mb-8 leading-relaxed">
							{t.heroSubtitle}
						</p>
					</div>
				</section>

				{/* Stats Section */}
				<section className="border-b border-slate-200 bg-slate-50 py-12 sm:py-16">
					<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{integrations.map((item) => (
								<div key={item.label} className="text-center">
									<p className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
										{item.label}
									</p>
									<p className="text-slate-600 font-medium">{item.desc}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* What is DocFinance */}
				<section className="py-16 sm:py-24 border-b border-slate-200">
					<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
						<div className="mb-12">
							<h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
								{t.whatTitle}
							</h2>
							<p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
								{t.whatSubtitle}
							</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{features.map((item) => {
								const Icon = item.icon
								return (
									<div
										key={item.title}
										className="group rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-blue-300 hover:shadow-lg hover:-translate-y-1"
									>
										<div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
											<Icon className="w-6 h-6" />
										</div>
										<h3 className="text-lg font-semibold text-slate-900 mb-3">
											{item.title}
										</h3>
										<p className="text-slate-600 leading-relaxed">
											{item.description}
										</p>
									</div>
								)
							})}
						</div>
					</div>
				</section>

				{/* Core Capabilities */}
				<section className="py-16 sm:py-24 bg-slate-50">
					<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
						<h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-12">
							{t.capabilitiesTitle}
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
							<div className="bg-white rounded-2xl p-8 border border-slate-200">
								<div className="flex items-start gap-4">
									<Gauge className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
									<div>
										<h3 className="text-xl font-semibold text-slate-900 mb-2">
											{t.planning}
										</h3>
										<p className="text-slate-600">
											{t.planningDesc}
										</p>
									</div>
								</div>
							</div>
							<div className="bg-white rounded-2xl p-8 border border-slate-200">
								<div className="flex items-start gap-4">
									<PiggyBank className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
									<div>
										<h3 className="text-xl font-semibold text-slate-900 mb-2">
											{t.credit}
										</h3>
										<p className="text-slate-600">
											{t.creditDesc}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Why Choose */}
				<section className="py-16 sm:py-24">
					<div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
						<div className="rounded-3xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 p-8 sm:p-12">
							<h2 className="text-3xl font-bold text-slate-900 mb-4">
								{t.ctaTitle}
							</h2>
							<p className="text-lg text-slate-600 mb-8 max-w-2xl">
								{t.ctaSubtitle}
							</p>
							<div className="flex flex-wrap gap-4">
								<a
									href="https://www.docfinance.net/"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 px-6 py-3 font-semibold transition-all hover:bg-blue-50"
								>
									{t.visitDocFinance}
								</a>
							</div>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	)
}
