import { Router } from 'express'
import { validate } from '../../middlewares/validate.middleware'
import { requireCustomerAuth } from '../auth/auth.middleware'
import {
  cancelOrderController,
  getOrderByIdController,
  getOrdersController,
} from './orders.controller'
import { orderIdParamsSchema, ordersQuerySchema } from './orders.schemas'

export const ordersRouter = Router()

ordersRouter.use(requireCustomerAuth)
ordersRouter.get('/', validate({ query: ordersQuerySchema }), getOrdersController)
ordersRouter.get('/:orderId', validate({ params: orderIdParamsSchema }), getOrderByIdController)
ordersRouter.patch(
  '/:orderId/cancel',
  validate({ params: orderIdParamsSchema }),
  cancelOrderController,
)
