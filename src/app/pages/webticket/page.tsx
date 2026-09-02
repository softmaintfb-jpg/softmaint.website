'use client';

import { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Mail, Phone, Smartphone, Settings, Send, CheckCircle2,
    UploadCloud, Paperclip, Trash2, AlertCircle, FileText, Image as ImageIcon, Plus,
    Eye, X
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
    const [allegati, setAllegati] = useState<File[]>([]);
    const [dragActive, setDragActive] = useState(false);

    // Status
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Escape listener & scroll lock for preview modal
    useEffect(() => {
        if (!isPreviewOpen) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsPreviewOpen(false);
        };
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', handleEscape);
        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = prevOverflow;
        };
    }, [isPreviewOpen]);

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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndAddFiles(e.dataTransfer.files);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndAddFiles(e.target.files);
            e.target.value = '';
        }
    };

    const validateAndAddFiles = (files: FileList | File[]) => {
        const fileList = Array.from(files);
        if (fileList.length === 0) return;

        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
        const validFiles: File[] = [];
        const errors: string[] = [];

        for (const file of fileList) {
            const isDuplicate = allegati.some(
                (f) => f.name === file.name && f.size === file.size && f.lastModified === file.lastModified
            );
            if (isDuplicate) {
                continue;
            }

            if (!allowedTypes.includes(file.type)) {
                errors.push(
                    language === 'it'
                        ? `"${file.name}": Tipo di file non supportato (solo PDF, PNG, JPG).`
                        : `"${file.name}": Unsupported file type (PDF, PNG, JPG only).`
                );
                continue;
            }

            if (file.size > maxSize) {
                errors.push(
                    language === 'it'
                        ? `"${file.name}": Supera il limite di 5MB.`
                        : `"${file.name}": Exceeds the 5MB size limit.`
                );
                continue;
            }

            validFiles.push(file);
        }

        if (errors.length > 0) {
            setErrorMessage(errors.join(' '));
            setStatus('error');
        } else {
            setErrorMessage('');
            if (status === 'error') {
                setStatus('idle');
            }
        }

        if (validFiles.length > 0) {
            setAllegati((prev) => [...prev, ...validFiles]);
        }
    };

    const removeFile = (indexToRemove: number) => {
        setAllegati((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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
        allegati.forEach((file) => {
            formData.append('allegati', file);
        });

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
            setAllegati([]);
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
                                                onChange={e => setNome(e.target.value.toUpperCase())}
                                                required
                                                placeholder="Mario"
                                                className="focus:ring-amber-400 focus:border-amber-400 rounded-xl uppercase"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                                {t.webticketPage.labelCognome} <span className="text-red-500">*</span>
                                            </label>
                                            <Input
                                                value={cognome}
                                                onChange={e => setCognome(e.target.value.toUpperCase())}
                                                required
                                                placeholder="Rossi"
                                                className="focus:ring-amber-400 focus:border-amber-400 rounded-xl uppercase"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                            {t.webticketPage.labelRagioneSociale} <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={ragioneSociale}
                                            onChange={e => setRagioneSociale(e.target.value.toUpperCase())}
                                            required
                                            placeholder="Nome Azienda"
                                            className="focus:ring-amber-400 focus:border-amber-400 rounded-xl uppercase"
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
                                                    <option value={t.webappPage.smartBI.name}>{t.webappPage.smartBI.name}</option>
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
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                                                {t.webticketPage.labelAllegato}
                                            </label>
                                            {allegati.length > 0 && (
                                                <span className="text-xs text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                                                    {allegati.length} {allegati.length === 1 ? (language === 'it' ? 'file caricato' : 'file attached') : (language === 'it' ? 'file caricati' : 'files attached')}
                                                </span>
                                            )}
                                        </div>

                                        {allegati.length === 0 ? (
                                            <div
                                                onDragEnter={handleDrag}
                                                onDragOver={handleDrag}
                                                onDragLeave={handleDrag}
                                                onDrop={handleDrop}
                                                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all flex flex-col items-center justify-center min-h-[140px] cursor-pointer ${dragActive
                                                    ? 'border-amber-400 bg-amber-50/50'
                                                    : 'border-stone-200 hover:border-amber-300 bg-stone-50/40 hover:bg-stone-50/80'
                                                    }`}
                                            >
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileChange}
                                                    accept=".pdf,.png,.jpg,.jpeg"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <div className="flex flex-col items-center pointer-events-none">
                                                    <UploadCloud className="w-8 h-8 text-zinc-400 mb-2" />
                                                    <p className="text-xs font-semibold text-zinc-600 max-w-[240px]">
                                                        {t.webticketPage.placeholderAllegato}
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2.5">
                                                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                                                    {allegati.map((file, idx) => (
                                                        <div
                                                            key={`${file.name}-${file.size}-${idx}`}
                                                            className="w-full flex items-center justify-between gap-3 bg-white p-2.5 rounded-xl border border-stone-200 shadow-2xs hover:border-amber-200 transition-all"
                                                        >
                                                            <div className="flex items-center gap-2.5 overflow-hidden text-left min-w-0">
                                                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0">
                                                                    {file.type === 'application/pdf' ? (
                                                                        <FileText className="w-4 h-4" />
                                                                    ) : file.type.startsWith('image/') ? (
                                                                        <ImageIcon className="w-4 h-4" />
                                                                    ) : (
                                                                        <Paperclip className="w-4 h-4" />
                                                                    )}
                                                                </div>
                                                                <div className="overflow-hidden min-w-0">
                                                                    <p className="text-xs font-semibold text-zinc-800 truncate" title={file.name}>
                                                                        {file.name}
                                                                    </p>
                                                                    <p className="text-[10px] font-bold text-zinc-400 uppercase">
                                                                        {(file.size / 1024).toFixed(0)} KB
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    removeFile(idx);
                                                                }}
                                                                className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                                                                title={language === 'it' ? 'Rimuovi file' : 'Remove file'}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Add more files dropzone */}
                                                <div
                                                    onDragEnter={handleDrag}
                                                    onDragOver={handleDrag}
                                                    onDragLeave={handleDrag}
                                                    onDrop={handleDrop}
                                                    className={`relative border border-dashed rounded-xl py-2.5 px-3 text-center transition-all flex items-center justify-center gap-2 cursor-pointer ${dragActive
                                                        ? 'border-amber-400 bg-amber-50/50'
                                                        : 'border-stone-200 hover:border-amber-400 hover:bg-amber-50/30 bg-stone-50/50'
                                                        }`}
                                                >
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={handleFileChange}
                                                        accept=".pdf,.png,.jpg,.jpeg"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    />
                                                    <Plus className="w-3.5 h-3.5 text-amber-600" />
                                                    <span className="text-xs font-semibold text-zinc-600">
                                                        {t.webticketPage.addMoreFiles || (language === 'it' ? 'Aggiungi altri file' : 'Add more files')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
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

                                        <div className="flex flex-col sm:flex-row items-center gap-3">
                                            <Button
                                                type="button"
                                                onClick={() => setIsPreviewOpen(true)}
                                                className="w-full sm:w-1/2 bg-stone-100 hover:bg-stone-200 text-zinc-800 font-semibold py-3 rounded-xl border border-stone-200 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                                            >
                                                <Eye className="w-4 h-4 text-amber-600" />
                                                {t.webticketPage.btnPreview}
                                            </Button>

                                            <Button
                                                type="submit"
                                                disabled={status === 'loading'}
                                                className="w-full sm:w-1/2 bg-amber-500 hover:bg-amber-400 text-zinc-900 font-bold py-3 rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-sm"
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
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Modal Anteprima Email */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-xs overflow-y-auto"
                        onClick={() => setIsPreviewOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 15 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 my-8 max-h-[90vh] flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="bg-stone-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-amber-400" />
                                    <span className="font-semibold text-sm tracking-wide">
                                        {t.webticketPage.previewTitle}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                                    title={t.webticketPage.previewClose}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Email Metadata Bar */}
                            <div className="bg-stone-100/90 border-b border-stone-200 px-5 py-3 text-xs text-stone-600 space-y-1.5 shrink-0">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold w-20 shrink-0 text-stone-500 uppercase">{t.webticketPage.previewSubject}:</span>
                                    <span className="font-bold text-stone-900 truncate">
                                        {ragioneSociale.trim() || '[Ragione Sociale]'} - {areaTematica || '[Area Tematica]'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold w-20 shrink-0 text-stone-500 uppercase">{t.webticketPage.previewFrom}:</span>
                                    <span className="text-stone-700 truncate">
                                        SOFTMAINT SRL | WebTicket &lt;noreply@softmaint.it&gt;
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold w-20 shrink-0 text-stone-500 uppercase">{t.webticketPage.previewTo}:</span>
                                    <span className="text-stone-700 truncate">
                                        {activeTab === 'ERP' ? 'assistenza.erp@softmaint.it' : 'assistenza.webapp@softmaint.it'}, {email.trim() || '[email richiedente]'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold w-20 shrink-0 text-stone-500 uppercase">{t.webticketPage.previewReplyTo}:</span>
                                    <span className="text-stone-700 truncate">
                                        {(nome + ' ' + cognome).trim() || '[Nome Cognome]'} &lt;{email.trim() || '[email]'}&gt;
                                    </span>
                                </div>
                            </div>

                            {/* Email Body */}
                            <div className="overflow-y-auto p-4 sm:p-6 bg-stone-50 flex-1">
                                <div className="bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-stone-200 max-w-[560px] mx-auto text-zinc-800 text-sm">
                                    <h2 className="text-lg font-bold text-amber-600 border-b-2 border-amber-500 pb-2.5 mb-4">
                                        Nuovo WebTicket Ricevuto
                                    </h2>

                                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                                        Dati del Richiedente
                                    </h3>
                                    <table className="w-full border-collapse mb-5 text-xs sm:text-sm">
                                        <tbody>
                                            <tr className="border-b border-stone-100">
                                                <td className="py-1.5 font-semibold text-zinc-500 w-36">Nome e Cognome:</td>
                                                <td className="py-1.5 font-medium text-zinc-900">
                                                    {(nome + ' ' + cognome).trim() || '-'}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-stone-100">
                                                <td className="py-1.5 font-semibold text-zinc-500">Ragione Sociale:</td>
                                                <td className="py-1.5 font-medium text-zinc-900">
                                                    {ragioneSociale || '-'}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-stone-100">
                                                <td className="py-1.5 font-semibold text-zinc-500">Email:</td>
                                                <td className="py-1.5 font-medium text-amber-700">
                                                    {email || '-'}
                                                </td>
                                            </tr>
                                            <tr className="border-b border-stone-100">
                                                <td className="py-1.5 font-semibold text-zinc-500">Telefono Fisso:</td>
                                                <td className="py-1.5 font-medium text-zinc-900">
                                                    {telefonoFisso || '-'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1.5 font-semibold text-zinc-500">Cellulare:</td>
                                                <td className="py-1.5 font-medium text-zinc-900">
                                                    {cellulare || '-'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                                        Dati del Ticket
                                    </h3>
                                    <table className="w-full border-collapse mb-5 text-xs sm:text-sm">
                                        <tbody>
                                            <tr className="border-b border-stone-100">
                                                <td className="py-1.5 font-semibold text-zinc-500 w-36">Tipo Assistenza:</td>
                                                <td className="py-1.5 font-bold text-amber-700">
                                                    {activeTab}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="py-1.5 font-semibold text-zinc-500">Area/Modulo:</td>
                                                <td className="py-1.5 font-medium text-zinc-900">
                                                    {areaTematica || '-'}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                                        Descrizione del problema
                                    </h3>
                                    <div className="bg-stone-100/80 p-3.5 border-l-4 border-amber-500 rounded-sm whitespace-pre-wrap leading-relaxed text-zinc-800 text-xs sm:text-sm mb-4">
                                        {descrizione || (
                                            <span className="text-zinc-400 italic">
                                                {t.webticketPage.previewNoDesc}
                                            </span>
                                        )}
                                    </div>

                                    {/* Allegati */}
                                    {allegati.length > 0 ? (
                                        <div className="mt-4 pt-3 border-t border-stone-200">
                                            <p className="text-xs font-bold text-zinc-600 mb-2">
                                                {t.webticketPage.previewAttachments} ({allegati.length}):
                                            </p>
                                            <ul className="list-disc pl-5 space-y-1 text-xs text-zinc-600">
                                                {allegati.map((f, i) => (
                                                    <li key={i}>
                                                        <strong className="text-zinc-800">{f.name}</strong> ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="mt-4 pt-3 border-t border-stone-200 text-xs text-zinc-400 italic">
                                            {t.webticketPage.previewNoAttachments}
                                        </div>
                                    )}

                                    {/* Footer allineato a destra */}
                                    <div className="mt-8 pt-4 border-t border-stone-200 text-right text-xs sm:text-sm text-zinc-600 leading-tight">
                                        <strong className="text-zinc-900">SOFTMAINT SRL</strong><br />
                                        Team Assistenza
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer Bar */}
                            <div className="bg-white border-t border-stone-200 px-5 py-3 flex items-center justify-end gap-3 shrink-0">
                                <Button
                                    type="button"
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="bg-stone-100 hover:bg-stone-200 text-zinc-800 font-semibold px-5 py-2 rounded-xl text-sm border border-stone-200 cursor-pointer"
                                >
                                    {t.webticketPage.previewClose}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}