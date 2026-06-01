import { ArrowLeft, CreditCard } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { PageHeader } from '../components/ui/PageHeader'
import { buttonStyles } from '../components/ui/button-styles'
import { formatCurrency } from '../utils/format'

type PaymentPageState = {
  orderNumber?: string
  totalAmount?: number
  paymentStatus?: string
}

export function PaymentPage() {
  const { orderId } = useParams()
  const location = useLocation()
  const state = (location.state as PaymentPageState | null) ?? null

  return (
    <>
      <PageHeader
        eyebrow="Payment"
        title="Your order is ready for payment"
        description="This placeholder page confirms the pending order was created successfully. Payment gateway integration will be added in the next module."
      />

      <Container className="pb-16">
        <Card className="mx-auto max-w-3xl p-8">
          <div className="flex flex-col gap-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-50 text-brand-600">
              <CreditCard className="h-8 w-8" />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold text-slate-950">
                  Pending payment order created
                </h2>
                <Badge variant="warning">
                  {state?.paymentStatus ?? 'pending'}
                </Badge>
              </div>

              <p className="text-base leading-7 text-slate-600">
                Order ID: <span className="font-semibold text-slate-950">{orderId}</span>
              </p>

              {state?.orderNumber ? (
                <p className="text-base leading-7 text-slate-600">
                  Order Number: <span className="font-semibold text-slate-950">{state.orderNumber}</span>
                </p>
              ) : null}

              {typeof state?.totalAmount === 'number' ? (
                <p className="text-base leading-7 text-slate-600">
                  Amount to be collected: <span className="font-semibold text-slate-950">{formatCurrency(state.totalAmount)}</span>
                </p>
              ) : null}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
              Payment integration will be added in the payment module. Your cart has not been cleared and stock has not been deducted in this step.
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link to="/orders" className={buttonStyles('primary', 'md')}>
                Back to Orders
              </Link>
              <Link to="/" className={buttonStyles('ghost', 'md')}>
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>
          </div>
        </Card>
      </Container>
    </>
  )
}
