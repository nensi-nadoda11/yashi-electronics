import type { RequestHandler } from 'express'
import { authService, clearAuthCookie, setAuthCookie } from './auth.service'
import { successResponse } from '../../utils/api-response'

export const registerCustomerController: RequestHandler = async (request, response, next) => {
  try {
    const result = await authService.registerCustomer(request.body)
    setAuthCookie(response, result.token)

    response
      .status(201)
      .json(successResponse('Registration successful', { customer: result.customer }))
  } catch (error) {
    next(error)
  }
}

export const loginCustomerController: RequestHandler = async (request, response, next) => {
  try {
    const result = await authService.loginCustomer(request.body)
    setAuthCookie(response, result.token)

    response
      .status(200)
      .json(successResponse('Login successful', { customer: result.customer }))
  } catch (error) {
    next(error)
  }
}

export const logoutCustomerController: RequestHandler = (_request, response) => {
  clearAuthCookie(response)
  response.status(200).json(successResponse('Logout successful'))
}

export const getSessionController: RequestHandler = async (request, response, next) => {
  try {
    const customer = await authService.getSessionCustomer(request.customer!.id)

    response
      .status(200)
      .json(successResponse('Session fetched successfully', { customer }))
  } catch (error) {
    next(error)
  }
}

export const forgotPasswordController: RequestHandler = async (request, response, next) => {
  try {
    const result = await authService.forgotPassword(request.body)

    response.status(200).json(successResponse(result.message))
  } catch (error) {
    next(error)
  }
}

export const resetPasswordController: RequestHandler = async (request, response, next) => {
  try {
    const result = await authService.resetPassword(request.body)
    clearAuthCookie(response)

    response.status(200).json(successResponse(result.message))
  } catch (error) {
    next(error)
  }
}
