import { WebAppProductPage } from '@/components/webapp-product-page'

export default function SmartAgentiPage() {
    return (
        <WebAppProductPage
            productKey="smartAgenti"
            image="/assets/agenti.png?v=20260402"
            pdfPath="/assets/pdf/agenti.pdf"
            alt="Schermata Smart Agenti con ordini, CRM, storico e monitoraggio credito"
        />
    )
}
