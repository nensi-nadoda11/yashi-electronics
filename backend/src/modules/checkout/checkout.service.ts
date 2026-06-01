import { Prisma } from '@prisma/client'
import { createHash } from 'node:crypto'
import { prisma } from '../../db/prisma'
import { AppError } from '../../utils/app-error'
import { calculateEffectivePrice } from '../catalog/product.mapper'
import {
  checkoutRepository,
  type CheckoutAddressRecord,
  type CheckoutCartItemRecord,
  type CheckoutPendingOrderRecord,
} from './checkout.repository'
import type {
  CheckoutAddress,
  CheckoutIssue,
  CheckoutItem,
  CheckoutSummary,
  CheckoutSummaryInput,
  CheckoutSummaryResponse,
  CreatePendingOrderInput,
  CreatePendingOrderResponse,
} from './checkout.types'

const ORDER_STATUS_PENDING_PAYMENT = 'pending_payment'
const PAYMENT_STATUS_PENDING = 'pending'
const FREE_DELIVERY_THRESHOLD = new Prisma.Decimal(999)
const STANDARD_DELIVERY_CHARGE = new Prisma.Decimal(50)
const DUPLICATE_PENDING_ORDER_WINDOW_MS = 2 * 60 * 1000
const pendingOrderLocks = new Map<string, Promise<CreatePendingOrderResponse>>()

type AddressFingerprintSource = Pick<
  CheckoutAddress,
  | 'fullName'
  | 'mobile'
  | 'addressLine1'
  | 'addressLine2'
  | 'city'
  | 'state'
  | 'pincode'
  | 'landmark'
>

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

const moneyToString = (value: Prisma.Decimal | number | string | null | undefined) =>
  roundMoney(toDecimal(value)).toFixed(2)

const createEmptySummary = (): CheckoutSummary => ({
  mrpTotal: 0,
  discountAmount: 0,
  subtotal: 0,
  gstAmount: 0,
  deliveryCharge: 0,
  finalAmount: 0,
  totalItems: 0,
})

const buildAddressFingerprint = (address: AddressFingerprintSource) =>
  JSON.stringify({
    fullName: address.fullName.trim(),
    mobile: address.mobile.trim(),
    addressLine1: address.addressLine1.trim(),
    addressLine2: address.addressLine2?.trim() ?? null,
    city: address.city.trim(),
    state: address.state.trim(),
    pincode: address.pincode.trim(),
    landmark: address.landmark?.trim() ?? null,
  })

const buildCheckoutFingerprint = (
  checkout: CheckoutSummaryResponse,
  address: CheckoutAddress,
) => {
  const payload = {
    address: buildAddressFingerprint(address),
    subtotal: moneyToString(checkout.summary.subtotal),
    discountAmount: moneyToString(checkout.summary.discountAmount),
    gstAmount: moneyToString(checkout.summary.gstAmount),
    deliveryCharge: moneyToString(checkout.summary.deliveryCharge),
    finalAmount: moneyToString(checkout.summary.finalAmount),
    items: checkout.items
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        lineSubtotal: moneyToString(item.lineSubtotal),
        lineGstAmount: moneyToString(item.lineGstAmount),
        lineTotal: moneyToString(item.lineTotal),
      }))
      .sort((left, right) => left.productId.localeCompare(right.productId)),
  }

  return createHash('sha256').update(JSON.stringify(payload)).digest('hex')
}

const buildOrderFingerprint = (order: CheckoutPendingOrderRecord) => {
  const payload = {
    address: buildAddressFingerprint({
      fullName: order.shippingFullName,
      mobile: order.shippingMobile,
      addressLine1: order.shippingAddressLine1,
      addressLine2: order.shippingAddressLine2,
      city: order.shippingCity,
      state: order.shippingState,
      pincode: order.shippingPincode,
      landmark: order.shippingLandmark,
    }),
    subtotal: moneyToString(order.subtotal),
    discountAmount: moneyToString(order.discountAmount),
    gstAmount: moneyToString(order.gstAmount),
    deliveryCharge: moneyToString(order.deliveryCharge),
    totalAmount: moneyToString(order.totalAmount),
    items: order.items
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        lineSubtotal: moneyToString(new Prisma.Decimal(item.unitPrice).times(item.quantity)),
        lineGstAmount: moneyToString(item.gstAmount),
        lineTotal: moneyToString(item.totalAmount),
      }))
      .sort((left, right) => left.productId.localeCompare(right.productId)),
  }

  return createHash('sha256').update(JSON.stringify(payload)).digest('hex')
}

