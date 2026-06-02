import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { catalogNavigation, getCatalogMainCategoryForSlug } from '../../data/catalog-navigation'
import { cn } from '../../utils/cn'

const buildProductsUrl = (slug: string) => `/products?category=${encodeURIComponent(slug)}`

export function CategoryNavigationBar() {
  const [activeMainSlug, setActiveMainSlug] = useState<string | null>(null)
  const [submenuLeft, setSubmenuLeft] = useState<number | null>(null)
  const navRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const selectedCategorySlug = searchParams.get('category')
  const selectedMainCategory = getCatalogMainCategoryForSlug(selectedCategorySlug) ?? null

  const activeCategory =
    catalogNavigation.find((category) => category.slug === activeMainSlug) ?? null

  useEffect(() => {
    setActiveMainSlug(null)
    setSubmenuLeft(null)
  }, [location.pathname, location.search])

  const openCategory = (buttonElement: HTMLButtonElement, slug: string) => {
    const navElement = navRef.current

    if (navElement) {
      const navRect = navElement.getBoundingClientRect()
      const buttonRect = buttonElement.getBoundingClientRect()
      const centerX = buttonRect.left - navRect.left + buttonRect.width / 2
      setSubmenuLeft(centerX)
    }

    setActiveMainSlug(slug)
  }

  return (
    <div
      ref={navRef}
      className="relative mt-4 hidden lg:block"
      onMouseLeave={() => {
        setActiveMainSlug(null)
        setSubmenuLeft(null)
      }}
    >
      <div className="rounded-[28px] border border-slate-200 bg-white/95 px-4 py-2.5 shadow-sm shadow-slate-950/5">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center bg-gradient-to-r from-white via-white/95 to-transparent pr-4">
            <ChevronLeft className="h-4 w-4 text-slate-300" />
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center bg-gradient-to-l from-white via-white/95 to-transparent pl-4 text-slate-400">
            <ChevronRight className="h-4 w-4" />
          </div>
          <div className="scrollbar-hidden flex items-center gap-2 overflow-x-auto px-6 pb-0.5">
            {catalogNavigation.map((category) => {
              const isActive = activeMainSlug === category.slug
              const isSelected = selectedMainCategory?.slug === category.slug

              return (
                <button
                  key={category.slug}
                  type="button"
                  onMouseEnter={(event) => openCategory(event.currentTarget, category.slug)}
                  onFocus={(event) => openCategory(event.currentTarget, category.slug)}
                  onClick={() => navigate(buildProductsUrl(category.slug))}
                  className={cn(
                    'whitespace-nowrap rounded-full border-b-2 px-4 py-2 text-sm font-semibold transition',
                    isSelected
                      ? 'border-brand-600 bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                    isActive && !isSelected ? 'bg-brand-50 text-brand-700' : null,
                  )}
                >
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {activeCategory ? (
        <div
          className="absolute top-[calc(100%+0.75rem)] z-20 max-h-[70vh] w-fit max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)]"
          style={{
            left: submenuLeft !== null ? `${submenuLeft}px` : '0px',
            transform: submenuLeft !== null ? 'translateX(-50%)' : 'none',
          }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                {activeCategory.name}
              </h3>
            </div>

            <div className="grid grid-flow-col grid-rows-5 auto-cols-max items-start gap-x-10 gap-y-1">
              {activeCategory.children.map((child) => {
                const isSelected = selectedCategorySlug === child.slug

                return (
                  <Link
                    key={child.slug}
                    to={buildProductsUrl(child.slug)}
                    className={cn(
                      'inline-flex whitespace-nowrap border-b-2 px-1 py-0.5 text-[13px] font-medium transition',
                      isSelected
                        ? 'border-brand-600 text-brand-700'
                        : 'border-transparent text-slate-700 hover:border-slate-300 hover:text-brand-700',
                    )} 
                  >
                    {child.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
