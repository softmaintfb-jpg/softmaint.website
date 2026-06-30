import DownloadPage from '../pages/download/page'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Area Download | Softmaint',
  description: 'Scarica i software di assistenza remota e consulta le brochure informative dei nostri prodotti software: Smart Logistica, Smart Agenti, Smart @MAIL, Smart Produzione, Smart B2B.',
  keywords: 'download, supremo, assistenza remota, smart logistica, smart agenti, smart mail, smart produzione, smart b2b, brochure, softmaint',
}

export default function Download() {
    return <DownloadPage />
}

