import { Heart, ShoppingCart, Truck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionTitle } from '../components/ui/SectionTitle'
import { buttonStyles } from '../components/ui/button-styles'
import { getProductBySlug } from '../features/catalog/catalog.api'
import type { ProductDetail, ProductImage, ProductListItem } from '../features/catalog/catalog.types'
import { getApiErrorMessage } from '../lib/api-client'
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

export function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>([])
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null)
  const [imageFailed, setImageFailed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      if (!id) {
        setErrorMessage('Product not found')
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setErrorMessage(null)
      setImageFailed(false)

      try {
        const data = await getProductBySlug(id)

        if (!isMounted) {
          return
        }

        setProduct(data.product)
        setRelatedProducts(data.relatedProducts)
        setSelectedImage(data.product.images[0] ?? data.product.primaryImage ?? null)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setProduct(null)
        setRelatedProducts([])
        setSelectedImage(null)
        setErrorMessage(getApiErrorMessage(error))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  const galleryImages = useMemo(() => {
    if (!product) {
      return []
    }

    return product.images.length > 0
      ? product.images
      : product.primaryImage
        ? [product.primaryImage]
        : []
  }, [product])

  if (isLoading) {
    return (
      <Container className="py-12">
        <LoadingState
          title="Loading product details"
          description="Preparing product images, specifications, and related catalogue items."
          cardCount={2}
        />
      </Container>
    )
  }

  if (!product) {
    return (
      <Container className="py-12">
        <ErrorState
          title="Product not found"
          description={errorMessage ?? 'The requested product could not be found.'}
          action={
            <Link to="/products" className={buttonStyles('secondary', 'md')}>
              Back to products
            </Link>
          }
        />
      </Container>
    )
  }

  return (
    <>
      <PageHeader
        eyebrow={product.category.name}
        title={product.name}
        description={product.shortDescription ?? product.description ?? 'Product details'}
      />

      <Container className="space-y-12 pb-16">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <Card className="overflow-hidden p-6">
              <div className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)]">
                <img
                  src={!imageFailed ? selectedImage?.imageUrl ?? fallbackImageUrl : fallbackImageUrl}
                  alt={selectedImage?.altText ?? product.name}
                  onError={() => setImageFailed(true)}
                  className="aspect-square w-full object-cover"
                />
              </div>
            </Card>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                {galleryImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => {
                      setSelectedImage(image)
                      setImageFailed(false)
                    }}
                    className={`overflow-hidden rounded-[24px] border p-1 transition ${
                      selectedImage?.id === image.id
                        ? 'border-brand-300 bg-brand-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.altText ?? product.name}
                      className="aspect-square w-full rounded-[20px] object-cover"
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="brand">{product.category.name}</Badge>
                <Badge variant={stockVariantMap[product.stockStatus]}>
                  {stockLabelMap[product.stockStatus]}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                  {product.brand?.name ?? 'Generic'}
                </p>
                <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                <div>
                  <p className="text-4xl font-extrabold text-slate-950">
                    {formatCurrency(product.effectivePrice)}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    MRP <span className="line-through">{formatCurrency(product.mrp)}</span>
                  </p>
                </div>
                {product.discountPercentage > 0 ? (
                  <Badge variant="success">{product.discountPercentage}% savings</Badge>
                ) : null}
              </div>

              <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                GST: {product.gstPercentage}% applicable. Final invoice and checkout tax workflow will continue in later modules.
              </p>
              <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                SKU: {product.sku} • Available quantity: {product.stockQuantity}
              </p>
            </div>

            <Card className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Button size="lg" disabled={product.stockStatus === 'out_of_stock'}>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  title="Wishlist integration will be added in a later module"
                >
                  <Heart className="h-4 w-4" />
                  Add to Wishlist
                </Button>
              </div>
              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-brand-50 px-4 py-4 text-sm text-brand-700">
                <Truck className="mt-0.5 h-4 w-4 shrink-0" />
                <span>Delivery timelines, serviceability, and installation workflows will be connected to future commerce modules.</span>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-950">Specifications</h2>
              <div className="mt-5 divide-y divide-slate-100">
                {product.specifications.map((specification) => (
                  <div key={specification.id} className="grid gap-2 py-4 sm:grid-cols-[180px_minmax(0,1fr)]">
                    <p className="text-sm font-semibold text-slate-700">{specification.name}</p>
                    <p className="text-sm leading-6 text-slate-600">{specification.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-slate-950">Product Description</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                {product.description ?? product.shortDescription ?? 'Product description will be updated soon.'}
              </p>
            </Card>
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="space-y-8">
            <SectionTitle
              eyebrow="Related Products"
              title="Customers also explore similar products"
              description="Additional catalogue items from the same category are surfaced here to support browsing."
            />
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {relatedProducts.map((entry) => (
                <ProductCard key={entry.id} product={entry} />
              ))}
            </div>
          </section>
        ) : null}
      </Container>
    </>
  )
}
