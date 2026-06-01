import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'

const cartProductInclude = Prisma.validator<Prisma.ProductInclude>()({
  category: true,
  brand: true,
  images: {
    take: 1,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  },
})

const cartItemInclude = Prisma.validator<Prisma.CartItemInclude>()({
  product: {
    include: cartProductInclude,
  },
})

const cartInclude = Prisma.validator<Prisma.CartInclude>()({
  items: {
    include: cartItemInclude,
    orderBy: [{ createdAt: 'asc' }],
  },
})

export type CartProductRecord = Prisma.ProductGetPayload<{
  include: typeof cartProductInclude
}>

export type CartItemRecord = Prisma.CartItemGetPayload<{
  include: typeof cartItemInclude
}>

export type CartRecord = Prisma.CartGetPayload<{
  include: typeof cartInclude
}>

export const cartRepository = {
  findCartByCustomerId(customerId: string) {
    return prisma.cart.findUnique({
      where: { customerId },
      include: cartInclude,
    })
  },

  findOrCreateCart(customerId: string) {
    return prisma.cart.upsert({
      where: { customerId },
      update: {},
      create: { customerId },
      include: cartInclude,
    })
  },

  findActiveProductById(productId: string) {
    return prisma.product.findFirst({
      where: {
        id: productId,
        isActive: true,
      },
      include: cartProductInclude,
    })
  },

  findProductById(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId },
      include: cartProductInclude,
    })
  },

  findCartItemByCustomerIdAndProductId(customerId: string, productId: string) {
    return prisma.cartItem.findFirst({
      where: {
        productId,
        cart: {
          customerId,
        },
      },
      include: cartItemInclude,
    })
  },

  findCartItemByIdAndCustomerId(itemId: string, customerId: string) {
    return prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cart: {
          customerId,
        },
      },
      include: cartItemInclude,
    })
  },

  upsertCartItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId,
          productId,
        },
      },
      update: {
        quantity,
      },
      create: {
        cartId,
        productId,
        quantity,
      },
      include: cartItemInclude,
    })
  },

  updateCartItemQuantity(itemId: string, quantity: number) {
    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: cartItemInclude,
    })
  },

  deleteCartItemById(itemId: string) {
    return prisma.cartItem.delete({
      where: { id: itemId },
    })
  },

  deleteCartItemsByCartId(cartId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId },
    })
  },
}
