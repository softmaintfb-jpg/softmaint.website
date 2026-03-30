import { WebAppProductPage } from '@/components/webapp-product-page'

export default function SmartMailPage() {
    return (
        <WebAppProductPage
            name="Smart Mail"
            subtitle="Automazione comunicazioni amministrative e solleciti"
            image="/assets/smartmail.png"
            pdfPath="/assets/pdf/mail.pdf"
            alt="Panoramica Smart Mail con regole automatiche, trigger e comunicazioni personalizzate"
            description="Smart Mail automatizza le comunicazioni amministrative partendo dai dati del gestionale. Definisci regole personalizzate, trigger temporali e contenuti dinamici per inviare avvisi, estratti conto e solleciti in modo preciso, riducendo attivita manuali e tempi di gestione."
            highlights={[
                'Motore regole configurabile per cliente, evento e scadenza',
                'Invio automatico di comunicazioni periodiche o condizionate',
                'Riduzione del tempo operativo nelle attivita ripetitive',
                'Migliore efficacia nel recupero crediti con messaggi puntuali'
            ]}
        />
    )
}