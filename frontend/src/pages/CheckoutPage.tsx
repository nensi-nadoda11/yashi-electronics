import { CreditCard, MapPin, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/PageHeader'
import { buttonStyles } from '../components/ui/button-styles'
import { addresses, cartItems, products } from '../data/mock-data'
import { formatCurrency } from '../utils/format'

const orderPreview = cartItems
  .map((item) => {
    const product = products.find((entry) => entry.id === item.productId)

    return product ? { product, quantity: item.quantity } : null
  })
  .filter(Boolean) as Array<{ product: (typeof products)[number]; quantity: number }>

const subtotal = orderPreview.reduce(
  (sum, item) => sum + item.product.price * item.quantity,
  0,
)
const gst = Math.round(subtotal * 0.18)
const delivery = subtotal > 50000 ? 0 : 499
const total = subtotal + gst + delivery

export function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Checkout"
        title="A clean checkout skeleton for future order placement"
        description="Address selection, order review, and payment placeholders are laid out to support upcoming commerce integrations."
      />

      <Container className="pb-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-950">Select Delivery Address</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Placeholder address management ready for future customer address book integration.
                  </p>
                </div>
                <Button variant="outline">
                  <Plus className="h-4 w-4" />
                  Add New Address
                </Button>
              </div>
              <div className="mt-6 grid gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`rounded-3xl border p-5 transition ${
                      address.isDefault
                        ? 'border-brand-200 bg-brand-50/50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold text-slate-950">
                        {address.label}
                      </h3>
                      {address.isDefault ? <Badge variant="brand">Default</Badge> : null}
                    </div>
                    <div className="mt-3 flex items-start gap-3 text-sm leading-6 text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      <p>
                        {address.name}, {address.line1}, {address.line2}, {address.city},{' '}
                        {address.state} - {address.pincode}. Contact: {address.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-950">Payment Method</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Payment integration is intentionally deferred for later modules, but the layout is ready for COD, UPI, cards, and financing options.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {['UPI / QR', 'Credit / Debit Card', 'Net Banking', 'Cash on Delivery'].map(
                  (method) => (
                    <div
                      key={method}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-sm">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{method}</p>
                          <p className="text-sm text-slate-500">Placeholder option</p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </Card>
          </div>

          <Card className="h-fit p-6">
            <h2 className="text-xl font-bold text-slate-950">Order Summary</h2>
            <div className="mt-5 space-y-4">
              {orderPreview.map((item) => (
                <div key={item.product.id} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{item.product.name}</p>
                    <p className="text-sm text-slate-500">
                      Qty {item.quantity} • {item.product.brand}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-4 border-t border-slate-100 pt-6 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>GST</span>
                <span>{formatCurrency(gst)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery</span>
                <span>{delivery === 0 ? 'Free' : formatCurrency(delivery)}</span>
              </div>
              <div className="flex items-center justify-between text-base font-semibold text-slate-950">
                <span>Total Payable</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
            <button type="button" className={`${buttonStyles('primary', 'lg')} mt-6 w-full`}>
              Pay Now
            </button>
            <Link to="/cart" className={`${buttonStyles('ghost', 'md')} mt-3 w-full`}>
              Back to Cart
            </Link>
          </Card>
        </div>
      </Container>
    </>
  )
}
