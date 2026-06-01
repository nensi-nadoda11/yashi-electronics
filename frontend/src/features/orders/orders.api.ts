import { apiClient } from '../../lib/api-client'
import type { ApiResponse } from '../../types/api'
import type {
  OrderDetailResponse,
  OrdersQueryParams,
  OrdersResponse,
} from './orders.types'

export async function getOrders(params: OrdersQueryParams = {}) {
  const response = await apiClient.get<ApiResponse<OrdersResponse>>('/orders', {
    params,
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch orders')
  }

  return response.data.data
}

export async function getOrderById(orderId: string) {
  const response = await apiClient.get<ApiResponse<OrderDetailResponse>>(`/orders/${orderId}`)

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch order')
  }

  return response.data.data
}

export async function cancelOrder(orderId: string) {
  const response = await apiClient.patch<ApiResponse<OrderDetailResponse>>(
    `/orders/${orderId}/cancel`,
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to cancel order')
  }

  return response.data.data
}
