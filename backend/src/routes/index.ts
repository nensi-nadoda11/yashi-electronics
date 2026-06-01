import { Router } from 'express'
import { authRouter } from '../modules/auth/auth.routes'
import { addressRouter } from '../modules/address/address.routes'
import { cartRouter } from '../modules/cart/cart.routes'
import { catalogRouter } from '../modules/catalog/catalog.routes'
import { checkoutRouter } from '../modules/checkout/checkout.routes'
import { ordersRouter } from '../modules/orders/orders.routes'
import { wishlistRouter } from '../modules/wishlist/wishlist.routes'
import { healthRouter } from './health.routes'

export const apiRouter = Router()

apiRouter.use('/health', healthRouter)
apiRouter.use('/auth', authRouter)
apiRouter.use('/addresses', addressRouter)
apiRouter.use('/cart', cartRouter)
apiRouter.use('/checkout', checkoutRouter)
apiRouter.use('/orders', ordersRouter)
apiRouter.use('/wishlist', wishlistRouter)
apiRouter.use(catalogRouter)
