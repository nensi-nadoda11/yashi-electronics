export const productSortOptions = [
  'newest',
  'price_low_to_high',
  'price_high_to_low',
  'name_az',
  'name_za',
  'discount_high_to_low',
] as const

export const productStockStatuses = ['in_stock', 'low_stock', 'out_of_stock'] as const

export type ProductSortOption = (typeof productSortOptions)[number]
export type ProductStockStatus = (typeof productStockStatuses)[number]

export type ProductQueryInput = {
  search?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  sort: ProductSortOption
  page: number
  limit: number
  stock?: ProductStockStatus
}

export type ProductFilters = {
  search?: string
  category?: string
  brandSlugs: string[]
  minPrice?: number
  maxPrice?: number
  sort: ProductSortOption
  page: number
  limit: number
  stock?: ProductStockStatus
}

export type CatalogCategory = {
  id: string
  name: string
  slug: string
  description: string | null
  productCount: number
}

export type CatalogBrand = {
  id: string
  name: string
  slug: string
  description: string | null
  productCount: number
}

export type CatalogProductImage = {
  id: string
  imageUrl: string
  altText: string | null
  sortOrder: number
}

export type CatalogProductSpecification = {
  id: string
  name: string
  value: string
}

export type CatalogProductSummary = {
  id: string
  slug: string
  sku: string
  name: string
  shortDescription: string | null
  description: string | null
  mrp: number
  sellingPrice: number
  discountPrice: number | null
  effectivePrice: number
  discountPercentage: number
  gstPercentage: number
  stockQuantity: number
  stockStatus: ProductStockStatus
  isFeatured: boolean
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
  createdAt: string
  updatedAt: string
}

export type CatalogProductDetail = CatalogProductSummary & {
  images: CatalogProductImage[]
  specifications: CatalogProductSpecification[]
}

export type ProductsPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}
