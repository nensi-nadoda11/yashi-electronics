import type { ProductStockStatus } from '../catalog/product.types'

export type WishlistActionInput = {
  customerId: string
  productId: string
}

export type WishlistStatusInput = {
  customerId: string
  productIds: string[]
}

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
  stockStatus: ProductStockStatus
}

export type WishlistItem = {
  wishlistId: string
  createdAt: string
  product: WishlistProduct
}

export type WishlistListResponse = {
  items: WishlistItem[]
  count: number
}

export type WishlistMutationResponse = {
  isWishlisted: boolean
  count: number
}

export type WishlistStatusResponse = {
  productIds: string[]
  count: number
}
