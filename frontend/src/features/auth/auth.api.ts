import { apiClient } from '../../lib/api-client'
import type { ApiResponse } from '../../types/api'
import type {
  Customer,
  ForgotPasswordPayload,
  LoginCustomerPayload,
  RegisterCustomerPayload,
  ResetPasswordPayload,
} from './auth.types'

type CustomerEnvelope = {
  customer: Customer
}

export async function registerCustomer(payload: RegisterCustomerPayload) {
  const response = await apiClient.post<ApiResponse<CustomerEnvelope>>('/auth/register', payload)
  return response.data
}

export async function loginCustomer(payload: LoginCustomerPayload) {
  const response = await apiClient.post<ApiResponse<CustomerEnvelope>>('/auth/login', payload)
  return response.data
}

export async function logoutCustomer() {
  const response = await apiClient.post<ApiResponse<undefined>>('/auth/logout')
  return response.data
}

export async function getCurrentSession() {
  const response = await apiClient.get<ApiResponse<CustomerEnvelope>>('/auth/session')
  return response.data
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  const response = await apiClient.post<ApiResponse<undefined>>('/auth/forgot-password', payload)
  return response.data
}

export async function resetPassword(payload: ResetPasswordPayload) {
  const response = await apiClient.post<ApiResponse<undefined>>('/auth/reset-password', payload)
  return response.data
}
