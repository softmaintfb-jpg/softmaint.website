'use client'

import Link from 'next/link'
import {
	ArrowRight,
	Briefcase,
	Calculator,
	ChartNoAxesCombined,
	ClipboardList,
	FileArchive,
	FileText,
	Handshake,
	LayoutGrid,
	Package,
	Scale,
	Settings2,
	ShoppingCart,
	Users,
	Wallet,
	Workflow,
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'
import {
	getErpModuleIconKey,
	getErpModuleSlug,
	type ErpIconKey,
} from '@/lib/erp-modules'

const moduleIcons: Record<ErpIconKey, typeof Briefcase> = {
	calculator: Calculator,
	wallet: Wallet,
	scale: Scale,
	fileText: FileText,
	shoppingCart: ShoppingCart,
	package: Package,
	workflow: Workflow,
	settings2: Settings2,
	chartNoAxesCombined: ChartNoAxesCombined,
	handshake: Handshake,
	fileArchive: FileArchive,
	users: Users,
	clipboardList: ClipboardList,
	briefcase: Briefcase,
}

export default function ErpPageContent() {
	const { language } = useLanguage()
	const t = translations[language]
	const modules = t.erpPage.modules as Array<{ title: string }>

	return (
		<>
			<Navbar backHref="/#servizi" backLabel={t.erpPage.backToServices} />

			<main className="min-h-screen bg-slate-100 pt-16 lg:pt-20">
				<section className="border-b border-slate-200 bg-white">
					<div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
						<div className="mt-6 overflow-hidden rounded-2xl bg-linear-to-r from-zinc-800 via-zinc-800 to-stone-700 px-6 py-8 text-white shadow-lg sm:px-10">
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
								{t.erpPage.heroBadge}
							</p>
							<div className="mt-4 grid gap-6 lg:grid-cols-[auto,1fr] lg:items-center">
								<div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
									<LayoutGrid className="h-7 w-7" />
								</div>
								<div>
									<h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">
										{t.erpPage.heroTitle}
									</h1>
									<p className="mt-4 max-w-4xl text-sm leading-relaxed text-stone-200 sm:text-base">
										{t.erpPage.heroSubtitle}
									</p>
									<p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-amber-300">
										{t.erpPage.heroCta}
										<ArrowRight className="h-4 w-4" />
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
					<h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
						{t.erpPage.modulesTitle}
					</h2>

					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
						{modules.map((module) => {
							const moduleSlug = getErpModuleSlug(module.title)
							const iconKey = getErpModuleIconKey(module.title)
							const Icon = moduleIcons[iconKey]
							return (
								<Link
									key={module.title}
									href={`/erp/${moduleSlug}`}
									className="group border-t border-amber-400 bg-white px-4 py-3 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
								>
									<h3 className="min-h-12 text-[15px] font-semibold text-slate-700">
										{module.title}
									</h3>

									<div className="mt-4 flex items-center justify-between">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-white">
											<Icon className="h-5 w-5" />
										</div>

										<span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 transition-all duration-200 group-hover:gap-2">
											{t.erpPage.learnMore}
											<ArrowRight className="h-3.5 w-3.5" />
										</span>
									</div>
								</Link>
							)
						})}
					</div>
				</section>

				<section className="border-t border-slate-200 bg-white">
					<div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
						<p className="mt-8 text-lg leading-relaxed text-slate-500">
							{t.erpPage.p1}
						</p>
						<p className="mt-6 text-lg leading-relaxed text-slate-500">
							{t.erpPage.p2}
						</p>
						<p className="mt-6 text-lg leading-relaxed text-slate-500">
							{t.erpPage.p3}
						</p>
						<p className="mt-6 text-lg leading-relaxed text-slate-500">
							{t.erpPage.p4}
						</p>
					</div>
				</section>
			</main>

			<Footer />
		</>
	)
}
