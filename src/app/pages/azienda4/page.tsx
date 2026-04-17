import Link from 'next/link'

export default function Azienda4Page() {
	return (
		<main className="mx-auto min-h-screen max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
			<h1 className="text-3xl font-bold text-slate-900">Azienda 4.0</h1>
			<p className="mt-4 text-base leading-relaxed text-slate-600">
				Questa sezione e in aggiornamento. Per maggiori informazioni torna alla home e
				contattaci.
			</p>
			<Link
				href="/#contatti"
				className="mt-8 inline-flex items-center rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-800"
			>
				Vai ai contatti
			</Link>
		</main>
	)
}
