import { z } from 'zod'

export const checkoutSummaryQuerySchema = z.object({
  addressId: z.string().trim().min(1).optional(),
})

export const createPendingOrderBodySchema = z.object({
  addressId: z.string().trim().min(1, 'addressId is required'),
  paymentMethod: z.literal('online'),
})
