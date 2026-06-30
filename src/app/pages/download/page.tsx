'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import {
    Download,
    Search,
    FileText,
    Monitor,
    File,
    FolderArchive,
    RefreshCw,
    HelpCircle,
    ArrowRight,
    Info
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { useLanguage } from '@/components/LanguageProvider'
import { translations } from '@/lib/translations'

interface DownloadFile {
    name: string
    path: string
    size: number
    ext: string
    lastModified: string
}

// Metadata mappings for known files (in Italian)
const fileMetadataIT: Record<string, { title: string; description: string; category: string; badge: string }> = {
    'supremo.exe': {
        title: 'Supremo Remote Desktop',
        description: 'Software di supporto remoto rapido, sicuro e affidabile. Consente ai nostri operatori di assistenza tecnica di collegarsi al tuo computer per risolvere problematiche in tempo reale.',
        category: 'software',
        badge: 'Assistenza Tecnica'
    },
    'smart_agenti_brochure.pdf': {
        title: 'Brochure Smart Agenti',
        description: 'Soluzione mobile per agenti e rete vendita: ordini rapidi, storico acquisti, CRM integrato e monitoraggio delle scadenze contabili direttamente da tablet o smartphone.',
        category: 'documenti',
        badge: 'Rete Vendita'
    },
    'smart_logistica_brochure.pdf': {
        title: 'Brochure Smart Logistica',
        description: 'Gestione magazzino e logistica evoluta: ottimizza prelievi guidati, inventario real-time e tracciabilità totale dei lotti con sincronizzazione bidirezionale con il tuo ERP.',
        category: 'documenti',
        badge: 'Logistica'
    },
    'smart_mail_brochure.pdf': {
        title: 'Brochure Smart @MAIL',
        description: 'Automatizza l\'invio di estratti conto, solleciti amministrativi e notifiche periodiche ai clienti, migliorando il flusso di cassa e riducendo il tempo dedicato ad attività manuali.',
        category: 'documenti',
        badge: 'Automazione Mail'
    },
    'smart_produzione_brochure.pdf': {
        title: 'Brochure Smart Produzione',
        description: 'Controllo ordini di lavoro (ODL), avanzamento reparti in tempo reale, gestione materiali, tracciabilità completa di lotti e controllo qualità integrato.',
        category: 'documenti',
        badge: 'Produzione MES'
    },
    'smart_b2b_brochure.pdf': {
        title: 'Brochure Smart B2B',
        description: 'Portale e-commerce B2B per consentire ai tuoi clienti di inserire ordini online, visualizzare il catalogo personalizzato ed effettuare il monitoraggio amministrativo autonomamente.',
        category: 'documenti',
        badge: 'Portale B2B'
    }
}

// Metadata mappings for known files (in English)
const fileMetadataEN: Record<string, { title: string; description: string; category: string; badge: string }> = {
    'supremo.exe': {
        title: 'Supremo Remote Desktop',
        description: 'Fast, secure, and reliable remote support software. Allows our technical support agents to connect to your computer to resolve issues in real-time.',
        category: 'software',
        badge: 'Technical Support'
    },
    'smart_agenti_brochure.pdf': {
        title: 'Smart Agenti Brochure',
        description: 'Mobile solution for sales agents: quick order entry, purchase history, integrated CRM, and customer credit monitoring directly from tablets or smartphones.',
        category: 'documenti',
        badge: 'Sales Force'
    },
    'smart_logistica_brochure.pdf': {
        title: 'Smart Logistica Brochure',
        description: 'Advanced inventory and warehouse management: optimize guided picking, real-time inventory, and total lot traceability with bidirectionally synced ERP data.',
        category: 'documenti',
        badge: 'WMS'
    },
    'smart_mail_brochure.pdf': {
        title: 'Smart @MAIL Brochure',
        description: 'Automate invoice reminders, account statements, and periodic customer alerts, accelerating cash collections and eliminating repetitive administrative work.',
        category: 'documenti',
        badge: 'Email Automation'
    },
    'smart_produzione_brochure.pdf': {
        title: 'Smart Produzione Brochure',
        description: 'Work order (ODL) control, real-time manufacturing stage tracking, materials allocation, full lot traceability, and integrated quality control.',
        category: 'documenti',
        badge: 'Production MES'
    },
    'smart_b2b_brochure.pdf': {
        title: 'Smart B2B Brochure',
        description: 'Integrated B2B e-commerce platform allowing customers to place orders online, view client-specific pricing catalogs, and track accounting invoices.',
        category: 'documenti',
        badge: 'B2B Portal'
    }
}

