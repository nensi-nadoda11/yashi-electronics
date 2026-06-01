import type { RequestHandler } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { successResponse } from '../../utils/api-response'
import { wishlistService } from './wishlist.service'

export const getWishlistController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await wishlistService.getWishlist(request.customer!.id)

  response.status(200).json(successResponse('Wishlist fetched successfully', data))
})

export const addWishlistItemController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await wishlistService.addWishlistItem({
    customerId: request.customer!.id,
    productId: request.body.productId as string,
  })

  response.status(200).json(successResponse('Product added to wishlist', data))
})

export const removeWishlistItemController: RequestHandler = asyncHandler(
  async (request, response) => {
    const data = await wishlistService.removeWishlistItem({
      customerId: request.customer!.id,
      productId: request.params.productId as string,
    })

    response.status(200).json(successResponse('Product removed from wishlist', data))
  },
)

export const toggleWishlistController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await wishlistService.toggleWishlistItem({
    customerId: request.customer!.id,
    productId: request.body.productId as string,
  })

  response.status(200).json(successResponse('Wishlist updated successfully', data))
})

export const getWishlistStatusController: RequestHandler = asyncHandler(
  async (request, response) => {
    const rawProductIds = request.query.productIds
    const productIds: string[] = Array.isArray(rawProductIds)
      ? rawProductIds.filter((entry): entry is string => typeof entry === 'string')
      : typeof rawProductIds === 'string'
        ? rawProductIds
            .split(',')
            .map((entry: string) => entry.trim())
            .filter(Boolean)
        : []

    const data = await wishlistService.getWishlistStatus({
      customerId: request.customer!.id,
      productIds,
    })

    response.status(200).json(successResponse('Wishlist status fetched successfully', data))
  },
)
