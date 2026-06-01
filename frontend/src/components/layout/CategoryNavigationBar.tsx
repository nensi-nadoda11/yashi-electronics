import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { catalogNavigation } from '../../data/catalog-navigation'
import { cn } from '../../utils/cn'

const buildProductsUrl = (slug: string) => `/products?category=${encodeURIComponent(slug)}`

export function CategoryNavigationBar() {
  const [activeMainSlug, setActiveMainSlug] = useState<string | null>(null)
  const [submenuLeft, setSubmenuLeft] = useState<number | null>(null)
  const navRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

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
        <div className="scrollbar-light flex items-center gap-2 overflow-x-auto pb-0.5">
          {catalogNavigation.map((category) => {
            const isActive = activeMainSlug === category.slug

            return (
              <button
                key={category.slug}
                type="button"
                onMouseEnter={(event) => openCategory(event.currentTarget, category.slug)}
                onFocus={(event) => openCategory(event.currentTarget, category.slug)}
                onClick={() => navigate(buildProductsUrl(category.slug))}
                className={cn(
                  'whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                )}
              >
                {category.name}
              </button>
            )
          })}
        </div>
      </div>

      {activeCategory ? (
        <div
          className="absolute top-[calc(100%+0.75rem)] z-20 max-h-[70vh] w-fit max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[28px] border border-slate-200 bg-white p-3 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)]"
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
              {activeCategory.children.map((child) => (
                <Link
                  key={child.slug}
                  to={buildProductsUrl(child.slug)}
                  className="whitespace-nowrap px-1 py-0.5 text-[13px] font-medium text-slate-700 transition hover:text-brand-700"
                >
                  {child.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
