import { Router } from 'express'
import {
  forgotPasswordController,
  getSessionController,
  loginCustomerController,
  logoutCustomerController,
  registerCustomerController,
  resetPasswordController,
  sendRegistrationOtpController,
} from './auth.controller'
import { requireCustomerAuth } from './auth.middleware'
import {
  forgotPasswordSchema,
  loginCustomerSchema,
  registerCustomerSchema,
  resetPasswordSchema,
  sendRegistrationOtpSchema,
} from './auth.schemas'
import { createRateLimit } from '../../middlewares/rate-limit.middleware'
import { validate } from '../../middlewares/validate.middleware'

export const authRouter = Router()

const loginAndRegisterRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts. Please try again later.',
})

const passwordRecoveryRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many password recovery attempts. Please try again later.',
})

const otpRequestRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many OTP requests. Please try again later.',
})

authRouter.post(
  '/register/send-otp',
  otpRequestRateLimit,
  validate({ body: sendRegistrationOtpSchema }),
  sendRegistrationOtpController,
)
authRouter.post(
  '/register',
  loginAndRegisterRateLimit,
  validate({ body: registerCustomerSchema }),
  registerCustomerController,
)
authRouter.post(
  '/login',
  loginAndRegisterRateLimit,
  validate({ body: loginCustomerSchema }),
  loginCustomerController,
)
authRouter.post('/logout', logoutCustomerController)
authRouter.get('/session', requireCustomerAuth, getSessionController)
authRouter.post(
  '/forgot-password',
  passwordRecoveryRateLimit,
  validate({ body: forgotPasswordSchema }),
  forgotPasswordController,
)
authRouter.post(
  '/reset-password',
  passwordRecoveryRateLimit,
  validate({ body: resetPasswordSchema }),
  resetPasswordController,
)
