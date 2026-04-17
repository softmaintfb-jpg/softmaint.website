import { WebAppProductPage } from '@/components/webapp-product-page'

export default function SmartLogisticaPage() {
    return (
        <WebAppProductPage
            productKey="smartLogistica"
            image="/assets/logistica.png?v=20260402"
            pdfPath="/assets/pdf/logistica.pdf"
            videoPath="/assets/video/produzione.mp4"
            alt="Panoramica Smart Logistica con flussi OVC OAF, LP LPF e DDT RCF"
        />
    )
}
