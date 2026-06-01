import type { CatalogStockStatus } from '../catalog/catalog.types'

export type WishlistProduct = {
  id: string
  name: string
  slug: string
  sku: string
  primaryImage: string | null
  category: string
  brand: string | null
  mrp: number
  sellingPrice: number
  discountPrice: number | null
  effectivePrice: number
  discountPercentage: number
  gstPercentage: number
  stockQuantity: number
  stockStatus: CatalogStockStatus
}

export type WishlistItem = {
  wishlistId: string
  createdAt: string
  product: WishlistProduct
}

export type WishlistResponse = {
  items: WishlistItem[]
  count: number
}

export type WishlistStatusResponse = {
  productIds: string[]
  count: number
}

export type ToggleWishlistResponse = {
  isWishlisted: boolean
  count: number
}
