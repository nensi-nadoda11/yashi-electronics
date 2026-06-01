import { ClipboardList, Filter, ShoppingBag, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Input } from '../components/ui/Input'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHeader } from '../components/ui/PageHeader'
import { buttonStyles } from '../components/ui/button-styles'
import { CancelOrderModal } from '../features/orders/CancelOrderModal'
import { cancelOrder, getOrders } from '../features/orders/orders.api'
import {
  isOrderStatus,
  isPaymentStatus,
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
  type OrderListItem,
  type OrdersPagination,
} from '../features/orders/orders.types'
import { OrderStatusBadge } from '../features/orders/OrderStatusBadge'
import { PaymentStatusBadge } from '../features/orders/PaymentStatusBadge'
import { getApiErrorMessage } from '../lib/api-client'
import { formatCurrency } from '../utils/format'

const DEFAULT_LIMIT = 10

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

const parsePage = (value: string | null) => {
  const parsed = Number(value ?? 1)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

const parseLimit = (value: string | null) => {
  const parsed = Number(value ?? DEFAULT_LIMIT)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return DEFAULT_LIMIT
  }

  return Math.min(parsed, 50)
}

const formatPreviewSummary = (order: OrderListItem) => {
  if (order.previewItems.length === 0) {
    return `Items: ${order.itemCount}`
  }

  const previewText = order.previewItems
    .map((item) => `${item.productName} x${item.quantity}`)
    .join(', ')

  const remainingCount = order.itemCount - order.previewItems.length
  return remainingCount > 0 ? `${previewText} +${remainingCount} more` : previewText
}

