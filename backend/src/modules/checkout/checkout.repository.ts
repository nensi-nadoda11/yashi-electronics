import { Prisma, PrismaClient } from '@prisma/client'
import { prisma } from '../../db/prisma'

type DbClient = PrismaClient | Prisma.TransactionClient

const getClient = (client: DbClient = prisma) => client

const checkoutProductInclude = Prisma.validator<Prisma.ProductInclude>()({
  category: true,
  brand: true,
  images: {
    take: 1,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  },
})

const checkoutCartItemInclude = Prisma.validator<Prisma.CartItemInclude>()({
  product: {
    include: checkoutProductInclude,
  },
})

const checkoutCartInclude = Prisma.validator<Prisma.CartInclude>()({
  items: {
    include: checkoutCartItemInclude,
    orderBy: [{ createdAt: 'asc' }],
  },
})

export type CheckoutCartRecord = Prisma.CartGetPayload<{
  include: typeof checkoutCartInclude
}>

export type CheckoutCartItemRecord = Prisma.CartItemGetPayload<{
  include: typeof checkoutCartItemInclude
}>

export type CheckoutAddressRecord = Prisma.CustomerAddressGetPayload<{}>

const checkoutOrderInclude = Prisma.validator<Prisma.OrderInclude>()({
  items: {
    select: {
      productId: true,
      quantity: true,
      unitPrice: true,
      gstAmount: true,
      totalAmount: true,
    },
    orderBy: [{ createdAt: 'asc' }],
  },
  payment: {
    select: {
      id: true,
      provider: true,
      amount: true,
      status: true,
      paidAt: true,
      createdAt: true,
    },
  },
})

export type CheckoutPendingOrderRecord = Prisma.OrderGetPayload<{
  include: typeof checkoutOrderInclude
}>

export const checkoutRepository = {
  findCartByCustomerId(customerId: string, client: DbClient = prisma) {
    return getClient(client).cart.findUnique({
      where: { customerId },
      include: checkoutCartInclude,
    })
  },

  findCustomerAddressById(customerId: string, addressId: string, client: DbClient = prisma) {
    return getClient(client).customerAddress.findFirst({
      where: {
        id: addressId,
        customerId,
      },
    })
  },

  findDefaultCustomerAddress(customerId: string, client: DbClient = prisma) {
    return getClient(client).customerAddress.findFirst({
      where: {
        customerId,
        isDefault: true,
      },
      orderBy: [{ updatedAt: 'desc' }],
    })
  },

  countOrdersWithPrefix(orderPrefix: string, client: DbClient = prisma) {
    return getClient(client).order.count({
      where: {
        orderNumber: {
          startsWith: orderPrefix,
        },
      },
    })
  },

  createOrder(
    data: Prisma.OrderUncheckedCreateInput,
    client: DbClient = prisma,
  ) {
    return getClient(client).order.create({
      data,
    })
  },

  createOrderItems(
    data: Prisma.OrderItemCreateManyInput[],
    client: DbClient = prisma,
  ) {
    return getClient(client).orderItem.createMany({
      data,
    })
  },

  createPayment(
    data: Prisma.PaymentUncheckedCreateInput,
    client: DbClient = prisma,
  ) {
    return getClient(client).payment.create({
      data,
    })
  },

  findPendingOrdersByCustomerId(customerId: string, client: DbClient = prisma) {
    return getClient(client).order.findMany({
      where: {
        customerId,
        status: 'pending_payment',
        paymentStatus: 'pending',
      },
      orderBy: [{ createdAt: 'desc' }],
      include: checkoutOrderInclude,
      take: 20,
    })
  },
}
