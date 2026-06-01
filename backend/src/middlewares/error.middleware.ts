import type { ErrorRequestHandler } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { env } from '../config/env'
import { AppError } from '../utils/app-error'
import { errorResponse } from '../utils/api-response'

const getPrismaErrorDetails = (error: unknown) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return {
          statusCode: 409,
          message: 'A record with the same details already exists',
        }
      case 'P2003':
        return {
          statusCode: 400,
          message: 'Unable to complete this request because related data is missing',
        }
      case 'P2025':
        return {
          statusCode: 404,
          message: 'Requested resource was not found',
        }
      default:
        return {
          statusCode: 400,
          message: 'Database request failed',
        }
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      statusCode: 400,
      message: 'Invalid database request',
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      statusCode: 500,
      message: 'Database connection failed',
    }
  }

  return null
}

export const errorMiddleware: ErrorRequestHandler = (error, _request, response, _next) => {
  const isJsonSyntaxError =
    error instanceof SyntaxError && 'body' in error
  const prismaError = getPrismaErrorDetails(error)

  let statusCode = 500
  let message = 'Internal server error'
  let errors: unknown

  if (isJsonSyntaxError) {
    statusCode = 400
    message = 'Invalid JSON payload'
  } else if (error instanceof ZodError) {
    statusCode = 400
    message = 'Validation failed'
    errors = error.flatten()
  } else if (error instanceof AppError) {
    statusCode = error.statusCode
    message = error.message
    errors = error.errors
  } else if (prismaError) {
    statusCode = prismaError.statusCode
    message = prismaError.message
  } else if (error instanceof Error) {
    message = error.message
  }

  response.status(statusCode).json(
    errorResponse(
      message,
      errors,
      env.isDevelopment && error instanceof Error ? error.stack : undefined,
    ),
  )
}
