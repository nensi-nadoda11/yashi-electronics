import { PrismaClient } from '@prisma/client'
import { env } from '../config/env'

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient
}

const createPrismaClient = () =>
  new PrismaClient({
    log: env.isDevelopment ? ['warn', 'error'] : ['error'],
  })

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (!env.isProduction) {
  globalForPrisma.prisma = prisma
}
