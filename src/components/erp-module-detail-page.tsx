'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  Calculator,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardList,
  FileArchive,
  FileText,
  Handshake,
  Lightbulb,
  Network,
  Package,
  Rocket,
  Scale,
  Settings2,
  ShoppingCart,
  Target,
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
        <Navbar backHref="/erp" backLabel={ui.backToErp} />
        <main className="min-h-screen bg-slate-100 pt-16 lg:pt-20">
          <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-slate-600">{ui.notFound}</p>
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

  const storySections = [
    {
      key: 'goal',
      title: ui.sectionGoal,
      intro: detail.goals[0],
      body: [detail.goals[1], detail.goals[2]],
      icon: Target,
    },
    {
      key: 'features',
      title: ui.sectionFeatures,
      intro: language === 'it'
        ? 'Queste sono le funzionalità operative che permettono al team di lavorare con maggiore precisione e continuità.'
        : 'These core capabilities help teams execute with more consistency and operational accuracy.',
      body: detail.features,
      icon: Lightbulb,
    },
    {
      key: 'integrations',
      title: ui.sectionIntegrations,
      intro: narrativeIntro.integrations,
      body: detail.integrations,
      icon: Network,
    },
    {
      key: 'rollout',
      title: ui.sectionRollout,
      intro: narrativeIntro.rollout,
      body: detail.rollout,
      icon: Rocket,
    },
  ]

  return (
    <>
      <Navbar backHref="/erp" backLabel={ui.backToErp} />

      <main className="min-h-screen bg-linear-to-b from-slate-100 via-slate-100 to-white pt-16 lg:pt-20">
        <section className="border-b border-slate-200 bg-slate-200/80">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="mt-2"
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-800 text-white shadow-sm ring-1 ring-blue-200/50">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">
                    {t.erpPage.heroBadge}
                  </p>
                  <h1 className="mt-2 text-3xl font-semibold leading-tight text-blue-900 sm:text-5xl">
                    {moduleTitle}
                  </h1>
                  <p className="mt-4 max-w-4xl text-base leading-relaxed text-slate-700 sm:text-lg">
                    {detail.overview}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-10 sm:py-10"
          >
            <div className="space-y-10 sm:space-y-12">
              {storySections.map((section, sectionIndex) => {
                const SectionIcon = section.icon

                return (
                  <section
                    key={section.key}
                    className={sectionIndex > 0 ? 'border-t border-slate-200 pt-10 sm:pt-12' : ''}
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[64px,1fr] sm:gap-6">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 sm:h-12 sm:w-12">
                        <SectionIcon className="h-5 w-5" />
                      </div>

                      <div>
                        <h2 className="text-base font-semibold uppercase tracking-[0.08em] text-blue-800 sm:text-lg">
                          {section.title}
                        </h2>

                        <p className="mt-4 text-xl leading-relaxed text-slate-600 sm:text-[2rem] sm:leading-[1.35]">
                          {section.intro}
                        </p>

                        <div className="mt-6 space-y-4">
                          {section.body.map((line, index) => (
                            <p key={`${section.key}-${index}`} className="leading-relaxed text-slate-700 sm:text-lg">
                              {section.key === 'rollout' ? `${index + 1}. ${line}` : line}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )
              })}
            </div>
          </motion.article>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.38 }}
            className="mt-10"
          >
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm sm:px-8">
              <h2 className="text-base font-semibold uppercase tracking-[0.08em] text-blue-800 sm:text-lg">
                {ui.sectionKpis}
              </h2>
              <p className="mt-3 text-slate-600 sm:text-lg">{narrativeIntro.kpis}</p>

              <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {detail.kpis.map((kpi) => (
                  <li key={kpi} className="flex items-start gap-2 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-slate-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <span>{kpi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {relatedModules.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.38 }}
              className="mt-10"
            >
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
                      className="group flex items-center justify-between px-5 py-4 transition-all duration-200 hover:bg-slate-50"
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
            </motion.section>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}