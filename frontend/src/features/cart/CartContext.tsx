import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getApiErrorMessage } from '../../lib/api-client'
import { useAuth } from '../auth/useAuth'
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from './cart.api'
import type { CartItem, CartResponse, CartSummary } from './cart.types'

type CartContextValue = {
  items: CartItem[]
  summary: CartSummary
  count: number
  isLoading: boolean
  isMutating: boolean
  error: string | null
  fetchCart: () => Promise<void>
  addItem: (productId: string, quantity: number) => Promise<void>
  updateItemQuantity: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCartItems: () => Promise<void>
  clearCartState: () => void
  isItemPending: (itemId: string) => boolean
  isProductPending: (productId: string) => boolean
}

const emptySummary: CartSummary = {
  mrpTotal: 0,
  discountAmount: 0,
  subtotal: 0,
  gstAmount: 0,
  deliveryCharge: 0,
  finalAmount: 0,
  totalItems: 0,
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [summary, setSummary] = useState<CartSummary>(emptySummary)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isMutating, setIsMutating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingItemIds, setPendingItemIds] = useState<string[]>([])
  const [pendingProductIds, setPendingProductIds] = useState<string[]>([])
  const isAuthenticatedRef = useRef(isAuthenticated)
  const pendingItemIdsRef = useRef(new Set<string>())
  const pendingProductIdsRef = useRef(new Set<string>())

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated
  }, [isAuthenticated])

  const syncPendingState = useCallback(() => {
    setPendingItemIds([...pendingItemIdsRef.current])
    setPendingProductIds([...pendingProductIdsRef.current])
    setIsMutating(
      pendingItemIdsRef.current.size > 0 || pendingProductIdsRef.current.size > 0,
    )
  }, [])

  const setPendingItem = useCallback(
    (itemId: string, pending: boolean) => {
      if (pending) {
        pendingItemIdsRef.current.add(itemId)
      } else {
        pendingItemIdsRef.current.delete(itemId)
      }

      syncPendingState()
    },
    [syncPendingState],
  )

  const setPendingProduct = useCallback(
    (productId: string, pending: boolean) => {
      if (pending) {
        pendingProductIdsRef.current.add(productId)
      } else {
        pendingProductIdsRef.current.delete(productId)
      }

      syncPendingState()
    },
    [syncPendingState],
  )

  const clearCartState = useCallback(() => {
    setItems([])
    setSummary(emptySummary)
    setCount(0)
    setError(null)
    setIsLoading(false)
    setIsMutating(false)
    pendingItemIdsRef.current.clear()
    pendingProductIdsRef.current.clear()
    setPendingItemIds([])
    setPendingProductIds([])
  }, [])

  const applyCart = useCallback((cart: CartResponse) => {
    setItems(cart.items)
    setSummary(cart.summary)
    setCount(cart.count)
  }, [])

  const fetchCart = useCallback(async () => {
    if (!isAuthenticatedRef.current) {
      clearCartState()
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await getCart()

      if (!isAuthenticatedRef.current) {
        return
      }

      applyCart(data)
    } catch (requestError) {
      if (!isAuthenticatedRef.current) {
        return
      }

      clearCartState()
      setError(getApiErrorMessage(requestError))
    } finally {
      if (isAuthenticatedRef.current) {
        setIsLoading(false)
      }
    }
  }, [applyCart, clearCartState])

  const addItem = useCallback(
    async (productId: string, quantity: number) => {
      if (!isAuthenticatedRef.current || pendingProductIdsRef.current.has(productId)) {
        return
      }

      setPendingProduct(productId, true)
      setError(null)

      try {
        const data = await addToCart({ productId, quantity })

        if (isAuthenticatedRef.current) {
          applyCart(data)
        }
      } catch (requestError) {
        setError(getApiErrorMessage(requestError))
      } finally {
        setPendingProduct(productId, false)
      }
    },
    [applyCart, setPendingProduct],
  )

  const updateItemQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      if (!isAuthenticatedRef.current || pendingItemIdsRef.current.has(itemId)) {
        return
      }

      setPendingItem(itemId, true)
      setError(null)

      try {
        const data = await updateCartItem({ itemId, quantity })

        if (isAuthenticatedRef.current) {
          applyCart(data)
        }
      } catch (requestError) {
        setError(getApiErrorMessage(requestError))
      } finally {
        setPendingItem(itemId, false)
      }
    },
    [applyCart, setPendingItem],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      if (!isAuthenticatedRef.current || pendingItemIdsRef.current.has(itemId)) {
        return
      }

      setPendingItem(itemId, true)
      setError(null)

      try {
        const data = await removeCartItem(itemId)

        if (isAuthenticatedRef.current) {
          applyCart(data)
        }
      } catch (requestError) {
        setError(getApiErrorMessage(requestError))
      } finally {
        setPendingItem(itemId, false)
      }
    },
    [applyCart, setPendingItem],
  )

  const clearCartItems = useCallback(async () => {
    if (!isAuthenticatedRef.current || isMutating) {
      return
    }

    setIsMutating(true)
    setError(null)

    try {
      const data = await clearCart()

      if (isAuthenticatedRef.current) {
        applyCart(data)
      }
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
    } finally {
      setIsMutating(
        pendingItemIdsRef.current.size > 0 || pendingProductIdsRef.current.size > 0,
      )
    }
  }, [applyCart, isMutating])

  const isItemPending = useCallback(
    (itemId: string) => pendingItemIdsRef.current.has(itemId),
    [],
  )

  const isProductPending = useCallback(
    (productId: string) => pendingProductIdsRef.current.has(productId),
    [],
  )

  useEffect(() => {
    if (isAuthLoading) {
      return
    }

    if (isAuthenticated) {
      void fetchCart()
      return
    }

    clearCartState()
  }, [isAuthenticated, isAuthLoading, fetchCart, clearCartState])

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      summary,
      count,
      isLoading,
      isMutating,
      error,
      fetchCart,
      addItem,
      updateItemQuantity,
      removeItem,
      clearCartItems,
      clearCartState,
      isItemPending,
      isProductPending,
    }),
    [
      addItem,
      clearCartItems,
      clearCartState,
      count,
      error,
      fetchCart,
      isItemPending,
      isLoading,
      isMutating,
      isProductPending,
      pendingItemIds,
      pendingProductIds,
      items,
      removeItem,
      summary,
      updateItemQuantity,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
