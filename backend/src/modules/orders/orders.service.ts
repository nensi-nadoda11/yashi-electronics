import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'
import { AppError } from '../../utils/app-error'
import {
  ordersRepository,
  type OrderDetailRecord,
  type OrderListRecord,
} from './orders.repository'
import type {
  CancelOrderResponse,
  OrderDetail,
  OrderDetailResponse,
  OrderListItem,
  OrderPayment,
  OrderShippingAddress,
  OrderStatus,
  OrderTimelineItem,
  OrdersListResponse,
  OrdersQueryInput,
  PaymentStatus,
} from './orders.types'

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

const roundMoney = (value: Prisma.Decimal | number | string | null | undefined) => {
  const numericValue = toNumber(value) ?? 0
  return Number(numericValue.toFixed(2))
}

const buildCanCancel = (status: OrderStatus) => status === 'pending_payment'

const buildCanContinuePayment = (status: OrderStatus, paymentStatus: PaymentStatus) =>
  status === 'pending_payment' && paymentStatus === 'pending'

const createTimelineEntry = (
  label: string,
  status: OrderTimelineItem['status'],
  date?: Date,
): OrderTimelineItem => ({
  label,
  status,
  ...(date ? { date: date.toISOString() } : {}),
})

const buildTimeline = (orderStatus: OrderStatus, createdAt: Date, updatedAt: Date) => {
  switch (orderStatus) {
    case 'pending_payment':
      return [
        createTimelineEntry('Order Created', 'completed', createdAt),
        createTimelineEntry('Payment Pending', 'current', updatedAt),
      ]
    case 'confirmed':
      return [
        createTimelineEntry('Order Created', 'completed', createdAt),
        createTimelineEntry('Payment Confirmed', 'completed', updatedAt),
        createTimelineEntry('Order Confirmed', 'current', updatedAt),
      ]
    case 'processing':
      return [
        createTimelineEntry('Order Created', 'completed', createdAt),
        createTimelineEntry('Payment Confirmed', 'completed', updatedAt),
        createTimelineEntry('Processing', 'current', updatedAt),
      ]
    case 'shipped':
      return [
        createTimelineEntry('Order Created', 'completed', createdAt),
        createTimelineEntry('Payment Confirmed', 'completed', updatedAt),
        createTimelineEntry('Processing', 'completed', updatedAt),
        createTimelineEntry('Shipped', 'current', updatedAt),
      ]
    case 'delivered':
      return [
        createTimelineEntry('Order Created', 'completed', createdAt),
        createTimelineEntry('Payment Confirmed', 'completed', updatedAt),
        createTimelineEntry('Processing', 'completed', updatedAt),
        createTimelineEntry('Shipped', 'completed', updatedAt),
        createTimelineEntry('Delivered', 'current', updatedAt),
      ]
    case 'cancelled':
      return [
        createTimelineEntry('Order Created', 'completed', createdAt),
        createTimelineEntry('Cancelled', 'current', updatedAt),
      ]
    case 'failed':
      return [
        createTimelineEntry('Order Created', 'completed', createdAt),
        createTimelineEntry('Failed', 'current', updatedAt),
      ]
    default:
      return [
        createTimelineEntry('Order Created', 'completed', createdAt),
        createTimelineEntry('Payment Pending', 'current', updatedAt),
      ]
  }
}

const mapShippingAddress = (order: OrderDetailRecord): OrderShippingAddress => ({
  fullName: order.shippingFullName,
  mobile: order.shippingMobile,
  addressLine1: order.shippingAddressLine1,
  addressLine2: order.shippingAddressLine2,
  city: order.shippingCity,
  state: order.shippingState,
  pincode: order.shippingPincode,
  landmark: order.shippingLandmark,
})

const mapPayment = (payment: OrderDetailRecord['payment']): OrderPayment | null => {
  if (!payment) {
    return null
  }

  return {
    id: payment.id,
    provider: payment.provider,
    amount: roundMoney(payment.amount),
    status: payment.status as PaymentStatus,
    paidAt: payment.paidAt ? payment.paidAt.toISOString() : null,
    createdAt: payment.createdAt.toISOString(),
  }
}

