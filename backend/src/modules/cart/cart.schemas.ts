import { z } from 'zod'

const quantitySchema = z.coerce.number().int().min(1).max(99)

export const cartItemBodySchema = z.object({
  productId: z.string().trim().cuid('Invalid productId'),
  quantity: quantitySchema,
}).strict()

export const cartItemQuantityBodySchema = z.object({
  quantity: quantitySchema,
}).strict()

export const cartItemParamsSchema = z.object({
  itemId: z.string().trim().cuid('Invalid itemId'),
}).strict()
