import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const booleanFromEnv = z.preprocess((value) => {
  if (typeof value === 'string') {
    const normalizedValue = value.trim().toLowerCase()

    if (normalizedValue === 'true') {
      return true
    }

    if (normalizedValue === 'false') {
      return false
    }
  }

  return value
}, z.boolean())

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().trim().min(1).default('/api/v1'),
  CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().trim().min(1).optional(),
  JWT_SECRET: z.string().trim().min(1).default('replace-with-strong-secret'),
  JWT_EXPIRES_IN: z.string().trim().min(1).default('7d'),
  AUTH_COOKIE_NAME: z.string().trim().min(1).default('yashi_customer_session'),
  AUTH_COOKIE_MAX_AGE_DAYS: z.coerce.number().positive().default(7),
  AUTH_COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  AUTH_COOKIE_SECURE: booleanFromEnv.default(false),
  FRONTEND_URL: z.string().trim().url().default('http://localhost:5173'),
  EMAIL_PROVIDER: z.string().trim().min(1).default('smtp'),
  EMAIL_FROM_NAME: z.string().trim().min(1).default('Yashi Electronics'),
  EMAIL_FROM_ADDRESS: z.string().trim().email().default('no-reply@yashielectronics.com'),
  SMTP_HOST: z.string().trim().default('smtp.gmail.com'),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_SECURE: booleanFromEnv.default(false),
  SMTP_USER: z.string().trim().default(''),
  SMTP_PASS: z.string().trim().default(''),
  RESET_PASSWORD_TOKEN_EXPIRY_MINUTES: z.coerce.number().int().positive().default(30),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  throw new Error(`Invalid environment configuration: ${parsedEnv.error.message}`)
}

const values = parsedEnv.data

export const env = {
  apiPrefix: values.API_PREFIX,
  authCookieMaxAgeDays: values.AUTH_COOKIE_MAX_AGE_DAYS,
  authCookieName: values.AUTH_COOKIE_NAME,
  authCookieSameSite: values.AUTH_COOKIE_SAME_SITE,
  authCookieSecure: values.AUTH_COOKIE_SECURE,
  corsAllowedOrigins: values.CORS_ALLOWED_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  databaseUrl: values.DATABASE_URL,
  emailFromAddress: values.EMAIL_FROM_ADDRESS,
  emailFromName: values.EMAIL_FROM_NAME,
  emailProvider: values.EMAIL_PROVIDER,
  frontendUrl: values.FRONTEND_URL,
  nodeEnv: values.NODE_ENV,
  jwtExpiresIn: values.JWT_EXPIRES_IN,
  jwtSecret: values.JWT_SECRET,
  port: values.PORT,
  resetPasswordTokenExpiryMinutes: values.RESET_PASSWORD_TOKEN_EXPIRY_MINUTES,
  smtpHost: values.SMTP_HOST,
  smtpPass: values.SMTP_PASS,
  smtpPort: values.SMTP_PORT,
  smtpSecure: values.SMTP_SECURE,
  smtpUser: values.SMTP_USER,
  isDevelopment: values.NODE_ENV === 'development',
  isProduction: values.NODE_ENV === 'production',
} as const
