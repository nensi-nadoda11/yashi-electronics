import { ChevronRight, Heart, LogOut, Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { useCart } from '../../features/cart/useCart'
import { useWishlist } from '../../features/wishlist/useWishlist'
import { catalogNavigation } from '../../data/catalog-navigation'
import { cn } from '../../utils/cn'
import { CategoryNavigationBar } from './CategoryNavigationBar'
import { Container } from '../ui/Container'
import { buttonStyles } from '../ui/button-styles'
import { quickLinks } from '../../data/mock-data'

const primaryNavLinks = quickLinks.filter((link) => ['Home', 'Products'].includes(link.label))
const authenticatedUtilityLinks = quickLinks.filter((link) =>
  ['Wishlist', 'Cart', 'Orders'].includes(link.label),
)

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-semibold transition hover:text-brand-700',
    isActive ? 'text-brand-700' : 'text-slate-600',
  )

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { customer, isAuthenticated, logout } = useAuth()
  const { count: cartCount } = useCart()
  const { count } = useWishlist()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState(
    location.pathname === '/products' ? searchParams.get('search') ?? '' : '',
  )
  const searchTimeoutRef = useRef<number | null>(null)
  const mobileNavLinks = isAuthenticated
    ? [...primaryNavLinks, ...authenticatedUtilityLinks]
    : primaryNavLinks

  useEffect(() => {
    if (location.pathname !== '/products') {
      return
    }

    setSearchText(searchParams.get('search') ?? '')
  }, [location.pathname, searchParams])

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current !== null) {
        window.clearTimeout(searchTimeoutRef.current)
        searchTimeoutRef.current = null
      }
    }
  }, [location.pathname])

  const firstName = customer?.fullName.trim().split(/\s+/)[0] ?? 'Profile'

  const handleSearchChange = (value: string) => {
    setSearchText(value)

    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      const nextSearch = value.trim()
      const targetUrl = nextSearch ? `/products?search=${encodeURIComponent(nextSearch)}` : '/products'

      navigate(targetUrl, { replace: true })
      setMobileOpen(false)
      searchTimeoutRef.current = null
    }, 150)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      await logout()
      setMobileOpen(false)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <Container className="py-3">
        <div className="flex items-center gap-3 lg:gap-6">
          <Link to="/" className="shrink-0">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-950 text-sm font-bold text-white">
                YE
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
                  Yashi
                </p>
                <p className="text-base font-bold text-slate-950">
                  Electronics
                </p>
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {primaryNavLinks.map((link) => (
              <NavLink key={link.label} to={link.href} className={navLinkClass} end={link.href === '/'}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden flex-1 lg:block">
            <label className="flex h-12 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 transition focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-100">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search smartphones, laptops, audio, appliances..."
                aria-label="Search products"
                value={searchText}
                onChange={(event) => handleSearchChange(event.target.value)}
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            {isAuthenticated ? (
              <>
                <NavLink to="/wishlist" className={buttonStyles('ghost', 'sm')}>
                  <Heart className="h-4 w-4" />
                  Wishlist
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                    {count}
                  </span>
                </NavLink>
                <NavLink to="/cart" className={buttonStyles('ghost', 'sm')}>
                  <ShoppingCart className="h-4 w-4" />
                  Cart
                  <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                    {cartCount}
                  </span>
                </NavLink>
                <NavLink to="/orders" className={buttonStyles('ghost', 'sm')}>
                  Orders
                </NavLink>
                <NavLink to="/profile" className={buttonStyles('ghost', 'sm')}>
                  <User className="h-4 w-4" />
                  {firstName}
                </NavLink>
                <button
                  type="button"
                  className={buttonStyles('outline', 'sm')}
                  onClick={() => void handleLogout()}
                  disabled={isLoggingOut}
                >
                  <LogOut className="h-4 w-4" />
                  {isLoggingOut ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={buttonStyles('outline', 'sm')}>
                  Login
                </NavLink>
                <NavLink to="/register" className={buttonStyles('secondary', 'sm')}>
                  Register
                </NavLink>
              </>
            )}
          </div>

          <button
            type="button"
            className="ml-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700 lg:hidden"
            aria-label="Toggle navigation"
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <CategoryNavigationBar />

        <div
          className={cn(
            'grid overflow-hidden transition-all duration-300 lg:hidden',
            mobileOpen ? 'grid-rows-[1fr] pt-4 opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="min-h-0">
            <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-lg shadow-slate-950/5">
              <label className="flex h-12 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  placeholder="Search products"
                  aria-label="Search products"
                  value={searchText}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>
              <nav className="grid gap-2">
                {mobileNavLinks.map((link) => (
                  <NavLink
                    key={link.label}
                    to={link.href}
                    className={({ isActive }) =>
                      cn(
                        'rounded-2xl px-4 py-3 text-sm font-semibold transition',
                        isActive
                          ? 'bg-brand-50 text-brand-700'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950',
                      )
                    }
                    end={link.href === '/'}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-2">
                  {catalogNavigation.map((mainCategory) => (
                    <details
                      key={mainCategory.slug}
                      className="group rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-slate-700 [&::-webkit-details-marker]:hidden">
                        <span>{mainCategory.name}</span>
                        <ChevronRight className="h-4 w-4 shrink-0 transition group-open:rotate-90" />
                      </summary>
                      <div className="mt-3 grid gap-2 border-t border-slate-100 pt-3">
                        {mainCategory.children.map((subCategory) => (
                          <Link
                            key={subCategory.slug}
                            to={`/products?category=${encodeURIComponent(subCategory.slug)}`}
                            className="rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            onClick={() => setMobileOpen(false)}
                          >
                            {subCategory.name}
                          </Link>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      className={buttonStyles('ghost', 'md')}
                      onClick={() => setMobileOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      {firstName}
                    </Link>
                    <button
                      type="button"
                      className={buttonStyles('outline', 'md')}
                      onClick={() => void handleLogout()}
                      disabled={isLoggingOut}
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className={buttonStyles('outline', 'md')}
                      onClick={() => setMobileOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className={buttonStyles('secondary', 'md')}
                      onClick={() => setMobileOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </header>
  )
}
