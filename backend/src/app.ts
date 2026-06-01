import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors, { type CorsOptions } from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env'
import { errorMiddleware } from './middlewares/error.middleware'
import { notFoundMiddleware } from './middlewares/not-found.middleware'
import { apiRouter } from './routes'
import { successResponse } from './utils/api-response'

const localhostOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:5173',
])

const isLocalhostOrigin = (origin: string) => {
  try {
    const url = new URL(origin)
    return (
      (url.protocol === 'http:' || url.protocol === 'https:') &&
      (url.hostname === 'localhost' || url.hostname === '127.0.0.1')
    )
  } catch {
    return false
  }
}

const corsOptions: CorsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin) {
      callback(null, true)
      return
    }

    const isAllowedOrigin =
      env.corsAllowedOrigins.includes(origin) ||
      (!env.isProduction && (localhostOrigins.has(origin) || isLocalhostOrigin(origin)))

    if (isAllowedOrigin) {
      callback(null, true)
      return
    }

    callback(new Error(`CORS origin not allowed: ${origin}`))
  },
}

export const app = express()

app.use(helmet())
app.use(compression())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json({ limit: '100kb' }))
app.use(express.urlencoded({ extended: true, limit: '100kb' }))

if (env.isDevelopment) {
  app.use(morgan('dev'))
}

app.get('/', (_request, response) => {
  response.status(200).json(successResponse('Yashi Electronics API running'))
})

app.use(env.apiPrefix, apiRouter)
app.use(notFoundMiddleware)
app.use(errorMiddleware)
