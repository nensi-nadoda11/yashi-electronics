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

const corsOptions: CorsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || env.corsAllowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new Error('CORS origin not allowed'))
  },
}

export const app = express()

app.use(helmet())
app.use(compression())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

if (env.isDevelopment) {
  app.use(morgan('dev'))
}

app.get('/', (_request, response) => {
  response.status(200).json(successResponse('Yashi Electronics API running'))
})

app.use(env.apiPrefix, apiRouter)
app.use(notFoundMiddleware)
app.use(errorMiddleware)
