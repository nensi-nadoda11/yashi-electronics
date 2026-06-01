import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Input } from '../components/ui/Input'
import { LoadingState } from '../components/ui/LoadingState'
import { getBrands, getProducts } from '../features/catalog/catalog.api'
import { useAuth } from '../features/auth/useAuth'
import { useWishlist } from '../features/wishlist/useWishlist'
import { getCatalogCategoryLabel } from '../data/catalog-navigation'
import type {
  Brand,
  ProductListItem,
  ProductsQueryParams,
  SortOption,
} from '../features/catalog/catalog.types'
import { getApiErrorMessage } from '../lib/api-client'

function FilterAccordion({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <section className="border-b border-slate-200/80 pb-4 last:border-b-0 last:pb-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">{title}</p>
        </div>
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 text-slate-500 transition ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>

      <div
        className={`grid overflow-hidden transition-all duration-300 ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="min-h-0 pt-3">{children}</div>
      </div>
    </section>
  )
}

function FilterPanel({
  brands,
  selectedBrand,
  selectedStock,
  minPrice,
  maxPrice,
  onBrandChange,
  onStockChange,
  onMinPriceChange,
  onMaxPriceChange,
}: {
  brands: Brand[]
  selectedBrand: string
  selectedStock: string
  minPrice: string
  maxPrice: string
  onBrandChange: (value: string) => void
  onStockChange: (value: string) => void
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
}) {
  const [isBrandsOpen, setIsBrandsOpen] = useState(true)
  const [isPriceOpen, setIsPriceOpen] = useState(true)
  const [isStockOpen, setIsStockOpen] = useState(true)

  return (
    <div className="space-y-4">
      <FilterAccordion
        title="Brands"
        isOpen={isBrandsOpen}
        onToggle={() => setIsBrandsOpen((value) => !value)}
      >
        <div className="max-h-64 overflow-auto pr-1 scrollbar-light">
          <div className="grid gap-2">
            <button
              type="button"
              onClick={() => onBrandChange('')}
              className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm font-medium transition ${
                selectedBrand === ''
                  ? 'border-brand-200 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <span>All brands</span>
              <span className="text-xs font-semibold text-slate-400">All</span>
            </button>

            {brands.map((brand) => (
              <button
                key={brand.id}
                type="button"
                onClick={() => onBrandChange(brand.slug)}
                className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2 text-left text-sm font-medium transition ${
                  selectedBrand === brand.slug
                    ? 'border-brand-200 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950'
                }`}
              >
                <span className="truncate">{brand.name}</span>
                <span className="ml-3 rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-400">
                  {brand.productCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      </FilterAccordion>

      <FilterAccordion
        title="Price range"
        isOpen={isPriceOpen}
        onToggle={() => setIsPriceOpen((value) => !value)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            type="number"
            min="0"
            placeholder="Min price"
            value={minPrice}
            onChange={(event) => onMinPriceChange(event.target.value)}
          />
          <Input
            type="number"
            min="0"
            placeholder="Max price"
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
          />
        </div>
      </FilterAccordion>

      <FilterAccordion
        title="Stock status"
        isOpen={isStockOpen}
        onToggle={() => setIsStockOpen((value) => !value)}
      >
        <div className="grid gap-2">
          {[
            { label: 'All stock', value: '' },
            { label: 'In stock', value: 'in_stock' },
            { label: 'Low stock', value: 'low_stock' },
            { label: 'Out of stock', value: 'out_of_stock' },
          ].map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => onStockChange(option.value)}
              className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                selectedStock === option.value
                  ? 'border-brand-200 bg-brand-50 text-brand-700'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <span>{option.label}</span>
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  selectedStock === option.value ? 'bg-brand-600' : 'border border-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
      </FilterAccordion>
    </div>
  )
}

function FilterChip({
  label,
  active = false,
}: {
  label: string
  active?: boolean
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium ${
        active
          ? 'border-brand-200 bg-brand-50 text-brand-700'
          : 'border-slate-200 bg-slate-50 text-slate-600'
      }`}
    >
      {label}
    </span>
  )
}

function FilterDrawer({
  open,
  onClose,
  onClearFilters,
  children,
}: {
  open: boolean
  onClose: () => void
  onClearFilters: () => void
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close filters"
        className="absolute inset-0 cursor-default bg-slate-950/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside className="absolute left-0 top-0 h-full w-[min(92vw,390px)] border-r border-slate-200 bg-white shadow-[24px_0_80px_-35px_rgba(15,23,42,0.45)]">
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4">
            <div>
              <p className="text-lg font-bold text-slate-950">Filters</p>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onClearFilters}>
                Clear filters
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close filter drawer">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-light">
            {children}
          </div>
        </div>
      </aside>
    </div>
  )
}

const defaultLimit = 12

const sortOptions: Array<{ label: string; value: SortOption }> = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_low_to_high' },
  { label: 'Price: High to Low', value: 'price_high_to_low' },
  { label: 'Name: A to Z', value: 'name_az' },
  { label: 'Name: Z to A', value: 'name_za' },
  { label: 'Discount: High to Low', value: 'discount_high_to_low' },
]

const normalizePositiveNumber = (value: string | null) => {
  if (!value) {
    return undefined
  }

  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : undefined
}

const normalizePositiveInteger = (value: string | null, fallbackValue: number) => {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallbackValue
  }

  return parsedValue
}

const buildProductsQuery = (searchParams: URLSearchParams): ProductsQueryParams => ({
  search: searchParams.get('search') || undefined,
  category: searchParams.get('category') || undefined,
  brand: searchParams.get('brand') || undefined,
  minPrice: normalizePositiveNumber(searchParams.get('minPrice')),
  maxPrice: normalizePositiveNumber(searchParams.get('maxPrice')),
  sort: (searchParams.get('sort') as SortOption | null) || 'newest',
  stock: (searchParams.get('stock') as ProductsQueryParams['stock'] | null) || undefined,
  page: normalizePositiveInteger(searchParams.get('page'), 1),
  limit: Math.min(normalizePositiveInteger(searchParams.get('limit'), defaultLimit), 48),
})

const updateSearchParams = (
  searchParams: URLSearchParams,
  updates: Record<string, string | undefined>,
  resetPage = false,
) => {
  const nextSearchParams = new URLSearchParams(searchParams)

  Object.entries(updates).forEach(([key, value]) => {
    if (!value) {
      nextSearchParams.delete(key)
      return
    }

    nextSearchParams.set(key, value)
  })

  if (resetPage) {
    nextSearchParams.delete('page')
  }

  return nextSearchParams
}

const getStockLabel = (stock?: ProductsQueryParams['stock']) => {
  switch (stock) {
    case 'in_stock':
      return 'In stock'
    case 'low_stock':
      return 'Low stock'
    case 'out_of_stock':
      return 'Out of stock'
    default:
      return 'All'
  }
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated } = useAuth()
  const { refreshWishlistStatus } = useWishlist()
  const query = useMemo(() => buildProductsQuery(searchParams), [searchParams])
  const [searchInput, setSearchInput] = useState(query.search ?? '')
  const [brands, setBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isMetaLoading, setIsMetaLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false)

  useEffect(() => {
    setSearchInput(query.search ?? '')
  }, [query.search])

  useEffect(() => {
    const nextSearch = searchInput.trim()
    const currentSearch = query.search ?? ''

    if (nextSearch === currentSearch) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setSearchParams(
        updateSearchParams(
          searchParams,
          {
            search: nextSearch || undefined,
          },
          true,
        ),
      )
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [query.search, searchInput, searchParams, setSearchParams])

  useEffect(() => {
    let isMounted = true

    const loadFilters = async () => {
      setIsMetaLoading(true)

      try {
        const brandsResponse = await getBrands()

        if (!isMounted) {
          return
        }

        setBrands(brandsResponse)
      } catch {
        if (!isMounted) {
          return
        }

        setBrands([])
      } finally {
        if (isMounted) {
          setIsMetaLoading(false)
        }
      }
    }

    void loadFilters()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const data = await getProducts(query)

        if (!isMounted) {
          return
        }

        setProducts(data.products)
        setTotalPages(data.pagination.totalPages)
        setTotalProducts(data.pagination.total)
      } catch (error) {
        if (!isMounted) {
          return
        }

        setProducts([])
        setTotalPages(1)
        setTotalProducts(0)
        setErrorMessage(getApiErrorMessage(error))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadProducts()

    return () => {
      isMounted = false
    }
  }, [query])

  useEffect(() => {
    if (!isAuthenticated || products.length === 0) {
      return
    }

    void refreshWishlistStatus(products.map((product) => product.id))
  }, [isAuthenticated, products, refreshWishlistStatus])

  const activeCategoryName = getCatalogCategoryLabel(query.category) ?? 'All'
  const activeBrandName = brands.find((brand) => brand.slug === query.brand)?.name ?? 'All'
  const activeStockLabel = getStockLabel(query.stock)
  const pageTitle = activeCategoryName === 'All' ? 'Products' : activeCategoryName

  const paginationButtons = useMemo(() => {
    const buttons = new Set<number>([1, totalPages, query.page ?? 1])
    const currentPage = query.page ?? 1

    if (currentPage - 1 > 1) {
      buttons.add(currentPage - 1)
    }

    if (currentPage + 1 < totalPages) {
      buttons.add(currentPage + 1)
    }

    return [...buttons].sort((left, right) => left - right)
  }, [query.page, totalPages])

  const clearFilters = () => {
    setSearchInput('')
    setSearchParams(new URLSearchParams())
  }

  const clearFiltersAndCloseDrawer = () => {
    clearFilters()
    setIsFilterDrawerOpen(false)
  }

  const changePage = (page: number) => {
    const nextSearchParams = new URLSearchParams(searchParams)
    nextSearchParams.set('page', String(page))
    setSearchParams(nextSearchParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const retryProducts = () => {
    setSearchParams(new URLSearchParams(searchParams))
  }

  const filterPanel = (
    <FilterPanel
      brands={brands}
      selectedBrand={query.brand ?? ''}
      selectedStock={query.stock ?? ''}
      minPrice={searchParams.get('minPrice') ?? ''}
      maxPrice={searchParams.get('maxPrice') ?? ''}
      onBrandChange={(value) => {
        setSearchParams(updateSearchParams(searchParams, { brand: value || undefined }, true))
      }}
      onStockChange={(value) => {
        setSearchParams(updateSearchParams(searchParams, { stock: value || undefined }, true))
      }}
      onMinPriceChange={(value) => {
        setSearchParams(updateSearchParams(searchParams, { minPrice: value || undefined }, true))
      }}
      onMaxPriceChange={(value) => {
        setSearchParams(updateSearchParams(searchParams, { maxPrice: value || undefined }, true))
      }}
    />
  )

  return (
    <>
      <Container className="pb-12 pt-4">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {pageTitle}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{totalProducts} products found</p>
        </div>

        <div className="space-y-6">
          <Card className="p-5 lg:p-6">
            <div className="grid gap-3 lg:grid-cols-[auto_minmax(0,1fr)_240px]">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setIsFilterDrawerOpen(true)}
                className="whitespace-nowrap justify-center lg:justify-start"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>

              <label className="flex h-12 min-w-0 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4">
                <Search className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  type="search"
                  placeholder="Search by product, SKU, category, or brand"
                  aria-label="Search products"
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>

              <select
                value={query.sort ?? 'newest'}
                onChange={(event) => {
                  setSearchParams(updateSearchParams(searchParams, { sort: event.target.value }, true))
                }}
                className="h-12 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort: {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <FilterChip label={`Category: ${activeCategoryName}`} active={activeCategoryName !== 'All'} />
              <FilterChip label={`Brand: ${activeBrandName}`} active={activeBrandName !== 'All'} />
              <FilterChip label={`Stock: ${activeStockLabel}`} active={activeStockLabel !== 'All'} />
              <FilterChip label={`${totalProducts} products`} active />
            </div>
          </Card>

          {isLoading ? (
            <LoadingState
              title="Loading products"
              description="Fetching the catalogue."
              cardCount={6}
            />
          ) : errorMessage ? (
            <ErrorState
              title="Unable to load products"
              description={errorMessage}
              action={
                <Button variant="secondary" onClick={retryProducts}>
                  Try again
                </Button>
              }
            />
          ) : products.length > 0 ? (
            <>
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Showing page {query.page ?? 1} of {totalPages}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    disabled={(query.page ?? 1) <= 1}
                    onClick={() => changePage((query.page ?? 1) - 1)}
                  >
                    Previous
                  </Button>
                  {paginationButtons.map((page) => (
                    <Button
                      key={page}
                      variant={page === (query.page ?? 1) ? 'primary' : 'outline'}
                      onClick={() => changePage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={(query.page ?? 1) >= totalPages}
                    onClick={() => changePage((query.page ?? 1) + 1)}
                  >
                    Next
                  </Button>
                </div>
              </Card>
            </>
          ) : (
            <EmptyState
              icon={Search}
              title="No products matched your filters"
              description="Try a different search or clear the filters."
              action={
                <Button variant="secondary" onClick={clearFilters}>
                  Clear filters
                </Button>
              }
            />
          )}
        </div>
      </Container>

      <FilterDrawer
        open={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        onClearFilters={clearFiltersAndCloseDrawer}
      >
        {isMetaLoading ? (
          <p className="text-sm text-slate-500">Loading filters...</p>
        ) : (
          filterPanel
        )}
      </FilterDrawer>
    </>
  )
}
