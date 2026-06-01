import type { ErrorInfo, ReactNode } from 'react'
import { Component } from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { Container } from '../ui/Container'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Application error boundary caught an error', error, errorInfo)
    }
  }

  private handleReload = () => {
    window.location.reload()
  }

  override render() {
    if (this.state.hasError) {
      return (
        <Container className="py-16">
          <Card className="mx-auto max-w-2xl border-rose-100 bg-rose-50/80 p-8 text-center">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-rose-600 shadow-sm">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <div className="mt-6 space-y-3">
              <h1 className="text-3xl font-bold text-slate-950">Something went wrong</h1>
              <p className="text-base leading-7 text-slate-600">
                The page hit an unexpected error. You can reload the app and try again.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button type="button" variant="primary" onClick={this.handleReload}>
                <RefreshCcw className="h-4 w-4" />
                Reload App
              </Button>
            </div>
          </Card>
        </Container>
      )
    }

    return this.props.children
  }
}
