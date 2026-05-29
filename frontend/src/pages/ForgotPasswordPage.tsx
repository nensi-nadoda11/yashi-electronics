import { Mail } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../features/auth/auth.api'
import { getApiErrorMessage } from '../lib/api-client'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'

const successMessage =
  'If an account exists with this email, a password reset link has been sent.'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await forgotPassword({ email: email.trim() })
      setSubmitted(true)
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Password Recovery"
        title="Reset your customer account password"
        description="Enter your email address and we will send a secure reset link if an account exists."
      />

      <Container className="pb-16">
        <div className="mx-auto max-w-2xl">
          <Card className="p-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
              <Mail className="h-7 w-7" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-950">Forgot your password?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              We&apos;ll email you a password reset link that expires shortly for security.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <Input
                id="forgot-password-email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              {submitted ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {successMessage}
                </div>
              ) : null}

              {errorMessage ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errorMessage}
                </div>
              ) : null}

              <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Remembered it?{' '}
              <Link to="/login" className="font-semibold text-brand-700 transition hover:text-brand-800">
                Back to login
              </Link>
            </p>
          </Card>
        </div>
      </Container>
    </>
  )
}
