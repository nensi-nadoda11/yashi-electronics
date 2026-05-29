import type { RequestHandler } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { successResponse } from '../../utils/api-response'
import { getCategories } from './category.service'

export const getCategoriesController: RequestHandler = asyncHandler(async (_request, response) => {
  const data = await getCategories()

  response.status(200).json(successResponse('Categories fetched successfully', data))
})
