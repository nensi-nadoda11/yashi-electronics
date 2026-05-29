import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Container } from '../ui/Container'
import { LoadingState } from '../ui/LoadingState'
import { useAuth } from '../../features/auth/useAuth'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <Container className="py-10">
        <LoadingState
          title="Checking your session"
          description="Please wait while we verify your customer account."
          cardCount={2}
        />
      </Container>
    )
  }

  if (!isAuthenticated) {
    const redirectPath = `${location.pathname}${location.search}`

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
        replace
      />
    )
  }

  return <>{children}</>
}
