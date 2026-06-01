import { Router } from 'express'
import { validate } from '../../middlewares/validate.middleware'
import { requireCustomerAuth } from '../auth/auth.middleware'
import {
  createAddressController,
  deleteAddressController,
  getAddressController,
  getAddressesController,
  setDefaultAddressController,
  updateAddressController,
} from './address.controller'
import {
  addressIdParamsSchema,
  createAddressBodySchema,
  updateAddressBodySchema,
} from './address.schemas'

export const addressRouter = Router()

addressRouter.use(requireCustomerAuth)
addressRouter.get('/', getAddressesController)
addressRouter.get('/:addressId', validate({ params: addressIdParamsSchema }), getAddressController)
addressRouter.post('/', validate({ body: createAddressBodySchema }), createAddressController)
addressRouter.patch(
  '/:addressId',
  validate({ params: addressIdParamsSchema, body: updateAddressBodySchema }),
  updateAddressController,
)
addressRouter.delete(
  '/:addressId',
  validate({ params: addressIdParamsSchema }),
  deleteAddressController,
)
addressRouter.patch(
  '/:addressId/default',
  validate({ params: addressIdParamsSchema }),
  setDefaultAddressController,
)
