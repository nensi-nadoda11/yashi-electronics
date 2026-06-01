import { apiClient } from '../../lib/api-client'
import type { ApiResponse } from '../../types/api'
import type {
  CheckoutSummaryResponse,
  CreatePendingOrderPayload,
  CreatePendingOrderResponse,
} from './checkout.types'

export async function getCheckoutSummary(addressId?: string) {
  const response = await apiClient.get<ApiResponse<CheckoutSummaryResponse>>('/checkout/summary', {
    params: addressId ? { addressId } : undefined,
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch checkout summary')
  }

  return response.data.data
}

export async function createPendingOrder(payload: CreatePendingOrderPayload) {
  const response = await apiClient.post<ApiResponse<CreatePendingOrderResponse>>(
    '/checkout/create-order',
    payload,
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to create order')
  }

  return response.data.data
}
