import type { RequestHandler } from 'express'
import type { ZodTypeAny } from 'zod'
import { ZodError } from 'zod'
import { AppError } from '../utils/app-error'

type ValidationSchemas = {
  body?: ZodTypeAny
  params?: ZodTypeAny
  query?: ZodTypeAny
}

export const validate = (schemas: ValidationSchemas): RequestHandler => {
  return (request, _response, next) => {
    try {
      if (schemas.body) {
        request.body = schemas.body.parse(request.body)
      }

      if (schemas.params) {
        request.params = schemas.params.parse(request.params) as typeof request.params
      }

      if (schemas.query) {
        request.query = schemas.query.parse(request.query) as typeof request.query
      }

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        next(new AppError('Validation failed', 400, error.flatten()))
        return
      }

      next(error)
    }
  }
}
