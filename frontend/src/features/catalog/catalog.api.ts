import { apiClient } from '../../lib/api-client'
import type { ApiResponse } from '../../types/api'
import type {
  Brand,
  Category,
  ProductDetailResponseData,
  ProductsQueryParams,
  ProductsResponseData,
} from './catalog.types'

export const getProducts = async (params: ProductsQueryParams) => {
  const response = await apiClient.get<ApiResponse<ProductsResponseData>>('/products', {
    params,
  })

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch products')
  }

  return response.data.data
}

export const getProductBySlug = async (slug: string) => {
  const response = await apiClient.get<ApiResponse<ProductDetailResponseData>>(`/products/${slug}`)

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch product')
  }

  return response.data.data
}

export const getCategories = async () => {
  const response = await apiClient.get<ApiResponse<Category[]>>('/categories')

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch categories')
  }

  return response.data.data
}

export const getBrands = async () => {
  const response = await apiClient.get<ApiResponse<Brand[]>>('/brands')

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch brands')
  }

  return response.data.data
}
