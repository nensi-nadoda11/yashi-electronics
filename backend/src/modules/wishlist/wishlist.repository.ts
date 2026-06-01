import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'

const wishlistProductInclude = Prisma.validator<Prisma.ProductInclude>()({
  category: true,
  brand: true,
  images: {
    take: 1,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  },
})

export type WishlistProductRecord = Prisma.ProductGetPayload<{
  include: typeof wishlistProductInclude
}>

export type WishlistItemRecord = Prisma.WishlistGetPayload<{
  include: {
    product: {
      include: typeof wishlistProductInclude
    }
  }
}>

export const wishlistRepository = {
  findWishlistItemsByCustomerId(customerId: string) {
    return prisma.wishlist.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          include: wishlistProductInclude,
        },
      },
    })
  },

  findWishlistItem(customerId: string, productId: string) {
    return prisma.wishlist.findUnique({
      where: {
        customerId_productId: {
          customerId,
          productId,
        },
      },
    })
  },

  createWishlistItem(customerId: string, productId: string) {
    return prisma.wishlist.create({
      data: {
        customerId,
        productId,
      },
    })
  },

  deleteWishlistItem(customerId: string, productId: string) {
    return prisma.wishlist.deleteMany({
      where: {
        customerId,
        productId,
      },
    })
  },

  countWishlistItems(customerId: string) {
    return prisma.wishlist.count({
      where: { customerId },
    })
  },

  findWishlistedProductIds(customerId: string, productIds: string[]) {
    return prisma.wishlist.findMany({
      where: {
        customerId,
        productId: {
          in: productIds,
        },
      },
      select: {
        productId: true,
      },
    })
  },

  findActiveProductById(productId: string) {
    return prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
        category: {
          isActive: true,
        },
        OR: [
          { brandId: null },
          {
            brand: {
              isActive: true,
            },
          },
        ],
      },
      include: wishlistProductInclude,
    })
  },
}
