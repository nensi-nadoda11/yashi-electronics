import { LockKeyhole } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../features/auth/auth.api'
import { getApiErrorMessage } from '../lib/api-client'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { ErrorState } from '../components/ui/ErrorState'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const token = searchParams.get('token') ?? ''
  const email = searchParams.get('email') ?? ''
  const hasRequiredParams = useMemo(() => Boolean(token && email), [email, token])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (password.trim().length < 8) {
      setErrorMessage('Password must be at least 8 characters')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Password and confirm password must match')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await resetPassword({
        email,
        token,
        password,
        confirmPassword,
      })

      if (!response.success) {
        throw new Error(response.message)
      }

      setSuccessMessage(response.message)
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Set New Password"
        title="Choose a new password for your account"
        description="Use the secure link from your email to complete the password reset."
      />

      <Container className="pb-16">
        {!hasRequiredParams ? (
          <ErrorState
            title="Invalid reset link"
            description="This reset password link is incomplete or expired. Please request a fresh reset email and try again."
            action={
              <Link to="/forgot-password" className="text-sm font-semibold text-brand-700 transition hover:text-brand-800">
                Request a new reset link
              </Link>
            }
          />
        ) : (
          <div className="mx-auto max-w-2xl">
            <Card className="p-8">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
                <LockKeyhole className="h-7 w-7" />
              </div>
              <h2 className="mt-6 text-3xl font-bold text-slate-950">Create a new password</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Update your password for <span className="font-semibold text-slate-900">{email}</span>.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <Input
                  id="reset-password"
                  type="password"
                  label="New Password"
                  placeholder="Enter your new password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <Input
                  id="reset-confirm-password"
                  type="password"
                  label="Confirm Password"
                  placeholder="Repeat your new password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />

                {successMessage ? (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {successMessage}
                  </div>
                ) : null}

                {errorMessage ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {errorMessage}
                  </div>
                ) : null}

                <Button className="w-full" size="lg" type="submit" disabled={isSubmitting || Boolean(successMessage)}>
                  {isSubmitting ? 'Resetting password...' : 'Reset password'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                <Link to="/login" className="font-semibold text-brand-700 transition hover:text-brand-800">
                  Return to login
                </Link>
              </p>
            </Card>
          </div>
        )}
      </Container>
    </>
  )
}
