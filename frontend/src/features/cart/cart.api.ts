import { apiClient } from '../../lib/api-client'
import type { ApiResponse } from '../../types/api'
import type {
  AddToCartPayload,
  CartResponse,
  UpdateCartItemPayload,
} from './cart.types'

export async function getCart() {
  const response = await apiClient.get<ApiResponse<CartResponse>>('/cart')

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch cart')
  }

  return response.data.data
}

export async function addToCart(payload: AddToCartPayload) {
  const response = await apiClient.post<ApiResponse<CartResponse>>('/cart/items', payload)

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to add product to cart')
  }

  return response.data.data
}

export async function updateCartItem(payload: UpdateCartItemPayload) {
  const response = await apiClient.patch<ApiResponse<CartResponse>>(
    `/cart/items/${payload.itemId}`,
    { quantity: payload.quantity },
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to update cart item')
  }

  return response.data.data
}

export async function removeCartItem(itemId: string) {
  const response = await apiClient.delete<ApiResponse<CartResponse>>(`/cart/items/${itemId}`)

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to remove cart item')
  }

  return response.data.data
}

export async function clearCart() {
  const response = await apiClient.delete<ApiResponse<CartResponse>>('/cart')

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to clear cart')
  }

  return response.data.data
}
