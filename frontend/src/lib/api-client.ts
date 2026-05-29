import axios, { AxiosError } from 'axios'
import type { ApiResponse } from '../types/api'

const DEFAULT_API_BASE_URL = 'http://localhost:4000/api/v1'
const unauthenticatedAuthPaths = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
])

let unauthorizedHandler: (() => void) | null = null

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const requestUrl = error.config?.url ?? ''
    const statusCode = error.response?.status

    if (
      statusCode === 401 &&
      unauthorizedHandler &&
      !unauthenticatedAuthPaths.has(requestUrl)
    ) {
      unauthorizedHandler()
    }

    return Promise.reject(error)
  },
)

export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  unauthorizedHandler = handler
}

export const getApiErrorMessage = (error: unknown) => {
  if (error instanceof AxiosError) {
    const apiMessage = (error.response?.data as ApiResponse<unknown> | undefined)?.message
    return apiMessage || error.message || 'Request failed'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}
