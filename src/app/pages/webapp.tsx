'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, X } from 'lucide-react'

const webApps = [
	{
		id: 'smart-logistica',
		name: 'Smart Logistica',
		route: '/smartlogistica',
		subtitle: 'Gestione evoluta del magazzino e dei flussi logistici',
		image: '/assets/logistica.png',
		alt: 'Panoramica Smart Logistica con flussi OVC OAF, LP LPF e DDT RCF',
		description:
			'Smart Logistica digitalizza il ciclo operativo del magazzino dalla presa in carico ordini fino alla spedizione. Include tracciabilita lotti e scadenze tramite codifica GS1, gestione automatica delle liste di prelievo e supporto ai riordini con analisi della disponibilita in tempo reale.',
		highlights: [
			'Controllo centralizzato di ordini, prelievi e documenti di trasporto',
			'Inventario e rettifiche in tempo reale con sincronizzazione bidirezionale',
			'Riduzione errori operativi e maggiore velocita nelle operazioni di picking'
		]
	},
	{
		id: 'smart-agenti',
		name: 'Smart Agenti',
		route: '/smartagenti',
		subtitle: 'L\'ufficio commerciale in tasca per rete vendita e agenti',
		image: '/assets/agenti.png',
		alt: 'Schermata Smart Agenti con ordini, CRM, storico e monitoraggio credito',
		description:
			'Smart Agenti mette a disposizione dell agente uno strumento mobile per lavorare ovunque con dati sempre aggiornati. Consente gestione ordini e catalogo, consultazione CRM e anagrafiche clienti, storico acquisti replicabile e monitoraggio amministrativo per ridurre rischi di credito e tempi di risposta.',
		highlights: [
			'Inserimento ordini rapido con disponibilita e prezzi aggiornati',
			'CRM completo con dati cliente sempre accessibili durante la visita',
			'Dematerializzazione documentale e controllo puntuale delle scadenze'
		]
	},
	{
		id: 'smart-mail',
		name: 'Smart Mail',
		route: '/smartmail',
		subtitle: 'Automazione comunicazioni amministrative e solleciti',
		image: '/assets/smartmail.png',
		alt: 'Panoramica Smart Mail con regole automatiche, trigger e comunicazioni personalizzate',
		description:
			'Smart Mail automatizza le comunicazioni amministrative partendo dai dati gestionali. Permette di impostare regole per eventi e scadenze, attivare invii periodici o condizionati e personalizzare messaggi per cliente, migliorando il recupero crediti e riducendo il tempo dedicato ad attivita ripetitive.',
		highlights: [
			'Motore regole flessibile con trigger temporali e per evento',
			'Invio automatico di estratti conto, promemoria e solleciti',
			'Maggiore efficacia nella comunicazione e riduzione dei tempi manuali'
		]
	}
] as const

export default function WebAppPageContent() {
	const [selectedAppId, setSelectedAppId] = useState<string | null>(null)
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
		<main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 text-slate-900">
			<section className="relative overflow-hidden border-b border-slate-200">
				<div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
				<div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-100 blur-3xl" />
				<div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
					<Link
						href="/#servizi"
						className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
					>
						<ArrowLeft className="h-4 w-4" />
						Torna ai servizi
					</Link>

					<h1 className="mt-6 max-w-4xl text-3xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
						Soluzioni Web Custom Softmaint
					</h1>
					<p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
						Tre applicazioni verticali pensate per migliorare operativita, controllo e produttivita: logistica intelligente, rete vendita connessa e automazione amministrativa.
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
									aria-label={`Ingrandisci immagine ${app.name}`}
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
										Clicca per ingrandire
									</span>
								</button>
							</div>

							<div className="p-7 sm:p-10">
								<p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">Web Application</p>
								<h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{app.name}</h2>
								<p className="mt-2 text-base font-medium text-blue-700">{app.subtitle}</p>

								<p className="mt-5 text-sm leading-relaxed text-slate-600 sm:text-base">{app.description}</p>

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
										Effettua richiesta di preventivo
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
							aria-label="Chiudi immagine ingrandita"
						>
							<X className="h-7 w-7" />
						</button>

						<div className="overflow-hidden rounded-2xl bg-slate-900 shadow-2xl">
							<Image
								src={selectedApp.image}
								alt={`${selectedApp.alt} - versione ingrandita`}
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
