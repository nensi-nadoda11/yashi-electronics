import { z } from 'zod'

const indianMobileRegex = /^[6-9]\d{9}$/
const optionalTrimmedTextSchema = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (typeof value !== 'string') {
      return undefined
    }

    const trimmed = value.trim()

    return trimmed.length > 0 ? trimmed : undefined
  })

const addressBodySchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters'),
  mobile: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ''))
    .refine((value) => indianMobileRegex.test(value), 'Please enter a valid 10 digit Indian mobile number'),
  addressLine1: z.string().trim().min(1, 'Address line 1 is required'),
  addressLine2: optionalTrimmedTextSchema.optional(),
  city: z.string().trim().min(1, 'City is required'),
  state: z.string().trim().min(1, 'State is required'),
  pincode: z.string().trim().regex(/^\d{6}$/, 'Please enter a valid 6 digit pincode'),
  landmark: optionalTrimmedTextSchema.optional(),
  isDefault: z.boolean().optional(),
}).strict()

export const addressIdParamsSchema = z.object({
  addressId: z.string().cuid('Invalid addressId'),
}).strict()

export const createAddressBodySchema = addressBodySchema
export const updateAddressBodySchema = addressBodySchema
