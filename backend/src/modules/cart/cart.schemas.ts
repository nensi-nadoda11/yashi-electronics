import { z } from 'zod'

const quantitySchema = z.coerce.number().int().min(1).max(99)

export const cartItemBodySchema = z.object({
  productId: z.string().trim().min(1, 'productId is required'),
  quantity: quantitySchema,
})

export const cartItemQuantityBodySchema = z.object({
  quantity: quantitySchema,
})

export const cartItemParamsSchema = z.object({
  itemId: z.string().trim().min(1, 'itemId is required'),
})
