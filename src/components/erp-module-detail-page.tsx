'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Calculator,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardList,
  FileArchive,
  FileText,
  Handshake,
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
  getErpModuleCategory,
  getErpModuleDetailContent,
  getErpModuleIconKey,
  getErpModuleSlug,
  resolveErpModuleFromSlug,
  type ErpIconKey,
} from '@/lib/erp-modules'

type ErpModuleDetailPageProps = {
  slug: string
}

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

const labels = {
  it: {
    sectionGoal: 'Obiettivi principali',
    sectionFeatures: 'Funzionalità chiave',
    sectionIntegrations: 'Integrazioni consigliate',
    sectionKpis: 'KPI da monitorare',
    sectionRollout: 'Piano di adozione',
    related: 'Moduli correlati',
    relatedSubtitle: 'Approfondimenti utili per completare il processo end-to-end.',
    notFound: 'Modulo non trovato. Seleziona una sezione dalla panoramica ERP.',
    backToErp: 'Torna alla panoramica ERP',
  },
  en: {
    sectionGoal: 'Main goals',
    sectionFeatures: 'Key features',
    sectionIntegrations: 'Suggested integrations',
    sectionKpis: 'KPIs to monitor',
    sectionRollout: 'Adoption plan',
    related: 'Related modules',
    relatedSubtitle: 'Useful deep-dives to complete your end-to-end process.',
    notFound: 'Module not found. Please select a section from the ERP overview.',
    backToErp: 'Back to ERP overview',
  },
} as const

export default function ErpModuleDetailPageContent({ slug }: ErpModuleDetailPageProps) {
  const { language } = useLanguage()
  const t = translations[language]
  const ui = labels[language]
  const resolvedModule = resolveErpModuleFromSlug(slug)

  if (!resolvedModule) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-slate-100 pt-16 lg:pt-20">
          <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-slate-600">{ui.notFound}</p>
              <Link
                href="/erp"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
              >
                <ArrowLeft className="h-4 w-4" />
                {ui.backToErp}
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  const moduleTitle = language === 'it' ? resolvedModule.titleIt : resolvedModule.titleEn
  const moduleIconKey = getErpModuleIconKey(moduleTitle)
  const Icon = moduleIcons[moduleIconKey]
  const detail = getErpModuleDetailContent(moduleTitle, language)
  const category = getErpModuleCategory(moduleTitle)
  const narrativeIntro = language === 'it'
    ? {
        integrations:
          'Per ottenere il massimo dal modulo, conviene inserirlo in un flusso connesso con gli altri reparti aziendali: amministrazione, acquisti, magazzino e area commerciale devono condividere lo stesso dato operativo.',
        rollout:
          'Un\'adozione efficace richiede una roadmap chiara: prima si allineano obiettivi e processi, poi si configura il modulo e infine si accompagna il team con formazione e monitoraggio dei risultati.',
        kpis:
          'Metriche pratiche per capire se il modulo sta migliorando davvero processi e risultati.',
      }
    : {
        integrations:
          'To get the most from this module, it should be embedded in a connected flow across departments: finance, purchasing, warehouse, and sales should work on shared operational data.',
        rollout:
          'A successful rollout needs a clear roadmap: align goals and processes first, configure the module second, then support teams with training and KPI monitoring.',
        kpis:
          'Practical metrics to verify whether the module is delivering measurable operational improvements.',
      }

  const relatedModules = (t.erpPage.modules as Array<{ title: string }>)
    .filter((module) => module.title !== moduleTitle)
    .filter((module) => getErpModuleCategory(module.title) === category)
    .slice(0, 4)

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 pt-16 lg:pt-20">
        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <Link
              href="/erp"
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.erpPage.backToServices}
            </Link>

            <div className="mt-6 overflow-hidden rounded-2xl bg-linear-to-r from-blue-900 via-blue-800 to-blue-700 px-6 py-8 text-white shadow-lg sm:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                {t.erpPage.heroBadge}
              </p>
              <div className="mt-4 grid gap-6 lg:grid-cols-[auto,1fr] lg:items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold leading-tight sm:text-4xl">{moduleTitle}</h1>
                  <p className="mt-4 max-w-4xl text-sm leading-relaxed text-blue-100 sm:text-base">
                    {detail.overview}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            <article className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-10 lg:col-span-8">
              <header className="border-b border-slate-200 pb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">ERP Insights</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">{moduleTitle}</h2>
                <p className="mt-4 leading-relaxed text-slate-600">{detail.overview}</p>
              </header>

              <section className="pt-7">
                <h3 className="text-xl font-bold text-slate-900">{ui.sectionGoal}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {detail.goals[0]}.
                </p>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {detail.goals[1]}. {detail.goals[2]}.
                </p>
              </section>

              <section className="pt-7">
                <h3 className="text-xl font-bold text-slate-900">{ui.sectionFeatures}</h3>
                <div className="mt-4 space-y-4">
                  {detail.features.map((feature) => (
                    <p key={feature} className="flex items-start gap-3 leading-relaxed text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <span>{feature}</span>
                    </p>
                  ))}
                </div>
              </section>

              <section className="pt-7">
                <h3 className="text-xl font-bold text-slate-900">{ui.sectionIntegrations}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {narrativeIntro.integrations}
                </p>
                <ul className="mt-4 space-y-3">
                  {detail.integrations.map((integration) => (
                    <li key={integration} className="flex items-start gap-3 text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <span>{integration}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="pt-7">
                <h3 className="text-xl font-bold text-slate-900">{ui.sectionRollout}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">
                  {narrativeIntro.rollout}
                </p>
                <ol className="mt-4 space-y-3">
                  {detail.rollout.map((step, index) => (
                    <li key={step} className="flex items-start gap-3 text-slate-700">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </section>
            </article>

            <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-4 lg:sticky lg:top-24">
              <h3 className="text-lg font-bold text-slate-900">{ui.sectionKpis}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {narrativeIntro.kpis}
              </p>
              <ul className="mt-4 space-y-3">
                {detail.kpis.map((kpi) => (
                  <li key={kpi} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>{kpi}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>

          {relatedModules.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-bold text-slate-900">{ui.related}</h2>
              <p className="mt-1 text-sm text-slate-600">{ui.relatedSubtitle}</p>

              <div className="mt-4 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {relatedModules.map((module) => {
                  const relatedSlug = getErpModuleSlug(module.title)
                  const relatedIconKey = getErpModuleIconKey(module.title)
                  const RelatedIcon = moduleIcons[relatedIconKey]

                  return (
                    <Link
                      key={module.title}
                      href={`/erp/${relatedSlug}`}
                      className="group flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-800 text-white">
                          <RelatedIcon className="h-4 w-4" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-700">{module.title}</h3>
                      </div>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 transition-all duration-200 group-hover:gap-2">
                        {t.erpPage.learnMore}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  )
                })}
              </div>
            </section>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}