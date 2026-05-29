import { Funnel, Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { ProductCard } from '../components/product/ProductCard'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Container } from '../components/ui/Container'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingState } from '../components/ui/LoadingState'
import { PageHeader } from '../components/ui/PageHeader'
import { buttonStyles } from '../components/ui/button-styles'
import { products } from '../data/mock-data'

const categories = ['All', ...new Set(products.map((product) => product.category))]
const brands = ['All', ...new Set(products.map((product) => product.brand))]

function FilterPanel({
  selectedCategory,
  selectedBrand,
  onCategoryChange,
  onBrandChange,
}: {
  selectedCategory: string
  selectedBrand: string
  onCategoryChange: (value: string) => void
  onBrandChange: (value: string) => void
}) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Funnel className="h-4 w-4 text-brand-600" />
          Filter by category
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoryChange(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                selectedCategory === category
                  ? 'bg-slate-950 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-slate-700">Brands</div>
        <div className="grid gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              type="button"
              onClick={() => onBrandChange(brand)}
              className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition ${
                selectedBrand === brand
                  ? 'border-brand-200 bg-brand-50 text-brand-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <div className="text-sm font-semibold text-slate-700">Price range</div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="h-2 rounded-full bg-slate-200">
            <div className="h-2 w-2/3 rounded-full bg-brand-500" />
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-slate-500">
            <span>₹5,000</span>
            <span>₹60,000+</span>
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-500">
            Placeholder UI ready for future range filtering.
          </p>
        </div>
      </div>
    </div>
  )
}

export function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedBrand, setSelectedBrand] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [isLoading, setIsLoading] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 650)

    return () => window.clearTimeout(timer)
  }, [])

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const matches = products.filter((product) => {
      const searchMatch =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)

      const categoryMatch =
        selectedCategory === 'All' || product.category === selectedCategory
      const brandMatch = selectedBrand === 'All' || product.brand === selectedBrand

      return searchMatch && categoryMatch && brandMatch
    })

    const sorted = [...matches]

    switch (sortBy) {
      case 'price-low':
        sorted.sort((left, right) => left.price - right.price)
        break
      case 'price-high':
        sorted.sort((left, right) => right.price - left.price)
        break
      case 'rating':
        sorted.sort((left, right) => right.rating - left.rating)
        break
      default:
        sorted.sort((left, right) => left.id - right.id)
    }

    return sorted
  }, [searchQuery, selectedCategory, selectedBrand, sortBy])

  return (
    <>
      <PageHeader
        eyebrow="Product Catalog"
        title="Browse electronics with a scalable storefront layout"
        description="Search, sort, and filter through a static product grid that is already structured for future API integration."
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
            <FilterPanel
              selectedCategory={selectedCategory}
              selectedBrand={selectedBrand}
              onCategoryChange={setSelectedCategory}
              onBrandChange={setSelectedBrand}
            />
          </Card>

          <div className="space-y-6">
            <Card className="p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <label className="flex h-12 flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4">
                  <Search className="h-4 w-4 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    type="search"
                    placeholder="Search by product, brand, or category"
                    className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />
                </label>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="h-12 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 outline-none transition focus:border-brand-300 focus:ring-4 focus:ring-brand-100"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Category: {selectedCategory}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  Brand: {selectedBrand}
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
                </span>
              </div>
            </Card>

            {isFilterOpen ? (
              <Card className="p-6 lg:hidden">
                <FilterPanel
                  selectedCategory={selectedCategory}
                  selectedBrand={selectedBrand}
                  onCategoryChange={setSelectedCategory}
                  onBrandChange={setSelectedBrand}
                />
              </Card>
            ) : null}

            {isLoading ? (
              <LoadingState
                title="Loading products"
                description="Preparing the catalog grid and filter layout."
                cardCount={6}
              />
            ) : filteredProducts.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="No products match this preview"
                description="Try another search term or reset the placeholder filters to bring back the full product grid."
                action={
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setSearchQuery('')
                      setSelectedCategory('All')
                      setSelectedBrand('All')
                      setSortBy('featured')
                    }}
                  >
                    Reset filters
                  </Button>
                }
              />
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
