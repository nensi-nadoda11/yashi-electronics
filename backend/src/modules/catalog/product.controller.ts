import type { RequestHandler } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { successResponse } from '../../utils/api-response'
import { getProductBySlug, getProducts } from './product.service'
import type { ProductQueryInput } from './product.types'

export const getProductsController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await getProducts(request.query as unknown as ProductQueryInput)

  response.status(200).json(successResponse('Products fetched successfully', data))
})

export const getProductBySlugController: RequestHandler = asyncHandler(async (request, response) => {
  const slug = typeof request.params.slug === 'string' ? request.params.slug : ''
  const data = await getProductBySlug(slug)

  response.status(200).json(successResponse('Product fetched successfully', data))
})
