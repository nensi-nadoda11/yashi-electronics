import { Prisma } from '@prisma/client'
import { AppError } from '../../utils/app-error'
import {
  calculateDiscountPercentage,
  calculateEffectivePrice,
  getStockStatus,
} from '../catalog/product.mapper'
import { cartRepository, type CartItemRecord, type CartProductRecord, type CartRecord } from './cart.repository'
import type {
  CartActionInput,
  CartItem,
  CartItemRemovalInput,
  CartItemQuantityInput,
  CartProduct,
  CartResponse,
  CartSummary,
} from './cart.types'

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

const toDecimal = (value: Prisma.Decimal | number | string | null | undefined) =>
  new Prisma.Decimal(value ?? 0)

const roundMoney = (value: Prisma.Decimal) => Number(value.toDecimalPlaces(2).toString())

const createEmptySummary = (): CartSummary => ({
  mrpTotal: 0,
  discountAmount: 0,
  subtotal: 0,
  gstAmount: 0,
  deliveryCharge: 0,
  finalAmount: 0,
  totalItems: 0,
})

const createEmptyResponse = (): CartResponse => ({
  items: [],
  summary: createEmptySummary(),
  count: 0,
})

const mapCartProduct = (product: CartProductRecord): CartProduct => {
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
  }
}

const ensureProductExists = async (productId: string) => {
  const product = await cartRepository.findProductById(productId)

  if (!product) {
    throw new AppError('Product not found', 404)
  }

  if (!product.isActive) {
    throw new AppError('Product is inactive', 400)
  }

  return product
}

const ensureProductAvailable = (product: CartProductRecord, requestedQuantity: number) => {
  if (product.stockQuantity <= 0) {
    throw new AppError('Product is out of stock', 400)
  }

  if (requestedQuantity > product.stockQuantity) {
    throw new AppError(`Only ${product.stockQuantity} item(s) available in stock`, 400)
  }
}

const mapCartItem = (item: CartItemRecord): CartItem => {
  const product = mapCartProduct(item.product)
  const quantity = item.quantity
  const subtotal = toDecimal(product.effectivePrice).times(quantity)
  const discountValue = toDecimal(product.mrp).minus(product.effectivePrice).times(quantity)
  const discountAmount = discountValue.greaterThan(0) ? discountValue : new Prisma.Decimal(0)
  const gstAmount = subtotal.times(product.gstPercentage).div(100)

  return {
    cartItemId: item.id,
    quantity,
    lineTotal: roundMoney(subtotal),
    lineGstAmount: roundMoney(gstAmount),
    lineDiscountAmount: roundMoney(discountAmount),
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    product,
  }
}

const buildCartResponse = (cart: CartRecord | null): CartResponse => {
  if (!cart || cart.items.length === 0) {
    return createEmptyResponse()
  }

  const items = cart.items.map(mapCartItem)

  const totals = cart.items.reduce(
    (accumulator, item) => {
      const product = mapCartProduct(item.product)
      const quantity = new Prisma.Decimal(item.quantity)
      const subtotal = toDecimal(product.effectivePrice).times(quantity)
      const discountValue = toDecimal(product.mrp).minus(product.effectivePrice).times(quantity)
      const discountAmount = discountValue.greaterThan(0) ? discountValue : new Prisma.Decimal(0)
      const gstAmount = subtotal.times(product.gstPercentage).div(100)

      return {
        mrpTotal: accumulator.mrpTotal.plus(toDecimal(product.mrp).times(quantity)),
        discountAmount: accumulator.discountAmount.plus(discountAmount),
        subtotal: accumulator.subtotal.plus(subtotal),
        gstAmount: accumulator.gstAmount.plus(gstAmount),
        totalItems: accumulator.totalItems.plus(quantity),
      }
    },
    {
      mrpTotal: new Prisma.Decimal(0),
      discountAmount: new Prisma.Decimal(0),
      subtotal: new Prisma.Decimal(0),
      gstAmount: new Prisma.Decimal(0),
      totalItems: new Prisma.Decimal(0),
    },
  )

  const subtotal = roundMoney(totals.subtotal)
  const deliveryCharge =
    subtotal <= 0 ? 0 : subtotal >= 999 ? 0 : 50
  const finalAmount = roundMoney(
    totals.subtotal.plus(totals.gstAmount).plus(new Prisma.Decimal(deliveryCharge)),
  )

  const summary: CartSummary = {
    mrpTotal: roundMoney(totals.mrpTotal),
    discountAmount: roundMoney(totals.discountAmount),
    subtotal,
    gstAmount: roundMoney(totals.gstAmount),
    deliveryCharge,
    finalAmount,
    totalItems: totals.totalItems.toNumber(),
  }

  return {
    items,
    summary,
    count: summary.totalItems,
  }
}

export const cartService = {
  async getCart(customerId: string): Promise<CartResponse> {
    const cart = await cartRepository.findCartByCustomerId(customerId)
    return buildCartResponse(cart)
  },

  async addCartItem({
    customerId,
    productId,
    quantity,
  }: CartActionInput): Promise<CartResponse> {
    const product = await ensureProductExists(productId)
    ensureProductAvailable(product, quantity)

    const cart = await cartRepository.findOrCreateCart(customerId)
    const existingItem = await cartRepository.findCartItemByCustomerIdAndProductId(customerId, productId)
    const finalQuantity = (existingItem?.quantity ?? 0) + quantity

    ensureProductAvailable(product, finalQuantity)

    await cartRepository.upsertCartItem(cart.id, productId, finalQuantity)

    return buildCartResponse(await cartRepository.findCartByCustomerId(customerId))
  },

  async updateCartItem({
    customerId,
    itemId,
    quantity,
  }: CartItemQuantityInput): Promise<CartResponse> {
    const existingItem = await cartRepository.findCartItemByIdAndCustomerId(itemId, customerId)

    if (!existingItem) {
      throw new AppError('Cart item not found', 404)
    }

    const product = await ensureProductExists(existingItem.productId)
    ensureProductAvailable(product, quantity)

    await cartRepository.updateCartItemQuantity(existingItem.id, quantity)

    return buildCartResponse(await cartRepository.findCartByCustomerId(customerId))
  },

  async removeCartItem({
    customerId,
    itemId,
  }: CartItemRemovalInput): Promise<CartResponse> {
    const existingItem = await cartRepository.findCartItemByIdAndCustomerId(itemId, customerId)

    if (existingItem) {
      await cartRepository.deleteCartItemById(existingItem.id)
    }

    return buildCartResponse(await cartRepository.findCartByCustomerId(customerId))
  },

  async clearCart(customerId: string): Promise<CartResponse> {
    const cart = await cartRepository.findCartByCustomerId(customerId)

    if (cart) {
      await cartRepository.deleteCartItemsByCartId(cart.id)
    }

    return createEmptyResponse()
  },
}
