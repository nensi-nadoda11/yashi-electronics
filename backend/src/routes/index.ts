import { Router } from 'express'
import { authRouter } from '../modules/auth/auth.routes'
import { cartRouter } from '../modules/cart/cart.routes'
import { catalogRouter } from '../modules/catalog/catalog.routes'
import { wishlistRouter } from '../modules/wishlist/wishlist.routes'
import { healthRouter } from './health.routes'

export const apiRouter = Router()

apiRouter.use('/health', healthRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/cart', cartRouter)
apiRouter.use('/wishlist', wishlistRouter)
apiRouter.use(catalogRouter)
