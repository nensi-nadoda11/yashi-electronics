import nodemailer from 'nodemailer'
import { env } from '../config/env'

type SendEmailInput = {
  html: string
  subject: string
  text: string
  to: string
}

type SendEmailResult = {
  sent: boolean
  reason?: 'not_configured' | 'send_failed'
}

const isSmtpConfigured = Boolean(env.smtpUser && env.smtpPass)

const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host: env.smtpHost,
      port: env.smtpPort,
      secure: env.smtpSecure,
      auth: {
        user: env.smtpUser,
        pass: env.smtpPass,
      },
    })
  : null

export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  if (env.emailProvider !== 'smtp' || !transporter) {
    return { sent: false, reason: 'not_configured' }
  }

  try {
    await transporter.sendMail({
      from: `"${env.emailFromName}" <${env.emailFromAddress}>`,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    })

    return { sent: true }
  } catch (error) {
    if (env.isDevelopment && error instanceof Error) {
      process.stderr.write(`Email delivery failed: ${error.message}\n`)
    }

    return { sent: false, reason: 'send_failed' }
  }
}

type SendPasswordResetEmailInput = {
  customerName: string
  expiresInMinutes: number
  resetLink: string
  to: string
}

export async function sendPasswordResetEmail(
  input: SendPasswordResetEmailInput,
): Promise<SendEmailResult> {
  const subject = 'Reset your Yashi Electronics password'
  const text = [
    `Hello ${input.customerName},`,
    '',
    'We received a request to reset your Yashi Electronics account password.',
    `Use this link within ${input.expiresInMinutes} minutes:`,
    input.resetLink,
    '',
    'If you did not request this, you can safely ignore this email.',
  ].join('\n')

  const html = `
    <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
      <p>Hello ${input.customerName},</p>
      <p>We received a request to reset your Yashi Electronics account password.</p>
      <p>
        This link expires in ${input.expiresInMinutes} minutes:
      </p>
      <p>
        <a href="${input.resetLink}" style="color: #2563eb; font-weight: 600;">Reset Password</a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
    </div>
  `

  return sendEmail({
    to: input.to,
    subject,
    text,
    html,
  })
}
