import { Heart, Menu, Search, ShoppingCart, User, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { cartItems, quickLinks, wishlistItems } from '../../data/mock-data'
import { useAuth } from '../../features/auth/useAuth'
import { cn } from '../../utils/cn'
import { Container } from '../ui/Container'
import { buttonStyles } from '../ui/button-styles'

const navLinks = quickLinks.filter((link) =>
  ['Home', 'Products', 'Wishlist', 'Cart', 'Orders'].includes(link.label),
)

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-semibold transition hover:text-brand-700',
    isActive ? 'text-brand-700' : 'text-slate-600',
  )

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { customer, isAuthenticated, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const firstName = customer?.fullName.trim().split(/\s+/)[0] ?? 'Profile'

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
            {navLinks.map((link) => (
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
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
          </div>

          <div className="ml-auto hidden items-center gap-2 lg:flex">
            <NavLink to="/wishlist" className={buttonStyles('ghost', 'sm')}>
              <Heart className="h-4 w-4" />
              Wishlist
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                {wishlistItems.length}
              </span>
            </NavLink>
            <NavLink to="/cart" className={buttonStyles('ghost', 'sm')}>
              <ShoppingCart className="h-4 w-4" />
              Cart
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-bold text-brand-700">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </NavLink>
            {isAuthenticated ? (
              <>
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
                  className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />
              </label>
              <nav className="grid gap-2">
                {navLinks.map((link) => (
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
