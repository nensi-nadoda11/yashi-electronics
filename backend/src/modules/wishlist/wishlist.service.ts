import { Prisma } from '@prisma/client'
import { AppError } from '../../utils/app-error'
import {
  calculateDiscountPercentage,
  calculateEffectivePrice,
  getStockStatus,
} from '../catalog/product.mapper'
import type { WishlistProductRecord } from './wishlist.repository'
import { wishlistRepository } from './wishlist.repository'
import type {
  WishlistActionInput,
  WishlistItem,
  WishlistListResponse,
  WishlistMutationResponse,
  WishlistProduct,
  WishlistStatusInput,
  WishlistStatusResponse,
} from './wishlist.types'

const toNumber = (value: Prisma.Decimal | number | string | null | undefined) => {
  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'number') {
    return value
  }

  if (typeof value === 'string') {
    return Number(value)
  }

  return value.toNumber()
}

const mapWishlistProduct = (product: WishlistProductRecord) => {
  const effectivePrice = calculateEffectivePrice(product.sellingPrice, product.discountPrice)

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    primaryImage: product.images[0]?.imageUrl ?? null,
    category: product.category.name,
    brand: product.brand?.name ?? null,
    mrp: toNumber(product.mrp) ?? 0,
    sellingPrice: toNumber(product.sellingPrice) ?? 0,
    discountPrice: toNumber(product.discountPrice),
    effectivePrice,
    discountPercentage: calculateDiscountPercentage(product.mrp, effectivePrice),
    gstPercentage: toNumber(product.gstPercentage) ?? 0,
    stockQuantity: product.stockQuantity,
    stockStatus: getStockStatus(product.stockQuantity),
  } satisfies WishlistProduct
}

const ensureActiveProduct = async (productId: string) => {
  const product = await wishlistRepository.findActiveProductById(productId)

  if (!product) {
    throw new AppError('Product not found', 404)
  }

  return product
}

const getWishlistCount = (customerId: string) => wishlistRepository.countWishlistItems(customerId)

export const wishlistService = {
  async getWishlist(customerId: string): Promise<WishlistListResponse> {
    const items = await wishlistRepository.findWishlistItemsByCustomerId(customerId)

    return {
      items: items.map(
        (item) =>
          ({
            wishlistId: item.id,
            createdAt: item.createdAt.toISOString(),
            product: mapWishlistProduct(item.product),
          }) satisfies WishlistItem,
      ),
      count: items.length,
    }
  },

  async addWishlistItem({
    customerId,
    productId,
  }: WishlistActionInput): Promise<WishlistMutationResponse> {
    await ensureActiveProduct(productId)

    const existingItem = await wishlistRepository.findWishlistItem(customerId, productId)

    if (!existingItem) {
      try {
        await wishlistRepository.createWishlistItem(customerId, productId)
      } catch (error) {
        if (
          !(error instanceof Prisma.PrismaClientKnownRequestError) ||
          error.code !== 'P2002'
        ) {
          throw error
        }
      }
    }

    return {
      isWishlisted: true,
      count: await getWishlistCount(customerId),
    }
  },

  async removeWishlistItem({
    customerId,
    productId,
  }: WishlistActionInput): Promise<WishlistMutationResponse> {
    await wishlistRepository.deleteWishlistItem(customerId, productId)

    return {
      isWishlisted: false,
      count: await getWishlistCount(customerId),
    }
  },

  async toggleWishlistItem({
    customerId,
    productId,
  }: WishlistActionInput): Promise<WishlistMutationResponse> {
    await ensureActiveProduct(productId)

    const existingItem = await wishlistRepository.findWishlistItem(customerId, productId)

    if (existingItem) {
      await wishlistRepository.deleteWishlistItem(customerId, productId)

      return {
        isWishlisted: false,
        count: await getWishlistCount(customerId),
      }
    }

    try {
      await wishlistRepository.createWishlistItem(customerId, productId)
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return {
          isWishlisted: true,
          count: await getWishlistCount(customerId),
        }
      }

      throw error
    }

    return {
      isWishlisted: true,
      count: await getWishlistCount(customerId),
    }
  },

  async getWishlistStatus({
    customerId,
    productIds,
  }: WishlistStatusInput): Promise<WishlistStatusResponse> {
    if (productIds.length === 0) {
      return {
        productIds: [],
        count: 0,
      }
    }

    const items = await wishlistRepository.findWishlistedProductIds(customerId, productIds)
    const wishlistedProductIds = items.map((item) => item.productId)

    return {
      productIds: wishlistedProductIds,
      count: wishlistedProductIds.length,
    }
  },
}
