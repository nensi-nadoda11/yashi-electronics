import axios, { AxiosError } from 'axios'
import type { ApiResponse } from '../types/api'

const DEFAULT_API_BASE_URL = 'http://localhost:4000/api/v1'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  withCredentials: true,
  timeout: 15000,
})

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