const buildDuplicateOrderResponse = (order: CheckoutPendingOrderRecord): CreatePendingOrderResponse => ({
  order: {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    totalAmount: roundMoney(order.totalAmount),
  },
  payment: {
    id: order.payment?.id ?? order.id,
    status: order.payment?.status ?? PAYMENT_STATUS_PENDING,
    provider: order.payment?.provider ?? 'online',
    amount: roundMoney(order.payment?.amount ?? order.totalAmount),
  },
})

const runWithCustomerLock = async (
  customerId: string,
  task: () => Promise<CreatePendingOrderResponse>,
) => {
  const existingLock = pendingOrderLocks.get(customerId)

  if (existingLock) {
    return existingLock
  }

  const lock = task().finally(() => {
    pendingOrderLocks.delete(customerId)
  })

  pendingOrderLocks.set(customerId, lock)

  return lock
}

const mapAddress = (address: CheckoutAddressRecord): CheckoutAddress => ({
  id: address.id,
  fullName: address.fullName,
  mobile: address.mobile,
  addressLine1: address.addressLine1,
  addressLine2: address.addressLine2,
  city: address.city,
  state: address.state,
  pincode: address.pincode,
  landmark: address.landmark,
  isDefault: address.isDefault,
})

const buildItemValidation = (item: CheckoutCartItemRecord) => {
  const { product, quantity } = item

  if (!product.isActive) {
    return {
      isAvailable: false,
      issue: {
        type: 'product' as const,
        productId: product.id,
        message: `${product.name} is currently unavailable`,
      },
    }
  }

  if (product.stockQuantity <= 0) {
    return {
      isAvailable: false,
      issue: {
        type: 'stock' as const,
        productId: product.id,
        message: `${product.name} is out of stock`,
      },
    }
  }

  if (quantity > product.stockQuantity) {
    return {
      isAvailable: false,
      issue: {
        type: 'stock' as const,
        productId: product.id,
        message: `Only ${product.stockQuantity} item(s) available for ${product.name}`,
      },
    }
  }

  return {
    isAvailable: true,
    issue: null,
  }
}

const mapCheckoutItem = (item: CheckoutCartItemRecord): { item: CheckoutItem; issue: CheckoutIssue | null } => {
  const { product, quantity } = item
  const mrp = toDecimal(product.mrp)
  const effectivePrice = toDecimal(calculateEffectivePrice(product.sellingPrice, product.discountPrice))
  const lineMrpTotal = mrp.times(quantity)
  const lineSubtotal = effectivePrice.times(quantity)
  const lineDiscountAmountValue = mrp.minus(effectivePrice).times(quantity)
  const lineDiscountAmount = lineDiscountAmountValue.greaterThan(0)
    ? lineDiscountAmountValue
    : new Prisma.Decimal(0)
  const lineGstAmount = lineSubtotal.times(product.gstPercentage).div(100)
  const lineTotal = lineSubtotal.plus(lineGstAmount)
  const validation = buildItemValidation(item)

  return {
    item: {
      cartItemId: item.id,
      productId: product.id,
      slug: product.slug,
      sku: product.sku,
      name: product.name,
      primaryImage: product.images[0]?.imageUrl ?? null,
      brand: product.brand?.name ?? null,
      category: product.category.name,
      quantity,
      mrp: roundMoney(mrp),
      sellingPrice: roundMoney(toDecimal(product.sellingPrice)),
      discountPrice: toNumber(product.discountPrice),
      effectivePrice: roundMoney(effectivePrice),
      gstPercentage: toNumber(product.gstPercentage) ?? 0,
      stockQuantity: product.stockQuantity,
      lineMrpTotal: roundMoney(lineMrpTotal),
      lineDiscountAmount: roundMoney(lineDiscountAmount),
      lineSubtotal: roundMoney(lineSubtotal),
      lineGstAmount: roundMoney(lineGstAmount),
      lineTotal: roundMoney(lineTotal),
      validation: {
        isAvailable: validation.isAvailable,
        message: validation.issue?.message ?? null,
      },
    },
    issue: validation.issue,
  }
}

