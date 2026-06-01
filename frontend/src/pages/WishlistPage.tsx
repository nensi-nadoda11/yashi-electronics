import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
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
import { useWishlist } from '../features/wishlist/useWishlist'
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

export function WishlistPage() {
  const {
    items,
    isLoading,
    error,
    fetchWishlist,
    removeWishlistItem,
    isUpdating,
  } = useWishlist()
  const { addItem, isProductPending } = useCart()

  return (
    <>
      <PageHeader
        eyebrow="Saved Items"
        title="Your wishlist"
        description="Products you've saved for later."
      />

      <Container className="pb-16">
        {isLoading ? (
          <LoadingState
            title="Loading wishlist"
            description="Fetching your saved items."
            cardCount={3}
          />
        ) : error && items.length === 0 ? (
          <ErrorState
            title="Unable to load wishlist"
            description={error}
            action={(
              <Button variant="secondary" onClick={() => void fetchWishlist()}>
                Try again
              </Button>
            )}
          />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Your wishlist is empty"
            description="Save products to see them here."
            action={
              <Link to="/products" className={buttonStyles('secondary', 'md')}>
                Explore products
              </Link>
            }
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <Card key={item.wishlistId} className="overflow-hidden p-5">
                <div className="space-y-5">
                  <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)]">
                    <img
                      src={item.product.primaryImage ?? fallbackImageUrl}
                      alt={item.product.name}
                      className="aspect-square w-full object-cover"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="brand">{item.product.category}</Badge>
                      <Badge variant={stockVariantMap[item.product.stockStatus]}>
                        {stockLabelMap[item.product.stockStatus]}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {item.product.brand ? (
                        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                          {item.product.brand}
                        </p>
                      ) : null}
                      <p className="text-2xl font-bold text-slate-950">{item.product.name}</p>
                      <p className="text-sm text-slate-500">SKU: {item.product.sku}</p>
                    </div>

                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-2xl font-extrabold text-slate-950">
                          {formatCurrency(item.product.effectivePrice)}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <span className="line-through">{formatCurrency(item.product.mrp)}</span>
                          {item.product.discountPercentage > 0 ? (
                            <span className="font-semibold text-emerald-600">
                              {item.product.discountPercentage}% off
                            </span>
                          ) : null}
                        </div>
                      </div>
                      <p className="text-sm text-slate-500">GST: {item.product.gstPercentage}%</p>
                    </div>

                    <div className="grid gap-3">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className={buttonStyles('outline', 'md')}
                      >
                        View details
                      </Link>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={
                          isUpdating(item.product.id) ||
                          isProductPending(item.product.id) ||
                          item.product.stockStatus === 'out_of_stock'
                        }
                        onClick={() => {
                          void addItem(item.product.id, 1)
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {item.product.stockStatus === 'out_of_stock'
                          ? 'Out of Stock'
                          : isProductPending(item.product.id)
                            ? 'Adding...'
                            : 'Move to Cart'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isUpdating(item.product.id)}
                        onClick={() => {
                          void removeWishlistItem(item.product.id)
                        }}
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
