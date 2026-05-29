import type { RequestHandler } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { successResponse } from '../../utils/api-response'
import { getBrands } from './brand.service'

export const getBrandsController: RequestHandler = asyncHandler(async (_request, response) => {
  const data = await getBrands()

  response.status(200).json(successResponse('Brands fetched successfully', data))
})
