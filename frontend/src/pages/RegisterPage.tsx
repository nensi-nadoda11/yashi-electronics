import { BadgeCheck, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { useAuth } from '../features/auth/useAuth'
import { getApiErrorMessage } from '../lib/api-client'

const indianMobileRegex = /^[6-9]\d{9}$/

const getRedirectPath = (searchParams: URLSearchParams) => {
  const redirectPath = searchParams.get('redirect')
  return redirectPath && redirectPath.startsWith('/') ? redirectPath : '/profile'
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, isLoading, register } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectPath = getRedirectPath(searchParams)

  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (fullName.trim().length < 2) {
      setErrorMessage('Full name must be at least 2 characters')
      return
    }

    if (!email.trim()) {
      setErrorMessage('Email address is required')
      return
    }

    if (mobile.trim() && !indianMobileRegex.test(mobile.replace(/\D/g, ''))) {
      setErrorMessage('Please enter a valid 10 digit Indian mobile number')
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and confirm password must match')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim() || undefined,
        password,
        confirmPassword,
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
        eyebrow="Customer Registration"
        title="Create your Yashi Electronics customer account"
        description="Create a secure customer account for wishlist access, protected profile features, and future order history."
      />

      <Container className="pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
              <UserPlus className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-950">Set up your account</h2>
            <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
              <div className="sm:col-span-2">
                <Input
                  id="register-name"
                  label="Full Name"
                  placeholder="Rahul Sharma"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </div>
              <Input
                id="register-email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Input
                id="register-phone"
                type="tel"
                label="Mobile Number"
                placeholder="9876543210"
                value={mobile}
                onChange={(event) => setMobile(event.target.value)}
              />
              <Input
                id="register-password"
                type="password"
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <Input
                id="register-confirm-password"
                type="password"
                label="Confirm Password"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
              <div className="sm:col-span-2 space-y-4">
                {errorMessage ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                  </div>
                ) : null}
                <Button className="w-full" variant="secondary" size="lg" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating account...' : 'Register'}
                </Button>
                <p className="text-center text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link
                    to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
                    className="font-semibold text-brand-700 transition hover:text-brand-800"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </Card>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
                <BadgeCheck className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-bold text-slate-950">
                Account creation that scales with future commerce features
              </h3>
              <div className="space-y-4">
                {[
                  'Create a persistent secure session immediately after successful registration.',
                  'Support password reset, profile access, and protected routes from the same account foundation.',
                  'Keep the registration experience clean, lightweight, and mobile friendly.',
                ].map((item) => (
                  <div key={item} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
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
