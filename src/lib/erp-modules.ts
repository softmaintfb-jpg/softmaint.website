import { translations, type Language } from '@/lib/translations'

type ModuleCategory =
  | 'accounting'
  | 'finance'
  | 'compliance'
  | 'documents'
  | 'sales'
  | 'warehouse'
  | 'planning'
  | 'production'
  | 'analytics'
  | 'integration'
  | 'security'
  | 'service'
  | 'automation'
  | 'generic'

export type ErpIconKey =
  | 'calculator'
  | 'wallet'
  | 'scale'
  | 'fileText'
  | 'shoppingCart'
  | 'package'
  | 'workflow'
  | 'settings2'
  | 'chartNoAxesCombined'
  | 'handshake'
  | 'fileArchive'
  | 'users'
  | 'clipboardList'
  | 'briefcase'

const categoryIconMap: Record<ModuleCategory, ErpIconKey> = {
  accounting: 'calculator',
  finance: 'wallet',
  compliance: 'scale',
  documents: 'fileText',
  sales: 'shoppingCart',
  warehouse: 'package',
  planning: 'workflow',
  production: 'settings2',
  analytics: 'chartNoAxesCombined',
  integration: 'handshake',
  security: 'fileArchive',
  service: 'users',
  automation: 'clipboardList',
  generic: 'briefcase',
}