export default function DownloadPage() {
    const { language } = useLanguage()
    const t = translations[language]

    const [files, setFiles] = useState<DownloadFile[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [activeCategory, setActiveCategory] = useState<string>('all')

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/downloads')
                if (!res.ok) throw new Error('Impossibile caricare i file.')
                const data = await res.json()
                setFiles(data)
            } catch (err: any) {
                console.error('Failed to load files:', err)
                setError(err.message || 'Errore imprevisto nel recupero dei file.')
            } finally {
                setLoading(false)
            }
        }
        fetchFiles()
    }, [])

    // Helper to format file size
    const formatSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
    }

    // Get localized file information
    const getFileDetails = (filename: string) => {
        const key = filename.toLowerCase()
        const metadata = language === 'it' ? fileMetadataIT : fileMetadataEN

        if (metadata[key]) {
            return metadata[key]
        }

        // Dynamic fallback for unknown files
        const cleanName = filename
            .replace(/\.[^/.]+$/, '') // remove ext
            .replace(/[_-]/g, ' ') // replace hyphens and underscores

        const formattedTitle = cleanName.charAt(0).toUpperCase() + cleanName.slice(1)
        const isDoc = filename.toLowerCase().endsWith('.pdf')

        return {
            title: formattedTitle,
            description: language === 'it'
                ? `Documento o risorsa utile fornito da Softmaint per clienti e partner.`
                : `Useful resource or document provided by Softmaint for clients and partners.`,
            category: isDoc ? 'documenti' : 'altro',
            badge: isDoc
                ? (language === 'it' ? 'Documento' : 'Document')
                : (language === 'it' ? 'Risorsa' : 'Utility')
        }
    }

    // Categories list
    const categories = useMemo(() => [
        { id: 'all', label: language === 'it' ? 'Tutti' : 'All' },
        { id: 'software', label: language === 'it' ? 'Software (.exe)' : 'Software (.exe)' },
        { id: 'documenti', label: language === 'it' ? 'Brochure (.pdf)' : 'Brochures (.pdf)' },
        { id: 'altro', label: language === 'it' ? 'Altro' : 'Other' }
    ], [language])

    // Filtered files
    const filteredFiles = useMemo(() => {
        return files.filter(file => {
            const details = getFileDetails(file.name)
            const matchesSearch =
                details.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                details.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                file.name.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesCategory = activeCategory === 'all' || details.category === activeCategory

            return matchesSearch && matchesCategory
        })
    }, [files, searchQuery, activeCategory, language])

    // Icon selector based on extension
    const renderIcon = (ext: string) => {
        const baseClass = "w-6 h-6 text-white"
        switch (ext) {
            case 'exe':
                return <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20"><Monitor className={baseClass} /></div>
            case 'pdf':
                return <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20"><FileText className={baseClass} /></div>
            case 'zip':
            case 'rar':
            case '7z':
                return <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20"><FolderArchive className={baseClass} /></div>
            default:
                return <div className="w-12 h-12 rounded-xl bg-slate-500 flex items-center justify-center shadow-lg shadow-slate-500/20"><File className={baseClass} /></div>
        }
    }

    // Variants for staggered entrance
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 25 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
    }

    return (
        <>
            <Navbar backHref="/" backLabel={language === 'it' ? 'Torna alla Home' : 'Back to Home'} />

            <main className="min-h-screen bg-linear-to-b from-slate-50 via-white to-slate-100 text-slate-900 pt-20 lg:pt-24 pb-20">

                {/* Decorative Blur Backgrounds */}
                <div className="absolute top-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-5 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

                {/* Hero Section */}
                <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mb-4">
                            <Info className="w-3.5 h-3.5" />
                            {language === 'it' ? 'Softmaint Downloads' : 'Softmaint Downloads'}
                        </span>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 mb-4 bg-clip-text">
                            {language === 'it' ? 'Area Download' : 'Download Area'}
                        </h1>
                        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
                            {language === 'it'
                                ? 'Scarica strumenti di assistenza tecnica remota e consulta o salva in locale le brochure dettagliate delle nostre soluzioni software.'
                                : 'Download remote technical support tools and view or download detailed brochures of our software solutions locally.'}
                        </p>
                    </motion.div>
                </section>

                {/* Filters and Search */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">

                    {/* Search Box */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="relative max-w-xl mx-auto"
                    >
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            placeholder={language === 'it' ? 'Cerca un file o una brochure...' : 'Search a file or brochure...'}
                            className="block w-full pl-12 pr-4 py-3.5 border border-slate-200/80 rounded-2xl bg-white shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </motion.div>

                    {/* Categories Filter */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-2 mt-8 mb-12"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${activeCategory === cat.id
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-105'
                                        : 'bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-50'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </motion.div>
                </section>

                {/* Grid Download Elements */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="animate-pulse bg-white border border-slate-100 rounded-3xl p-6 h-64 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                                            <div className="w-24 h-5 bg-slate-200 rounded-md" />
                                        </div>
                                        <div className="w-3/4 h-6 bg-slate-200 rounded-md" />
                                        <div className="w-full h-12 bg-slate-200 rounded-md" />
                                    </div>
                                    <div className="w-full h-11 bg-slate-200 rounded-xl" />
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && error && (
                        <div className="max-w-md mx-auto text-center py-12 px-6 bg-red-50/50 border border-red-100 rounded-3xl">
                            <p className="text-red-800 font-semibold mb-2">
                                {language === 'it' ? 'Si è verificato un errore' : 'An error occurred'}
                            </p>
                            <p className="text-red-600/80 text-sm mb-6">{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-full hover:bg-red-700 transition-colors shadow-sm"
                            >
                                <RefreshCw className="w-4 h-4" />
                                {language === 'it' ? 'Riprova' : 'Retry'}
                            </button>
                        </div>
                    )}

                    {!loading && !error && filteredFiles.length === 0 && (
                        <div className="max-w-md mx-auto text-center py-16">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <HelpCircle className="w-8 h-8" />
                            </div>
                            <p className="text-slate-900 font-bold text-lg mb-1">
                                {language === 'it' ? 'Nessun risultato trovato' : 'No results found'}
                            </p>
                            <p className="text-slate-500 text-sm mb-6">
                                {language === 'it'
                                    ? 'Prova a modificare i termini di ricerca o la categoria selezionata.'
                                    : 'Try changing your search terms or the selected category.'}
                            </p>
                            {(searchQuery !== '' || activeCategory !== 'all') && (
                                <button
                                    onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                                    className="px-5 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-full text-xs font-semibold shadow-sm transition-all"
                                >
                                    {language === 'it' ? 'Azzera Filtri' : 'Reset Filters'}
                                </button>
                            )}
                        </div>
                    )}

                    {!loading && !error && filteredFiles.length > 0 && (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredFiles.map((file) => {
                                    const details = getFileDetails(file.name)
                                    return (
                                        <motion.article
                                            key={file.name}
                                            variants={cardVariants}
                                            layout
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                                        >
                                            {/* Decorative corner accent */}
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-500/5 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            <div>
                                                {/* Header icon and category badge */}
                                                <div className="flex justify-between items-start mb-4">
                                                    {renderIcon(file.ext)}
                                                    <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100/90 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200/30">
                                                        {details.badge}
                                                    </span>
                                                </div>

                                                {/* Title & Description */}
                                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-200 leading-snug mb-2">
                                                    {details.title}
                                                </h3>
                                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-6">
                                                    {details.description}
                                                </p>
                                            </div>

                                            {/* Footer card action */}
                                            <div>
                                                <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-100">
                                                    <span className="font-semibold uppercase text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                                        {file.ext}
                                                    </span>
                                                    <span className="font-medium">
                                                        {formatSize(file.size)}
                                                    </span>
                                                </div>

                                                <a
                                                    href={file.path}
                                                    download={file.name}
                                                    className="mt-4 w-full py-3 px-4 bg-slate-50 hover:bg-blue-600 text-slate-700 hover:text-white rounded-2xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 group/btn border border-slate-200/50 hover:border-blue-600 cursor-pointer"
                                                >
                                                    {language === 'it' ? 'Scarica Risorsa' : 'Download Resource'}
                                                    <Download className="w-4 h-4 group-hover/btn:translate-y-0.5 transition-transform duration-200" />
                                                </a>
                                            </div>
                                        </motion.article>
                                    )
                                })}
                            </AnimatePresence>
                        </motion.div>
                    )}

                </section>

            </main>

            <Footer />
        </>
    )
}