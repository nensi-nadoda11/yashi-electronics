import type { RequestHandler } from 'express'
import { AppError } from '../utils/app-error'

export const notFoundMiddleware: RequestHandler = (request, _response, next) => {
  next(new AppError(`Route not found: ${request.method} ${request.originalUrl}`, 404))
}
