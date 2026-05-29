export type Customer = {
  id: string
  fullName: string
  email: string
  mobile: string | null
  isActive: boolean
  lastLoginAt?: string | null
}

export type AuthState = {
  customer: Customer | null
  isAuthenticated: boolean
  isLoading: boolean
}

export type RegisterCustomerPayload = {
  fullName: string
  email: string
  mobile?: string
  password: string
  confirmPassword: string
}

export type LoginCustomerPayload = {
  identifier: string
  password: string
}

export type ForgotPasswordPayload = {
  email: string
}

export type ResetPasswordPayload = {
  email: string
  token: string
  password: string
  confirmPassword: string
}
