export type ApiSuccessResponse<T = unknown> = {
  success: true
  message: string
  data?: T
}

export type ApiErrorResponse = {
  success: false
  message: string
  errors?: unknown
  stack?: string
}

export const successResponse = <T>(message: string, data?: T): ApiSuccessResponse<T> => ({
  success: true,
  message,
  ...(data !== undefined ? { data } : {}),
})

export const errorResponse = (
  message: string,
  errors?: unknown,
  stack?: string,
): ApiErrorResponse => ({
  success: false,
  message,
  ...(errors !== undefined ? { errors } : {}),
  ...(stack !== undefined ? { stack } : {}),
})
