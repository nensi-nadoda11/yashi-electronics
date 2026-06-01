import type { RequestHandler } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { successResponse } from '../../utils/api-response'
import { ordersService } from './orders.service'
import type { OrdersQueryInput } from './orders.types'

export const getOrdersController: RequestHandler = asyncHandler(async (request, response) => {
  const query = request.query as unknown as {
    page?: number | string
    limit?: number | string
    status?: OrdersQueryInput['status']
    paymentStatus?: OrdersQueryInput['paymentStatus']
    search?: string | string[]
  }

  const pageValue = Array.isArray(query.page) ? query.page[0] : query.page
  const limitValue = Array.isArray(query.limit) ? query.limit[0] : query.limit
  const searchValue = Array.isArray(query.search) ? query.search[0] : query.search
  const page = Number(pageValue ?? 1)
  const limit = Math.min(Number(limitValue ?? 10), 50)

  const data = await ordersService.getOrders({
    customerId: request.customer!.id,
    page: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
    limit: Number.isFinite(limit) && limit > 0 ? Math.floor(limit) : 10,
    ...(query.status ? { status: query.status } : {}),
    ...(query.paymentStatus ? { paymentStatus: query.paymentStatus } : {}),
    ...(typeof searchValue === 'string' && searchValue.trim().length > 0
      ? { search: searchValue.trim() }
      : {}),
  })

  response.status(200).json(successResponse('Orders fetched successfully', data))
})

export const getOrderByIdController: RequestHandler = asyncHandler(async (request, response) => {
  const orderId = request.params.orderId as string
  const data = await ordersService.getOrderById(request.customer!.id, orderId)

  response.status(200).json(successResponse('Order fetched successfully', data))
})

export const cancelOrderController: RequestHandler = asyncHandler(async (request, response) => {
  const orderId = request.params.orderId as string
  const data = await ordersService.cancelOrder(request.customer!.id, orderId)

  response.status(200).json(successResponse('Order cancelled successfully', data))
})
