import { NextResponse, NextRequest } from 'next/server'
import nodemailer from 'nodemailer'

export const runtime = 'nodejs'

interface AssistenzaFormData {
  nome: string
  cognome: string
  ragioneSociale: string
  email: string
  telefonoFisso?: string
  cellulare: string
  gestionale: string
  prezzoStimato: string
  opzioniScelte: string[]
}

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
    const body: AssistenzaFormData = await request.json()
    const {
      nome,
      cognome,
      ragioneSociale,
      email,
      telefonoFisso = '',
      cellulare,
      gestionale,
      prezzoStimato,
      opzioniScelte
    } = body

    // Validation
    if (!nome || !cognome || !ragioneSociale || !email || !cellulare || !gestionale) {
      return NextResponse.json(
        { success: false, error: 'Tutti i campi obbligatori devono essere compilati' },
        { status: 400 }
      )
    }

    // SMTP configuration
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT)
    const user = process.env.SMTP_USER
    const pass = process.env.SMTP_PASS
    const from = process.env.SMTP_FROM_ORDINE || process.env.SMTP_FROM
    const assistanceEmail = process.env.SMTP_FOR_ASSISTENZA || process.env.SMTP_TO
    const ccnString = process.env.MAIL_CCN || ''

    if (!host || !port || !user || !pass || !from || !assistanceEmail) {
      return NextResponse.json(
        { success: false, error: 'Configurazione SMTP incompleta nel server' },
        { status: 500 }
      )
    }

    const to = [assistanceEmail, email].filter(Boolean).join(', ')

    const ccnAddresses = ccnString
      .split(/[;,]/)
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0)
      .join(', ')

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    })

    const optionsHtml = opzioniScelte && opzioniScelte.length > 0
      ? opzioniScelte.map(opt => {
        let suffix = ''
        if (opt === 'VPN Server') {
          suffix = ' — <strong>350,00€</strong> una tantum'
        } else if (opt.startsWith('VPN Client')) {
          const match = opt.match(/\((\d+)\s+client\)/)
          if (match) {
            const count = parseInt(match[1], 10)
            return `<li>VPN Client -- <strong>70,00€ x ${count} client (Totale: ${count * 70},00€ annui)</strong></li>`
          }
        } else if (opt.startsWith('Backup Cloud')) {
          const match = opt.match(/\((\d+)\s+aziende\)/)
          if (match) {
            const count = parseInt(match[1], 10)
            return `<li>Backup Cloud -- <strong>50,00€ x ${count} aziende (Totale: ${count * 50},00€ annui)</strong></li>`
          }
        }
        return `<li>${escapeHtml(opt)}${suffix}</li>`
      }).join('')
      : '<li>Nessuna opzione specifica selezionata</li>'

    // Dynamic price breakdown for VPN
    let priceDisplay = `€ ${prezzoStimato.trim()}`
    let plainPrice = `€${prezzoStimato.trim()}`
    let priceExplanation = `
        <div style="margin-top: 10px; padding: 10px; background-color: #292524; border: 1px solid #44403c; border-radius: 6px; font-size: 11px; color: #e7e5e4; text-align: left; line-height: 1.4;">
          Per procedere con l'ordine, vi chiediamo cortesemente di inviarci la contabile del pagamento, da intestare a <strong>SOFTMAINT SRL</strong> | <strong>IBAN:</strong> IT70B0303240020010000005043
        </div>
      `

    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      background-color: #f6f9fc;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      background-color: #f6f9fc;
      padding: 20px 10px;
    }
    .container {
      max-width: 550px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border: 1px solid #eef2f6;
    }
    .header {
      background-color: #1c1917;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      color: #f59e0b;
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.5px;
    }
    .header p {
      color: #a8a29e;
      margin: 3px 0 0 0;
      font-size: 12px;
    }
    .content {
      padding: 25px 20px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: #1c1917;
      border-bottom: 2px solid #f59e0b;
      padding-bottom: 6px;
      margin-top: 0;
      margin-bottom: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-grid {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .info-grid td {
      padding: 8px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .info-label {
      font-weight: 600;
      color: #000000;
      width: 35%;
      font-size: 13px;
    }
    .info-value {
      color: #2563eb;
      font-size: 13px;
    }
    .options-box {
      background-color: #fafaf9;
      border: 1px solid #f5f5f4;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }
    .options-list {
      margin: 0;
      padding-left: 15px;
      color: #2563eb;
      font-size: 13px;
    }
    .options-list li {
      margin-bottom: 6px;
    }
    .price-box {
      background: linear-gradient(135deg, #1c1917 0%, #292524 100%);
      border-radius: 8px;
      padding: 18px;
      color: #ffffff;
      text-align: center;
      margin-bottom: 12px;
    }
    .price-title {
      font-size: 11px;
      text-transform: uppercase;
      color: #a8a29e;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .price-value {
      font-size: 26px;
      font-weight: 800;
      color: #f59e0b;
    }
    .price-vat {
      font-size: 10px;
      color: #a8a29e;
      margin-top: 3px;
    }
    .footer {
      background-color: #f8fafc;
      padding: 15px;
      text-align: center;
      font-size: 11px;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Softmaint SRL | Ordine WEB</h1>
        <p>Nuovo ordine inviato dal sito web</p>
      </div>
      <div class="content">
        <h2 class="section-title">Dati Richiedente</h2>
        <table class="info-grid">
          <tr>
            <td class="info-label" style="width: 20%;">Nome, Cognome:</td>
            <td class="info-value" style="width: 30%;">${escapeHtml(nome)} ${escapeHtml(cognome)}</td>
          </tr>
          <tr>
            <td class="info-label">Ragione Sociale:</td>
            <td class="info-value" style="width: 28%;">${escapeHtml(ragioneSociale)}</td>
          </tr>
          <tr>
            <td class="info-label">E-Mail:</td>
            <td class="info-value" colspan="3"><a href="mailto:${escapeHtml(email)}" style="color: #f59e0b; text-decoration: none; font-weight: 600;">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td class="info-label">Tel. Fisso:</td>
            <td class="info-value">${escapeHtml(telefonoFisso || '-')}</td>
            <td class="info-label" style="padding-left: 10px;">Cellulare:</td>
            <td class="info-value">${escapeHtml(cellulare)}</td>
          </tr>
        </table>

        <h2 class="section-title">Dettaglio Ordine</h2>
        <table class="info-grid">
          <tr>
            <td class="info-label">Intervento richiesto</td>
            <td class="info-value" style="font-weight: 700; color: #f59e0b;">${escapeHtml(gestionale)}</td>
          </tr>
        </table>

        <div class="options-box">
          <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 14px; color: #1c1917;">Opzioni e Interventi Selezionati:</h3>
          <ul class="options-list color-blue">
            ${optionsHtml}
          </ul>
        </div>

        <div class="price-box">
          <div class="price-title">Costo Stimato Intervento</div>
          <div class="price-value">${priceDisplay}</div>
          <div class="price-vat">I prezzi si intendono al netto di IVA</div>
          ${priceExplanation}
        </div>
      </div>
      <div class="footer">
        Questo è un messaggio automatico generato dalla piattaforma WEB di Softmaint SRL.
      </div>
    </div>
  </div>
</body>
</html>
`

    const plainText = `
NUOVO ORDINE WEB
---------------------------------------
Dati Richiedente:
Nome, Cognome e Ragione Sociale: ${nome} ${cognome}, ${ragioneSociale}
E-Mail: ${email}
Telefono Fisso e Cellulare: ${telefonoFisso || '-'} / ${cellulare}

Dettaglio Ordine:
Categoria richiesta: ${gestionale}
Opzioni e Interventi Selezionati:
${opzioniScelte ? opzioniScelte.map(o => `- ${o}`).join('\n') : '- Nessuna opzione specifica'}

Costo Stimato Intervento: ${plainPrice} (al netto di IVA)
${(gestionale === 'VPN' || gestionale === 'BKP_CLOUD') ? `
Per procedere con l'ordine, vi chiediamo cortesemente di inviarci la contabile del pagamento, da intestare a SOFTMAINT SRL
IBAN: IT70B0303240020010000005043
` : ''}
`

    const mailOptions: nodemailer.SendMailOptions = {
      from,
      to,
      replyTo: `${nome} ${cognome} <${email}>`,
      subject: `${ragioneSociale} | Ordine WEB - ${escapeHtml(gestionale)}`,
      text: plainText,
      html: htmlBody,
    }

    if (ccnAddresses) {
      mailOptions.bcc = ccnAddresses
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('[Assistenza Form] Email inviata:', info.messageId)

    return NextResponse.json({
      success: true,
      message: 'Richiesta di assistenza inviata con successo!',
    })
  } catch (error) {
    console.error('[Assistenza Form] Errore:', error)
    return NextResponse.json(
      { success: false, error: 'Si è verificato un errore durante l\'invio della richiesta.' },
      { status: 500 }
    )
  }
}
