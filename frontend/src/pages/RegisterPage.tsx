import { BadgeCheck, MailCheck, RotateCcw, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { Input } from '../components/ui/Input'
import { PageHeader } from '../components/ui/PageHeader'
import { sendRegistrationOtp } from '../features/auth/auth.api'
import { useAuth } from '../features/auth/useAuth'
import { getApiErrorMessage, getApiValidationErrors } from '../lib/api-client'

const indianMobileRegex = /^[6-9]\d{9}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const otpRegex = /^\d{6}$/

type RegisterFormValues = {
  fullName: string
  email: string
  mobile: string
  password: string
  confirmPassword: string
  otp: string
}

type RegisterFormErrors = Partial<Record<keyof RegisterFormValues, string>>

const getRedirectPath = (searchParams: URLSearchParams) => {
  const redirectPath = searchParams.get('redirect')
  return redirectPath && redirectPath.startsWith('/') ? redirectPath : '/profile'
}

const createInitialValues = (): RegisterFormValues => ({
  fullName: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  otp: '',
})

const normalizeRegisterPayload = (values: RegisterFormValues) => ({
  fullName: values.fullName.trim(),
  email: values.email.trim(),
  mobile: values.mobile.trim() || undefined,
  password: values.password,
  confirmPassword: values.confirmPassword,
})

const validateRegistrationDetails = (values: RegisterFormValues) => {
  const errors: RegisterFormErrors = {}

  if (values.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters'
  }

  if (!values.email.trim()) {
    errors.email = 'Email address is required'
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address'
  }

  if (values.mobile.trim() && !indianMobileRegex.test(values.mobile.replace(/\D/g, ''))) {
    errors.mobile = 'Please enter a valid 10 digit Indian mobile number'
  }

  if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm password is required'
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = 'Password and confirm password must match'
  }

  return errors
}

const extractRegisterErrors = (error: unknown) => {
  const flattenedErrors = getApiValidationErrors(error)

  if (!flattenedErrors) {
    return null
  }

  const fieldNames: Array<keyof RegisterFormValues> = [
    'fullName',
    'email',
    'mobile',
    'password',
    'confirmPassword',
    'otp',
  ]

  const fieldErrors: RegisterFormErrors = {}

  for (const fieldName of fieldNames) {
    const message = flattenedErrors.fieldErrors?.[fieldName]?.[0]

    if (message) {
      fieldErrors[fieldName] = message
    }
  }

  return {
    fieldErrors,
    formError: flattenedErrors.formErrors?.[0] ?? '',
  }
}

