import SMTPTransport from 'nodemailer/lib/smtp-transport'
export type ConfigProps = SMTPTransport | {
    host: string
    port: number | string
    secure: boolean
    auth: {
        user: string
        pass: string
    }
    headers: {

    }   
    
}
export const config: ConfigProps = {
    host: process.env.SMTP_HOST || '',
    port: process.env.SMTP_PORT || '', // SMTP PORT
    secure: false, // true for 465, false for other ports
    
    auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
    },
    headers: {
      "X-MC-Autotext": "True",
      "X-MC-Tags": 'site_tagplus',
      "X-MC-Subaccount": 'TagPlus'
    }
  
  }