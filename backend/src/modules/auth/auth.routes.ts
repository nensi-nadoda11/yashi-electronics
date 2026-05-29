import { Router } from 'express'
import {
  forgotPasswordController,
  getSessionController,
  loginCustomerController,
  logoutCustomerController,
  registerCustomerController,
  resetPasswordController,
} from './auth.controller'
import { requireCustomerAuth } from './auth.middleware'
import {
  forgotPasswordSchema,
  loginCustomerSchema,
  registerCustomerSchema,
  resetPasswordSchema,
} from './auth.schemas'
import { validate } from '../../middlewares/validate.middleware'

export const authRouter = Router()

authRouter.post('/register', validate({ body: registerCustomerSchema }), registerCustomerController)
authRouter.post('/login', validate({ body: loginCustomerSchema }), loginCustomerController)
authRouter.post('/logout', logoutCustomerController)
authRouter.get('/session', requireCustomerAuth, getSessionController)
authRouter.post(
  '/forgot-password',
  validate({ body: forgotPasswordSchema }),
  forgotPasswordController,
)
authRouter.post('/reset-password', validate({ body: resetPasswordSchema }), resetPasswordController)
