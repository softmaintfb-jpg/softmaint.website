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

    const nome = (data.get('nome') as string || '').trim().toUpperCase()
    const cognome = (data.get('cognome') as string || '').trim().toUpperCase()
    const ragioneSociale = (data.get('ragioneSociale') as string || '').trim().toUpperCase()
    const email = data.get('email') as string
    const telefonoFisso = (data.get('telefonoFisso') as string) || ''
    const cellulare = data.get('cellulare') as string

    const tipo = data.get('tipo') as string // 'ERP' | 'WEBAPP'
    const areaTematica = data.get('areaTematica') as string
    const descrizione = data.get('descrizione') as string

    // Retrieve multiple files or single file
    const rawFiles = [
      ...data.getAll('allegati'),
      ...data.getAll('allegato')
    ]
    const files = rawFiles.filter((f): f is File => f instanceof File && f.size > 0)

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
    const from = process.env.SMTP_FROM_TICKET || process.env.SMTP_FROM || 'Softmaint SRL | WebTicket <noreply@softmaint.it>'
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

    // Handle file attachments
    const attachments = []
    for (const file of files) {
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

    const filesText = files.length > 0
      ? `\nAllegati (${files.length}):\n` + files.map((f, i) => `  ${i + 1}. ${f.name} (${(f.size / (1024 * 1024)).toFixed(2)} MB)`).join('\n')
      : ''

    const filesHtml = files.length > 0
      ? `
        <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 13px; font-weight: bold; color: #4b5563; margin-bottom: 6px;">Allegati (${files.length}):</p>
          <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #6b7280;">
            ${files.map(f => `<li><strong>${escapeHtml(f.name)}</strong> (${(f.size / (1024 * 1024)).toFixed(2)} MB)</li>`).join('')}
          </ul>
        </div>
      `
      : ''

    const teamAssistenza = tipo?.toUpperCase() === 'ERP' ? 'Team Assistenza ERP' : 'Team Assistenza Sviluppo'

    const mailOptions = {
      from,
      to,
      replyTo: `${nome} ${cognome} <${email}>`,
      bcc: ccnAddresses || undefined,
      subject: `${ragioneSociale} - ${areaTematica}`,
      text: `Nuovo ticket Ricevuto
      
Dati del Richiedente:
-------------------------
Ragione Sociale: ${ragioneSociale}
Nome e Cognome: ${nome} ${cognome}
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
${filesText}

SOFTMAINT SRL
${teamAssistenza}
`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
          <h2 style="color: #d97706; border-bottom: 2px solid #f59e0b; padding-bottom: 10px;">Nuovo WebTicket Ricevuto</h2>
          
          <h3 style="color: #2563eb;">Dati del Richiedente</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 6px 0; font-weight: bold; width: 180px;">Ragione Sociale:</td>
              <td style="padding: 6px 0;">${escapeHtml(ragioneSociale)}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; font-weight: bold;">Nome e Cognome:</td>
              <td style="padding: 6px 0;">${escapeHtml(nome)} ${escapeHtml(cognome)}</td>
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

          <h3 style="color: #2563eb;">Dati del Ticket</h3>
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

          <h3 style="color: #2563eb;">Descrizione del problema</h3>
          <div style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px; white-space: pre-wrap; font-family: inherit; line-height: 1.5; margin-bottom: 20px;">${escapeHtml(descrizione)}</div>
          
          ${filesHtml}

          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 13px; color: #4b5563; line-height: 1.5;">
            <strong>SOFTMAINT SRL</strong><br />
            ${escapeHtml(teamAssistenza)}
          </div>
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
