import { Heart, ShoppingCart, Star, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { ErrorState } from '../components/ui/ErrorState'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionTitle } from '../components/ui/SectionTitle'
import { buttonStyles } from '../components/ui/button-styles'
import { products } from '../data/mock-data'
import { calculateDiscountPercentage, formatCurrency } from '../utils/format'

export function ProductDetailPage() {
  const { id } = useParams()
  const productId = Number(id)
  const product = products.find((entry) => entry.id === productId)

  if (!product) {
    return (
      <Container className="py-12">
        <ErrorState
          title="Product not found"
          description="This product detail route is ready, but the requested demo product does not exist. Try returning to the catalog and selecting one of the available items."
          action={
            <Link to="/products" className={buttonStyles('secondary', 'md')}>
              Back to products
            </Link>
          }
        />
      </Container>
    )
  }

  const relatedProducts = products
    .filter(
      (entry) => entry.id !== product.id && entry.category === product.category,
    )
    .slice(0, 3)

  const discount = calculateDiscountPercentage(product.mrp, product.price)

  return (
    <>
      <PageHeader
        eyebrow={product.category}
        title={product.name}
        description={product.shortDescription}
      />

      <Container className="space-y-12 pb-16">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <Card className="overflow-hidden p-6">
              <div className="rounded-[32px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)] p-8">
                <div className="flex min-h-[340px] flex-col justify-between rounded-[28px] border border-white/70 bg-white/80 p-8 shadow-inner shadow-white/60">
                  <Badge variant="brand" className="w-fit">
                    {product.brand}
                  </Badge>
                  <div className="space-y-3">
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-700">
                      Product Showcase
                    </p>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">
                      {product.heroLabel}
                    </h2>
                    <p className="max-w-md text-base leading-7 text-slate-600">
                      {product.description}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
            <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="p-3">
                  <div className="flex aspect-square items-center justify-center rounded-[24px] bg-slate-100 p-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    View {index + 1}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="brand">{product.category}</Badge>
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
                <div className="flex items-center gap-2 text-sm text-amber-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold text-slate-700">{product.rating}</span>
                  <span className="text-slate-500">({product.reviews} reviews)</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                  {product.brand}
                </p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <p className="text-4xl font-extrabold text-slate-950">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    MRP <span className="line-through">{formatCurrency(product.mrp)}</span>
                  </p>
                </div>
                <Badge variant="success">{discount}% savings</Badge>
              </div>

              <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                GST note placeholder: tax presentation, invoice, and business purchase handling can be connected in future checkout modules.
              </p>
            </div>

            <Card className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/cart" className={buttonStyles('primary', 'lg')}>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Link>
                <Link to="/wishlist" className={buttonStyles('outline', 'lg')}>
                  <Heart className="h-4 w-4" />
                  Add to Wishlist
                </Link>
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-brand-50 px-4 py-4 text-sm text-brand-700">
                <Truck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{product.delivery}</span>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-950">Specifications</h2>
              <div className="mt-5 divide-y divide-slate-100">
                {product.specs.map((spec) => (
                  <div key={spec.label} className="grid gap-2 py-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                    <p className="text-sm font-semibold text-slate-700">{spec.label}</p>
                    <p className="text-sm leading-6 text-slate-600">{spec.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-950">Product Description</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {product.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="neutral">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="space-y-8">
          <SectionTitle
            eyebrow="Related Products"
            title="Customers also explore similar products"
            description="This area is ready for future related-product recommendations from catalog APIs."
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {relatedProducts.map((entry) => (
              <ProductCard key={entry.id} product={entry} />
            ))}
          </div>
        </section>
      </Container>
    </>
  )
}
