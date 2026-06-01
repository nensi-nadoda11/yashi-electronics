import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
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
import { cn } from '../utils/cn'
import { formatCurrency } from '../utils/format'

const fallbackImageUrl = 'https://placehold.co/900x900/e2e8f0/0f172a/png?text=Yashi+Electronics'

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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {items.map((item) => (
              <Card key={item.wishlistId} className="h-full min-h-[420px] overflow-hidden p-4">
                <div className="flex h-full flex-col gap-4">
                  <div className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)]">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="absolute right-3 top-3 z-10 h-10 w-10 rounded-full border-white/80 bg-white/95 p-0 text-slate-600 shadow-lg backdrop-blur hover:bg-white"
                      disabled={isUpdating(item.product.id)}
                      onClick={() => {
                        void removeWishlistItem(item.product.id)
                      }}
                      aria-label={`Remove ${item.product.name} from wishlist`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <img
                      src={item.product.primaryImage ?? fallbackImageUrl}
                      alt={item.product.name}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col gap-3">
                    <div className="space-y-2">
                      <p className="line-clamp-2 min-h-[3rem] text-xl font-bold leading-tight text-slate-950">
                        {item.product.name}
                      </p>
                      <p className="text-2xl font-extrabold text-slate-950">
                        {formatCurrency(item.product.effectivePrice)}
                      </p>
                    </div>

                    <div className="mt-auto grid gap-3">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className={cn(buttonStyles('outline', 'sm'), 'w-full justify-center')}
                      >
                        View details
                      </Link>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="w-full"
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