const mapOrderListItem = (order: OrderListRecord): OrderListItem => ({
  id: order.id,
  orderNumber: order.orderNumber,
  status: order.status as OrderStatus,
  paymentStatus: order.paymentStatus as PaymentStatus,
  totalAmount: roundMoney(order.totalAmount),
  itemCount: order._count.items,
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
  previewItems: order.items.map((item) => ({
    productName: item.productName,
    quantity: item.quantity,
  })),
  paymentSummary: order.payment
    ? {
        provider: order.payment.provider,
        amount: roundMoney(order.payment.amount),
        status: order.payment.status as PaymentStatus,
        paidAt: order.payment.paidAt ? order.payment.paidAt.toISOString() : null,
      }
    : null,
  canCancel: buildCanCancel(order.status as OrderStatus),
  canContinuePayment: buildCanContinuePayment(
    order.status as OrderStatus,
    order.paymentStatus as PaymentStatus,
  ),
})

const mapOrderDetail = (order: OrderDetailRecord): OrderDetail => ({
  id: order.id,
  orderNumber: order.orderNumber,
  status: order.status as OrderStatus,
  paymentStatus: order.paymentStatus as PaymentStatus,
  subtotal: roundMoney(order.subtotal),
  discountAmount: roundMoney(order.discountAmount),
  gstAmount: roundMoney(order.gstAmount),
  deliveryCharge: roundMoney(order.deliveryCharge),
  totalAmount: roundMoney(order.totalAmount),
  shippingAddress: mapShippingAddress(order),
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    sku: item.sku,
    quantity: item.quantity,
    unitPrice: roundMoney(item.unitPrice),
    gstPercentage: roundMoney(item.gstPercentage),
    gstAmount: roundMoney(item.gstAmount),
    totalAmount: roundMoney(item.totalAmount),
  })),
  payment: mapPayment(order.payment),
  timeline: buildTimeline(order.status as OrderStatus, order.createdAt, order.updatedAt),
  canCancel: buildCanCancel(order.status as OrderStatus),
  canContinuePayment: buildCanContinuePayment(
    order.status as OrderStatus,
    order.paymentStatus as PaymentStatus,
  ),
  createdAt: order.createdAt.toISOString(),
  updatedAt: order.updatedAt.toISOString(),
})

const ensureOrderCancelable = (order: OrderDetailRecord) => {
  const status = order.status as OrderStatus

  if (status === 'cancelled') {
    return
  }

  if (status !== 'pending_payment') {
    throw new AppError('This order cannot be cancelled from customer panel.', 400)
  }
}

export const ordersService = {
  async getOrders(input: OrdersQueryInput): Promise<OrdersListResponse> {
    const [total, orders] = await prisma.$transaction([
      ordersRepository.countOrdersByCustomerId(input),
      ordersRepository.findOrdersByCustomerId(input),
    ])

    return {
      orders: orders.map(mapOrderListItem),
      pagination: {
        page: input.page,
        limit: input.limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / input.limit),
      },
    }
  },

  async getOrderById(customerId: string, orderId: string): Promise<OrderDetailResponse> {
    const order = await ordersRepository.findOrderByIdAndCustomerId(customerId, orderId)

    if (!order) {
      throw new AppError('Order not found', 404)
    }

    return {
      order: mapOrderDetail(order),
    }
  },

  async cancelOrder(customerId: string, orderId: string): Promise<CancelOrderResponse> {
    return prisma.$transaction(async (transaction) => {
      const order = await ordersRepository.findOrderByIdAndCustomerId(customerId, orderId, transaction)

      if (!order) {
        throw new AppError('Order not found', 404)
      }

      ensureOrderCancelable(order)

      if (order.status === 'cancelled') {
        return {
          order: mapOrderDetail(order),
        }
      }

      await ordersRepository.updateOrderStatus(
        order.id,
        {
          status: 'cancelled',
          paymentStatus: 'failed',
        },
        transaction,
      )

      if (order.payment?.status === 'pending') {
        await ordersRepository.updatePaymentStatus(
          order.id,
          {
            status: 'failed',
          },
          transaction,
        )
      }

      const updatedOrder = await ordersRepository.findOrderByIdAndCustomerId(customerId, orderId, transaction)

      if (!updatedOrder) {
        throw new AppError('Order not found', 404)
      }

      return {
        order: mapOrderDetail(updatedOrder),
      }
    })
  },
}
