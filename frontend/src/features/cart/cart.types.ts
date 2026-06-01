import type { CatalogStockStatus } from '../catalog/catalog.types'

export type CartProduct = {
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

export type CartItem = {
  cartItemId: string
  quantity: number
  lineTotal: number
  lineGstAmount: number
  lineDiscountAmount: number
  createdAt: string
  updatedAt: string
  product: CartProduct
}

export type CartSummary = {
  mrpTotal: number
  discountAmount: number
  subtotal: number
  gstAmount: number
  deliveryCharge: number
  finalAmount: number
  totalItems: number
}

export type CartResponse = {
  items: CartItem[]
  summary: CartSummary
  count: number
}

export type AddToCartPayload = {
  productId: string
  quantity: number
}

export type UpdateCartItemPayload = {
  itemId: string
  quantity: number
}
