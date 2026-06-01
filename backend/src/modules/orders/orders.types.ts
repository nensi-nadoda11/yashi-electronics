export const ORDER_STATUSES = [
  'pending_payment',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'failed',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const PAYMENT_STATUSES = ['pending', 'paid', 'failed', 'refunded'] as const

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number]

export type OrderPreviewItem = {
  productName: string
  quantity: number
}

export type OrderPaymentSummary = {
  provider: string
  amount: number
  status: PaymentStatus
  paidAt: string | null
}

export type OrderListItem = {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  totalAmount: number
  itemCount: number
  createdAt: string
  updatedAt: string
  previewItems: OrderPreviewItem[]
  paymentSummary: OrderPaymentSummary | null
  canCancel: boolean
  canContinuePayment: boolean
}

export type OrdersPagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type OrdersListResponse = {
  orders: OrderListItem[]
  pagination: OrdersPagination
}

export type OrderItem = {
  id: string
  productId: string
  productName: string
  sku: string
  quantity: number
  unitPrice: number
  gstPercentage: number
  gstAmount: number
  totalAmount: number
}

export type OrderShippingAddress = {
  fullName: string
  mobile: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  pincode: string
  landmark: string | null
}

export type OrderPayment = {
  id: string
  provider: string
  amount: number
  status: PaymentStatus
  paidAt: string | null
  createdAt: string
}

export type OrderTimelineItem = {
  label: string
  status: 'completed' | 'current' | 'pending'
  date?: string
}

export type OrderDetail = {
  id: string
  orderNumber: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  subtotal: number
  discountAmount: number
  gstAmount: number
  deliveryCharge: number
  totalAmount: number
  shippingAddress: OrderShippingAddress
  items: OrderItem[]
  payment: OrderPayment | null
  timeline: OrderTimelineItem[]
  canCancel: boolean
  canContinuePayment: boolean
  createdAt: string
  updatedAt: string
}

export type OrdersQueryInput = {
  customerId: string
  page: number
  limit: number
  status?: OrderStatus
  paymentStatus?: PaymentStatus
  search?: string
}

export type OrderDetailResponse = {
  order: OrderDetail
}

export type CancelOrderResponse = OrderDetailResponse
