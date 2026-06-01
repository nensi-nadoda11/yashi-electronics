import { z } from 'zod'

const productIdSchema = z.string().trim().cuid()

const normalizeProductIds = (value: unknown): string[] => {
  const entries: string[] = Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : typeof value === 'string'
      ? [value]
      : []

  return [
    ...new Set(
      entries.flatMap((entry: string) =>
        entry
          .split(',')
          .map((item: string) => item.trim())
          .filter(Boolean),
      ),
    ),
  ]
}

export const wishlistItemBodySchema = z.object({
  productId: productIdSchema,
}).strict()

export const wishlistItemParamsSchema = z.object({
  productId: productIdSchema,
}).strict()

export const wishlistStatusQuerySchema = z.object({
  productIds: z.preprocess(
    normalizeProductIds,
    z.array(productIdSchema).max(100).default([]),
  ),
}).strict()
