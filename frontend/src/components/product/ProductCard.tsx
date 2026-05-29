import { ArrowRight, Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ProductListItem } from '../../features/catalog/catalog.types'
import type { Product } from '../../types/store'
import { calculateDiscountPercentage, formatCurrency } from '../../utils/format'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { buttonStyles } from '../ui/button-styles'
import { cn } from '../../utils/cn'

interface ProductCardProps {
  product: ProductListItem | Product
}

const fallbackImageUrl = 'https://placehold.co/900x900/e2e8f0/0f172a/png?text=Yashi+Electronics'

export function ProductCard({ product }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false)

  const isCatalogProduct = 'slug' in product
  const brandName = isCatalogProduct ? product.brand?.name ?? 'Generic' : product.brand
  const categoryName = isCatalogProduct ? product.category.name : product.category
  const productHref = isCatalogProduct ? `/products/${product.slug}` : `/products/${product.id}`
  const effectivePrice = isCatalogProduct ? product.effectivePrice : product.price
  const description = isCatalogProduct
    ? product.shortDescription ?? product.description
    : product.description
  const stockStatus = isCatalogProduct ? product.stockStatus : product.stockStatus
  const discount = isCatalogProduct
    ? product.discountPercentage
    : calculateDiscountPercentage(product.mrp, product.price)
  const stockBadgeLabel =
    stockStatus === 'in_stock' || stockStatus === 'In Stock'
      ? 'In Stock'
      : stockStatus === 'low_stock' || stockStatus === 'Limited Stock'
        ? 'Low Stock'
        : 'Out of Stock'
  const stockBadgeVariant =
    stockBadgeLabel === 'In Stock'
      ? 'success'
      : stockBadgeLabel === 'Low Stock'
        ? 'warning'
        : 'danger'
  const imageUrl =
    isCatalogProduct && !imageFailed && product.primaryImage?.imageUrl
      ? product.primaryImage.imageUrl
      : fallbackImageUrl

  return (
    <Card className="group overflow-hidden p-5 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)]">
      <div className="flex h-full flex-col gap-5">
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)]">
          <div className="absolute right-4 top-4 z-10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              aria-label={`Wishlist for ${product.name} coming soon`}
              title="Wishlist integration will be added in a later module"
              className="h-10 w-10 rounded-full border-white/70 bg-white/85 p-0 text-slate-600 hover:text-rose-500"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          <img
            src={imageUrl}
            alt={isCatalogProduct ? product.primaryImage?.altText ?? product.name : product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
                {brandName}
              </p>
              <p className="truncate text-sm text-slate-500">{categoryName}</p>
            </div>
            <Badge variant={stockBadgeVariant}>{stockBadgeLabel}</Badge>
          </div>

          <div className="space-y-2">
            <Link
              to={productHref}
              className="line-clamp-2 text-xl font-bold tracking-tight text-slate-950 transition group-hover:text-brand-700"
            >
              {product.name}
            </Link>
            <p className="line-clamp-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </div>

          <div className="mt-auto space-y-4">
            <div>
              <p className="text-2xl font-extrabold text-slate-950">
                {formatCurrency(effectivePrice)}
              </p>
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <span className="line-through">{formatCurrency(product.mrp)}</span>
                {discount > 0 ? (
                  <span className="font-semibold text-emerald-600">{discount}% off</span>
                ) : null}
              </p>
              {'gstPercentage' in product ? (
                <p className="mt-2 text-xs text-slate-500">GST: {product.gstPercentage}%</p>
              ) : null}
            </div>

            <div className="flex gap-3">
              <Link to={productHref} className={cn(buttonStyles('outline', 'sm'), 'flex-1 justify-center')}>
                View Details
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Button
                type="button"
                size="sm"
                disabled={stockBadgeLabel === 'Out of Stock'}
                title="Cart integration will be added in a later module"
                className="flex-1 justify-center"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
