import type { RequestHandler } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { successResponse } from '../../utils/api-response'
import { cartService } from './cart.service'

export const getCartController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await cartService.getCart(request.customer!.id)
  response.status(200).json(successResponse('Cart fetched successfully', data))
})

export const addCartItemController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await cartService.addCartItem({
    customerId: request.customer!.id,
    productId: request.body.productId,
    quantity: request.body.quantity,
  })

  response.status(200).json(successResponse('Product added to cart', data))
})

export const updateCartItemController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await cartService.updateCartItem({
    customerId: request.customer!.id,
    itemId: request.params.itemId as string,
    quantity: request.body.quantity,
  })

  response.status(200).json(successResponse('Cart item updated successfully', data))
})

export const removeCartItemController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await cartService.removeCartItem({
    customerId: request.customer!.id,
    itemId: request.params.itemId as string,
  })

  response.status(200).json(successResponse('Cart item removed successfully', data))
})

export const clearCartController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await cartService.clearCart(request.customer!.id)

  response.status(200).json(successResponse('Cart cleared successfully', data))
})
