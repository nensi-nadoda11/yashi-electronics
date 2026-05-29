export type CatalogStockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export type SortOption =
  | 'newest'
  | 'price_low_to_high'
  | 'price_high_to_low'
  | 'name_az'
  | 'name_za'
  | 'discount_high_to_low'

export type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  productCount: number
}

export type Brand = {
  id: string
  name: string
  slug: string
  description: string | null
  productCount: number
}

export type ProductImage = {
  id: string
  imageUrl: string
  altText: string | null
  sortOrder: number
}

export type ProductSpecification = {
  id: string
  name: string
  value: string
}

export type ProductListItem = {
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
  stockStatus: CatalogStockStatus
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
  primaryImage: ProductImage | null
  createdAt: string
  updatedAt: string
}

export type ProductDetail = ProductListItem & {
  images: ProductImage[]
  specifications: ProductSpecification[]
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type ProductsQueryParams = {
  search?: string
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  sort?: SortOption
  page?: number
  limit?: number
  stock?: CatalogStockStatus
}

export type ProductsResponseData = {
  products: ProductListItem[]
  pagination: PaginationMeta
}

export type ProductDetailResponseData = {
  product: ProductDetail
  relatedProducts: ProductListItem[]
}
