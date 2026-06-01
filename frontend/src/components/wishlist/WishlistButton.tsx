import { Heart, LoaderCircle } from 'lucide-react'
import type { MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { useWishlist } from '../../features/wishlist/useWishlist'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'

type WishlistButtonProps = {
  productId: string
  variant?: 'icon' | 'button'
  className?: string
  disabled?: boolean
}

export function WishlistButton({
  productId,
  variant = 'icon',
  className,
  disabled = false,
}: WishlistButtonProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const { isWishlisted, isUpdating, toggleWishlistItem } = useWishlist()

  const wishlisted = isWishlisted(productId)
  const loading = isUpdating(productId)
  const label = wishlisted ? 'Remove from wishlist' : 'Add to wishlist'
  const isDisabled = disabled || isAuthLoading || loading

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (isDisabled) {
      return
    }

    if (!isAuthenticated) {
      const redirectPath = `${location.pathname}${location.search}${location.hash}`
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`)
      return
    }

    try {
      await toggleWishlistItem(productId)
    } catch {
      // Shared state already captures the error.
    }
  }

  const icon = loading ? (
    <LoaderCircle className="h-4 w-4 animate-spin" />
  ) : (
    <Heart className={cn('h-4 w-4', wishlisted ? 'fill-current' : '')} />
  )

  if (variant === 'button') {
    return (
      <Button
        type="button"
        variant={wishlisted ? 'secondary' : 'outline'}
        size="lg"
        aria-label={label}
        aria-pressed={wishlisted}
        title={label}
        className={className}
        disabled={isDisabled}
        onClick={(event) => {
          void handleClick(event)
        }}
      >
        {icon}
        {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </Button>
    )
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={wishlisted}
      title={label}
      disabled={isDisabled}
      onClick={(event) => {
        void handleClick(event)
      }}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/90 p-0 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 disabled:pointer-events-none disabled:opacity-60',
        wishlisted
          ? 'border-rose-200 text-rose-500'
          : 'border-white/70 text-slate-600 hover:text-rose-500',
        className,
      )}
    >
      {icon}
    </button>
  )
}
