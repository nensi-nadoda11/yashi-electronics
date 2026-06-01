import { Router } from 'express'
import { validate } from '../../middlewares/validate.middleware'
import { requireCustomerAuth } from '../auth/auth.middleware'
import {
  createPendingOrderController,
  getCheckoutSummaryController,
} from './checkout.controller'
import {
  checkoutSummaryQuerySchema,
  createPendingOrderBodySchema,
} from './checkout.schemas'

export const checkoutRouter = Router()

checkoutRouter.use(requireCustomerAuth)
checkoutRouter.get('/summary', validate({ query: checkoutSummaryQuerySchema }), getCheckoutSummaryController)
checkoutRouter.post(
  '/create-order',
  validate({ body: createPendingOrderBodySchema }),
  createPendingOrderController,
)
