'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'
import { phonePattern } from '@/lib/validators'
import {
  ChevronRight, ArrowRight, Phone, Mail, MapPin,
  Database, Globe, Leaf, Factory, DollarSign, Shield,
  Zap, Users, Award, HeadphonesIcon, CheckCircle, Star,
  BarChart3, Truck, Send, ExternalLink, Download,
  Euro,
  X,
  PieChart,
  Gauge
} from 'lucide-react'

// ─── Varianti Animazioni ─────────────────────────────────────────────────────
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
} as const

const fadeInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
} as const

const fadeInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
} as const

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
} as const

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } }
} as const

// ─── Hook: Sezione visibile ───────────────────────────────────────────────────
interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  variants?: object
  delay?: number
}

function AnimatedSection({ children, className = '', variants = fadeInUp, delay = 0 }: AnimatedSectionProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants as any}
      style={{ transitionDelay: `${delay}s` }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Dati Servizi ─────────────────────────────────────────────────────────────
const servizi = [
  {
    id: 1,
    icon: DollarSign,
    title: 'DocFinance',
    subtitle: 'Tesoreria & Finanza',
    description: 'Gestione completa della tesoreria aziendale. Controllo dei flussi di cassa, previsioni finanziarie, riconciliazione bancaria e reportistica avanzata.',
    color: 'from-amber-500 to-amber-700',
    badge: 'Finanza'
  },
  {
    id: 2,
    icon: Truck,
    title: 'WMS',
    subtitle: 'Warehouse Management System',
    description: 'Sistema di gestione magazzino avanzato per ottimizzare picking, stoccaggio, inventario e tracciabilità dei prodotti in tempo reale.',
    color: 'from-stone-600 to-stone-800',
    badge: 'Logistica'
  },
  {
    id: 3,
    icon: Globe,
    title: 'Web Application',
    subtitle: 'Soluzioni Web Custom',
    description: 'Sviluppo di applicazioni web su misura, responsive e performanti. Dal portale aziendale all\'app gestionale, soluzioni personalizzate per ogni esigenza.',
    color: 'from-yellow-500 to-yellow-700',
    badge: 'Sviluppo'
  },
  {
    id: 4,
    icon: Leaf,
    title: 'Green Project',
    subtitle: 'Sostenibilità Digitale',
    description: 'Soluzioni software orientate alla sostenibilità: riduzione della carta, ottimizzazione dei processi energetici e monitoraggio delle emissioni aziendali.',
    color: 'from-amber-600 to-amber-800',
    badge: 'Green'
  },
  {
    id: 5,
    icon: Factory,
    title: 'Azienda 4.0',
    subtitle: 'Industria del Futuro',
    description: 'Digitalizzazione dei processi produttivi. IoT, automazione, MES e integrazione con sistemi ERP per una fabbrica intelligente e connessa.',
    color: 'from-zinc-600 to-zinc-800',
    badge: 'Industria'
  }
]

// ─── Dati Valori ─────────────────────────────────────────────────────────────
const valori = [
  {
    icon: Award,
    title: 'Esperienza Consolidata',
    description: 'Anni di esperienza nel settore IT al servizio di aziende di ogni dimensione. Conosciamo le sfide reali del business.'
  },
  {
    icon: Zap,
    title: 'Innovazione Continua',
    description: 'Costante aggiornamento tecnologico per offrirti sempre le soluzioni più moderne ed efficienti del mercato.'
  },
  {
    icon: Users,
    title: 'Soluzioni Personalizzate',
    description: 'Ogni progetto è unico. Analizziamo il tuo business e progettiamo soluzioni su misura per le tue esigenze specifiche.'
  },
  {
    icon: HeadphonesIcon,
    title: 'Supporto Dedicato',
    description: 'Team di assistenza tecnica sempre disponibile. Monitoriamo i tuoi sistemi e interveniamo tempestivamente in caso di necessità.'
  }
]

const partnerLogos = [
  { src: '/assets/partner/docfinance.png', alt: 'DocFinance' },
  { src: '/assets/partner/ingenia.png', alt: 'Ingenia' },
  { src: '/assets/partner/proemdya.png', alt: 'Proemdya' },
]


// ─── Sezione Hero ─────────────────────────────────────────────────────────────
function HeroSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const heroSubtitle = 'subtitle1' in t.hero
    ? [t.hero.subtitle1, t.hero.subtitle2]
    : [t.hero.subtitle]

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-stone-800 to-zinc-800" />

      {/* Background image overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1617791160536-598cf32026fb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwaW5ub3ZhdGlvbnxlbnwwfHx8Ymx1ZXwxNzc0ODc5NjI0fDA&ixlib=rb-4.1.0&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* <Badge className="mb-6 bg-blue-500/20 text-white border-blue-400/30 hover:bg-blue-500/30 text-sm px-4 py-1.5 ">
            <Star className="w-3.5 h-3.5 mr-1.5" />
            {t.hero.badge}
          </Badge> */}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6"
        >
          {t.hero.title1}
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 to-yellow-400">
            {t.hero.title2}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg sm:text-xl text-stone-200/80 w-full mb-10 leading-relaxed"
        >
          {heroSubtitle.map((line, index) => (
            <span key={`${index}-${line}`}>
              {line}
              {index === 0 && heroSubtitle.length > 1 ? <br /> : null}
            </span>
          ))}

        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => document.querySelector('#servizi')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-2 bg-amber-400 text-zinc-900 font-semibold px-8 py-3.5 rounded-full hover:bg-amber-300 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            {t.hero.btnServizi}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => document.querySelector('#contatti')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 text-white border border-white/30 font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            {t.hero.btnContatti}
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Stats with indicators */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: t.hero.stat1, label: t.hero.stat1Label, icon: Gauge },
            { value: t.hero.stat2, label: t.hero.stat2Label, icon: Gauge },
            { value: t.hero.stat3, label: t.hero.stat3Label, icon: Gauge },
          ].map((stat) => (
            <motion.div 
              key={stat.label} 
              className="text-center group"
              whileHover={{ scale: 1.08 }}
            >
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-amber-400/20 transition-colors">
                  <stat.icon className="w-8 h-8 text-amber-300" />
                </div>
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-white">{stat.value}</div>
              <div className="text-sm sm:text-base text-stone-300/70 mt-3">{stat.label}</div>
              <div className="mt-4 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── Sezione Partner ─────────────────────────────────────────────────────────
function PartnerSection() {
  return (
    <section className="border-y border-stone-200 bg-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
            Partner
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {partnerLogos.map((partner) => (
            <div
              key={partner.alt}
              className="flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 py-8 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={280}
                height={140}
                className="h-20 w-full object-contain sm:h-24"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Sezione Servizi ─────────────────────────────────────────────────────────
function ServiziSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const servizi = [
      {
      id: 1,
      icon: Database,
      title: t.serviziDetails.wms.title,
      subtitle: t.serviziDetails.wms.subtitle,
      description: t.serviziDetails.wms.description,
      color: 'from-stone-600 to-stone-800',
      badge: t.serviziDetails.wms.badge,
      href: '/erp',
          ctaLabel: t.servizi.erpCta,
      isWeb: false,
    },
    {
      id: 2,
      icon: Euro,
      title: t.serviziDetails.docfinance.title,
      subtitle: t.serviziDetails.docfinance.subtitle,
      description: t.serviziDetails.docfinance.description,
      color: 'from-amber-500 to-amber-700',
      badge: t.serviziDetails.docfinance.badge,
          href: '/docfinance',
          ctaLabel: t.servizi.docfinanceCta,
      isWeb: false,
    },
    {
      id: 3,
      icon: Globe,
      title: t.serviziDetails.webapp.title,
      subtitle: t.serviziDetails.webapp.subtitle,
      description: t.serviziDetails.webapp.description,
      color: 'from-yellow-500 to-yellow-700',
      badge: t.serviziDetails.webapp.badge,
      isWeb: true,
    },
    {
      id: 4,
      icon: Factory,
      title: t.serviziDetails.azienda40.title,
      subtitle: t.serviziDetails.azienda40.subtitle,
      description: t.serviziDetails.azienda40.description,
      color: 'from-zinc-600 to-zinc-800',
      badge: t.serviziDetails.azienda40.badge,
      isWeb: false,
    },

  ]

  return (
    <section id="servizi" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h2 className="text-amber-600 font-semibold text-3xl uppercase tracking-widest">{t.servizi.label}</h2>
          {/* <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            {t.servizi.title}
          </h2> */}
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            {t.servizi.subtitle}
          </p>
        </AnimatedSection>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {servizi.map((s) => (
            <motion.div
              key={s.id}
              variants={cardVariant}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${s.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className="w-6 h-6 text-white" /> 
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{s.title}</h3> 
              {/* da mettere accanto  */}
              {/* <Badge variant="outline" className="w-fit text-xs mb-3 text-blue-700 border-blue-200 bg-blue-50">
                {s.badge}
              </Badge> */}
              
              <p className="text-sm text-amber-600 font-medium mb-3">{s.subtitle}</p>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">{s.description}</p>
              {s.isWeb ? (
                <Link
                  href="/webapp"
                  className="mt-5 inline-flex items-center gap-1.5 text-amber-600 text-sm font-semibold hover:gap-2.5 transition-all duration-200 group/btn"
                >
                  {t.servizi.scopriWeb}
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              ) : s.href ? (
                <Link
                  href={s.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-amber-600 text-sm font-semibold hover:gap-2.5 transition-all duration-200 group/btn"
                >
                  {s.ctaLabel ?? t.servizi.richiediInfo}
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              ) : (
                <button
                  onClick={() => document.querySelector('#contatti')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-5 flex items-center gap-1.5 text-amber-600 text-sm font-semibold hover:gap-2.5 transition-all duration-200 group/btn"
                >
                  {s.ctaLabel ?? t.servizi.richiediInfo}
                  <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              )}
            </motion.div>
          ))}

          {/* Card Download Supremo */}
          <motion.div
            variants={cardVariant}
            className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 flex flex-col justify-between text-white"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.servizi.supremoTitle}</h3>
              <p className="text-stone-300/80 text-sm leading-relaxed">
                {t.servizi.supremoDescription}
              </p>
            </div>
            <button
              onClick={() => window.location.href = 'https://softmaint.it/files/Supremo.exe'}
              className="mt-6 flex items-center justify-center gap-2 bg-amber-400 text-zinc-900 font-semibold px-5 py-2.5 rounded-full hover:bg-amber-300 transition-colors text-sm"
            >
              {t.servizi.supremoBtn} <Download className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Card CTA */}
          <motion.div
            variants={cardVariant}
            className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl p-6 flex flex-col justify-between text-white"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t.servizi.ctaTitle}</h3>
              <p className="text-stone-300/80 text-sm leading-relaxed">
                {t.servizi.ctaText}
              </p>
            </div>
            <button
              onClick={() => document.querySelector('#contatti')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-6 flex items-center justify-center gap-2 bg-amber-400 text-zinc-900 font-semibold px-5 py-2.5 rounded-full hover:bg-amber-300 transition-colors text-sm"
            >
              {t.servizi.ctaBtn} <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Sezione Chi Siamo ────────────────────────────────────────────────────────
function ChiSiamoSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

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

  return (
    <section id="chi-siamo" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Testo */}
          <AnimatedSection variants={fadeInLeft}>
            <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">{t.chiSiamo.label}</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              {t.chiSiamo.title}
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              <strong className="text-gray-900">{t.chiSiamo.p1}</strong>
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              {t.chiSiamo.p2}
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              {t.chiSiamo.p3}
            </p>
            <div className="flex flex-wrap gap-3">
              {['ERP', 'DocFinance', 'WebApp', 'Azienda 4.0 | 5.0'].map((tag) => (
                <a key={tag} href="#servizi" onClick={() => document.querySelector('#servizi')?.scrollIntoView({ behavior: 'smooth' })} className="bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-4 py-1.5 text-sm font-medium hover:bg-amber-100 transition-colors cursor-pointer">
                  {tag}
                </a>
              ))}
            </div>
          </AnimatedSection>

          {/* Immagine / Visual */}
          <AnimatedSection variants={fadeInRight} className="w-full">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsImageModalOpen(true)}
                className="relative block w-full aspect-20/9 rounded-2xl overflow-hidden shadow-2xl cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Apri immagine in modale"
              >
                <Image
                  src="/assets/softmaint_info.png?v=20260402"
                  alt="Team Softmaint al lavoro"
                  width={1000}
                  height={450}
                  priority
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-zinc-900/40 to-transparent" />
              </button>
              {/* Floating card */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-4 border border-blue-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">{t.chiSiamo.floatingCard}</div>
                    <div className="text-lg font-bold text-gray-900">{t.chiSiamo.floatingCardValue}</div>
                  </div>
                </div>
              </motion.div>
              {/* Badge tecnologia */}
              {/* <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-blue-900 text-white rounded-xl shadow-xl p-4"
              >
                <div className="text-xs text-blue-300 mb-1">{t.chiSiamo.specializzati}</div>
                <div className="text-sm font-bold">{t.chiSiamo.specializzatiValue}</div>
              </motion.div> */}
            </div>
            <AnimatePresence>
              {isImageModalOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsImageModalOpen(false)}
                  className="fixed inset-0 z-120 bg-slate-950/85 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.96, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={(event) => event.stopPropagation()}
                    className="relative w-full max-w-6xl"
                  >
                    <button
                      type="button"
                      onClick={() => setIsImageModalOpen(false)}
                      aria-label="Chiudi modale"
                      className="absolute -top-12 right-0 text-white/90 hover:text-white transition-colors"
                    >
                      <X className="w-7 h-7" />
                    </button>

                    <div className="rounded-2xl overflow-hidden shadow-2xl bg-slate-900">
                      <Image
                        src="/assets/softmaint_info.png?v=20260402"
                        alt="Team Softmaint al lavoro - ingrandita"
                        width={1600}
                        height={720}
                        className="w-full h-auto"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

// ─── Sezione Valori ───────────────────────────────────────────────────────────
function ValoriSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const valori = [
    {
      icon: Award,
      title: t.valori.val1Title,
      description: t.valori.val1,
    },
    {
      icon: Zap,
      title: t.valori.val2Title,
      description: t.valori.val2,
    },
    {
      icon: Users,
      title: t.valori.val3Title,
      description: t.valori.val3,
    },
    {
      icon: HeadphonesIcon,
      title: t.valori.val4Title,
      description: t.valori.val4,
    }
  ]

  return (
    <section className="py-24 bg-linear-to-br from-zinc-900 via-stone-800 to-zinc-800 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-amber-300 font-semibold text-sm uppercase tracking-widest">{t.valori.label}</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            {t.valori.title}
          </h2>
          <p className="mt-4 text-lg text-stone-300/70 max-w-2xl mx-auto">
            {t.valori.subtitle}
          </p>
        </AnimatedSection>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {valori.map((v) => (
            <motion.div
              key={v.title}
              variants={cardVariant}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center mb-5 group-hover:bg-amber-400/30 transition-colors">
                <v.icon className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{v.title}</h3>
              <p className="text-stone-300/60 text-sm leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Sezione Contatti ─────────────────────────────────────────────────────────
function ContattiSection() {
  const { language } = useLanguage()
  const t = translations[language]
  const [formData, setFormData] = useState({ nome: '', email: '', telefono: '', messaggio: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formData.nome || !formData.email || !formData.messaggio) {
      setStatus('error')
      return
    }
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setStatus('success')
        setFormData({ nome: '', email: '', telefono: '', messaggio: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const contatti = [
    { icon: Phone, label: t.contatti.telefono, value: '+39 081 8232059', href: 'tel:+390818232059' },
    { icon: Phone, label: 'Mobile', value: '+39 320 8519307', href: 'tel:+393208519307' },
    { icon: Mail, label: t.contatti.email, value: 'info@softmaint.it', href: 'mailto:info@softmaint.it' },
    { icon: MapPin, label: t.contatti.sede, value: t.doveSiamo.indirizzoValue, href: '' },
  ]

  return (
    <section id="contatti" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          {/* <span className="text-amber-600 font-semibold text-sm uppercase tracking-widest">{t.contatti.label}</span> */}
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-800">
            {t.contatti.title}
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            {t.contatti.subtitle}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Info contatti */}
          <AnimatedSection variants={fadeInLeft} className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl p-8 text-white">
              {/* <h3 className="text-xl font-bold mb-6">{t.contatti.infoTitle}</h3> */}
              <div className="space-y-5">
                {contatti.map((c) => (
                  <a key={c.label} href={c.href} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-amber-400/20 transition-colors shrink-0">
                      <c.icon className="w-5 h-5 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-xs text-amber-300 mb-0.5">{c.label}</div>
                      <div className="text-sm font-medium">{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Orari */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4">{t.contatti.orariTitle}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t.contatti.orariLunVen}</span>
                  <span className="font-semibold text-gray-700">{t.contatti.orariOrari}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t.contatti.orariSabDom}</span>
                  <span className="text-red-400">{t.contatti.orariChiuso}</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection variants={fadeInRight} className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{t.contatti.formTitle}</h3>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{t.contatti.formSuccess}</h4>
                  <p className="text-gray-500 mb-6">{t.contatti.formSuccessText}</p>
                  <Button onClick={() => setStatus('idle')} variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-50">
                    {t.contatti.formAltro}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t.contatti.formNome} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Mario Rossi"
                        required
                        className="h-11 border-gray-200 focus:border-amber-400 focus:ring-amber-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        {t.contatti.formEmail} <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="mario@azienda.it"
                        required
                        className="h-11 border-gray-200 focus:border-amber-400 focus:ring-amber-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.contatti.formTelefono}
                    </label>
                    <Input
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+39 333 1234567"
                      pattern={phonePattern}
                      className="h-11 border-gray-200 focus:border-amber-400 focus:ring-amber-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t.contatti.formMessaggio} <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="messaggio"
                      value={formData.messaggio}
                      onChange={handleChange}
                      placeholder={t.contatti.formDesc}
                      required
                      rows={5}
                      className="border-gray-200 focus:border-amber-400 focus:ring-amber-200 resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-500">{t.contatti.formError}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full h-11 bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-lg font-semibold transition-all duration-200 disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        {t.contatti.formLoading}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        {t.contatti.formBtn}
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

// ─── Sezione Mappa ────────────────────────────────────────────────────────────
function MapSection() {
  const { language } = useLanguage()
  const t = translations[language]

  return (
    <section id="dove-siamo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <h3 className="text-amber-600 font-semibold text-3xl uppercase tracking-widest">{t.doveSiamo.label}</h3>
          {/* <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            {t.doveSiamo.title}
          </h2> */}
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            {t.doveSiamo.subtitle}
          </p>
        </AnimatedSection>

        <AnimatedSection variants={fadeInUp}>
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Mappa */}
            <div className="lg:flex-1">
              <div className="rounded-2xl overflow-hidden shadow-2xl h-96 lg:h-full min-h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2985.7548934369386!2d14.5257608!3d40.9321462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133bb3d03ad6366f:0xb48cebe1154bb378!2sSoftmaint%20%7C%20Software%20House!5e0!3m2!1sit!2sit!4v1712345678901"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Info Sede */}
            <div className="lg:flex-1 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-linear-to-br from-zinc-800 to-zinc-900 rounded-2xl p-8 text-white shadow-xl"
              >
                <h3 className="text-2xl font-bold mb-8">{t.doveSiamo.sedeTitle}</h3>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-400/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-sm text-amber-300 mb-2 font-semibold uppercase tracking-small">{t.doveSiamo.indirizzo}</div>
                      <div className="text-base font-medium leading-relaxed whitespace-pre-line">
                        {t.doveSiamo.indirizzoValue}
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => window.open('https://maps.google.com/maps?q=40.9321462,14.5257608', '_blank')}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 group border border-white/10"
                  >
                    {t.doveSiamo.mapBtn}
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}


// ─── App Principale ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar isHomepage={true} />
      <HeroSection />
      <ServiziSection />
      <ChiSiamoSection />
      <PartnerSection />
      <ValoriSection />
      <ContattiSection />
      <MapSection />
      <Footer />
    </main>
  )
}
