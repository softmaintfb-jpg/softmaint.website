'use client';

import { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Phone, Smartphone, Settings, Send, CheckCircle2,
    UploadCloud, Paperclip, Trash2, AlertCircle, FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from '@/components/LanguageProvider';
import { translations } from '@/lib/translations';

export default function WebTicketPage() {
    const { language } = useLanguage();
    const t = translations[language];

    const [activeTab, setActiveTab] = useState<'ERP' | 'WEBAPP'>('ERP');

    // Requester fields
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [ragioneSociale, setRagioneSociale] = useState('');
    const [email, setEmail] = useState('');
    const [telefonoFisso, setTelefonoFisso] = useState('');
    const [cellulare, setCellulare] = useState('');

    // Ticket fields
    const [areaTematica, setAreaTematica] = useState('');
    const [descrizione, setDescrizione] = useState('');
    const [allegato, setAllegato] = useState<File | null>(null);
    const [dragActive, setDragActive] = useState(false);

    // Status
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Update default selected category when activeTab or language changes
    useEffect(() => {
        if (activeTab === 'ERP') {
            setAreaTematica(t.webticketPage.erpOptions.option1);
        } else {
            setAreaTematica(t.webappPage.smartLogistica.name);
        }
    }, [activeTab, language, t]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

        if (!allowedTypes.includes(file.type)) {
            setErrorMessage(language === 'it'
                ? 'Tipo di file non supportato. Carica solo PDF, PNG o JPG.'
                : 'Unsupported file type. Please upload PDF, PNG or JPG.'
            );
            setStatus('error');
            return;
        }

        if (file.size > maxSize) {
            setErrorMessage(language === 'it'
                ? 'Il file supera il limite di 5MB.'
                : 'File exceeds the 5MB size limit.'
            );
            setStatus('error');
            return;
        }

        setAllegato(file);
        setErrorMessage('');
        if (status === 'error') {
            setStatus('idle');
        }
    };

    const removeFile = () => {
        setAllegato(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('cognome', cognome);
        formData.append('ragioneSociale', ragioneSociale);
        formData.append('email', email);
        formData.append('telefonoFisso', telefonoFisso);
        formData.append('cellulare', cellulare);
        formData.append('tipo', activeTab);
        formData.append('areaTematica', areaTematica);
        formData.append('descrizione', descrizione);
        if (allegato) {
            formData.append('allegato', allegato);
        }

        try {
            const response = await fetch('/api/webticket', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || t.webticketPage.errorSend);
            }

            setStatus('success');
            // Reset fields
            setNome('');
            setCognome('');
            setRagioneSociale('');
            setEmail('');
            setTelefonoFisso('');
            setCellulare('');
            setDescrizione('');
            setAllegato(null);
        } catch (error: any) {
            setErrorMessage(error.message || t.webticketPage.errorSend);
            setStatus('error');
        }
    };

    return (
        <div className="bg-stone-50 min-h-screen flex flex-col justify-between">
            <Navbar backHref="/" backLabel={language === 'it' ? 'Torna alla Home' : 'Back to Home'} />

            <main className="flex-1 pt-24 lg:pt-28 pb-20">
                {/* Background glowing decorations */}
                <div className="absolute top-20 right-10 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 max-w-5xl relative z-10">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-4">
                            <Settings className="w-3.5 h-3.5 animate-spin" />
                            {t.webticketPage.badge}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
                            {t.webticketPage.title}
                        </h1>
                        <p className="text-zinc-500 text-base md:text-lg mt-2 max-w-xl mx-auto">
                            {t.webticketPage.subtitle}
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex justify-center mb-10 bg-stone-200/50 p-1.5 rounded-2xl max-w-xs mx-auto border border-stone-200">
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab('ERP');
                                setErrorMessage('');
                                if (status === 'error') setStatus('idle');
                            }}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'ERP'
                                ? 'bg-white text-zinc-950 shadow-xs border border-stone-300/40 font-extrabold'
                                : 'text-zinc-500 hover:text-zinc-900'
                                }`}
                        >
                            ERP
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setActiveTab('WEBAPP');
                                setErrorMessage('');
                                if (status === 'error') setStatus('idle');
                            }}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === 'WEBAPP'
                                ? 'bg-white text-zinc-950 shadow-xs border border-stone-300/40 font-extrabold'
                                : 'text-zinc-500 hover:text-zinc-900'
                                }`}
                        >
                            Smart WebAPP
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {status === 'success' ? (
                            <motion.div
                                key="success-screen"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-md max-w-2xl mx-auto border border-stone-200"
                            >
                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-zinc-900 mb-3">{t.webticketPage.successTitle}</h3>
                                <p className="text-zinc-600 mb-8 max-w-md mx-auto">
                                    {t.webticketPage.successDesc}
                                </p>
                                <Button
                                    onClick={() => setStatus('idle')}
                                    className="bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-full px-8 py-3 font-semibold shadow-xs transition-all cursor-pointer"
                                >
                                    {t.webticketPage.btnAnother}
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="ticket-form"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                onSubmit={handleSubmit}
                                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
                            >
                                {/* Left Side: Requester Details */}
                                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-stone-200 lg:col-span-6 space-y-6">
                                    <h2 className="text-xl font-bold text-zinc-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                                        <User className="w-5 h-5 text-amber-500" />
                                        {t.webticketPage.sectionRequester}
                                    </h2>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                                {t.webticketPage.labelNome} <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                value={nome}
                                                onChange={e => setNome(e.target.value)}
                                                required
                                                placeholder="Mario"
                                                className="focus:ring-amber-400 focus:border-amber-400 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                                {t.webticketPage.labelCognome} <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                value={cognome}
                                                onChange={e => setCognome(e.target.value)}
                                                required
                                                placeholder="Rossi"
                                                className="focus:ring-amber-400 focus:border-amber-400 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                            {t.webticketPage.labelRagioneSociale} <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={ragioneSociale}
                                            onChange={e => setRagioneSociale(e.target.value)}
                                            required
                                            placeholder="Nome Azienda"
                                            className="focus:ring-amber-400 focus:border-amber-400 rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                            {t.webticketPage.labelEmail} <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                            placeholder="mario@azienda.it"
                                            className="focus:ring-amber-400 focus:border-amber-400 rounded-xl"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                                {t.webticketPage.labelTelefonoFisso}
                                            </label>
                                            <Input
                                                type="tel"
                                                value={telefonoFisso}
                                                onChange={e => setTelefonoFisso(e.target.value)}
                                                placeholder="081 123456"
                                                className="focus:ring-amber-400 focus:border-amber-400 rounded-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                                {t.webticketPage.labelCellulare} <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                type="tel"
                                                value={cellulare}
                                                onChange={e => setCellulare(e.target.value)}
                                                required
                                                placeholder="333 1234567"
                                                className="focus:ring-amber-400 focus:border-amber-400 rounded-xl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Ticket Details */}
                                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-stone-200 lg:col-span-6 space-y-6">
                                    <h2 className="text-xl font-bold text-zinc-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-amber-500" />
                                        {t.webticketPage.sectionTicket}
                                    </h2>

                                    {/* Product Specific Dropdown */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                            {t.webticketPage.labelSelectArea} <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={areaTematica}
                                            onChange={e => setAreaTematica(e.target.value)}
                                            required
                                            className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm text-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all cursor-pointer h-10"
                                        >
                                            {activeTab === 'ERP' ? (
                                                <>
                                                    <option value={t.webticketPage.erpOptions.option1}>{t.webticketPage.erpOptions.option1}</option>
                                                    <option value={t.webticketPage.erpOptions.option2}>{t.webticketPage.erpOptions.option2}</option>
                                                    <option value={t.webticketPage.erpOptions.option3}>{t.webticketPage.erpOptions.option3}</option>
                                                    <option value={t.webticketPage.erpOptions.option4}>{t.webticketPage.erpOptions.option4}</option>
                                                    <option value={t.webticketPage.erpOptions.option5}>{t.webticketPage.erpOptions.option5}</option>
                                                    <option value={t.webticketPage.erpOptions.option6}>{t.webticketPage.erpOptions.option6}</option>
                                                    <option value={t.webticketPage.erpOptions.option7}>{t.webticketPage.erpOptions.option7}</option>

                                                </>
                                            ) : (
                                                <>
                                                    <option value={t.webappPage.smartLogistica.name}>{t.webappPage.smartLogistica.name}</option>
                                                    <option value={t.webappPage.smartAgenti.name}>{t.webappPage.smartAgenti.name}</option>
                                                    <option value={t.webappPage.smartMail.name}>{t.webappPage.smartMail.name}</option>
                                                    <option value={t.webappPage.smartProduzione.name}>{t.webappPage.smartProduzione.name}</option>
                                                    <option value={t.webappPage.smartB2B.name}>{t.webappPage.smartB2B.name}</option>
                                                    <option value={t.webappPage.smartTentataVendita.name}>{t.webappPage.smartTentataVendita.name}</option>
                                                </>
                                            )}
                                        </select>
                                    </div>

                                    {/* Large Problem Description Textarea */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                            {t.webticketPage.labelDescrizione} <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={descrizione}
                                            onChange={e => setDescrizione(e.target.value)}
                                            required
                                            rows={6}
                                            placeholder={t.webticketPage.placeholderDescrizione}
                                            className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-zinc-700 focus:outline-hidden focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-zinc-400"
                                        />
                                    </div>

                                    {/* Attachment Section */}
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                            {t.webticketPage.labelAllegato}
                                        </label>

                                        <div
                                            onDragEnter={handleDrag}
                                            onDragOver={handleDrag}
                                            onDragLeave={handleDrag}
                                            onDrop={handleDrop}
                                            className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[140px] cursor-pointer ${dragActive
                                                ? 'border-amber-400 bg-amber-50/50'
                                                : allegato
                                                    ? 'border-emerald-300 bg-emerald-50/10'
                                                    : 'border-stone-200 hover:border-amber-300 bg-stone-50/40 hover:bg-stone-50/80'
                                                }`}
                                        >
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                                accept=".pdf,.png,.jpg,.jpeg"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />

                                            {allegato ? (
                                                <div className="w-full flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-2xs relative z-10">
                                                    <div className="flex items-center gap-2.5 overflow-hidden text-left">
                                                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                                                            {allegato.type === 'application/pdf' ? (
                                                                <FileText className="w-5 h-5" />
                                                            ) : (
                                                                <Paperclip className="w-5 h-5" />
                                                            )}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-sm font-semibold text-zinc-800 truncate max-w-[200px] sm:max-w-xs">{allegato.name}</p>
                                                            <p className="text-[10px] font-bold text-zinc-400 uppercase">{(allegato.size / 1024).toFixed(0)} KB</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            removeFile();
                                                        }}
                                                        className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center pointer-events-none">
                                                    <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
                                                    <p className="text-xs font-semibold text-zinc-600 max-w-[240px]">
                                                        {t.webticketPage.placeholderAllegato}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons / Error Display */}
                                    <div className="pt-2">
                                        <AnimatePresence>
                                            {status === 'error' && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 5 }}
                                                    className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-100 flex items-start gap-2.5 mb-4"
                                                >
                                                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                    <div>
                                                        <span className="font-semibold">{language === 'it' ? 'Errore' : 'Error'}</span>
                                                        <p className="text-xs mt-0.5">{errorMessage}</p>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <Button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <Settings className="w-4 h-4 animate-spin" />
                                                    {t.webticketPage.btnLoading}
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    {t.webticketPage.btnSubmit}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            <Footer />
        </div>
    );
}