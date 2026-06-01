import type { RequestHandler } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { successResponse } from '../../utils/api-response'
import { ordersService } from './orders.service'
import { ordersQuerySchema } from './orders.schemas'
import type { OrdersQueryInput } from './orders.types'

export const getOrdersController: RequestHandler = asyncHandler(async (request, response) => {
  const query = ordersQuerySchema.parse(request.query)
  const status = query.status
  const paymentStatus = query.paymentStatus
  const search = query.search

  const input: OrdersQueryInput = {
    customerId: request.customer!.id,
    page: query.page,
    limit: query.limit,
  }

  if (status !== undefined) {
    input.status = status
  }

  if (paymentStatus !== undefined) {
    input.paymentStatus = paymentStatus
  }

  if (search !== undefined) {
    input.search = search
  }

  const data = await ordersService.getOrders(input)

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