function normalizeTitle(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function getErpModuleSlug(title: string) {
  return normalizeTitle(title)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getErpModuleCategory(title: string): ModuleCategory {
  const normalized = normalizeTitle(title)

  if (/contabil|iva|corrispettiv|cespit|ammort/.test(normalized)) return 'accounting'
  if (/flussi finanziari|riconciliazione bancaria|crisi d'impresa|cash flow|bank reconciliation/.test(normalized)) return 'finance'
  if (/fatturazione elettronica|telematica|peppol|passport|pa e privati/.test(normalized)) return 'compliance'
  if (/document|dms|fepa|passiva|archiviazione/.test(normalized)) return 'documents'
  if (/shop|vendite|ordini|ddt|budget commerciale|counter sales|commercial budget/.test(normalized)) return 'sales'
  if (/magazzino|giacenza|warehouse|riordini|fulfillment/.test(normalized)) return 'warehouse'
  if (/programmazione|pianificazione|mrp|fabbisogni|assembly to order|easy planning/.test(normalized)) return 'planning'
  if (/produzione|commesse|distinta base|project management/.test(normalized)) return 'production'
  if (/analyzer|analitica|analysis/.test(normalized)) return 'analytics'
  if (/connector|connection|importer|acquisizione automatica|import/.test(normalized)) return 'integration'
  if (/accessi|extended access/.test(normalized)) return 'security'
  if (/assistenza|contratti|noleggi|service management|rental/.test(normalized)) return 'service'
  if (/operazioni pianificate|processi user web|scheduled operations|process management/.test(normalized)) return 'automation'

  return 'generic'
}

export function getErpModuleIconKey(title: string): ErpIconKey {
  return categoryIconMap[getErpModuleCategory(title)]
}

type DetailContent = {
  overview: string
  goals: string[]
  features: string[]
  integrations: string[]
  kpis: string[]
  rollout: string[]
}

export function getErpModuleDetailContent(title: string, language: Language): DetailContent {
  const category = getErpModuleCategory(title)

  const focus = {
    it: {
      accounting: 'contabilità e adempimenti fiscali',
      finance: 'tesoreria, flussi e controllo finanziario',
      compliance: 'compliance normativa e tracciabilità documentale',
      documents: 'gestione documentale e ciclo amministrativo',
      sales: 'vendite, ordini e canali commerciali',
      warehouse: 'magazzino, disponibilità e movimentazioni',
      planning: 'pianificazione operativa e fabbisogni',
      production: 'esecuzione e controllo della produzione',
      analytics: 'analisi dati e supporto decisionale',
      integration: 'integrazioni e scambio dati tra sistemi',
      security: 'governance accessi e controllo operativo',
      service: 'post-vendita, contratti e servizi ricorrenti',
      automation: 'workflow e attività pianificate',
      generic: 'processi ERP trasversali',
    },
    en: {
      accounting: 'accounting operations and tax workflows',
      finance: 'treasury, cash flow and financial control',
      compliance: 'regulatory compliance and document traceability',
      documents: 'document management and administrative cycle',
      sales: 'sales flows, orders and commercial channels',
      warehouse: 'warehouse operations and stock movement',
      planning: 'planning and demand orchestration',
      production: 'production execution and control',
      analytics: 'data analysis and decision support',
      integration: 'system integration and data exchange',
      security: 'access governance and operational control',
      service: 'after-sales, contracts and recurring services',
      automation: 'workflow automation and scheduled activities',
      generic: 'cross-functional ERP operations',
    },
  }

  if (language === 'it') {
    return {
      overview: `${title} è il modulo pensato per rendere più efficiente l'area di ${focus.it[category]} con processi standardizzati, controlli puntuali e visibilità in tempo reale su attività e risultati.`,
      goals: [
        `Ridurre tempi operativi e attività manuali nell'area ${focus.it[category]}`,
        'Aumentare coerenza e qualità del dato su reparti coinvolti',
        'Supportare decisioni rapide con indicatori sempre aggiornati',
      ],
      features: [
        `Workflow guidati e configurabili dedicati a ${title}`,
        'Regole automatiche, notifiche e controlli sulle eccezioni',
        'Dashboard operative con viste per ruolo e stato avanzamento',
        'Storico completo per audit, analisi e miglioramento continuo',
      ],
      integrations: [
        'Anagrafiche condivise con amministrazione, acquisti e commerciale',
        'Allineamento con documenti, magazzino e contabilità generale',
        'Scambio dati con strumenti esterni tramite import/export o connettori',
      ],
      kpis: [
        'Tempo medio di processo',
        'Riduzione errori e rilavorazioni',
        'SLA di evasione attività/pratiche',
        'Produttività per operatore e reparto',
      ],
      rollout: [
        'Analisi processi attuali e obiettivi di progetto',
        'Configurazione del modulo e set-up dati iniziale',
        'Formazione utenti e fase pilota controllata',
        'Go-live, monitoraggio KPI e ottimizzazione progressiva',
      ],
    }
  }

  return {
    overview: `${title} is designed to improve ${focus.en[category]} through standardized workflows, stronger controls, and real-time visibility across teams.`,
    goals: [
      `Reduce operational effort in ${focus.en[category]}`,
      'Increase data consistency across involved departments',
      'Enable faster decisions with up-to-date operational indicators',
    ],
    features: [
      `Guided and configurable workflows tailored for ${title}`,
      'Automatic rules, alerts, and exception controls',
      'Role-based operational dashboards and progress views',
      'Complete history for audits, analysis, and continuous improvement',
    ],
    integrations: [
      'Shared master data with finance, purchasing, and sales teams',
      'Alignment with documents, warehouse, and accounting modules',
      'External data exchange via connectors and controlled imports/exports',
    ],
    kpis: [
      'Average cycle time',
      'Error and rework reduction',
      'Operational SLA compliance',
      'Department and operator productivity',
    ],
    rollout: [
      'Assess current process and project objectives',
      'Configure the module and initial data setup',
      'Train users and run a controlled pilot phase',
      'Go live, monitor KPIs, and iterate improvements',
    ],
  }
}

export function resolveErpModuleFromSlug(slug: string) {
  const modulesIt = translations.it.erpPage.modules.map((module) => module.title)
  const modulesEn = translations.en.erpPage.modules.map((module) => module.title)
  const count = Math.max(modulesIt.length, modulesEn.length)

  for (let index = 0; index < count; index += 1) {
    const titleIt = modulesIt[index] ?? modulesEn[index]
    const titleEn = modulesEn[index] ?? modulesIt[index]

    const candidates = [
      getErpModuleSlug(titleIt),
      getErpModuleSlug(titleEn),
    ]

    if (candidates.includes(slug)) {
      return { titleIt, titleEn }
    }
  }

  return null
}