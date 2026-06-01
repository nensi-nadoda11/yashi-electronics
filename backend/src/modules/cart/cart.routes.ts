import { Router } from 'express'
import { requireCustomerAuth } from '../auth/auth.middleware'
import { validate } from '../../middlewares/validate.middleware'
import {
  addCartItemController,
  clearCartController,
  getCartController,
  removeCartItemController,
  updateCartItemController,
} from './cart.controller'
import {
  cartItemBodySchema,
  cartItemParamsSchema,
  cartItemQuantityBodySchema,
} from './cart.schemas'

export const cartRouter = Router()

cartRouter.use(requireCustomerAuth)
cartRouter.get('/', getCartController)
cartRouter.post('/items', validate({ body: cartItemBodySchema }), addCartItemController)
cartRouter.patch(
  '/items/:itemId',
  validate({ params: cartItemParamsSchema, body: cartItemQuantityBodySchema }),
  updateCartItemController,
)
cartRouter.delete(
  '/items/:itemId',
  validate({ params: cartItemParamsSchema }),
  removeCartItemController,
)
cartRouter.delete('/', clearCartController)
