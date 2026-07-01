'use client';

import { useState, useEffect } from 'react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Check, FileText, Send, CheckCircle2, User, Building2, Mail, Phone, Smartphone, Settings, Euro, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type GestionaleType = 'ERP' | 'SQL' | 'SQL_ERP' | 'BKP_CLOUD' | 'VPN';

export default function Assistenza() {
    const [nome, setNome] = useState('');
    const [cognome, setCognome] = useState('');
    const [ragioneSociale, setRagioneSociale] = useState('');
    const [email, setEmail] = useState('');
    const [telefonoFisso, setTelefonoFisso] = useState('');
    const [cellulare, setCellulare] = useState('');

    const [gestionale, setGestionale] = useState<GestionaleType>('ERP');

    const [erpOptions, setErpOptions] = useState({
        bls: true,
        client: true
    });
    const [sqlOptions, setSqlOptions] = useState({
        sms: true
    });
    const [sqlErpOptions, setSqlErpOptions] = useState({
        erp: true,
        sms: true,
        bls: true,
        client: true,
        backup: true,
        backupAzienda: true,
    });
    const [backupOptions, setBackupOptions] = useState({
        cloud: true,
        aziende: 1
    });
    const [vpnOptions, setVpnOptions] = useState({
        server: true,
        client: true,
        clientCount: 1
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        if (gestionale === 'ERP') {
            setErpOptions({ bls: true, client: true });
        } else if (gestionale === 'SQL') {
            setSqlOptions({ sms: true });
        } else if (gestionale === 'BKP_CLOUD') {
            setBackupOptions({ cloud: true, aziende: 1 });
        } else if (gestionale === 'VPN') {
            setVpnOptions({ server: true, client: true, clientCount: 1 });
        }
    }, [gestionale]);

    const getPrice = () => {
        if (gestionale === 'ERP') return ' 150,00';
        if (gestionale === 'SQL') return ' 150,00';
        if (gestionale === 'SQL_ERP') return ' 350,00';
        if (gestionale === 'BKP_CLOUD') {
            const price = 50 * backupOptions.aziende;
            return ` ${price},00`;
        }
        if (gestionale === 'VPN') {
            let total = 0;
            if (vpnOptions.server) total += 350;
            if (vpnOptions.client) total += 20 * vpnOptions.clientCount;
            return ` ${total},00`;
        }
        return ' 0,00';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        const selectedOptions: string[] = [];
        if (gestionale === 'ERP') {
            if (erpOptions.bls) selectedOptions.push('Installazione ERP BLS');
            if (erpOptions.client) selectedOptions.push('Installazione Client');
        } else if (gestionale === 'SQL') {
            if (sqlOptions.sms) selectedOptions.push('Installazione Sql SMS');
        } else if (gestionale === 'SQL_ERP') {
            if (sqlErpOptions.erp) selectedOptions.push('Installazione ERP');
            if (sqlErpOptions.sms) selectedOptions.push('Installazione SQL SMS');
            if (sqlErpOptions.bls) selectedOptions.push('Installazione ERP BLS');
            if (sqlErpOptions.client) selectedOptions.push('Installazione ERP CLIENT');
            if (sqlErpOptions.backupAzienda) selectedOptions.push('Restore Backup Azienda');
        } else if (gestionale === 'BKP_CLOUD') {
            if (backupOptions.cloud) selectedOptions.push(`Backup Cloud (${backupOptions.aziende} aziende)`);
        } else if (gestionale === 'VPN') {
            if (vpnOptions.server) selectedOptions.push('VPN Server');
            if (vpnOptions.client) selectedOptions.push(`VPN Client (${vpnOptions.clientCount} client)`);
        }

        const payload = {
            nome,
            cognome,
            ragioneSociale,
            email,
            telefonoFisso,
            cellulare,
            gestionale,
            prezzoStimato: getPrice(),
            opzioniScelte: selectedOptions
        };

        try {
            const response = await fetch('/api/assistenza', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Errore');
            }
            setStatus('success');
            setNome('');
            setCognome('');
            setRagioneSociale('');
            setEmail('');
            setTelefonoFisso('');
            setCellulare('');
            setGestionale('ERP');
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="bg-stone-50 min-h-screen flex flex-col justify-between">
            <Navbar />

            <main className="flex-1 pt-24 lg:pt-28 pb-20">
                <div className="absolute top-20 right-10 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto px-4 max-w-6xl relative z-10">

                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mb-4">
                            <Settings className="w-3.5 h-3.5 animate-spin" />
                            Softmaint SRL | Ordine di servizio
                        </span>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-zinc-900 tracking-tight">
                            Richiesta Ordine di Servizio
                        </h1>
                        <p className="text-zinc-500 text-base md:text-lg mt-2 max-w-xl mx-auto">
                            Completa il modulo sottostante per richiedere un ordine di servizio.
                        </p>
                    </div>

                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-md max-w-2xl mx-auto border border-stone-200"
                        >
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 mb-3">Richiesta Inviata con Successo!</h3>
                            <p className="text-zinc-600 mb-8 max-w-md mx-auto">
                                Abbiamo preso in carico la tua richiesta. Un nostro tecnico si metterà in contatto con te per programmare l'intervento.
                            </p>
                            <Button
                                onClick={() => setStatus('idle')}
                                className="bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-full px-8 py-3 font-semibold shadow-sm transition-all"
                            >
                                Invia un'altra richiesta
                            </Button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200 lg:col-span-7 space-y-6">
                                <h2 className="text-xl font-bold text-zinc-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                                    <User className="w-5 h-5 text-amber-500" />
                                    Dati del Richiedente
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1">
                                            Nome <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={nome}
                                            onChange={e => setNome(e.target.value)}
                                            required
                                            placeholder="Mario"
                                            className="focus:ring-amber-400 focus:border-amber-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5 flex items-center gap-1">
                                            Cognome <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            value={cognome}
                                            onChange={e => setCognome(e.target.value)}
                                            required
                                            placeholder="Rossi"
                                            className="focus:ring-amber-400 focus:border-amber-400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                        Ragione Sociale <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        value={ragioneSociale}
                                        onChange={e => setRagioneSociale(e.target.value)}
                                        required
                                        placeholder="Nome Azienda SRL"
                                        className="focus:ring-amber-400 focus:border-amber-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                        E-Mail <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                        placeholder="mario@azienda.it"
                                        className="focus:ring-amber-400 focus:border-amber-400"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                            Telefono fisso
                                        </label>
                                        <Input
                                            type="tel"
                                            value={telefonoFisso}
                                            onChange={e => setTelefonoFisso(e.target.value)}
                                            placeholder="081 123456"
                                            className="focus:ring-amber-400 focus:border-amber-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                                            Cellulare <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            type="tel"
                                            value={cellulare}
                                            onChange={e => setCellulare(e.target.value)}
                                            required
                                            placeholder="333 1234567"
                                            className="focus:ring-amber-400 focus:border-amber-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-5 space-y-6">

                                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-200 space-y-6">
                                    <h2 className="text-xl font-bold text-zinc-900 border-b border-stone-100 pb-3 flex items-center gap-2">
                                        <Settings className="w-5 h-5 text-amber-500 animate-spin" />
                                        Selezionare la richiesta
                                    </h2>

                                    <div className="grid grid-cols-3 gap-2">
                                        {(['ERP', 'SQL', 'SQL_ERP', 'BKP_CLOUD', 'VPN'] as const).map((type) => {
                                            const displayMap = {
                                                ERP: 'ERP',
                                                SQL: 'SQL SMS',
                                                SQL_ERP: 'SQL | ERP',
                                                BKP_CLOUD: 'BKP Cloud',
                                                VPN: 'VPN'
                                            };
                                            const isActive = gestionale === type;
                                            return (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setGestionale(type)}
                                                    className={`py-3 px-1.5 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer text-center ${isActive
                                                        ? 'border-amber-500 bg-amber-50 text-amber-700 shadow-xs'
                                                        : 'border-stone-200 bg-white text-zinc-600 hover:bg-stone-50'
                                                        }`}
                                                >
                                                    {displayMap[type]}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/50 space-y-2">
                                        <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                                            Interventi Inclusi
                                        </span>

                                        {gestionale === 'ERP' && (
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200/60 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={erpOptions.bls}
                                                        onChange={e => setErpOptions(prev => ({ ...prev, bls: e.target.checked }))}
                                                        className="h-4.5 w-4.5 accent-amber-500"
                                                    />
                                                    <span className="text-sm font-medium text-zinc-700">Installazione ERP Bls</span>
                                                </label>
                                                <label className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200/60 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={erpOptions.client}
                                                        onChange={e => setErpOptions(prev => ({ ...prev, client: e.target.checked }))}
                                                        className="h-4.5 w-4.5 accent-amber-500"
                                                    />
                                                    <span className="text-sm font-medium text-zinc-700">Installazione ERP Client</span>
                                                </label>
                                            </div>
                                        )}

                                        {gestionale === 'BKP_CLOUD' && (
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200/60 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={backupOptions.cloud}
                                                        onChange={e => setBackupOptions(prev => ({ ...prev, cloud: e.target.checked }))}
                                                        className="h-4.5 w-4.5 accent-amber-500"
                                                    />
                                                    <span className="text-sm font-medium text-zinc-700">Backup Cloud</span>
                                                </label>
                                                <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200/60">
                                                    <span className="text-sm font-medium text-zinc-700">Numero aziende</span>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        step={1}
                                                        value={backupOptions.aziende}
                                                        onChange={e => {
                                                            const val = parseInt(e.target.value, 10);
                                                            setBackupOptions(prev => ({ ...prev, aziende: isNaN(val) ? 1 : val }));
                                                        }}
                                                        className="w-24 text-center focus:ring-amber-400 focus:border-amber-400"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {gestionale === 'VPN' && (
                                            <div className="space-y-3">
                                                <label className="flex items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-stone-200/60 cursor-pointer hover:border-amber-200 transition-all">
                                                    <div className="flex items-center gap-3">
                                                        <input
                                                            type="checkbox"
                                                            checked={vpnOptions.server}
                                                            onChange={e => setVpnOptions(prev => ({ ...prev, server: e.target.checked }))}
                                                            className="h-4.5 w-4.5 accent-amber-500 cursor-pointer"
                                                        />
                                                        <span className="text-sm font-semibold text-zinc-700">VPN Server</span>
                                                    </div>
                                                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">350,00€ una tantum</span>
                                                </label>

                                                <div className="bg-white p-3.5 rounded-xl border border-stone-200/60 space-y-3">
                                                    <label className="flex items-center justify-between gap-3 cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="checkbox"
                                                                checked={vpnOptions.client}
                                                                onChange={e => setVpnOptions(prev => ({ ...prev, client: e.target.checked }))}
                                                                className="h-4.5 w-4.5 accent-amber-500 cursor-pointer"
                                                            />
                                                            <span className="text-sm font-semibold text-zinc-700">VPN Client</span>
                                                        </div>
                                                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">20,00€ annui</span>
                                                    </label>

                                                    {vpnOptions.client && (
                                                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                                                            <span className="text-xs text-zinc-500 font-medium">Numero di Client</span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setVpnOptions(prev => ({ ...prev, clientCount: Math.max(1, prev.clientCount - 1) }))}
                                                                    className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:border-stone-300 font-bold transition-all"
                                                                >
                                                                    -
                                                                </button>
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    step={1}
                                                                    value={vpnOptions.clientCount}
                                                                    onChange={e => {
                                                                        const val = parseInt(e.target.value, 10);
                                                                        setVpnOptions(prev => ({ ...prev, clientCount: isNaN(val) ? 1 : val }));
                                                                    }}
                                                                    className="w-16 h-8 text-center text-sm font-semibold border-stone-200 focus:ring-amber-400 focus:border-amber-400 p-0"
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setVpnOptions(prev => ({ ...prev, clientCount: prev.clientCount + 1 }))}
                                                                    className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-50 hover:border-stone-300 font-bold transition-all"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {gestionale === 'SQL' && (
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-3 bg-white p-3 rounded-xl border border-stone-200/60 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={sqlOptions.sms}
                                                        onChange={e => setSqlOptions(prev => ({ ...prev, sms: e.target.checked }))}
                                                        className="h-4.5 w-4.5 accent-amber-500"
                                                    />
                                                    <span className="text-sm font-medium text-zinc-700">Installazione SQL SMS</span>
                                                </label>
                                            </div>
                                        )}

                                        {gestionale === 'SQL_ERP' && (
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200/60 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={sqlErpOptions.backupAzienda}
                                                        onChange={e => setSqlErpOptions(prev => ({ ...prev, backup: e.target.checked }))}
                                                        className="h-4.5 w-4.5 accent-amber-500"
                                                    />
                                                    <span className="text-sm font-medium text-zinc-700">Backup Azienda</span>                                                </label>
                                                <label className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200/60 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={sqlErpOptions.erp}
                                                        onChange={e => setSqlErpOptions(prev => ({ ...prev, erp: e.target.checked }))}
                                                        className="h-4.5 w-4.5 accent-amber-500"
                                                    />
                                                    <span className="text-sm font-medium text-zinc-700">Installazione ERP</span>
                                                </label>
                                                <label className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200/60 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={sqlErpOptions.sms}
                                                        onChange={e => setSqlErpOptions(prev => ({ ...prev, sms: e.target.checked }))}
                                                        className="h-4.5 w-4.5 accent-amber-500"
                                                    />
                                                    <span className="text-sm font-medium text-zinc-700">Installazione SQL SMS</span>
                                                </label>
                                                <label className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200/60 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={sqlErpOptions.bls}
                                                        onChange={e => setSqlErpOptions(prev => ({ ...prev, bls: e.target.checked }))}
                                                        className="h-4.5 w-4.5 accent-amber-500"
                                                    />
                                                    <span className="text-sm font-medium text-zinc-700">Installazione ERP Bls</span>
                                                </label>
                                                <label className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200/60 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={sqlErpOptions.client}
                                                        onChange={e => setSqlErpOptions(prev => ({ ...prev, client: e.target.checked }))}
                                                        className="h-4.5 w-4.5 accent-amber-500"
                                                    />
                                                    <span className="text-sm font-medium text-zinc-700">Installazione ERP Client</span>
                                                </label>
                                                <label className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-stone-200/60 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={sqlErpOptions.backup}
                                                        onChange={e => setSqlErpOptions(prev => ({ ...prev, backup: e.target.checked }))}
                                                        className="h-4.5 w-4.5 accent-amber-500"
                                                    />
                                                    <span className="text-sm font-medium text-zinc-700">Restore Azienda</span>
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-zinc-900 rounded-3xl p-6 md:p-8 text-white shadow-md space-y-6 relative overflow-hidden border border-zinc-800">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

                                    <h3 className="text-lg font-bold border-b border-zinc-800 pb-3 flex items-center gap-2">
                                        <Euro className="w-5 h-5 text-amber-400" />
                                        Costo Intervento
                                    </h3>

                                    <div className="flex justify-between items-baseline">
                                        <span className="text-stone-300 text-sm">Tariffa Standard:</span>
                                        <span className="text-3xl font-extrabold text-amber-400">€{getPrice()}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-xs text-stone-300 text-sm">I prezzi si intendono al netto di IVA</span>
                                    </div>

                                    {status === 'error' && (
                                        <p className="text-sm text-red-400">Si è verificato un errore durante l'invio. Riprova.</p>
                                    )}

                                    <Button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-zinc-900 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 transition-all"
                                    >
                                        {status === 'loading' ? (
                                            <span className="flex items-center gap-2">
                                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                                Invio in corso...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Send className="w-4 h-4" />
                                                Invia Richiesta
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}