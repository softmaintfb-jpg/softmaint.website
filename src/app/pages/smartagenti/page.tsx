import { WebAppProductPage } from '@/components/webapp-product-page'

export default function SmartAgentiPage() {
    return (
        <WebAppProductPage
            name="Smart Agenti"
            subtitle="L'ufficio commerciale in tasca per rete vendita e agenti"
            image="/assets/agenti.png"
            pdfPath="/assets/pdf/agenti.pdf"
            alt="Schermata Smart Agenti con ordini, CRM, storico e monitoraggio credito"
            description="Smart Agenti e la web app pensata per la forza vendita: consente di gestire ordini, consultare il catalogo, verificare anagrafiche clienti e monitorare informazioni amministrative direttamente da smartphone o tablet, anche durante le visite commerciali."
            highlights={[
                'Gestione ordini e catalogo con dati sempre aggiornati',
                'CRM e anagrafiche clienti disponibili in mobilita',
                'Storico acquisti e riordino rapido con pochi tocchi',
                'Monitoraggio rischio credito e scadenze per una vendita piu sicura'
            ]}
        />
    )
}