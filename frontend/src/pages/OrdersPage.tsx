import { ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { buttonStyles } from '../components/ui/button-styles'
import { orders } from '../data/mock-data'
import { formatCurrency } from '../utils/format'

export function OrdersPage() {
  const [showEmpty, setShowEmpty] = useState(false)

  return (
    <>
      <PageHeader
        eyebrow="Order History"
        title="Track customer orders from a clean account dashboard"
        description="The orders page is laid out for future live order timelines, invoice downloads, and support interactions."
        actions={
          <Button variant="outline" onClick={() => setShowEmpty((value) => !value)}>
            {showEmpty ? 'Show demo orders' : 'Preview empty orders'}
          </Button>
        }
      />

      <Container className="pb-16">
        {showEmpty ? (
          <EmptyState
            icon={ClipboardList}
            title="No orders yet"
            description="Once real checkout is connected, placed orders can appear here with shipment updates, invoice links, and support actions."
            action={
              <Link to="/products" className={buttonStyles('secondary', 'md')}>
                Start shopping
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-xl font-bold text-slate-950">{order.id}</p>
                      <Badge
                        variant={
                          order.orderStatus === 'Delivered'
                            ? 'success'
                            : order.orderStatus === 'Shipped'
                              ? 'brand'
                              : 'warning'
                        }
                      >
                        {order.orderStatus}
                      </Badge>
                      <Badge
                        variant={
                          order.paymentStatus === 'Paid'
                            ? 'success'
                            : order.paymentStatus === 'Pending'
                              ? 'warning'
                              : 'danger'
                        }
                      >
                        Payment {order.paymentStatus}
                      </Badge>
                    </div>
                    <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                      <p>Placed on: {order.placedOn}</p>
                      <p>Items: {order.items}</p>
                      <p>Total: {formatCurrency(order.amount)}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" className={buttonStyles('outline', 'md')}>
                      View Details
                    </button>
                    <Link to="/profile" className={buttonStyles('ghost', 'md')}>
                      Contact Support
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
