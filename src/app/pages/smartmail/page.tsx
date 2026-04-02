import { WebAppProductPage } from '@/components/webapp-product-page'

export default function SmartMailPage() {
    return (
        <WebAppProductPage
            productKey="smartMail"
            image="/assets/smartmail.png?v=20260402"
            pdfPath="/assets/pdf/mail.pdf"
            alt="Panoramica Smart Mail con regole automatiche, trigger e comunicazioni personalizzate"
        />
    )
}
