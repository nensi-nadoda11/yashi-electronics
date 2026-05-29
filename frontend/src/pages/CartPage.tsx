import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { buttonStyles } from '../components/ui/button-styles'
import { cartItems, products } from '../data/mock-data'
import { formatCurrency } from '../utils/format'

const initialCart = cartItems
  .map((item) => {
    const product = products.find((entry) => entry.id === item.productId)

    return product ? { product, quantity: item.quantity } : null
  })
  .filter(Boolean) as Array<{ product: (typeof products)[number]; quantity: number }>

export function CartPage() {
  const [items, setItems] = useState(initialCart)

  const summary = useMemo(() => {
    const subtotal = items.reduce(
      (sum, item) => sum + item.product.mrp * item.quantity,
      0,
    )
    const saleTotal = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    )
    const discount = subtotal - saleTotal
    const gst = Math.round(saleTotal * 0.18)
    const delivery = saleTotal > 50000 || saleTotal === 0 ? 0 : 499

    return {
      subtotal,
      discount,
      gst,
      delivery,
      total: saleTotal + gst + delivery,
    }
  }, [items])

  return (
    <>
      <PageHeader
        eyebrow="Your Cart"
        title="Review selected products before checkout"
        description="The cart layout is structured for future quantity sync, coupon logic, delivery estimates, and payment-ready checkout flows."
        actions={
          <Button
            variant="outline"
            onClick={() => setItems([])}
            disabled={items.length === 0}
          >
            Preview empty cart
          </Button>
        }
      />

      <Container className="pb-16">
        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            description="Add products to continue. This empty state is ready for future personalized recommendations and saved cart recovery."
            action={
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/products" className={buttonStyles('secondary', 'md')}>
                  Browse products
                </Link>
                <Button variant="outline" onClick={() => setItems(initialCart)}>
                  Restore demo cart
                </Button>
              </div>
            }
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.product.id} className="p-5">
                  <div className="flex flex-col gap-5 md:flex-row">
                    <div className="w-full rounded-[28px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)] p-5 md:max-w-[220px]">
                      <div className="flex h-full min-h-[180px] items-end rounded-[24px] border border-white/70 bg-white/80 p-5">
                        <div className="space-y-2">
                          <Badge variant="brand">{item.product.category}</Badge>
                          <p className="text-lg font-bold text-slate-950">
                            {item.product.heroLabel}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                          {item.product.brand}
                        </p>
                        <h2 className="text-2xl font-bold text-slate-950">
                          {item.product.name}
                        </h2>
                        <p className="text-sm leading-6 text-slate-600">
                          {item.product.shortDescription}
                        </p>
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-2xl font-extrabold text-slate-950">
                            {formatCurrency(item.product.price)}
                          </p>
                          <p className="text-sm text-slate-500">
                            MRP <span className="line-through">{formatCurrency(item.product.mrp)}</span>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
                            <button
                              type="button"
                              className="rounded-full p-1 text-slate-600 transition hover:bg-white"
                              onClick={() =>
                                setItems((current) =>
                                  current.map((entry) =>
                                    entry.product.id === item.product.id
                                      ? {
                                          ...entry,
                                          quantity: Math.max(1, entry.quantity - 1),
                                        }
                                      : entry,
                                  ),
                                )
                              }
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-8 text-center text-sm font-semibold text-slate-700">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              className="rounded-full p-1 text-slate-600 transition hover:bg-white"
                              onClick={() =>
                                setItems((current) =>
                                  current.map((entry) =>
                                    entry.product.id === item.product.id
                                      ? { ...entry, quantity: entry.quantity + 1 }
                                      : entry,
                                  ),
                                )
                              }
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              setItems((current) =>
                                current.filter((entry) => entry.product.id !== item.product.id),
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="h-fit p-6">
              <h2 className="text-xl font-bold text-slate-950">Price Summary</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(summary.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>-{formatCurrency(summary.discount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST</span>
                  <span>{formatCurrency(summary.gst)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Delivery charge</span>
                  <span>{summary.delivery === 0 ? 'Free' : formatCurrency(summary.delivery)}</span>
                </div>
                <div className="border-t border-slate-100 pt-4 text-base font-semibold text-slate-950">
                  <div className="flex items-center justify-between">
                    <span>Total</span>
                    <span>{formatCurrency(summary.total)}</span>
                  </div>
                </div>
              </div>
              <Link to="/checkout" className={`${buttonStyles('primary', 'lg')} mt-6 w-full`}>
                Proceed to Checkout
              </Link>
            </Card>
          </div>
        )}
      </Container>
    </>
  )
}
