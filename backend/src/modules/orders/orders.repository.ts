import { Prisma, PrismaClient } from '@prisma/client'
import { prisma } from '../../db/prisma'
import type { OrdersQueryInput } from './orders.types'

type DbClient = PrismaClient | Prisma.TransactionClient

const getClient = (client: DbClient = prisma) => client

const orderListInclude = Prisma.validator<Prisma.OrderInclude>()({
  items: {
    select: {
      productName: true,
      quantity: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
    take: 3,
  },
  payment: {
    select: {
      provider: true,
      amount: true,
      status: true,
      paidAt: true,
    },
  },
  _count: {
    select: {
      items: true,
    },
  },
})

const orderDetailInclude = Prisma.validator<Prisma.OrderInclude>()({
  items: {
    select: {
      id: true,
      productId: true,
      productName: true,
      sku: true,
      quantity: true,
      unitPrice: true,
      gstPercentage: true,
      gstAmount: true,
      totalAmount: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
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

export type OrderListRecord = Prisma.OrderGetPayload<{
  include: typeof orderListInclude
}>

export type OrderDetailRecord = Prisma.OrderGetPayload<{
  include: typeof orderDetailInclude
}>

const buildOrderWhereClause = (input: OrdersQueryInput): Prisma.OrderWhereInput => ({
  customerId: input.customerId,
  ...(input.status ? { status: input.status } : {}),
  ...(input.paymentStatus ? { paymentStatus: input.paymentStatus } : {}),
  ...(input.search
    ? {
        orderNumber: {
          contains: input.search,
          mode: 'insensitive',
        },
      }
    : {}),
})

export const ordersRepository = {
  countOrdersByCustomerId(input: OrdersQueryInput, client: DbClient = prisma) {
    return getClient(client).order.count({
      where: buildOrderWhereClause(input),
    })
  },

  findOrdersByCustomerId(input: OrdersQueryInput, client: DbClient = prisma) {
    return getClient(client).order.findMany({
      where: buildOrderWhereClause(input),
      orderBy: [
        {
          createdAt: 'desc',
        },
        {
          updatedAt: 'desc',
        },
      ],
      skip: (input.page - 1) * input.limit,
      take: input.limit,
      include: orderListInclude,
    })
  },

  findOrderByIdAndCustomerId(customerId: string, orderId: string, client: DbClient = prisma) {
    return getClient(client).order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
      include: orderDetailInclude,
    })
  },

  updateOrderStatus(
    orderId: string,
    data: Prisma.OrderUpdateInput,
    client: DbClient = prisma,
  ) {
    return getClient(client).order.update({
      where: {
        id: orderId,
      },
      data,
    })
  },

  updatePaymentStatus(
    orderId: string,
    data: Prisma.PaymentUpdateInput,
    client: DbClient = prisma,
  ) {
    return getClient(client).payment.update({
      where: {
        orderId,
      },
      data,
    })
  },
}
