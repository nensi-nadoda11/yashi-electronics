import { ArrowLeft, CalendarDays, CreditCard, Package2, ReceiptText, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHeader } from '../components/ui/PageHeader'
import { buttonStyles } from '../components/ui/button-styles'
import { CancelOrderModal } from '../features/orders/CancelOrderModal'
import { cancelOrder, getOrderById } from '../features/orders/orders.api'
import { OrderStatusBadge } from '../features/orders/OrderStatusBadge'
import { OrderTimeline } from '../features/orders/OrderTimeline'
import { PaymentStatusBadge } from '../features/orders/PaymentStatusBadge'
import type { OrderDetail } from '../features/orders/orders.types'
import { getApiErrorMessage } from '../lib/api-client'
import { formatCurrency } from '../utils/format'

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

export function OrderDetailPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const loadOrder = async () => {
    if (!orderId) {
      setError('Order not found')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getOrderById(orderId)
      setOrder(data.order)
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadOrder()
    // loadOrder depends on the current route param.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId])

  const handleCancelOrder = async () => {
    if (!orderId || !order) {
      return
    }

    setIsCancelling(true)
    setCancelError(null)

    try {
      const data = await cancelOrder(orderId)
      setOrder(data.order)
      setIsCancelModalOpen(false)
    } catch (cancelError) {
      setCancelError(getApiErrorMessage(cancelError))
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Order Details"
        title="Review order, payment, and tracking information"
        description="View the full order snapshot, shipping address, items, timeline, and payment summary for your customer account."
        actions={
          <Link to="/orders" className={buttonStyles('outline', 'md')}>
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        }
      />

      <Container className="pb-16">
        {loading ? (
          <LoadingState
            title="Loading order details"
            description="Fetching the full customer order snapshot."
            cardCount={1}
          />
        ) : error ? (
          <ErrorState
            title="Unable to load order"
            description={error}
            action={
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={() => void loadOrder()}>
                  Retry
                </Button>
                <Link to="/orders" className={buttonStyles('secondary', 'md')}>
                  Back to Orders
                </Link>
              </div>
            }
          />
        ) : order ? (
          <div className="space-y-6">
            <Card className="p-6 lg:p-8">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-950">{order.orderNumber}</h2>
                      <OrderStatusBadge status={order.status} />
                      <PaymentStatusBadge status={order.paymentStatus} />
                    </div>
                    <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                      <p>
                        <span className="font-medium text-slate-900">Order date:</span>{' '}
                        {formatDateTime(order.createdAt)}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Updated:</span>{' '}
                        {formatDateTime(order.updatedAt)}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Items:</span>{' '}
                        {order.items.length}
                      </p>
                      <p>
                        <span className="font-medium text-slate-900">Amount:</span>{' '}
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                    {order.canContinuePayment ? (
                      <Link to={`/payment/${order.id}`} className={buttonStyles('primary', 'md')}>
                        <CreditCard className="h-4 w-4" />
                        Continue Payment
                      </Link>
                    ) : null}
                    {order.canCancel ? (
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => {
                          setCancelError(null)
                          setIsCancelModalOpen(true)
                        }}
                      >
                        Cancel Order
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
                    <Package2 className="h-5 w-5 text-brand-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Order status
                      </p>
                      <div className="mt-2">
                        <OrderStatusBadge status={order.status} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
                    <ReceiptText className="h-5 w-5 text-brand-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Payment status
                      </p>
                      <div className="mt-2">
                        <PaymentStatusBadge status={order.paymentStatus} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-white p-4">
                    <CalendarDays className="h-5 w-5 text-brand-600" />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                        Timeline
                      </p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">
                        {order.timeline[order.timeline.length - 1]?.label ?? 'Order created'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <Package2 className="h-5 w-5 text-brand-600" />
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">Product list</h3>
                      <p className="text-sm text-slate-600">All items saved on this order snapshot.</p>
                    </div>
                  </div>

                  {order.items.length === 0 ? (
                    <p className="text-sm text-slate-600">No order items found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase tracking-[0.18em] text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">SKU</th>
                            <th className="px-4 py-3">Qty</th>
                            <th className="px-4 py-3">Unit Price</th>
                            <th className="px-4 py-3">GST %</th>
                            <th className="px-4 py-3">GST Amount</th>
                            <th className="px-4 py-3">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                          {order.items.map((item) => (
                            <tr key={item.id} className="align-top">
                              <td className="px-4 py-4">
                                <p className="font-semibold text-slate-950">{item.productName}</p>
                                <p className="mt-1 text-xs text-slate-500">Product ID: {item.productId}</p>
                              </td>
                              <td className="px-4 py-4 text-slate-600">{item.sku}</td>
                              <td className="px-4 py-4 text-slate-600">{item.quantity}</td>
                              <td className="px-4 py-4 text-slate-600">{formatCurrency(item.unitPrice)}</td>
                              <td className="px-4 py-4 text-slate-600">{item.gstPercentage.toFixed(2)}%</td>
                              <td className="px-4 py-4 text-slate-600">{formatCurrency(item.gstAmount)}</td>
                              <td className="px-4 py-4 font-semibold text-slate-950">
                                {formatCurrency(item.totalAmount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <Truck className="h-5 w-5 text-brand-600" />
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">Shipping address</h3>
                      <p className="text-sm text-slate-600">Delivery snapshot captured during checkout.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Recipient</p>
                      <p className="mt-1 text-base font-semibold text-slate-950">
                        {order.shippingAddress.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-500">Mobile</p>
                      <p className="mt-1 text-base font-semibold text-slate-950">
                        {order.shippingAddress.mobile}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-semibold text-slate-500">Address</p>
                      <div className="mt-1 space-y-1 text-sm leading-6 text-slate-700">
                        <p>{order.shippingAddress.addressLine1}</p>
                        {order.shippingAddress.addressLine2 ? <p>{order.shippingAddress.addressLine2}</p> : null}
                        <p>
                          {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                          {order.shippingAddress.pincode}
                        </p>
                        {order.shippingAddress.landmark ? (
                          <p>Landmark: {order.shippingAddress.landmark}</p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-brand-600" />
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">Payment details</h3>
                      <p className="text-sm text-slate-600">Payment record linked to this order.</p>
                    </div>
                  </div>

                  {order.payment ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Provider</p>
                        <p className="mt-1 text-base font-semibold text-slate-950">
                          {order.payment.provider}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Amount</p>
                        <p className="mt-1 text-base font-semibold text-slate-950">
                          {formatCurrency(order.payment.amount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Status</p>
                        <div className="mt-2">
                          <PaymentStatusBadge status={order.payment.status} />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-500">Paid at</p>
                        <p className="mt-1 text-base font-semibold text-slate-950">
                          {order.payment.paidAt ? formatDateTime(order.payment.paidAt) : 'Not paid yet'}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm font-semibold text-slate-500">Created at</p>
                        <p className="mt-1 text-base font-semibold text-slate-950">
                          {formatDateTime(order.payment.createdAt)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600">No payment record available.</p>
                  )}
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <CalendarDays className="h-5 w-5 text-brand-600" />
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">Tracking timeline</h3>
                      <p className="text-sm text-slate-600">Current status progression for this order.</p>
                    </div>
                  </div>
                  <OrderTimeline timeline={order.timeline} />
                </Card>

                <Card className="p-6">
                  <div className="mb-5 flex items-center gap-3">
                    <ReceiptText className="h-5 w-5 text-brand-600" />
                    <div>
                      <h3 className="text-xl font-bold text-slate-950">Order summary</h3>
                      <p className="text-sm text-slate-600">Final amount stored with the order snapshot.</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-semibold text-slate-950">
                        {formatCurrency(order.subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-600">Discount</span>
                      <span className="font-semibold text-slate-950">
                        -{formatCurrency(order.discountAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-600">GST</span>
                      <span className="font-semibold text-slate-950">
                        {formatCurrency(order.gstAmount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-slate-600">Delivery charge</span>
                      <span className="font-semibold text-slate-950">
                        {formatCurrency(order.deliveryCharge)}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-4">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-base font-semibold text-slate-950">Total</span>
                        <span className="text-lg font-bold text-slate-950">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : null}
      </Container>

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        orderNumber={order?.orderNumber}
        error={cancelError}
        isLoading={isCancelling}
        onCancel={() => {
          if (!isCancelling) {
            setIsCancelModalOpen(false)
            setCancelError(null)
          }
        }}
        onConfirm={() => void handleCancelOrder()}
      />
    </>
  )
}
