import { RefreshCcw, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { QuantitySelector } from '../components/cart/QuantitySelector'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHeader } from '../components/ui/PageHeader'
import { buttonStyles } from '../components/ui/button-styles'
import { useCart } from '../features/cart/useCart'
import { cn } from '../utils/cn'
import { formatCurrency } from '../utils/format'

const fallbackImageUrl = 'https://placehold.co/900x900/e2e8f0/0f172a/png?text=Yashi+Electronics'

const stockVariantMap = {
  in_stock: 'success',
  low_stock: 'warning',
  out_of_stock: 'danger',
} as const

const stockLabelMap = {
  in_stock: 'In Stock',
  low_stock: 'Low Stock',
  out_of_stock: 'Out of Stock',
} as const

export function CartPage() {
  const {
    items,
    summary,
    isLoading,
    isMutating,
    error,
    fetchCart,
    updateItemQuantity,
    removeItem,
    clearCartItems,
    isItemPending,
  } = useCart()

  const hasItems = items.length > 0
  const deliveryLabel = summary.deliveryCharge === 0 ? 'Free' : formatCurrency(summary.deliveryCharge)

  if (isLoading) {
    return (
      <Container className="py-12">
        <LoadingState
          title="Loading cart"
          description="Pulling your saved cart items."
          cardCount={2}
        />
      </Container>
    )
  }

  if (error && !hasItems) {
    return (
      <Container className="py-12">
        <ErrorState
          title="Unable to load cart"
          description={error}
          action={
            <Button type="button" variant="outline" onClick={() => void fetchCart()}>
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>
          }
        />
      </Container>
    )
  }

  if (!hasItems) {
    return (
      <Container className="py-12">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add products from the catalog or product detail page to see them here."
          action={
            <Link to="/products" className={buttonStyles('secondary', 'md')}>
              Browse products
            </Link>
          }
        />
      </Container>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow="Your Cart"
        title="Review selected products before checkout"
        description="Check quantities, taxes, and delivery preview before you proceed."
        actions={
          <Button
            type="button"
            variant="outline"
            onClick={() => void clearCartItems()}
            disabled={isMutating}
          >
            <Trash2 className="h-4 w-4" />
            Clear cart
          </Button>
        }
      />

      <Container className="pb-16">
        <div className="space-y-4">
          {error ? (
            <Card className="border-rose-100 bg-rose-50/70 p-4 text-sm text-rose-700">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p>{error}</p>
                <Button type="button" variant="outline" size="sm" onClick={() => void fetchCart()}>
                  <RefreshCcw className="h-4 w-4" />
                  Retry
                </Button>
              </div>
            </Card>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {items.map((item) => {
                const isPending = isItemPending(item.cartItemId)
                const isOutOfStock = item.product.stockStatus === 'out_of_stock'

                return (
                  <Card key={item.cartItemId} className="p-5">
                    <div className="flex flex-col gap-5 md:flex-row">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="w-full overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)] p-5 md:max-w-[220px]"
                      >
                        <img
                          src={item.product.primaryImage ?? fallbackImageUrl}
                          alt={item.product.name}
                          className="aspect-square w-full rounded-[24px] object-cover"
                        />
                      </Link>

                      <div className="flex flex-1 flex-col gap-4">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="brand">{item.product.category}</Badge>
                            <Badge variant={stockVariantMap[item.product.stockStatus]}>
                              {stockLabelMap[item.product.stockStatus]}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                              {item.product.brand ?? 'Generic'}
                            </p>
                            <Link
                              to={`/products/${item.product.slug}`}
                              className="mt-1 block text-2xl font-bold text-slate-950 transition hover:text-brand-700"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              SKU: {item.product.sku}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                          <div>
                            <p className="text-2xl font-extrabold text-slate-950">
                              {formatCurrency(item.product.effectivePrice)}
                            </p>
                            <p className="text-sm text-slate-500">
                              MRP <span className="line-through">{formatCurrency(item.product.mrp)}</span>
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                              GST: {item.product.gstPercentage}%
                            </p>
                            <p className="text-xs text-slate-500">
                              Item total: {formatCurrency(item.lineTotal)}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">
                            <QuantitySelector
                              value={item.quantity}
                              min={1}
                              max={item.product.stockQuantity}
                              disabled={isPending || isOutOfStock}
                              onChange={(value) => void updateItemQuantity(item.cartItemId, value)}
                            />
                            <Button
                              type="button"
                              variant="danger"
                              size="sm"
                              onClick={() => void removeItem(item.cartItemId)}
                              disabled={isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            <Card className="h-fit p-6">
              <h2 className="text-xl font-bold text-slate-950">Cart Summary</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span>{summary.totalItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>MRP Total</span>
                  <span>{formatCurrency(summary.mrpTotal)}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(summary.discountAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST</span>
                  <span>{formatCurrency(summary.gstAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery charge</span>
                  <span>{deliveryLabel}</span>
                </div>
                <div className="border-t border-slate-100 pt-4 text-base font-semibold text-slate-950">
                  <div className="flex items-center justify-between">
                    <span>Final Amount</span>
                    <span>{formatCurrency(summary.finalAmount)}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className={cn(
                  buttonStyles('primary', 'lg'),
                  'mt-6 w-full',
                  !hasItems ? 'pointer-events-none opacity-60' : '',
                )}
                aria-disabled={!hasItems}
              >
                Proceed to Checkout
              </Link>
            </Card>
          </div>
        </div>
      </Container>
    </>
  )
}
