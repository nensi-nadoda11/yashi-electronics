import { apiClient } from '../../lib/api-client'
import type { ApiResponse } from '../../types/api'
import type {
  ToggleWishlistResponse,
  WishlistResponse,
  WishlistStatusResponse,
} from './wishlist.types'

export async function getWishlist() {
  const response = await apiClient.get<ApiResponse<WishlistResponse>>('/wishlist')

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch wishlist')
  }

  return response.data.data
}

export async function addToWishlist(productId: string) {
  const response = await apiClient.post<ApiResponse<ToggleWishlistResponse>>('/wishlist/items', {
    productId,
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to add product to wishlist')
  }

  return response.data.data
}

export async function removeFromWishlist(productId: string) {
  const response = await apiClient.delete<ApiResponse<ToggleWishlistResponse>>(
    `/wishlist/items/${productId}`,
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to remove product from wishlist')
  }

  return response.data.data
}

export async function toggleWishlist(productId: string) {
  const response = await apiClient.post<ApiResponse<ToggleWishlistResponse>>('/wishlist/toggle', {
    productId,
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to update wishlist')
  }

  return response.data.data
}

export async function getWishlistStatus(productIds: string[]) {
  const response = await apiClient.get<ApiResponse<WishlistStatusResponse>>('/wishlist/status', {
    params: {
      productIds: productIds.join(','),
    },
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch wishlist status')
  }

  return response.data.data
}
