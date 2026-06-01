import { Router } from 'express'
import { requireCustomerAuth } from '../auth/auth.middleware'
import { validate } from '../../middlewares/validate.middleware'
import {
  addWishlistItemController,
  getWishlistController,
  getWishlistStatusController,
  removeWishlistItemController,
  toggleWishlistController,
} from './wishlist.controller'
import {
  wishlistItemBodySchema,
  wishlistItemParamsSchema,
  wishlistStatusQuerySchema,
} from './wishlist.schemas'

export const wishlistRouter = Router()

wishlistRouter.use(requireCustomerAuth)
wishlistRouter.get('/', getWishlistController)
wishlistRouter.get('/status', validate({ query: wishlistStatusQuerySchema }), getWishlistStatusController)
wishlistRouter.post('/items', validate({ body: wishlistItemBodySchema }), addWishlistItemController)
wishlistRouter.delete(
  '/items/:productId',
  validate({ params: wishlistItemParamsSchema }),
  removeWishlistItemController,
)
wishlistRouter.post('/toggle', validate({ body: wishlistItemBodySchema }), toggleWishlistController)
