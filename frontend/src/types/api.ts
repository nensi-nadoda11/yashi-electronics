export type ApiResponse<T> =
  | {
      success: true
      message: string
      data?: T
    }
  | {
      success: false
      message: string
      errors?: unknown
    }

export type HealthResponseData = {
  service: string
  status: 'ok'
  timestamp: string
  database: 'connected' | 'not_configured' | 'disconnected'
}