export function OrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))
  const limit = parseLimit(searchParams.get('limit'))
  const statusParam = searchParams.get('status')
  const paymentStatusParam = searchParams.get('paymentStatus')
  const search = searchParams.get('search')?.trim() ?? ''
  const status = isOrderStatus(statusParam) ? statusParam : undefined
  const paymentStatus = isPaymentStatus(paymentStatusParam) ? paymentStatusParam : undefined

  const [searchDraft, setSearchDraft] = useState(search)
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const [pagination, setPagination] = useState<OrdersPagination>({
    page,
    limit,
    total: 0,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelTarget, setCancelTarget] = useState<OrderListItem | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  useEffect(() => {
    setSearchDraft(search)
  }, [search])

  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getOrders({
        page,
        limit,
        status,
        paymentStatus,
        search: search || undefined,
      })

      setOrders(data.orders)
      setPagination(data.pagination)
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError))
    } finally {
      setLoading(false)
    }
  }, [limit, page, paymentStatus, search, status])

  useEffect(() => {
    void loadOrders()
  }, [loadOrders])

  const updateSearchParams = useCallback(
    (updates: Record<string, string | undefined>, options?: { resetPage?: boolean }) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current)

        Object.entries(updates).forEach(([key, value]) => {
          if (value && value.trim().length > 0) {
            next.set(key, value)
          } else {
            next.delete(key)
          }
        })

        if (options?.resetPage !== false) {
          next.set('page', '1')
        }

        return next
      })
    },
    [setSearchParams],
  )

  useEffect(() => {
    const nextSearch = searchDraft.trim()
    const currentSearch = search.trim()

    const timer = window.setTimeout(() => {
      if (nextSearch === currentSearch) {
        return
      }

      updateSearchParams({ search: nextSearch || undefined })
    }, 300)

    return () => {
      window.clearTimeout(timer)
    }
  }, [search, searchDraft, updateSearchParams])

  const clearFilters = () => {
    setSearchParams({
      page: '1',
      limit: String(DEFAULT_LIMIT),
    })
    setSearchDraft('')
  }

  const hasFilters = Boolean(search || status || paymentStatus || limit !== DEFAULT_LIMIT || page !== 1)

  const handleCancelOrder = async () => {
    if (!cancelTarget) {
      return
    }

    setIsCancelling(true)
    setCancelError(null)

    try {
      await cancelOrder(cancelTarget.id)
      setCancelTarget(null)
      await loadOrders()
    } catch (cancelError) {
      setCancelError(getApiErrorMessage(cancelError))
    } finally {
      setIsCancelling(false)
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Order History"
        title="Track your customer orders"
        description="Search, filter, and manage customer orders from one place."
        actions={
          <div className="flex flex-wrap gap-3">
            {hasFilters ? (
              <Button type="button" variant="outline" onClick={clearFilters}>
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            ) : null}
            <Link to="/products" className={buttonStyles('secondary', 'md')}>
              <ShoppingBag className="h-4 w-4" />
              Shop products
            </Link>
          </div>
        }
      />

      <Container className="pb-16">
        <div className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_16px_55px_-35px_rgba(15,23,42,0.35)] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <Input
            id="order-search"
            label="Search order number"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search by order number"
          />

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span className="inline-flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              Order Status
            </span>
            <select
              value={status ?? ''}
              onChange={(event) => updateSearchParams({ status: event.target.value || undefined })}
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            >
              <option value="">All statuses</option>
              {ORDER_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            <span className="inline-flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              Payment Status
            </span>
            <select
              value={paymentStatus ?? ''}
              onChange={(event) =>
                updateSearchParams({ paymentStatus: event.target.value || undefined })
              }
              className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
            >
              <option value="">All payment statuses</option>
              {PAYMENT_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <LoadingState
            title="Loading your orders"
            description="Fetching the latest customer order history."
            cardCount={2}
          />
        ) : error ? (
          <ErrorState
            title="Unable to load orders"
            description={error}
            action={
              <Button type="button" variant="outline" onClick={() => void loadOrders()}>
                Retry
              </Button>
            }
          />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No orders yet"
            description="Orders created from checkout will appear here with tracking, payment, and cancellation actions."
            action={
              <Link to="/products" className={buttonStyles('secondary', 'md')}>
                Start shopping
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-5">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-xl font-bold text-slate-950">{order.orderNumber}</h2>
                          <OrderStatusBadge status={order.status} />
                          <PaymentStatusBadge status={order.paymentStatus} />
                        </div>
                        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-4">
                          <p>Placed on: {formatDate(order.createdAt)}</p>
                          <p>Items: {order.itemCount}</p>
                          <p>Total: {formatCurrency(order.totalAmount)}</p>
                          <p>
                            Payment:{' '}
                            {order.paymentSummary
                              ? `${order.paymentSummary.provider} • ${formatCurrency(order.paymentSummary.amount)}`
                              : 'Not available'}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-start gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-600">
                          <span className="font-medium text-slate-500">Products:</span>
                          <span className="font-semibold text-slate-900">
                            {formatPreviewSummary(order)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
                        <Link to={`/orders/${order.id}`} className={buttonStyles('outline', 'md')}>
                          View Details
                        </Link>
                        {order.canContinuePayment ? (
                          <Link
                            to={`/payment/${order.id}`}
                            className={buttonStyles('primary', 'md')}
                          >
                            Continue Payment
                          </Link>
                        ) : null}
                        {order.canCancel ? (
                          <Button
                            type="button"
                            variant="danger"
                            onClick={() => {
                              setCancelError(null)
                              setCancelTarget(order)
                            }}
                          >
                            Cancel
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {pagination.totalPages > 1 ? (
              <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      updateSearchParams(
                        { page: String(Math.max(1, pagination.page - 1)) },
                        { resetPage: false },
                      )
                    }
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      updateSearchParams(
                        { page: String(Math.min(pagination.totalPages, pagination.page + 1)) },
                        { resetPage: false },
                      )
                    }
                    disabled={pagination.page >= pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </Container>

      <CancelOrderModal
        isOpen={Boolean(cancelTarget)}
        orderNumber={cancelTarget?.orderNumber}
        error={cancelError}
        isLoading={isCancelling}
        onCancel={() => {
          if (!isCancelling) {
            setCancelTarget(null)
            setCancelError(null)
          }
        }}
        onConfirm={() => void handleCancelOrder()}
      />
    </>
  )
}
