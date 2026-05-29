import { z } from 'zod'

const indianMobileRegex = /^[6-9]\d{9}$/

const fullNameSchema = z.string().trim().min(2, 'Full name must be at least 2 characters')
const emailSchema = z.string().trim().email('Please enter a valid email address').transform((value) =>
  value.toLowerCase(),
)
const mobileSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ''))
  .refine((value) => indianMobileRegex.test(value), 'Please enter a valid 10 digit Indian mobile number')

const passwordSchema = z.string().min(8, 'Password must be at least 8 characters')

export const registerCustomerSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    mobile: z
      .union([z.string(), z.undefined()])
      .transform((value) => {
        if (!value || value.trim() === '') {
          return undefined
        }

        return value
      })
      .pipe(mobileSchema.optional()),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: 'custom',
        message: 'Password and confirm password must match',
        path: ['confirmPassword'],
      })
    }
  })

export const loginCustomerSchema = z.object({
  identifier: z.string().trim().min(1, 'Email or mobile is required'),
  password: z.string().min(1, 'Password is required'),
})

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    token: z.string().trim().min(1, 'Reset token is required'),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine((value, context) => {
    if (value.password !== value.confirmPassword) {
      context.addIssue({
        code: 'custom',
        message: 'Password and confirm password must match',
        path: ['confirmPassword'],
      })
    }
  })
