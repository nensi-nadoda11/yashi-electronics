import { Router } from 'express'
import { env } from '../config/env'
import { prisma } from '../db/prisma'
import { asyncHandler } from '../utils/async-handler'
import { successResponse } from '../utils/api-response'

export const healthRouter = Router()

healthRouter.get(
  '/',
  asyncHandler(async (_request, response) => {
    let database: 'connected' | 'not_configured' | 'disconnected' = 'not_configured'

    if (env.databaseUrl) {
      try {
        await prisma.$queryRaw`SELECT 1`
        database = 'connected'
      } catch {
        database = 'disconnected'
      }
    }

    response.status(200).json(
      successResponse('Yashi Electronics API is healthy', {
        service: 'yashi-electronics-api' as const,
        status: 'ok' as const,
        timestamp: new Date().toISOString(),
        database,
      }),
    )
  }),
)
