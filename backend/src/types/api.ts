export type ApiResponse<T = unknown> =
  | {
      success: true
      message: string
      data?: T
    }
  | {
      success: false
      message: string
      errors?: unknown
      stack?: string
    }

export type HealthRouteData = {
  service: 'yashi-electronics-api'
  status: 'ok'
  timestamp: string
  database: 'connected' | 'not_configured' | 'disconnected'
}
