import type { ErrorRequestHandler } from 'express'
import { env } from '../config/env'
import { AppError } from '../utils/app-error'
import { errorResponse } from '../utils/api-response'

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  const isJsonSyntaxError =
    error instanceof SyntaxError && 'body' in error

  const statusCode = isJsonSyntaxError
    ? 400
    : error instanceof AppError
      ? error.statusCode
      : 500
  const message = isJsonSyntaxError
    ? 'Invalid JSON payload'
    : error instanceof Error
      ? error.message
      : 'Internal server error'
  const errors = error instanceof AppError ? error.errors : undefined

  response.status(statusCode).json(
    errorResponse(message, errors, env.isDevelopment && error instanceof Error ? error.stack : undefined),
  )
}
