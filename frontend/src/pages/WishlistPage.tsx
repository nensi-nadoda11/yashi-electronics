import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { buttonStyles } from '../components/ui/button-styles'
import { wishlistItems } from '../data/mock-data'
import { formatCurrency } from '../utils/format'

export function WishlistPage() {
  const [items, setItems] = useState(wishlistItems)

  return (
    <>
      <PageHeader
        eyebrow="Saved Items"
        title="Keep products bookmarked for later decisions"
        description="This wishlist screen is ready for future account sync, inventory alerts, and quick add-to-cart flows."
        actions={
          <Button
            variant="outline"
            onClick={() => setItems([])}
            disabled={items.length === 0}
          >
            Preview empty wishlist
          </Button>
        }
      />

      <Container className="pb-16">
        {items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save products here to compare later. This placeholder is ready for customer account persistence in future modules."
            action={
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/products" className={buttonStyles('secondary', 'md')}>
                  Explore products
                </Link>
                <Button variant="outline" onClick={() => setItems(wishlistItems)}>
                  Restore demo wishlist
                </Button>
              </div>
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((product) => (
              <Card key={product.id} className="overflow-hidden p-5">
                <div className="space-y-5">
                  <div className="rounded-[28px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)] p-5">
                    <div className="min-h-[200px] rounded-[24px] border border-white/70 bg-white/80 p-5">
                      <Badge variant="brand">{product.category}</Badge>
                      <div className="mt-5 space-y-2">
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                          {product.brand}
                        </p>
                        <p className="text-2xl font-bold text-slate-950">{product.name}</p>
                        <p className="text-sm leading-6 text-slate-600">{product.shortDescription}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-2xl font-extrabold text-slate-950">
                          {formatCurrency(product.price)}
                        </p>
                        <p className="text-sm text-slate-500 line-through">
                          {formatCurrency(product.mrp)}
                        </p>
                      </div>
                      <Badge
                        variant={product.stockStatus === 'In Stock' ? 'success' : 'warning'}
                      >
                        {product.stockStatus}
                      </Badge>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <Button
                        variant="secondary"
                        onClick={() =>
                          setItems((current) =>
                            current.filter((entry) => entry.id !== product.id),
                          )
                        }
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Move to Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setItems((current) =>
                            current.filter((entry) => entry.id !== product.id),
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    </div>
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
