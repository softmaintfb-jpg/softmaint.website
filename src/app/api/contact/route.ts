import { NextResponse, NextRequest } from 'next/server'
import nodemailer from 'nodemailer'
import { phoneRegex } from '@/lib/validators'

export const runtime = 'nodejs'

interface ContactFormData {
  nome: string
  email: string
  telefono?: string
  messaggio: string
}

type SmtpConfig = {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
  to: string
}

function getSmtpConfig(): SmtpConfig {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    SMTP_TO,
    SMTP_SECURE,
  } = process.env

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SMTP_FROM || !SMTP_TO) {
    throw new Error('SMTP config missing')
  }

  const port = Number(SMTP_PORT)
  if (!Number.isFinite(port) || port <= 0) {
    throw new Error('SMTP port invalid')
  }

  const secure = SMTP_SECURE ? SMTP_SECURE === 'true' : port === 465

  return {
    host: SMTP_HOST,
    port,
    secure,
    user: SMTP_USER,
    pass: SMTP_PASS,
    from: SMTP_FROM,
    to: SMTP_TO,
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
      default:
        return char
    }
  })
}

function formatTimestamp(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return new Intl.DateTimeFormat('it-IT', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date)
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

    const trimmedTelefono = telefono.trim()
    if (trimmedTelefono && !phoneRegex.test(trimmedTelefono)) {
      return NextResponse.json(
        { success: false, error: 'Formato telefono non valido' },
        { status: 400 }
      )
    }

    // Creazione oggetto contatto
    const contact = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      telefono: trimmedTelefono,
      messaggio: messaggio.trim(),
      timestamp: new Date().toISOString(),
    }
    const formattedTimestamp = formatTimestamp(contact.timestamp)

    const smtp = getSmtpConfig()
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    })

    const plainText = [
      'Nuovo messaggio dal sito',
      '',
      `Nome: ${contact.nome}`,
      `Email: ${contact.email}`,
      `Telefono: ${contact.telefono || '-'}`,
      '',
      'Messaggio:',
      contact.messaggio,
      '',
      `Timestamp: ${formattedTimestamp}`,
    ].join('\n')

    const htmlBody = [
      '<h2>Nuovo messaggio dal sito</h2>',
      `<p><strong>Nome:</strong> ${escapeHtml(contact.nome)}</p>`,
      `<p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>`,
      `<p><strong>Telefono:</strong> ${escapeHtml(contact.telefono || '-')}</p>`,
      `<p><strong>Messaggio:</strong><br/>${escapeHtml(contact.messaggio).replace(/\n/g, '<br/>')}</p>`,
      `<p><strong>Timestamp:</strong> ${escapeHtml(formattedTimestamp)}</p>`,
    ].join('')

    const info = await transporter.sendMail({
      from: smtp.from,
      to: smtp.to,
      replyTo: `${contact.nome} <${contact.email}>`,
      subject: `Nuovo messaggio dal sito: ${contact.nome}`,
      text: plainText,
      html: htmlBody,
    })

    console.log('[Contact Form] Email inviata:', info.messageId)

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
      { success: false, error: 'Errore invio email o configurazione SMTP non valida' },
      { status: 500 }
    )
  }
}
