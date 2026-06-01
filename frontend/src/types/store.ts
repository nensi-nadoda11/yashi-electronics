export interface ProductSpec {
  label: string
  value: string
}

export interface Product {
  id: number
  name: string
  brand: string
  category: string
  shortDescription: string
  description: string
  price: number
  mrp: number
  rating: number
  reviews: number
  stockStatus: 'In Stock' | 'Limited Stock' | 'Out of Stock'
  tags: string[]
  delivery: string
  heroLabel: string
  specs: ProductSpec[]
}

export interface CategoryPreview {
  name: string
  description: string
  accent: string
}

export interface CartItem {
  productId: number
  quantity: number
}

export interface Order {
  id: string
  placedOn: string
  amount: number
  items: number
  orderStatus: 'Processing' | 'Packed' | 'Shipped' | 'Delivered'
  paymentStatus: 'Paid' | 'Pending' | 'Refunded'
}

export interface CustomerProfile {
  name: string
  email: string
  phone: string
  gstin?: string
  company?: string
  memberSince: string
}
