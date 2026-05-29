import { Funnel, Search, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/product/ProductCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Input } from '../components/ui/Input'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHeader } from '../components/ui/PageHeader'
import { buttonStyles } from '../components/ui/button-styles'
import { getBrands, getCategories, getProducts } from '../features/catalog/catalog.api'
import type {
  Brand,
  Category,
  ProductListItem,
  ProductsQueryParams,
  SortOption,
} from '../features/catalog/catalog.types'
import { getApiErrorMessage } from '../lib/api-client'

function FilterPanel({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  selectedStock,
  minPrice,
  maxPrice,
  onCategoryChange,
  onBrandChange,
  onStockChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClearFilters,
}: {
  categories: Category[]
  brands: Brand[]
  selectedCategory: string
  selectedBrand: string
  selectedStock: string
  minPrice: string
  maxPrice: string
  onCategoryChange: (value: string) => void
  onBrandChange: (value: string) => void
  onStockChange: (value: string) => void
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  onClearFilters: () => void
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Funnel className="h-4 w-4 text-brand-600" />
          Filter by category
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCategoryChange('')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selectedCategory === ''
                ? 'bg-slate-950 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.slug)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category.slug
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-slate-700">Brands</div>
        <div className="grid gap-2">
          <button
            type="button"
            onClick={() => onBrandChange('')}
            className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
              selectedBrand === ''
                ? 'border-brand-200 bg-brand-50 text-brand-700'
                : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            All brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand.id}
              type="button"
              onClick={() => onBrandChange(brand.slug)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                selectedBrand === brand.slug
                  ? 'border-brand-200 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span>{brand.name}</span>
                <span className="text-xs text-slate-400">{brand.productCount}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-slate-700">Price range</div>
        <div className="grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <Input
            type="number"
            min="0"
            placeholder="Minimum price"
            value={minPrice}
            onChange={(event) => onMinPriceChange(event.target.value)}
          />
          <Input
            type="number"
            min="0"
            placeholder="Maximum price"
            value={maxPrice}
            onChange={(event) => onMaxPriceChange(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-slate-700">Stock status</div>
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
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                selectedStock === option.value
                  ? 'border-brand-200 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={onClearFilters}>
        <X className="h-4 w-4" />
        Clear filters
      </Button>
    </div>
  )
}

const defaultLimit = 12

const sortOptions: Array<{ label: string; value: SortOption }> = [
  { label: 'Newest', value: 'newest' },
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
  stock:
    (searchParams.get('stock') as ProductsQueryParams['stock'] | null) || undefined,
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

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = useMemo(() => buildProductsQuery(searchParams), [searchParams])
  const [searchInput, setSearchInput] = useState(query.search ?? '')
  const [categories, setCategories] = useState<Category[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [products, setProducts] = useState<ProductListItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isMetaLoading, setIsMetaLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    setSearchInput(query.search ?? '')
  }, [query.search])

  useEffect(() => {
    let isMounted = true

    const loadFilters = async () => {
      setIsMetaLoading(true)

      try {
        const [categoriesResponse, brandsResponse] = await Promise.all([
          getCategories(),
          getBrands(),
        ])

        if (!isMounted) {
          return
        }

        setCategories(categoriesResponse)
        setBrands(brandsResponse)
      } catch {
        if (!isMounted) {
          return
        }

        setCategories([])
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

  const activeCategoryName =
    categories.find((category) => category.slug === query.category)?.name ?? 'All'
  const activeBrandName =
    brands.find((brand) => brand.slug === query.brand)?.name ?? 'All'

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

  const applySearch = () => {
    setSearchParams(
      updateSearchParams(
        searchParams,
        {
          search: searchInput.trim() || undefined,
        },
        true,
      ),
    )
  }

  const clearFilters = () => {
    setSearchInput('')
    setSearchParams(new URLSearchParams())
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
      categories={categories}
      brands={brands}
      selectedCategory={query.category ?? ''}
      selectedBrand={query.brand ?? ''}
      selectedStock={query.stock ?? ''}
      minPrice={searchParams.get('minPrice') ?? ''}
      maxPrice={searchParams.get('maxPrice') ?? ''}
      onCategoryChange={(value) => {
        setSearchParams(updateSearchParams(searchParams, { category: value || undefined }, true))
      }}
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
      onClearFilters={clearFilters}
    />
  )

  return (
    <>
      <PageHeader
        eyebrow="Product Catalog"
        title="Browse electronics with real catalogue search and filters"
        description="Search, sort, and filter customer products without disturbing the existing storefront theme."
        actions={
          <button
            type="button"
            className={`${buttonStyles('outline', 'md')} lg:hidden`}
            onClick={() => setIsFilterOpen((value) => !value)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        }
      />

      <Container className="pb-16">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Card className="hidden h-fit p-6 lg:block">
            {isMetaLoading ? (
              <p className="text-sm text-slate-500">Loading filters...</p>
            ) : (
              filterPanel
            )}
          </Card>

          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <label className="flex h-12 flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        applySearch()
                      }
                    }}
                    type="search"
                    placeholder="Search by product, SKU, category, or brand"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </label>
                <Button onClick={applySearch}>
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                <select
                  value={query.sort ?? 'newest'}
                  onChange={(event) => {
                    setSearchParams(
                      updateSearchParams(searchParams, { sort: event.target.value }, true),
                    )
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

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Category: {activeCategoryName}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Brand: {activeBrandName}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Stock: {query.stock ? query.stock.replaceAll('_', ' ') : 'All'}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {totalProducts} product{totalProducts === 1 ? '' : 's'}
                </span>
              </div>
            </Card>

            {isFilterOpen ? (
              <Card className="p-6 lg:hidden">
                {isMetaLoading ? (
                  <p className="text-sm text-slate-500">Loading filters...</p>
                ) : (
                  filterPanel
                )}
              </Card>
            ) : null}

            {isLoading ? (
              <LoadingState
                title="Loading products"
                description="Fetching the latest product catalogue and applying your selected filters."
                cardCount={6}
              />
            ) : errorMessage ? (
              <ErrorState
                title="Unable to load products"
                description={errorMessage}
                action={(
                  <Button variant="secondary" onClick={retryProducts}>
                    Try again
                  </Button>
                )}
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
                description="Try a different search term, broaden your price range, or clear the current filters."
                action={(
                  <Button variant="secondary" onClick={clearFilters}>
                    Clear filters
                  </Button>
                )}
              />
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
