import type { RequestHandler } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { successResponse } from '../../utils/api-response'
import { ordersService } from './orders.service'
import type { OrdersQueryInput } from './orders.types'

export const getOrdersController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await ordersService.getOrders({
    customerId: request.customer!.id,
    page: request.query.page as number,
    limit: request.query.limit as number,
    ...(request.query.status ? { status: request.query.status as OrdersQueryInput['status'] } : {}),
    ...(request.query.paymentStatus
      ? { paymentStatus: request.query.paymentStatus as OrdersQueryInput['paymentStatus'] }
      : {}),
    ...(request.query.search ? { search: request.query.search as string } : {}),
  })

  response.status(200).json(successResponse('Orders fetched successfully', data))
})

export const getOrderByIdController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await ordersService.getOrderById(request.customer!.id, request.params.orderId as string)

  response.status(200).json(successResponse('Order fetched successfully', data))
})

export const cancelOrderController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await ordersService.cancelOrder(request.customer!.id, request.params.orderId as string)

  response.status(200).json(successResponse('Order cancelled successfully', data))
})
