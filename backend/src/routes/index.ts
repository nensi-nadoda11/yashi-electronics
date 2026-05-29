import { Router } from 'express'
import { authRouter } from '../modules/auth/auth.routes'
import { catalogRouter } from '../modules/catalog/catalog.routes'
import { healthRouter } from './health.routes'

export const apiRouter = Router()

apiRouter.use('/health', healthRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use(catalogRouter)
