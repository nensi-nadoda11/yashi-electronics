import bcrypt from 'bcryptjs'
import type { Response } from 'express'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { Prisma } from '@prisma/client'
import { createHash, randomBytes } from 'node:crypto'
import { env } from '../../config/env'
import { AppError } from '../../utils/app-error'
import { sendPasswordResetEmail } from '../../services/email.service'
import { authRepository } from './auth.repository'
import type {
  AuthTokenPayload,
  ForgotPasswordInput,
  LoginCustomerInput,
  RegisterCustomerInput,
  ResetPasswordInput,
  SafeCustomer,
} from './auth.types'

const BCRYPT_SALT_ROUNDS = 10
const INVALID_LOGIN_MESSAGE = 'Invalid email/mobile or password'
const FORGOT_PASSWORD_RESPONSE_MESSAGE =
  'If an account exists with this email, a password reset link has been sent.'

const authCookieMaxAgeMs = env.authCookieMaxAgeDays * 24 * 60 * 60 * 1000
const authCookieSecure = env.isProduction || env.authCookieSecure

const normalizedEmail = (email: string) => email.trim().toLowerCase()
const normalizedMobile = (mobile: string) => mobile.replace(/\D/g, '')

const createResetTokenHash = (token: string) =>
  createHash('sha256').update(token).digest('hex')

export const signAuthToken = (customerId: string) =>
  jwt.sign(
    { sub: customerId },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn as NonNullable<SignOptions['expiresIn']> } satisfies SignOptions,
  )

export const verifyAuthToken = (token: string): AuthTokenPayload => {
  try {
    const decodedToken = jwt.verify(token, env.jwtSecret)

    if (
      typeof decodedToken !== 'object' ||
      decodedToken === null ||
      typeof decodedToken.sub !== 'string'
    ) {
      throw new AppError('Invalid session token', 401)
    }

    return { sub: decodedToken.sub }
  } catch {
    throw new AppError('Session expired or invalid', 401)
  }
}

export const setAuthCookie = (response: Response, token: string) => {
  response.cookie(env.authCookieName, token, {
    httpOnly: true,
    sameSite: env.authCookieSameSite,
    secure: authCookieSecure,
    maxAge: authCookieMaxAgeMs,
    path: '/',
  })
}

export const clearAuthCookie = (response: Response) => {
  response.clearCookie(env.authCookieName, {
    httpOnly: true,
    sameSite: env.authCookieSameSite,
    secure: authCookieSecure,
    path: '/',
  })
}

class AuthService {
  private createAuthResponse(customer: SafeCustomer) {
    return {
      customer,
      token: signAuthToken(customer.id),
    }
  }

  async registerCustomer(input: RegisterCustomerInput) {
    const email = normalizedEmail(input.email)
    const mobile = input.mobile ? normalizedMobile(input.mobile) : undefined

    const [existingEmailCustomer, existingMobileCustomer] = await Promise.all([
      authRepository.findSafeCustomerByEmail(email),
      mobile ? authRepository.findSafeCustomerByMobile(mobile) : Promise.resolve(null),
    ])

    if (existingEmailCustomer) {
      throw new AppError('An account already exists with this email address', 409)
    }

    if (existingMobileCustomer) {
      throw new AppError('An account already exists with this mobile number', 409)
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS)

    try {
      const customer = await authRepository.createCustomer({
        fullName: input.fullName.trim(),
        email,
        mobile: mobile ?? null,
        passwordHash,
      })

      return this.createAuthResponse(customer)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new AppError('An account with these details already exists', 409)
      }

      throw error
    }
  }

  async loginCustomer(input: LoginCustomerInput) {
    const identifier = input.identifier.trim()
    const email = identifier.includes('@') ? normalizedEmail(identifier) : null
    const mobile = !email ? normalizedMobile(identifier) : null

    const customer = await authRepository.findAuthCustomerByIdentifier({
      email,
      mobile,
    })

    if (!customer) {
      throw new AppError(INVALID_LOGIN_MESSAGE, 401)
    }

    if (!customer.isActive) {
      throw new AppError('Your account is inactive. Please contact support.', 403)
    }

    const passwordMatches = await bcrypt.compare(input.password, customer.passwordHash)

    if (!passwordMatches) {
      throw new AppError(INVALID_LOGIN_MESSAGE, 401)
    }

    const customerWithLastLogin = await authRepository.updateLastLoginAt(customer.id, new Date())

    return this.createAuthResponse(customerWithLastLogin)
  }

  async getSessionCustomer(customerId: string) {
    const customer = await authRepository.findSafeCustomerById(customerId)

    if (!customer || !customer.isActive) {
      throw new AppError('Unauthorized', 401)
    }

    return customer
  }

  async forgotPassword(input: ForgotPasswordInput) {
    const email = normalizedEmail(input.email)
    const customer = await authRepository.findAuthCustomerByEmail(email)

    if (!customer || !customer.isActive) {
      return {
        message: FORGOT_PASSWORD_RESPONSE_MESSAGE,
      }
    }

    const rawToken = randomBytes(32).toString('hex')
    const resetPasswordTokenHash = createResetTokenHash(rawToken)
    const resetPasswordExpiresAt = new Date(
      Date.now() + env.resetPasswordTokenExpiryMinutes * 60 * 1000,
    )

    await authRepository.setPasswordResetToken(
      customer.id,
      resetPasswordTokenHash,
      resetPasswordExpiresAt,
    )

    const resetLink = `${env.frontendUrl}/reset-password?token=${encodeURIComponent(rawToken)}&email=${encodeURIComponent(email)}`

    const emailResult = await sendPasswordResetEmail({
      to: email,
      customerName: customer.fullName,
      resetLink,
      expiresInMinutes: env.resetPasswordTokenExpiryMinutes,
    })

    if (!emailResult.sent && env.isDevelopment) {
      process.stdout.write(`Password reset link preview for ${email}: ${resetLink}\n`)
    }

    return {
      message: FORGOT_PASSWORD_RESPONSE_MESSAGE,
    }
  }

  async resetPassword(input: ResetPasswordInput) {
    const email = normalizedEmail(input.email)
    const customer = await authRepository.findAuthCustomerByEmail(email)

    if (!customer || !customer.resetPasswordTokenHash) {
      throw new AppError('Invalid or expired password reset request', 400)
    }

    const resetPasswordExpiresAt = customer.resetPasswordExpiresAt

    if (!resetPasswordExpiresAt || resetPasswordExpiresAt.getTime() < Date.now()) {
      throw new AppError('Invalid or expired password reset request', 400)
    }

    const incomingTokenHash = createResetTokenHash(input.token.trim())

    if (incomingTokenHash !== customer.resetPasswordTokenHash) {
      throw new AppError('Invalid or expired password reset request', 400)
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_SALT_ROUNDS)

    await authRepository.updatePasswordAndClearResetToken(customer.id, passwordHash)

    return {
      message: 'Password reset successful. Please log in with your new password.',
    }
  }
}

export const authService = new AuthService()
