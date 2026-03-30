import { NextResponse, NextRequest } from 'next/server'

interface ContactFormData {
  nome: string
  email: string
  telefono?: string
  messaggio: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()
    const { nome, email, telefono = '', messaggio } = body

    // Validazione campi obbligatori
    if (!nome || !email || !messaggio) {
      return NextResponse.json(
        { success: false, error: 'Nome, email e messaggio sono obbligatori' },
        { status: 400 }
      )
    }

    // Validazione email base
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Formato email non valido' },
        { status: 400 }
      )
    }

    // Creazione oggetto contatto
    const contact = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono.trim(),
      messaggio: messaggio.trim(),
      timestamp: new Date().toISOString(),
    }

    // Log del contatto (in produzione, salva su DB, invia email, ecc.)
    console.log('[Contact Form] Nuovo messaggio:', contact)

    // TODO: Implementare salvataggio su MongoDB o altro database
    // TODO: Inviare email di notifica

    return NextResponse.json(
      {
        success: true,
        message: 'Messaggio inviato con successo! Ti risponderemo al più presto.',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[Contact Form] Errore:', error)
    return NextResponse.json(
      { success: false, error: 'Errore nel salvataggio del messaggio' },
      { status: 500 }
    )
  }
}
