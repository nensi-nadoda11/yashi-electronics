export type SafeCustomer = {
  id: string
  fullName: string
  email: string
  mobile: string | null
  isActive: boolean
  lastLoginAt: Date | null
}

export type AuthenticatedCustomer = Pick<
  SafeCustomer,
  'id' | 'fullName' | 'email' | 'mobile' | 'isActive'
> & {
  lastLoginAt?: Date | null
}

export type AuthTokenPayload = {
  sub: string
}

export type RegisterCustomerInput = {
  fullName: string
  email: string
  mobile?: string
  password: string
}

export type LoginCustomerInput = {
  identifier: string
  password: string
}

export type ForgotPasswordInput = {
  email: string
}

export type ResetPasswordInput = {
  email: string
  token: string
  password: string
}
