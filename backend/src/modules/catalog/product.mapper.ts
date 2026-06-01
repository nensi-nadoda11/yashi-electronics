import { Prisma } from '@prisma/client'
import type {
  CatalogProductImage,
  CatalogProductSummary,
  ProductStockStatus,
} from './product.types'

const toNumber = (value: Prisma.Decimal | number | string | null | undefined) => {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    return Number(value)
  }

  return value.toNumber()
}

export const calculateEffectivePrice = (
  sellingPrice: Prisma.Decimal | number | string,
  discountPrice?: Prisma.Decimal | number | string | null,
) => {
  const normalizedDiscountPrice = toNumber(discountPrice)
  const normalizedSellingPrice = toNumber(sellingPrice) ?? 0

  return normalizedDiscountPrice ?? normalizedSellingPrice
}

export const calculateDiscountPercentage = (
  mrp: Prisma.Decimal | number | string,
  effectivePrice: Prisma.Decimal | number | string,
) => {
  const normalizedMrp = toNumber(mrp) ?? 0
  const normalizedEffectivePrice = toNumber(effectivePrice) ?? 0

  if (normalizedMrp <= 0 || normalizedMrp <= normalizedEffectivePrice) {
    return 0
  }

  return Math.round(((normalizedMrp - normalizedEffectivePrice) / normalizedMrp) * 100)
}

export const getStockStatus = (stockQuantity: number): ProductStockStatus => {
  if (stockQuantity <= 0) {
    return 'out_of_stock'
  }

  if (stockQuantity <= 5) {
    return 'low_stock'
  }

  return 'in_stock'
}

export const mapPrimaryImage = (
  image:
    | {
        id: string | null
        imageUrl: string | null
        altText: string | null
        sortOrder: number | null
      }
    | undefined,
): CatalogProductImage | null => {
  if (!image?.id || !image.imageUrl) {
    return null
  }

  return {
    id: image.id,
    imageUrl: image.imageUrl,
    altText: image.altText,
    sortOrder: image.sortOrder ?? 0,
  }
}

type CatalogProductSummarySource = {
  id: string
  slug: string
  sku: string
  name: string
  shortDescription: string | null
  description: string | null
  mrp: Prisma.Decimal | number | string
  sellingPrice: Prisma.Decimal | number | string
  discountPrice: Prisma.Decimal | number | string | null
  gstPercentage: Prisma.Decimal | number | string
  stockQuantity: number
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  category: {
    id: string
    name: string
    slug: string
  }
  brand: {
    id: string
    name: string
    slug: string
  } | null
  primaryImage: CatalogProductImage | null
}

export const mapCatalogProductSummary = (
  product: CatalogProductSummarySource,
): CatalogProductSummary => {
  const mrp = toNumber(product.mrp) ?? 0
  const sellingPrice = toNumber(product.sellingPrice) ?? 0
  const discountPrice = toNumber(product.discountPrice)
  const effectivePrice = calculateEffectivePrice(product.sellingPrice, product.discountPrice)

  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    shortDescription: product.shortDescription,
    description: product.description,
    mrp,
    sellingPrice,
    discountPrice,
    effectivePrice,
    discountPercentage: calculateDiscountPercentage(mrp, effectivePrice),
    gstPercentage: toNumber(product.gstPercentage) ?? 0,
    stockQuantity: product.stockQuantity,
    stockStatus: getStockStatus(product.stockQuantity),
    isFeatured: product.isFeatured,
    category: product.category,
    brand: product.brand,
    primaryImage: product.primaryImage,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  }
}
