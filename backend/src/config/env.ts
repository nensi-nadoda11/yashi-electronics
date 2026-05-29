import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  API_PREFIX: z.string().trim().min(1).default('/api/v1'),
  CORS_ALLOWED_ORIGINS: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().trim().min(1).optional(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  throw new Error(`Invalid environment configuration: ${parsedEnv.error.message}`)
}

const values = parsedEnv.data

export const env = {
  apiPrefix: values.API_PREFIX,
  corsAllowedOrigins: values.CORS_ALLOWED_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
  databaseUrl: values.DATABASE_URL,
  nodeEnv: values.NODE_ENV,
  port: values.PORT,
  isDevelopment: values.NODE_ENV === 'development',
  isProduction: values.NODE_ENV === 'production',
} as const
