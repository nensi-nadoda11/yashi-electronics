import axios, { AxiosError } from 'axios'
import type { ApiResponse } from '../types/api'

const DEFAULT_API_BASE_URL = 'http://localhost:4000/api/v1'
const unauthenticatedAuthPaths = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/register/send-otp',
  '/auth/forgot-password',
  '/auth/reset-password',
])

let unauthorizedHandler: (() => void) | null = null

const normalizeRequestPath = (url: string) => url.split('?')[0] ?? url

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const requestUrl = normalizeRequestPath(error.config?.url ?? '')
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
    if (!error.response) {
      return 'Unable to reach the server. Please check your connection and try again.'
    }

    if (error.response.status === 401) {
      const apiMessage = (error.response.data as ApiResponse<unknown> | undefined)?.message
      return apiMessage || 'Your session has expired. Please sign in again.'
    }

    const apiMessage = (error.response?.data as ApiResponse<unknown> | undefined)?.message
    return apiMessage || error.message || 'Request failed'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong'
}

type FlattenedValidationErrors = {
  fieldErrors?: Record<string, string[] | undefined>
  formErrors?: string[]
}

export const getApiValidationErrors = (error: unknown) => {
  if (!(error instanceof AxiosError)) {
    return null
  }

  const apiResponse = error.response?.data as ApiResponse<unknown> | undefined
  const flattenedErrors = apiResponse?.success === false ? (apiResponse.errors as FlattenedValidationErrors | undefined) : undefined

  if (!flattenedErrors?.fieldErrors && !flattenedErrors?.formErrors) {
    return null
  }

  return flattenedErrors
}
