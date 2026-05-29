import { Prisma } from '@prisma/client'
import { AppError } from '../../utils/app-error'
import {
  findProductBySlug,
  findProducts,
  findRelatedProducts,
} from './product.repository'
import type {
  CatalogProductDetail,
  CatalogProductImage,
  CatalogProductSummary,
  ProductFilters,
  ProductQueryInput,
  ProductStockStatus,
  ProductsPagination,
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

const normalizeBrandSlugs = (brand?: string) =>
  brand
    ?.split(',')
    .map((slug) => slug.trim())
    .filter(Boolean) ?? []

const mapPrimaryImage = (
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

const mapProductSummary = (product: {
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
}): CatalogProductSummary => {
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

export const getProducts = async (query: ProductQueryInput) => {
  const page = Number(query.page)
  const limit = Number(query.limit)
  const filters: ProductFilters = {
    brandSlugs: normalizeBrandSlugs(query.brand),
    sort: query.sort,
    page: Number.isInteger(page) && page > 0 ? page : 1,
    limit: Number.isInteger(limit) && limit > 0 ? limit : 12,
    ...(query.search ? { search: query.search } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(query.minPrice !== undefined ? { minPrice: Number(query.minPrice) } : {}),
    ...(query.maxPrice !== undefined ? { maxPrice: Number(query.maxPrice) } : {}),
    ...(query.stock ? { stock: query.stock } : {}),
  }

  const { rows, total } = await findProducts(filters)

  const products = rows.map((row) =>
    mapProductSummary({
      id: row.id,
      slug: row.slug,
      sku: row.sku,
      name: row.name,
      shortDescription: row.shortDescription,
      description: row.description,
      mrp: row.mrp,
      sellingPrice: row.sellingPrice,
      discountPrice: row.discountPrice,
      gstPercentage: row.gstPercentage,
      stockQuantity: row.stockQuantity,
      isFeatured: row.isFeatured,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      category: {
        id: row.categoryId,
        name: row.categoryName,
        slug: row.categorySlug,
      },
      brand: row.brandId && row.brandName && row.brandSlug
        ? {
            id: row.brandId,
            name: row.brandName,
            slug: row.brandSlug,
          }
        : null,
      primaryImage: mapPrimaryImage({
        id: row.primaryImageId,
        imageUrl: row.primaryImageUrl,
        altText: row.primaryImageAltText,
        sortOrder: row.primaryImageSortOrder,
      }),
    }),
  )

  const pagination: ProductsPagination = {
    page: filters.page,
    limit: filters.limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / filters.limit)),
  }

  return {
    products,
    pagination,
  }
}

export const getProductBySlug = async (slug: string) => {
  const product = await findProductBySlug(slug)

  if (!product) {
    throw new AppError('Product not found', 404)
  }

  const relatedProducts = await findRelatedProducts(product.categoryId, product.id)

  const detail: CatalogProductDetail = {
    ...mapProductSummary({
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      mrp: product.mrp,
      sellingPrice: product.sellingPrice,
      discountPrice: product.discountPrice,
      gstPercentage: product.gstPercentage,
      stockQuantity: product.stockQuantity,
      isFeatured: product.isFeatured,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
      },
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
            slug: product.brand.slug,
          }
        : null,
      primaryImage:
        product.images[0]
          ? {
              id: product.images[0].id,
              imageUrl: product.images[0].imageUrl,
              altText: product.images[0].altText,
              sortOrder: product.images[0].sortOrder,
            }
          : null,
    }),
    images: product.images.map((image) => ({
      id: image.id,
      imageUrl: image.imageUrl,
      altText: image.altText,
      sortOrder: image.sortOrder,
    })),
    specifications: product.specifications.map((specification) => ({
      id: specification.id,
      name: specification.name,
      value: specification.value,
    })),
  }

  return {
    product: detail,
    relatedProducts: relatedProducts.map((relatedProduct) =>
      mapProductSummary({
        id: relatedProduct.id,
        slug: relatedProduct.slug,
        sku: relatedProduct.sku,
        name: relatedProduct.name,
        shortDescription: relatedProduct.shortDescription,
        description: relatedProduct.description,
        mrp: relatedProduct.mrp,
        sellingPrice: relatedProduct.sellingPrice,
        discountPrice: relatedProduct.discountPrice,
        gstPercentage: relatedProduct.gstPercentage,
        stockQuantity: relatedProduct.stockQuantity,
        isFeatured: relatedProduct.isFeatured,
        createdAt: relatedProduct.createdAt,
        updatedAt: relatedProduct.updatedAt,
        category: {
          id: relatedProduct.category.id,
          name: relatedProduct.category.name,
          slug: relatedProduct.category.slug,
        },
        brand: relatedProduct.brand
          ? {
              id: relatedProduct.brand.id,
              name: relatedProduct.brand.name,
              slug: relatedProduct.brand.slug,
            }
          : null,
        primaryImage: relatedProduct.images[0]
          ? {
              id: relatedProduct.images[0].id,
              imageUrl: relatedProduct.images[0].imageUrl,
              altText: relatedProduct.images[0].altText,
              sortOrder: relatedProduct.images[0].sortOrder,
            }
          : null,
      }),
    ),
  }
}
