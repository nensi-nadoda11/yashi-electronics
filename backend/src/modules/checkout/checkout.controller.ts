import type { RequestHandler } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { successResponse } from '../../utils/api-response'
import { checkoutService } from './checkout.service'

export const getCheckoutSummaryController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await checkoutService.getCheckoutSummary(
    request.query.addressId
      ? {
          customerId: request.customer!.id,
          addressId: request.query.addressId as string,
        }
      : {
          customerId: request.customer!.id,
        },
  )

  response.status(200).json(successResponse('Checkout summary fetched successfully', data))
})

export const createPendingOrderController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await checkoutService.createPendingOrder({
    customerId: request.customer!.id,
    addressId: request.body.addressId,
    paymentMethod: request.body.paymentMethod,
  })

  response.status(201).json(successResponse('Pending order created successfully', data))
})