export function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { isAuthenticated, isLoading, register } = useAuth()
  const [formValues, setFormValues] = useState<RegisterFormValues>(createInitialValues)
  const [fieldErrors, setFieldErrors] = useState<RegisterFormErrors>({})
  const [formError, setFormError] = useState('')
  const [otpSentTo, setOtpSentTo] = useState('')
  const [otpInfoMessage, setOtpInfoMessage] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)

  const redirectPath = getRedirectPath(searchParams)
  const isOtpStep = otpSentTo.length > 0

  if (!isLoading && isAuthenticated) {
    return <Navigate to={redirectPath} replace />
  }

  const updateFieldValue = (field: keyof RegisterFormValues, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }))

    setFieldErrors((current) => ({
      ...current,
      [field]: '',
    }))

    setFormError('')
  }

  const applyServerErrors = (error: unknown) => {
    const extractedErrors = extractRegisterErrors(error)

    if (extractedErrors) {
      setFieldErrors((current) => ({
        ...current,
        ...extractedErrors.fieldErrors,
      }))

      if (extractedErrors.formError) {
        setFormError(extractedErrors.formError)
        return
      }
    }

    setFormError(getApiErrorMessage(error))
  }

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitOtpRequest()
  }

  const submitOtpRequest = async () => {
    const nextErrors = validateRegistrationDetails(formValues)

    setFieldErrors(nextErrors)
    setFormError('')
    setOtpInfoMessage('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSendingOtp(true)

    try {
      const payload = normalizeRegisterPayload(formValues)
      const response = await sendRegistrationOtp(payload)

      setFieldErrors({})
      setOtpSentTo(payload.email)
      setOtpInfoMessage(response.message)
      setFormValues((current) => ({
        ...current,
        otp: '',
      }))
    } catch (error) {
      applyServerErrors(error)
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: RegisterFormErrors = {}

    if (!otpRegex.test(formValues.otp.trim())) {
      nextErrors.otp = 'OTP must be 6 digits'
    }

    setFieldErrors((current) => ({
      ...current,
      ...nextErrors,
    }))
    setFormError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setIsVerifyingOtp(true)

    try {
      await register({
        ...normalizeRegisterPayload(formValues),
        otp: formValues.otp.trim(),
      })

      navigate(redirectPath, { replace: true })
    } catch (error) {
      applyServerErrors(error)
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleChangeDetails = () => {
    setOtpSentTo('')
    setOtpInfoMessage('')
    setFormError('')
    setFieldErrors({})
    setFormValues((current) => ({
      ...current,
      otp: '',
    }))
  }

  return (
    <>
      <PageHeader
        eyebrow="Customer Registration"
        title="Create your account"
        description="Email OTP verify hone ke baad hi account create hoga."
      />

      <Container className="pb-16">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
              {isOtpStep ? <MailCheck className="h-7 w-7" /> : <UserPlus className="h-7 w-7" />}
            </div>
            <h2 className="mt-6 text-3xl font-bold text-slate-950">
              {isOtpStep ? 'Verify email OTP' : 'Set up your account'}
            </h2>

            {!isOtpStep ? (
              <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSendOtp}>
                <div className="sm:col-span-2">
                  <Input
                    id="register-name"
                    label="Full Name"
                    placeholder="Rahul Sharma"
                    value={formValues.fullName}
                    onChange={(event) => updateFieldValue('fullName', event.target.value)}
                    error={fieldErrors.fullName}
                    required
                  />
                </div>
                <Input
                  id="register-email"
                  type="email"
                  label="Email Address"
                  placeholder="you@example.com"
                  value={formValues.email}
                  onChange={(event) => updateFieldValue('email', event.target.value)}
                  error={fieldErrors.email}
                  required
                />
                <Input
                  id="register-phone"
                  type="tel"
                  label="Mobile Number"
                  placeholder="9876543210"
                  value={formValues.mobile}
                  onChange={(event) => updateFieldValue('mobile', event.target.value)}
                  error={fieldErrors.mobile}
                  hint="Optional"
                />
                <Input
                  id="register-password"
                  type="password"
                  label="Password"
                  placeholder="Create a password"
                  value={formValues.password}
                  onChange={(event) => updateFieldValue('password', event.target.value)}
                  error={fieldErrors.password}
                  required
                />
                <Input
                  id="register-confirm-password"
                  type="password"
                  label="Confirm Password"
                  placeholder="Repeat your password"
                  value={formValues.confirmPassword}
                  onChange={(event) => updateFieldValue('confirmPassword', event.target.value)}
                  error={fieldErrors.confirmPassword}
                  required
                />
                <div className="sm:col-span-2 space-y-4">
                  <p className="text-xs text-slate-500">Fields marked with <span className="text-rose-600">*</span> are required.</p>
                  {formError ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                      {formError}
                    </div>
                  ) : null}
                  <Button
                    className="w-full"
                    variant="secondary"
                    size="lg"
                    type="submit"
                    disabled={isSendingOtp}
                  >
                    {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
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
            ) : (
              <form className="mt-8 space-y-5" onSubmit={handleVerifyOtp}>
                <div className="rounded-3xl border border-brand-100 bg-brand-50/60 p-5 text-sm text-slate-700">
                  <p className="font-semibold text-slate-900">OTP sent to</p>
                  <p className="mt-1">{otpSentTo}</p>
                  {otpInfoMessage ? <p className="mt-3 text-brand-700">{otpInfoMessage}</p> : null}
                </div>
                <Input
                  id="register-otp"
                  label="Email OTP"
                  placeholder="Enter 6 digit OTP"
                  value={formValues.otp}
                  onChange={(event) => updateFieldValue('otp', event.target.value)}
                  error={fieldErrors.otp}
                  required
                />
                {formError ? (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {formError}
                  </div>
                ) : null}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button className="flex-1" variant="secondary" size="lg" type="submit" disabled={isVerifyingOtp}>
                    {isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP & Register'}
                  </Button>
                  <Button
                    className="flex-1"
                    variant="ghost"
                    size="lg"
                    type="button"
                    onClick={handleChangeDetails}
                    disabled={isVerifyingOtp}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Change details
                  </Button>
                </div>
                <Button
                  className="w-full"
                  variant="ghost"
                  size="lg"
                  type="button"
                  onClick={() => void submitOtpRequest()}
                  disabled={isSendingOtp || isVerifyingOtp}
                >
                  {isSendingOtp ? 'Resending OTP...' : 'Resend OTP'}
                </Button>
              </form>
            )}
          </Card>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-950 text-white">
                <BadgeCheck className="h-7 w-7" />
              </div>
              <h3 className="text-3xl font-bold text-slate-950">What you get</h3>
              <div className="space-y-4">
                {[
                  'Email OTP verification before account creation',
                  'Field-wise validation messages on registration form',
                  'Wishlist and profile access after successful signup',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600"
                  >
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
