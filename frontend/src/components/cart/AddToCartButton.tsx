import { LoaderCircle, ShoppingCart } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/useAuth'
import { useCart } from '../../features/cart/useCart'
import { cn } from '../../utils/cn'
import { Button } from '../ui/Button'
import type { ButtonVariant } from '../ui/button-styles'

interface AddToCartButtonProps {
  productId: string | number
  stockQuantity: number
  quantity?: number
  variant?: ButtonVariant
  className?: string
  disabled?: boolean
}

export function AddToCartButton({
  productId,
  stockQuantity,
  quantity = 1,
  variant = 'secondary',
  className,
  disabled = false,
}: AddToCartButtonProps) {
  const cartProductId = String(productId)
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { addItem, isProductPending } = useCart()

  const isOutOfStock = stockQuantity <= 0
  const isPending = isProductPending(cartProductId)

  const handleClick = async () => {
    if (disabled || isOutOfStock || isPending) {
      return
    }

    if (!isAuthenticated) {
      const redirectPath = `${location.pathname}${location.search}${location.hash}`
      navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`)
      return
    }

    await addItem(cartProductId, quantity)
  }

  return (
    <Button
      type="button"
      variant={variant}
      disabled={disabled || isOutOfStock || isPending}
      onClick={() => void handleClick()}
      aria-label={isOutOfStock ? 'Out of Stock' : isPending ? 'Adding to cart' : 'Add to Cart'}
      title={isOutOfStock ? 'Out of Stock' : isPending ? 'Adding to cart' : 'Add to Cart'}
      className={cn(className)}
    >
      {isPending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
    </Button>
  )
}
