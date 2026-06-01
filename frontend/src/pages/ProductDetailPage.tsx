import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AddToCartButton } from '../components/cart/AddToCartButton'
import { QuantitySelector } from '../components/cart/QuantitySelector'
import { ProductCard } from '../components/product/ProductCard'
import { WishlistButton } from '../components/wishlist/WishlistButton'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { ErrorState } from '../components/ui/ErrorState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHeader } from '../components/ui/PageHeader'
import { SectionTitle } from '../components/ui/SectionTitle'
import { buttonStyles } from '../components/ui/button-styles'
import { getProductBySlug } from '../features/catalog/catalog.api'
import type { ProductDetail, ProductImage, ProductListItem } from '../features/catalog/catalog.types'
import { useWishlist } from '../features/wishlist/useWishlist'
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
  const { refreshWishlistStatus } = useWishlist()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<ProductListItem[]>([])
  const [selectedImage, setSelectedImage] = useState<ProductImage | null>(null)
  const [selectedQuantity, setSelectedQuantity] = useState(1)
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
        setSelectedQuantity(1)
        void refreshWishlistStatus([data.product.id])
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
  }, [id, refreshWishlistStatus])

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

  useEffect(() => {
    if (!product) {
      return
    }

    const maxQuantity = Math.max(1, product.stockQuantity)
    setSelectedQuantity((current) => Math.min(Math.max(1, current), maxQuantity))
  }, [product?.id, product?.stockQuantity])

  if (isLoading) {
    return (
      <Container className="py-12">
        <LoadingState
          title="Loading product details"
          description="Preparing product details."
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
        title="Product Details"
      />

      <Container className="space-y-12 pb-16">
        <section className="grid gap-8 lg:grid-cols-[0.84fr_1.16fr]">
          <div className="space-y-4">
            <Card className="overflow-hidden p-4">
              <div className="overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#eff6ff_0%,#ffffff_55%,#dbeafe_100%)]">
                <img
                  src={!imageFailed ? selectedImage?.imageUrl ?? fallbackImageUrl : fallbackImageUrl}
                  alt={selectedImage?.altText ?? product.name}
                  onError={() => setImageFailed(true)}
                  className="aspect-[5/4] w-full object-cover"
                />
              </div>
            </Card>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
                {galleryImages.map((image) => (
                  <button
                    key={image.id}
                    type="button"
                    aria-label={`View ${image.altText ?? product.name}`}
                    onClick={() => {
                      setSelectedImage(image)
                      setImageFailed(false)
                    }}
                    className={`overflow-hidden rounded-[18px] border p-1 transition ${
                      selectedImage?.id === image.id
                        ? 'border-brand-300 bg-brand-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.altText ?? product.name}
                      className="aspect-square w-full rounded-[16px] object-cover"
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
                </div>
                <div className="flex flex-wrap items-center gap-3 pb-1">
                  <p className="text-sm text-slate-500">
                    MRP <span className="line-through">{formatCurrency(product.mrp)}</span>
                  </p>
                  {product.discountPercentage > 0 ? (
                    <Badge variant="success">{product.discountPercentage}% savings</Badge>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  GST: {product.gstPercentage}%
                </p>
                <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                  SKU: {product.sku} | Available: {product.stockQuantity}
                </p>
              </div>
            </div>

            <Card className="p-5">
              <div className="flex items-center gap-3">
                <QuantitySelector
                  value={selectedQuantity}
                  min={1}
                  max={product.stockQuantity}
                  disabled={product.stockStatus === 'out_of_stock'}
                  onChange={setSelectedQuantity}
                />
                <div className="grid flex-1 gap-3 sm:grid-cols-2">
                  <AddToCartButton
                    productId={product.id}
                    stockQuantity={product.stockQuantity}
                    quantity={selectedQuantity}
                    className="h-12 w-full"
                    disabled={product.stockStatus === 'out_of_stock'}
                  />
                  <WishlistButton productId={product.id} variant="button" className="w-full" />
                </div>
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
              title="Related products"
              description="Similar products from the same category."
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
