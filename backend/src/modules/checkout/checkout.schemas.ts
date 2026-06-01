import { z } from 'zod'

export const checkoutSummaryQuerySchema = z.object({
  addressId: z.string().trim().cuid('Invalid addressId').optional(),
}).strict()

export const createPendingOrderBodySchema = z.object({
  addressId: z.string().trim().cuid('Invalid addressId'),
  paymentMethod: z.literal('online'),
}).strict()
