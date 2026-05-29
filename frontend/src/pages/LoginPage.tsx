import { KeyRound, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { useAuth } from '../features/auth/useAuth'
import { getApiErrorMessage } from '../lib/api-client'

const getRedirectPath = (searchParams: URLSearchParams) => {
  const redirectPath = searchParams.get('redirect')
  return redirectPath && redirectPath.startsWith('/') ? redirectPath : '/profile'
}

export function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, isLoading, login } = useAuth()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectPath = getRedirectPath(searchParams)

  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (!identifier.trim()) {
      setErrorMessage('Email or mobile is required')
      return
    }

    if (!password) {
      setErrorMessage('Password is required')
      return
    }

    setIsSubmitting(true)

    try {
      await login({
        identifier: identifier.trim(),
        password,
      })

      navigate(redirectPath, { replace: true })
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Customer Login"
        title="Sign in to access orders, wishlist, and profile details"
        description="Sign in with your email or mobile number to access your secure customer account."
      />

      <Container className="pb-16">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
              <KeyRound className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-950">Welcome back</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Log in to manage your saved items, review past orders, and continue toward a streamlined checkout.
            </p>
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <Input
                id="login-identifier"
                label="Email or Mobile"
                placeholder="you@example.com or 9876543210"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
              <Input
                id="login-password"
                type="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-3 text-sm">
                <Link
                  to={`/register?redirect=${encodeURIComponent(redirectPath)}`}
                  className="font-medium text-brand-700 transition hover:text-brand-800"
                >
                  Create account
                </Link>
                <Link
                  to="/forgot-password"
                  className="font-medium text-slate-500 transition hover:text-slate-900"
                >
                  Forgot password?
                </Link>
              </div>
              <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in...' : 'Login'}
              </Button>
            </form>
          </Card>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-slate-950">
                  Built for a reliable customer account experience
                </h3>
                <p className="text-sm leading-7 text-slate-600">
                  Secure sessions, password recovery, and protected account access now plug into this layout without changing the customer-facing theme.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  'Access your order history and tracking',
                  'Save products to your wishlist across devices',
                  'Manage profile details and addresses',
                  'Prepare for future GST-ready checkout workflows',
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </>
  )
}
