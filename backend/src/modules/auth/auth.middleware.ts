import type { RequestHandler } from 'express'
import { env } from '../../config/env'
import { authRepository } from './auth.repository'
import { clearAuthCookie, verifyAuthToken } from './auth.service'
import { AppError } from '../../utils/app-error'

export const requireCustomerAuth: RequestHandler = async (request, response, next) => {
  try {
    const token = request.cookies?.[env.authCookieName]

    if (!token || typeof token !== 'string') {
      throw new AppError('Unauthorized', 401)
    }

    const payload = verifyAuthToken(token)
    const customer = await authRepository.findSafeCustomerById(payload.sub)

    if (!customer || !customer.isActive) {
      clearAuthCookie(response)
      throw new AppError('Unauthorized', 401)
    }

    request.customer = customer
    next()
  } catch (error) {
    clearAuthCookie(response)
    next(error)
  }
}
