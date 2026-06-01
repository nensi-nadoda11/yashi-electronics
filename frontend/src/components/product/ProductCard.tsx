import { Eye } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ProductListItem } from '../../features/catalog/catalog.types'
import type { Product } from '../../types/store'
import { calculateDiscountPercentage, formatCurrency } from '../../utils/format'
import { AddToCartButton } from '../cart/AddToCartButton'
import { WishlistButton } from '../wishlist/WishlistButton'
import { Badge } from '../ui/Badge'
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
    <Card className="group overflow-hidden p-4 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)]">
      <div className="flex h-full flex-col gap-4">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)]">
          <div className="absolute right-4 top-4 z-10">
            {'id' in product && typeof product.id === 'string' ? (
              <WishlistButton productId={product.id} />
            ) : null}
          </div>
          <img
            src={imageUrl}
            alt={isCatalogProduct ? product.primaryImage?.altText ?? product.name : product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover"
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
          </div>

          <div className="mt-auto space-y-4">
            <div>
              <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <p className="text-2xl font-extrabold text-slate-950">
                  {formatCurrency(effectivePrice)}
                </p>
                <span className="text-sm text-slate-500 line-through">
                  {formatCurrency(product.mrp)}
                </span>
                {discount > 0 ? (
                  <span className="text-sm font-semibold text-emerald-600">{discount}% off</span>
                ) : null}
              </div>
              {'gstPercentage' in product ? (
                <p className="mt-2 text-xs text-slate-500">GST: {product.gstPercentage}%</p>
              ) : null}
            </div>

            <div className="flex gap-3">
              <Link
                to={productHref}
                aria-label="View details"
                title="View details"
                className={cn(buttonStyles('outline', 'sm'), 'flex-1 justify-center')}
              >
                <Eye className="h-4 w-4" />
              </Link>
              <AddToCartButton
                productId={product.id}
                stockQuantity={isCatalogProduct ? product.stockQuantity : 0}
                className="flex-1 justify-center"
                variant="secondary"
                disabled={stockBadgeLabel === 'Out of Stock'}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
