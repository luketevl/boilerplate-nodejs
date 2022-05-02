import nodemailer, { SentMessageInfo } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { config } from './../config/smtp'

export type MailOptions = {
    to: string
    subject: string
    html: string
    bcc?: string
    replyTo?: string
    from?: string
    fromName?: string
    attachments?: Array<{ 
        filename: string
        content: string
    }>
}

export const isValid = (mailOptions: MailOptions) => {
    if(mailOptions.to && mailOptions.subject && mailOptions.html){
        if((mailOptions.from && (mailOptions.from.toString().includes('@tagplus') || mailOptions.from.toString().includes('@gattecnologia'))) || !mailOptions.from) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

type SendData = (mailOptions: MailOptions) => Promise<SentMessageInfo | {
    success: boolean,
    error?: string | Object | undefined
}>
export const send:SendData  = async (mailOptions) => {
    try{
        if(!isValid(mailOptions)) {
            return {
                success: false,
                error: 'Required fields missing!'
            }
        }
        // create Nodemailer SES transporter
        const transporter = nodemailer.createTransport(config as SMTPTransport);
        const fromTmp = mailOptions.from ? mailOptions.from : process.env.FROM
        const from = mailOptions.fromName ? `${mailOptions.fromName} <${fromTmp}>`: fromTmp
        const result = await transporter.sendMail({
            ...mailOptions,
            from,
            
        });
        transporter.close();
        return result
    }
    catch(ex){
        return {
            success: false,
            error: ex
        }
    }
}

export type PrepareAttachmentsData = (files: Array<Express.Multer.File>) => Array<{
    filename: string
    path: string
}>

export const prepareAttachments: PrepareAttachmentsData = (files) => {
    const attachments = []
    for (const file of files) {
        attachments.push({
            filename: file.originalname,
            path: file.path
        })
    }
    return attachments
}
