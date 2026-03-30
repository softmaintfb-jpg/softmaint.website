import { WebAppProductPage } from '@/components/webapp-product-page'

export default function SmartLogisticaPage() {
    return (
        <WebAppProductPage
            name="Smart Logistica"
            subtitle="Gestione evoluta del magazzino e dei flussi logistici"
            image="/assets/logistica.png"
            pdfPath="/assets/pdf/logistica.pdf"
            alt="Panoramica Smart Logistica con flussi OVC OAF, LP LPF e DDT RCF"
            description="Smart Logistica digitalizza l'intero ciclo operativo di magazzino: dalla presa in carico ordini alla preparazione, fino alla spedizione e alla rettifica inventariale. Centralizza i documenti logistici, migliora la tracciabilita e riduce i tempi di evasione."
            highlights={[
                'Controllo centralizzato di OVC OAF, LP LPF e DDT RCF',
                'Tracciabilita totale di lotti e scadenze con codifica GS1',
                'Inventario e rettifiche real-time con sincronizzazione dati',
                'Supporto ai riordini e riduzione degli errori di picking'
            ]}
        />
    )
}