const buildSummaryFromItems = (items: CheckoutItem[]): CheckoutSummary => {
  const totals = items.reduce(
    (accumulator, item) => ({
      mrpTotal: accumulator.mrpTotal.plus(item.lineMrpTotal),
      discountAmount: accumulator.discountAmount.plus(item.lineDiscountAmount),
      subtotal: accumulator.subtotal.plus(item.lineSubtotal),
      gstAmount: accumulator.gstAmount.plus(item.lineGstAmount),
      totalItems: accumulator.totalItems + item.quantity,
    }),
    {
      mrpTotal: new Prisma.Decimal(0),
      discountAmount: new Prisma.Decimal(0),
      subtotal: new Prisma.Decimal(0),
      gstAmount: new Prisma.Decimal(0),
      totalItems: 0,
    },
  )

  const deliveryCharge =
    totals.subtotal.lte(0) || totals.subtotal.gte(FREE_DELIVERY_THRESHOLD)
      ? new Prisma.Decimal(0)
      : STANDARD_DELIVERY_CHARGE

  return {
    mrpTotal: roundMoney(totals.mrpTotal),
    discountAmount: roundMoney(totals.discountAmount),
    subtotal: roundMoney(totals.subtotal),
    gstAmount: roundMoney(totals.gstAmount),
    deliveryCharge: roundMoney(deliveryCharge),
    finalAmount: roundMoney(totals.subtotal.plus(totals.gstAmount).plus(deliveryCharge)),
    totalItems: totals.totalItems,
  }
}

