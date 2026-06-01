import { z } from 'zod'
import { ORDER_STATUSES, PAYMENT_STATUSES } from './orders.types'

const trimmedOptionalStringSchema = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}, z.string().min(1).optional())

export const orderIdParamsSchema = z.object({
  orderId: z.string().cuid('Invalid orderId'),
}).strict()

export const ordersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
  status: z.preprocess((value) => {
    if (typeof value !== 'string') {
      return undefined
    }

    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }, z.enum(ORDER_STATUSES).optional()),
  paymentStatus: z.preprocess((value) => {
    if (typeof value !== 'string') {
      return undefined
    }

    const trimmed = value.trim()
    return trimmed.length > 0 ? trimmed : undefined
  }, z.enum(PAYMENT_STATUSES).optional()),
  search: trimmedOptionalStringSchema.optional(),
}).strict()
