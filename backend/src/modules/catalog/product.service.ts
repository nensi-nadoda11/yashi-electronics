import { AppError } from '../../utils/app-error'
import {
  mapCatalogProductSummary,
  mapPrimaryImage,
} from './product.mapper'
import {
  findProductBySlug,
  findProducts,
  findRelatedProducts,
} from './product.repository'
import type {
  CatalogProductDetail,
  ProductFilters,
  ProductQueryInput,
  ProductsPagination,
} from './product.types'

const normalizeBrandSlugs = (brand?: string) =>
  brand
    ?.split(',')
    .map((slug) => slug.trim())
    .filter(Boolean) ?? []

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
    mapCatalogProductSummary({
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
    ...mapCatalogProductSummary({
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
      mapCatalogProductSummary({
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
