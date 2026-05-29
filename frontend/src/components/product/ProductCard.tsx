import { ArrowRight, Heart, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../../types/store'
import { calculateDiscountPercentage, formatCurrency } from '../../utils/format'
import { Badge } from '../ui/Badge'
import { Card } from '../ui/Card'
import { buttonStyles } from '../ui/button-styles'
import { cn } from '../../utils/cn'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = calculateDiscountPercentage(product.mrp, product.price)

  return (
    <Card className="group overflow-hidden p-5 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_70px_-30px_rgba(15,23,42,0.35)]">
      <div className="flex h-full flex-col gap-5">
        <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)] p-5">
          <div className="absolute right-4 top-4">
            <button
              type="button"
              aria-label={`Add ${product.name} to wishlist`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-600 shadow-sm transition hover:bg-white hover:text-rose-500"
            >
              <Heart className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-6">
            <Badge variant="brand">{product.category}</Badge>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
                {product.brand}
              </p>
              <div className="rounded-[24px] border border-white/70 bg-white/80 p-5 shadow-inner shadow-white/40">
                <p className="text-lg font-bold text-slate-950">{product.heroLabel}</p>
                <p className="mt-2 text-sm text-slate-500">{product.shortDescription}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold text-slate-700">{product.rating}</span>
              <span className="text-slate-500">({product.reviews})</span>
            </div>
            <Badge
              variant={
                product.stockStatus === 'In Stock'
                  ? 'success'
                  : product.stockStatus === 'Limited Stock'
                    ? 'warning'
                    : 'danger'
              }
            >
              {product.stockStatus}
            </Badge>
          </div>
          <div className="space-y-2">
            <Link
              to={`/products/${product.id}`}
              className="line-clamp-2 text-xl font-bold tracking-tight text-slate-950 transition group-hover:text-brand-700"
            >
              {product.name}
            </Link>
            <p className="line-clamp-2 text-sm leading-6 text-slate-600">
              {product.description}
            </p>
          </div>
          <div className="mt-auto flex items-end justify-between gap-4">
            <div>
              <p className="text-2xl font-extrabold text-slate-950">
                {formatCurrency(product.price)}
              </p>
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <span className="line-through">{formatCurrency(product.mrp)}</span>
                <span className="font-semibold text-emerald-600">{discount}% off</span>
              </p>
            </div>
            <Link
              to={`/products/${product.id}`}
              className={cn(buttonStyles('outline', 'sm'), 'shrink-0')}
            >
              View
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}
