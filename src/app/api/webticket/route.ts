import { NextResponse, NextRequest } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;'
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '"': return '&quot;'
      case "'": return '&#39;'
      default: return char
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()

    const nome = data.get('nome') as string
    const cognome = data.get('cognome') as string
    const ragioneSociale = data.get('ragioneSociale') as string
    const email = data.get('email') as string
    const telefonoFisso = (data.get('telefonoFisso') as string) || ''
    const cellulare = data.get('cellulare') as string

    const tipo = data.get('tipo') as string // 'ERP' | 'WEBAPP'
    const areaTematica = data.get('areaTematica') as string
    const descrizione = data.get('descrizione') as string
    const file = data.get('allegato') as File | null

    // Validation
    if (!nome || !cognome || !ragioneSociale || !email || !cellulare || !tipo || !areaTematica || !descrizione) {
      return NextResponse.json(
        { success: false, error: 'Tutti i campi obbligatori devono essere compilati.' },
        { status: 400 }
      )
    }

    // SMTP configuration
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.SMTP_FROM_TICKET || process.env.SMTP_FROM
    const targetEmail = tipo === 'ERP' ? process.env.SMTP_ERP : process.env.SMTP_WEBAPP
    const ccnString = process.env.MAIL_CCN || ''

    if (!host || !port || !user || !pass || !from || !targetEmail) {
      return NextResponse.json(
        { success: false, error: 'Configurazione SMTP incompleta nel server.' },
        { status: 500 }
      )
    }

    const to = [targetEmail, email].filter(Boolean).join(', ')
    const ccnAddresses = ccnString
      .split(/[;,]/)
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0)
      .join(', ')

    // Handle file attachment
    const attachments = []
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      attachments.push({
        filename: file.name,
        content: buffer,
        contentType: file.type
      })
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const mailOptions = {
      from,
      to,
      bcc: ccnAddresses || undefined,
      subject: `Softmaint SRL | WebTicket - ${areaTematica}`,
      text: `Nuovo ticket Ricevuto
      
Dati del Richiedente:
-------------------------
Nome e Cognome: ${nome} ${cognome}
Ragione Sociale: ${ragioneSociale}
Email: ${email}
Telefono Fisso: ${telefonoFisso || '-'}
Cellulare: ${cellulare}

Dettagli del Ticket:
-------------------------
Prodotto/Tipo: ${tipo}
Area Tematica/Modulo: ${areaTematica}

Descrizione del problema:
-------------------------
${descrizione}
`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
          <h2 style="color: #d97706; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">Nuovo WebTicket Ricevuto</h2>
          
          <h3 style="color: #4b5563;">Dati del Richiedente</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 180px;">Nome e Cognome:</td>
              <td style="padding: 6px 0;">${escapeHtml(nome)} ${escapeHtml(cognome)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Ragione Sociale:</td>
              <td style="padding: 6px 0;">${escapeHtml(ragioneSociale)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Email:</td>
              <td style="padding: 6px 0;"><a href="mailto:${email}">${escapeHtml(email)}</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Telefono Fisso:</td>
              <td style="padding: 6px 0;">${escapeHtml(telefonoFisso) || '-'}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Cellulare:</td>
              <td style="padding: 6px 0;">${escapeHtml(cellulare)}</td>
            </tr>
          </table>

          <h3 style="color: #4b5563;">Dati del Ticket</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 180px;">Tipo Assistenza:</td>
              <td style="padding: 6px 0; font-weight: bold; color: #b45309;">${escapeHtml(tipo)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Area/Modulo:</td>
              <td style="padding: 6px 0;">${escapeHtml(areaTematica)}</td>
            </tr>
          </table>

          <h3 style="color: #4b5563;">Descrizione del problema</h3>
          <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px; white-space: pre-wrap; font-family: inherit; line-height: 1.5; margin-bottom: 20px;">${escapeHtml(descrizione)}</div>
          
          ${file && file.size > 0 ? `<p style="font-size: 13px; color: #6b7280; font-style: italic;">Nota: È presente un file allegato: <strong>${escapeHtml(file.name)}</strong> (${(file.size / 1024 / 1024).toFixed(2)} MB)</p>` : ''}
        </div>
      `,
      attachments
    }

    await transporter.sendMail(mailOptions)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error sending webticket email:', error)
    return NextResponse.json(
      { success: false, error: 'Si è verificato un errore interno del server.' },
      { status: 500 }
    )
  }
}
