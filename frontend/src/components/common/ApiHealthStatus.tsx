import { useEffect, useState } from 'react'
import { apiClient, getApiErrorMessage } from '../../lib/api-client'
import type { ApiResponse, HealthResponseData } from '../../types/api'

type HealthState =
  | { status: 'idle' | 'loading' }
  | { status: 'connected'; database: HealthResponseData['database'] }
  | { status: 'unavailable'; message: string }

const databaseLabelMap: Record<HealthResponseData['database'], string> = {
  connected: 'DB connected',
  not_configured: 'DB not configured',
  disconnected: 'DB disconnected',
}

export function ApiHealthStatus() {
  const [healthState, setHealthState] = useState<HealthState>({ status: 'loading' })

  useEffect(() => {
    let isMounted = true

    const fetchHealth = async () => {
      try {
        const response = await apiClient.get<ApiResponse<HealthResponseData>>('/health')

        if (!isMounted) {
          return
        }

        if (response.data.success && response.data.data) {
          setHealthState({
            status: 'connected',
            database: response.data.data.database,
          })
          return
        }

        setHealthState({
          status: 'unavailable',
          message: response.data.message || 'API unavailable',
        })
      } catch (error) {
        if (!isMounted) {
          return
        }

        setHealthState({
          status: 'unavailable',
          message: getApiErrorMessage(error),
        })
      }
    }

    void fetchHealth()

    return () => {
      isMounted = false
    }
  }, [])

  if (!import.meta.env.DEV) {
    return null
  }

  const content =
    healthState.status === 'connected'
      ? `API connected • ${databaseLabelMap[healthState.database]}`
      : healthState.status === 'unavailable'
        ? `API unavailable • ${healthState.message}`
        : 'Checking API health...'

  const toneClassName =
    healthState.status === 'connected'
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
      : healthState.status === 'unavailable'
        ? 'border-amber-500/20 bg-amber-500/10 text-amber-100'
        : 'border-slate-700 bg-slate-900/70 text-slate-300'

  return (
    <div className={`rounded-full border px-3 py-1.5 text-xs tracking-wide ${toneClassName}`}>
      {content}
    </div>
  )
}
