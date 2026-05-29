import { z } from 'zod'
import { productSortOptions, productStockStatuses } from './product.types'

const optionalTrimmedString = z.preprocess((value) => {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmedValue = value.trim()
  return trimmedValue.length > 0 ? trimmedValue : undefined
}, z.string().optional())

export const productListQuerySchema = z
  .object({
    search: optionalTrimmedString,
    category: optionalTrimmedString,
    brand: optionalTrimmedString,
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    sort: z.enum(productSortOptions).default('newest'),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(48).default(12),
    stock: z.enum(productStockStatuses).optional(),
  })
  .superRefine((value, context) => {
    if (
      value.minPrice !== undefined &&
      value.maxPrice !== undefined &&
      value.minPrice > value.maxPrice
    ) {
      context.addIssue({
        code: 'custom',
        message: 'Minimum price cannot be greater than maximum price',
        path: ['minPrice'],
      })
    }
  })
