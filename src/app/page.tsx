'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Menu, X, ChevronRight, ArrowRight, Phone, Mail, MapPin,
  Database, Globe, Leaf, Factory, DollarSign, Shield,
  Zap, Users, Award, HeadphonesIcon, CheckCircle, Star,
  BarChart3, Truck, Send, ExternalLink
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
    color: 'from-blue-600 to-blue-800',
    badge: 'Finanza'
  },
  {
    id: 2,
    icon: Truck,
    title: 'WMS',
    subtitle: 'Warehouse Management System',
    description: 'Sistema di gestione magazzino avanzato per ottimizzare picking, stoccaggio, inventario e tracciabilità dei prodotti in tempo reale.',
    color: 'from-indigo-600 to-indigo-800',
    badge: 'Logistica'
  },
  {
    id: 3,
    icon: Globe,
    title: 'Web Application',
    subtitle: 'Soluzioni Web Custom',
    description: 'Sviluppo di applicazioni web su misura, responsive e performanti. Dal portale aziendale all\'app gestionale, soluzioni personalizzate per ogni esigenza.',
    color: 'from-sky-600 to-sky-800',
    badge: 'Sviluppo'
  },
  {
    id: 4,
    icon: Leaf,
    title: 'Green Project',
    subtitle: 'Sostenibilità Digitale',
    description: 'Soluzioni software orientate alla sostenibilità: riduzione della carta, ottimizzazione dei processi energetici e monitoraggio delle emissioni aziendali.',
    color: 'from-teal-600 to-teal-800',
    badge: 'Green'
  },
  {
    id: 5,
    icon: Factory,
    title: 'Azienda 4.0',
    subtitle: 'Industria del Futuro',
    description: 'Digitalizzazione dei processi produttivi. IoT, automazione, MES e integrazione con sistemi ERP per una fabbrica intelligente e connessa.',
    color: 'from-violet-600 to-violet-800',
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

// ─── Componente Navbar ───────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Servizi', href: '#servizi' },
    { label: 'Chi Siamo', href: '#chi-siamo' },
    // { label: 'Contatti', href: '#contatti' },
  ]

  const scrollTo = (href: string) => {
    setMobileOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-blue-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <button onClick={() => scrollTo('#home')} className="flex items-center gap-2 group">
            <Image
              src="/assets/logo.jpg"
              alt="Logo Softmaint"
              width={170}
              height={50}
              priority
              className={`h-9 w-auto rounded-md transition-all duration-300 ${
                scrolled ? 'bg-white p-0' : 'bg-white/95 p-1'
              }`}
            />
            <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
              scrolled ? 'text-blue-900' : 'text-white'
            }`}>
              SOFT<span className={scrolled ? 'text-blue-600' : 'text-blue-300'}>MAINT</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`text-sm font-medium transition-all duration-200 hover:opacity-80 relative group ${
                  scrolled ? 'text-gray-700' : 'text-white/90'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                  scrolled ? 'bg-blue-600' : 'bg-white'
                }`} />
              </button>
            ))}
            <Button
              onClick={() => scrollTo('#contatti')}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-full shadow-md transition-all duration-200 hover:scale-105"
            >
              Contattaci
            </Button>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'
            }`}
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
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left text-gray-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <Button
                onClick={() => scrollTo('#contatti')}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full mt-1"
              >
                Contattaci
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── Sezione Hero ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-950 via-blue-900 to-blue-800" />

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
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Badge className="mb-6 bg-blue-500/20 text-white border-blue-400/30 hover:bg-blue-500/30 text-sm px-4 py-1.5 ">
            <Star className="w-3.5 h-3.5 mr-1.5" />
            Software House Italiana
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6"
        >
          Tecnologia al Servizio
          <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-sky-300">
            del tuo Business
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-lg sm:text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Soluzioni software innovative per la gestione aziendale:
          WMS, DocFinance, WebApp personalizzate e percorsi verso l&apos;Azienda 4.0.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => document.querySelector('#servizi')?.scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center gap-2 bg-white text-blue-900 font-semibold px-8 py-3.5 rounded-full hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Scopri i Servizi
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => document.querySelector('#contatti')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 text-white border border-white/30 font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            Contattaci
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
        >
          {[
            { value: '20+', label: 'Anni di Esperienza' },
            { value: '100+', label: 'Clienti Soddisfatti' },
            { value: '5', label: 'Soluzioni Software' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
              <div className="text-xs sm:text-sm text-blue-200/70 mt-1">{stat.label}</div>
            </div>
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

// ─── Sezione Servizi ─────────────────────────────────────────────────────────
function ServiziSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="servizi" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Le nostre soluzioni</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            I Nostri Software
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Soluzioni complete e personalizzabili per ogni esigenza aziendale.
            Dalla tesoreria alla logistica, dalla produzione al web.
          </p>
        </AnimatedSection>

        <motion.div
          ref={ref}
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {servizi.map((s, i) => (
            <motion.div
              key={s.id}
              variants={cardVariant}
              className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
            <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${s.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <Badge variant="outline" className="w-fit text-xs mb-3 text-blue-700 border-blue-200 bg-blue-50">
                {s.badge}
              </Badge>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{s.title}</h3>
              <p className="text-sm text-blue-600 font-medium mb-3">{s.subtitle}</p>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">{s.description}</p>
              <button
                onClick={() => document.querySelector('#contatti')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-5 flex items-center gap-1.5 text-blue-600 text-sm font-semibold hover:gap-2.5 transition-all duration-200 group/btn"
              >
                Richiedi info
                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}

          {/* Card CTA */}
          <motion.div
            variants={cardVariant}
            className="bg-linear-to-br from-blue-900 to-blue-700 rounded-2xl p-6 flex flex-col justify-between text-white"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <Send className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Hai un&apos;esigenza specifica?</h3>
              <p className="text-blue-100/80 text-sm leading-relaxed">
                Il nostro team di esperti è pronto ad analizzare le tue necessità e proporre la soluzione più adatta al tuo business.
              </p>
            </div>
            <button
              onClick={() => document.querySelector('#contatti')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-6 flex items-center justify-center gap-2 bg-white text-blue-900 font-semibold px-5 py-2.5 rounded-full hover:bg-blue-50 transition-colors text-sm"
            >
              Parliamone <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Sezione Chi Siamo ────────────────────────────────────────────────────────
function ChiSiamoSection() {
  return (
    <section id="chi-siamo" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Testo */}
          <AnimatedSection variants={fadeInLeft}>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">La nostra storia</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Chi è Softmaint?
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              <strong className="text-gray-900">Dinamismo, professionalità, costante aggiornamento,
              ricerca di soluzioni personalizzate per il tuo business</strong>: tutto questo è SOFTMAINT.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              Siamo professionisti dell&apos;informatica, dell&apos;innovazione tecnologica e della comunicazione
              a tua disposizione. Da anni affianchiamo aziende di ogni dimensione nel loro percorso
              di digitalizzazione e trasformazione digitale.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              La nostra missione è semplice: creare software che fa la differenza.
              Ascoltiamo i tuoi processi, ne comprendiamo le criticità e progettiamo
              soluzioni su misura che aumentano l&apos;efficienza e la competitività della tua azienda.
            </p>
            <div className="flex flex-wrap gap-3">
              {['WMS', 'DocFinance', 'WebApp', 'Green Project', 'Azienda 4.0'].map((tag) => (
                <span key={tag} className="bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-4 py-1.5 text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </AnimatedSection>

          {/* Immagine / Visual */}
          <AnimatedSection variants={fadeInRight}>
            <div className="relative">
            <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.pexels.com/photos/8386437/pexels-photo-8386437.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Team Softmaint al lavoro"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-blue-900/40 to-transparent" />
              </div>
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
                    <div className="text-xs text-gray-500">Progetti completati</div>
                    <div className="text-lg font-bold text-gray-900">100+ clienti</div>
                  </div>
                </div>
              </motion.div>
              {/* Badge tecnologia */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -top-4 -right-4 bg-blue-900 text-white rounded-xl shadow-xl p-4"
              >
                <div className="text-xs text-blue-300 mb-1">Specializzati in</div>
                <div className="text-sm font-bold">Industry 4.0</div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

// ─── Sezione Valori ───────────────────────────────────────────────────────────
function ValoriSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 bg-linear-to-br from-blue-950 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-blue-300 font-semibold text-sm uppercase tracking-widest">Il nostro impegno</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Perché Scegliere Softmaint
          </h2>
          <p className="mt-4 text-lg text-blue-200/70 max-w-2xl mx-auto">
            Non vendiamo solo software. Costruiamo partnership durature basate sulla fiducia
            e sui risultati concreti.
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
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-5 group-hover:bg-blue-500/30 transition-colors">
                <v.icon className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{v.title}</h3>
              <p className="text-blue-100/60 text-sm leading-relaxed">{v.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Sezione Contatti ─────────────────────────────────────────────────────────
function ContattiSection() {
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
    { icon: Phone, label: 'Telefono', value: '+39 0000 000000', href: 'tel:+390000000000' },
    { icon: Mail, label: 'Email', value: 'info@softmaint.it', href: 'mailto:info@softmaint.it' },
    { icon: MapPin, label: 'Sede', value: 'Italia', href: '#' },
  ]

  return (
    <section id="contatti" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Parliamoci</span>
          <h2 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Contattaci
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            Hai un progetto in mente? Vuoi saperne di più sui nostri servizi?
            Siamo qui per te.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Info contatti */}
          <AnimatedSection variants={fadeInLeft} className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-linear-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Informazioni di Contatto</h3>
              <div className="space-y-5">
                {contatti.map((c) => (
                  <a key={c.label} href={c.href} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors shrink-0">
                      <c.icon className="w-5 h-5 text-blue-200" />
                    </div>
                    <div>
                      <div className="text-xs text-blue-300 mb-0.5">{c.label}</div>
                      <div className="text-sm font-medium">{c.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Orari */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4">Orari di disponibilità</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Lunedì – Venerdì</span>
                  <span className="font-semibold text-gray-700">9:00 – 13:00 | 14:00 – 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sabato e Domenica</span>
                  <span className="text-red-400">Chiuso</span>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Form */}
          <AnimatedSection variants={fadeInRight} className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Invia un messaggio</h3>

              {status === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Messaggio Inviato!</h4>
                  <p className="text-gray-500 mb-6">Ti risponderemo al più presto. Grazie per averci contattato.</p>
                  <Button onClick={() => setStatus('idle')} variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                    Invia un altro messaggio
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nome e Cognome <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        placeholder="Mario Rossi"
                        required
                        className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="mario@azienda.it"
                        required
                        className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Telefono
                    </label>
                    <Input
                      name="telefono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleChange}
                      placeholder="+39 333 1234567"
                      className="h-11 border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Messaggio <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      name="messaggio"
                      value={formData.messaggio}
                      onChange={handleChange}
                      placeholder="Descrivici le tue esigenze..."
                      required
                      rows={5}
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-200 resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-500">Compila tutti i campi obbligatori (*) e riprova.</p>
                  )}

                  <Button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-60"
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Invio in corso...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Invia Messaggio
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

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear()
  const scrollTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-800">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/assets/SM_Logo.jpg"
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
              Professionisti dell&apos;informatica, dell&apos;innovazione tecnologica
              e della comunicazione. Software su misura per il tuo business.
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
            <h4 className="text-white font-semibold mb-4">Navigazione</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Servizi', href: '#servizi' },
                { label: 'Chi Siamo', href: '#chi-siamo' },
                { label: 'Contatti', href: '#contatti' },
              ].map(link => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="hover:text-blue-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Soluzioni */}
          <div>
            <h4 className="text-white font-semibold mb-4">Soluzioni</h4>
            <ul className="space-y-2 text-sm">
              {['DocFinance', 'WMS', 'Web Application', 'Green Project', 'Azienda 4.0'].map(s => (
                <li key={s}>
                  <button
                    onClick={() => scrollTo('#servizi')}
                    className="hover:text-blue-400 transition-colors text-left"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>&copy; {year} Softmaint S.r.l. – Tutti i diritti riservati</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
            <span className="text-gray-600">P.IVA: 00000000000</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── App Principale ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ServiziSection />
      <ChiSiamoSection />
      <ValoriSection />
      <ContattiSection />
      <Footer />
    </main>
  )
}