const resolveSelectedAddress = async (
  customerId: string,
  addressId?: string,
  client: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<{ selectedAddress: CheckoutAddress | null; addressIssue: CheckoutIssue | null }> => {
  if (addressId) {
    const address = await checkoutRepository.findCustomerAddressById(customerId, addressId, client)

    if (!address) {
      return {
        selectedAddress: null,
        addressIssue: {
          type: 'address',
          productId: null,
          message: 'Selected address is invalid',
        },
      }
    }

    return {
      selectedAddress: mapAddress(address),
      addressIssue: null,
    }
  }

  const defaultAddress = await checkoutRepository.findDefaultCustomerAddress(customerId, client)

  return {
    selectedAddress: defaultAddress ? mapAddress(defaultAddress) : null,
    addressIssue: defaultAddress
      ? null
      : {
          type: 'address',
          productId: null,
          message: 'Please add a delivery address',
        },
  }
}

const buildCheckoutState = async (
  input: CheckoutSummaryInput,
  client: Prisma.TransactionClient | typeof prisma = prisma,
): Promise<CheckoutSummaryResponse> => {
  const cart = await checkoutRepository.findCartByCustomerId(input.customerId, client)
  const { selectedAddress, addressIssue } = await resolveSelectedAddress(
    input.customerId,
    input.addressId,
    client,
  )

  if (!cart || cart.items.length === 0) {
    return {
      items: [],
      selectedAddress,
      summary: createEmptySummary(),
      canCheckout: false,
      issues: [
        {
          type: 'cart',
          productId: null,
          message: 'Your cart is empty',
        },
        ...(addressIssue ? [addressIssue] : []),
      ],
    }
  }

  const mapped = cart.items.map(mapCheckoutItem)
  const items = mapped.map((entry) => entry.item)
  const issues = mapped.flatMap((entry) => (entry.issue ? [entry.issue] : []))

  if (addressIssue) {
    issues.push(addressIssue)
  }

  return {
    items,
    selectedAddress,
    summary: buildSummaryFromItems(items),
    canCheckout: issues.length === 0,
    issues,
  }
}

const formatOrderDateSegment = (date: Date) => {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  return `${year}${month}${day}`
}

const generateOrderNumber = async (client: Prisma.TransactionClient, createdAt: Date) => {
  const prefix = `YE-${formatOrderDateSegment(createdAt)}-`
  const existingCount = await checkoutRepository.countOrdersWithPrefix(prefix, client)
  return `${prefix}${String(existingCount + 1).padStart(4, '0')}`
}

export const checkoutService = {
  async getCheckoutSummary(input: CheckoutSummaryInput): Promise<CheckoutSummaryResponse> {
    return buildCheckoutState(input)
  },

  async createPendingOrder(input: CreatePendingOrderInput): Promise<CreatePendingOrderResponse> {
    return runWithCustomerLock(input.customerId, async () => {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        try {
          return await prisma.$transaction(async (transaction) => {
            const checkout = await buildCheckoutState(
              {
                customerId: input.customerId,
                addressId: input.addressId,
              },
              transaction,
            )

            if (!checkout.selectedAddress) {
              throw new AppError('Please select a valid address', 400)
            }

            if (checkout.items.length === 0) {
              throw new AppError('Your cart is empty', 400)
            }

            if (!checkout.canCheckout) {
              const blockingIssue = checkout.issues[0]
              throw new AppError(blockingIssue?.message ?? 'Unable to create order right now', 400)
            }

            const shippingAddress = checkout.selectedAddress
            const fingerprint = buildCheckoutFingerprint(checkout, shippingAddress)
            const pendingOrders = await checkoutRepository.findPendingOrdersByCustomerId(
              input.customerId,
              transaction,
            )
            const duplicateOrder = pendingOrders.find((order) => {
              if (Date.now() - order.createdAt.getTime() > DUPLICATE_PENDING_ORDER_WINDOW_MS) {
                return false
              }

              return buildOrderFingerprint(order) === fingerprint
            })

            if (duplicateOrder) {
              return buildDuplicateOrderResponse(duplicateOrder)
            }

            const createdAt = new Date()
            const orderNumber = await generateOrderNumber(transaction, createdAt)

            const order = await checkoutRepository.createOrder(
              {
                customerId: input.customerId,
                orderNumber,
                status: ORDER_STATUS_PENDING_PAYMENT,
                paymentStatus: PAYMENT_STATUS_PENDING,
                subtotal: toDecimal(checkout.summary.subtotal),
                discountAmount: toDecimal(checkout.summary.discountAmount),
                gstAmount: toDecimal(checkout.summary.gstAmount),
                deliveryCharge: toDecimal(checkout.summary.deliveryCharge),
                totalAmount: toDecimal(checkout.summary.finalAmount),
                shippingFullName: shippingAddress.fullName,
                shippingMobile: shippingAddress.mobile,
                shippingAddressLine1: shippingAddress.addressLine1,
                shippingAddressLine2: shippingAddress.addressLine2,
                shippingCity: shippingAddress.city,
                shippingState: shippingAddress.state,
                shippingPincode: shippingAddress.pincode,
                shippingLandmark: shippingAddress.landmark,
                createdAt,
              },
              transaction,
            )

            await checkoutRepository.createOrderItems(
              checkout.items.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                productName: item.name,
                sku: item.sku,
                quantity: item.quantity,
                unitPrice: toDecimal(item.effectivePrice),
                gstPercentage: toDecimal(item.gstPercentage),
                gstAmount: toDecimal(item.lineGstAmount),
                totalAmount: toDecimal(item.lineTotal),
              })),
              transaction,
            )

            const payment = await checkoutRepository.createPayment(
              {
                orderId: order.id,
                provider: input.paymentMethod,
                amount: toDecimal(checkout.summary.finalAmount),
                status: PAYMENT_STATUS_PENDING,
              },
              transaction,
            )

            return {
              order: {
                id: order.id,
                orderNumber: order.orderNumber,
                status: order.status,
                paymentStatus: order.paymentStatus,
                totalAmount: roundMoney(order.totalAmount),
              },
              payment: {
                id: payment.id,
                status: payment.status,
                provider: payment.provider,
                amount: roundMoney(payment.amount),
              },
            }
          })
        } catch (error) {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002' &&
            Array.isArray(error.meta?.target) &&
            error.meta.target.includes('orderNumber')
          ) {
            continue
          }

          throw error
        }
      }

      throw new AppError('Unable to generate a unique order number right now', 500)
    })
  },
}
