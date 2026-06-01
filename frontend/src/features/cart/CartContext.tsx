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

function buildCartSummary(items: CartItem[], deliveryCharge: number): CartSummary {
  const totals = items.reduce(
    (accumulator, item) => {
      const lineSubtotal = item.product.effectivePrice * item.quantity
      const lineMrpTotal = item.product.mrp * item.quantity
      const lineDiscountAmount = lineMrpTotal - lineSubtotal
      const lineGstAmount = Math.round((lineSubtotal * item.product.gstPercentage) / 100)

      accumulator.mrpTotal += lineMrpTotal
      accumulator.discountAmount += lineDiscountAmount
      accumulator.subtotal += lineSubtotal
      accumulator.gstAmount += lineGstAmount
      accumulator.totalItems += item.quantity

      return accumulator
    },
    {
      mrpTotal: 0,
      discountAmount: 0,
      subtotal: 0,
      gstAmount: 0,
      totalItems: 0,
    },
  )

  return {
    mrpTotal: totals.mrpTotal,
    discountAmount: totals.discountAmount,
    subtotal: totals.subtotal,
    gstAmount: totals.gstAmount,
    deliveryCharge,
    finalAmount: totals.subtotal + totals.gstAmount + deliveryCharge,
    totalItems: totals.totalItems,
  }
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
  const itemsRef = useRef<CartItem[]>([])
  const summaryRef = useRef<CartSummary>(emptySummary)
  const pendingItemRequestCountsRef = useRef(new Map<string, number>())
  const pendingProductIdsRef = useRef(new Set<string>())
  const itemUpdateSequenceRef = useRef(new Map<string, number>())

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated
  }, [isAuthenticated])

  const syncPendingState = useCallback(() => {
    setPendingItemIds(
      [...pendingItemRequestCountsRef.current.entries()]
        .filter(([, requestCount]) => requestCount > 0)
        .map(([itemId]) => itemId),
    )
    setPendingProductIds([...pendingProductIdsRef.current])
    setIsMutating(
      pendingItemRequestCountsRef.current.size > 0 || pendingProductIdsRef.current.size > 0,
    )
  }, [])

  const setPendingItem = useCallback(
    (itemId: string, pending: boolean) => {
      if (pending) {
        const currentCount = pendingItemRequestCountsRef.current.get(itemId) ?? 0
        pendingItemRequestCountsRef.current.set(itemId, currentCount + 1)
      } else {
        const currentCount = pendingItemRequestCountsRef.current.get(itemId) ?? 0

        if (currentCount <= 1) {
          pendingItemRequestCountsRef.current.delete(itemId)
        } else {
          pendingItemRequestCountsRef.current.set(itemId, currentCount - 1)
        }
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
    itemsRef.current = []
    summaryRef.current = emptySummary
    pendingItemRequestCountsRef.current.clear()
    pendingProductIdsRef.current.clear()
    itemUpdateSequenceRef.current.clear()
    setPendingItemIds([])
    setPendingProductIds([])
  }, [])

  const applyCart = useCallback((cart: CartResponse) => {
    setItems(cart.items)
    setSummary(cart.summary)
    setCount(cart.count)
    itemsRef.current = cart.items
    summaryRef.current = cart.summary
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
      if (!isAuthenticatedRef.current) {
        return
      }

      const currentItems = itemsRef.current
      const currentItem = currentItems.find((item) => item.cartItemId === itemId)

      if (!currentItem || currentItem.quantity === quantity) {
        return
      }

      const nextItems = currentItems.map((item) => {
        if (item.cartItemId !== itemId) {
          return item
        }

        const lineTotal = item.product.effectivePrice * quantity
        const lineDiscountAmount = (item.product.mrp - item.product.effectivePrice) * quantity
        const lineGstAmount = Math.round((lineTotal * item.product.gstPercentage) / 100)

        return {
          ...item,
          quantity,
          lineTotal,
          lineDiscountAmount,
          lineGstAmount,
          updatedAt: new Date().toISOString(),
        }
      })

      const nextSummary = buildCartSummary(nextItems, summaryRef.current.deliveryCharge)

      setItems(nextItems)
      setSummary(nextSummary)
      setCount(nextSummary.totalItems)
      itemsRef.current = nextItems
      summaryRef.current = nextSummary

      const requestSequence = (itemUpdateSequenceRef.current.get(itemId) ?? 0) + 1
      itemUpdateSequenceRef.current.set(itemId, requestSequence)
      setPendingItem(itemId, true)
      setError(null)

      try {
        const data = await updateCartItem({ itemId, quantity })

        if (
          isAuthenticatedRef.current &&
          itemUpdateSequenceRef.current.get(itemId) === requestSequence
        ) {
          applyCart(data)
        }
      } catch (requestError) {
        if (
          isAuthenticatedRef.current &&
          itemUpdateSequenceRef.current.get(itemId) === requestSequence
        ) {
          setError(getApiErrorMessage(requestError))
          void fetchCart()
        }
      } finally {
        if (itemUpdateSequenceRef.current.get(itemId) === requestSequence) {
          setPendingItem(itemId, false)
        } else {
          setPendingItem(itemId, false)
        }
      }
    },
    [applyCart, fetchCart, setPendingItem],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      const isPending = (pendingItemRequestCountsRef.current.get(itemId) ?? 0) > 0

      if (!isAuthenticatedRef.current || isPending) {
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
        pendingItemRequestCountsRef.current.size > 0 || pendingProductIdsRef.current.size > 0,
      )
    }
  }, [applyCart, isMutating])

  const isItemPending = useCallback(
    (itemId: string) => (pendingItemRequestCountsRef.current.get(itemId) ?? 0) > 0,
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
