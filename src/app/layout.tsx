import './globals.css'
import { ReactNode } from 'react'
import { Providers } from '@/components/Providers'
import { ErrorHandler } from '@/components/ErrorHandler'

export const metadata = {
  title: 'Softmaint | Software House',
  description: 'Softmaint - Soluzioni software innovative per la tua azienda. WMS, DocFinance, WebApp, Green Project e Azienda 4.0. Professionisti dell\'informatica e dell\'innovazione tecnologica.',
  keywords: 'software house, WMS, warehouse management, DocFinance, tesoreria, WebApp, Azienda 4.0, innovazione tecnologica',
  authors: [{ name: 'Softmaint' }],
  openGraph: {
    title: 'Softmaint | Software House',
    description: 'Soluzioni software innovative per la tua azienda.',
    type: 'website',
  },
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="it" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-inter antialiased">
        <ErrorHandler />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
