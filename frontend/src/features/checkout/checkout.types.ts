import type { Address } from '../address/address.types'

export type CheckoutIssueType =
  | 'cart'
  | 'address'
  | 'stock'
  | 'product'

export type CheckoutIssue = {
  type: CheckoutIssueType
  productId: string | null
  message: string
}

export type CheckoutItem = {
  cartItemId: string
  productId: string
  slug: string
  sku: string
  name: string
  primaryImage: string | null
  brand: string | null
  category: string
  quantity: number
  mrp: number
  sellingPrice: number
  discountPrice: number | null
  effectivePrice: number
  gstPercentage: number
  stockQuantity: number
  lineMrpTotal: number
  lineDiscountAmount: number
  lineSubtotal: number
  lineGstAmount: number
  lineTotal: number
  validation: {
    isAvailable: boolean
    message: string | null
  }
}

export type CheckoutSummary = {
  mrpTotal: number
  discountAmount: number
  subtotal: number
  gstAmount: number
  deliveryCharge: number
  finalAmount: number
  totalItems: number
}

export type CheckoutSummaryResponse = {
  items: CheckoutItem[]
  selectedAddress: Address | null
  summary: CheckoutSummary
  canCheckout: boolean
  issues: CheckoutIssue[]
}

export type CreatePendingOrderPayload = {
  addressId: string
  paymentMethod: 'online'
}

export type CreatePendingOrderResponse = {
  order: {
    id: string
    orderNumber: string
    status: string
    paymentStatus: string
    totalAmount: number
  }
  payment: {
    id: string
    status: string
    provider: string
    amount: number
  }
}
