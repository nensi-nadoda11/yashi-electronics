import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { getApiErrorMessage } from '../../lib/api-client'
import {
  getWishlist,
  getWishlistStatus,
  removeFromWishlist,
  toggleWishlist,
} from './wishlist.api'
import type { WishlistItem } from './wishlist.types'

type WishlistContextValue = {
  items: WishlistItem[]
  wishlistProductIds: string[]
  count: number
  isLoading: boolean
  error: string | null
  fetchWishlist: () => Promise<void>
  toggleWishlistItem: (productId: string) => Promise<boolean>
  removeWishlistItem: (productId: string) => Promise<void>
  isWishlisted: (productId: string) => boolean
  isUpdating: (productId: string) => boolean
  refreshWishlistStatus: (productIds: string[]) => Promise<void>
  clearWishlist: () => void
}

export const WishlistContext = createContext<WishlistContextValue | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([])
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingProductIds, setPendingProductIds] = useState<string[]>([])
  const isAuthenticatedRef = useRef(isAuthenticated)
  const pendingProductIdsRef = useRef(new Set<string>())

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated
  }, [isAuthenticated])

  const clearWishlist = useCallback(() => {
    setItems([])
    setWishlistProductIds([])
    setCount(0)
    setError(null)
    pendingProductIdsRef.current.clear()
    setPendingProductIds([])
  }, [])

  const setPendingState = useCallback((productId: string, isPending: boolean) => {
    if (isPending) {
      pendingProductIdsRef.current.add(productId)
    } else {
      pendingProductIdsRef.current.delete(productId)
    }

    setPendingProductIds([...pendingProductIdsRef.current])
  }, [])

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticatedRef.current) {
      clearWishlist()
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await getWishlist()

      if (!isAuthenticatedRef.current) {
        return
      }

      setItems(data.items)
      setWishlistProductIds(data.items.map((item) => item.product.id))
      setCount(data.count)
    } catch (requestError) {
      if (!isAuthenticatedRef.current) {
        return
      }

      clearWishlist()
      setError(getApiErrorMessage(requestError))
    } finally {
      if (isAuthenticatedRef.current) {
        setIsLoading(false)
      }
    }
  }, [clearWishlist])

  const isWishlisted = useCallback(
    (productId: string) => wishlistProductIds.includes(productId),
    [wishlistProductIds],
  )

  const isUpdating = useCallback(
    (productId: string) => pendingProductIdsRef.current.has(productId),
    [],
  )

  const toggleWishlistItem = useCallback(async (productId: string) => {
    if (!isAuthenticatedRef.current || isUpdating(productId)) {
      return false
    }

    setPendingState(productId, true)
    setError(null)

    try {
      const data = await toggleWishlist(productId)

      setWishlistProductIds((current) => {
        const nextIds = new Set(current)

        if (data.isWishlisted) {
          nextIds.add(productId)
        } else {
          nextIds.delete(productId)
        }

        return [...nextIds]
      })
      setItems((current) =>
        data.isWishlisted
          ? current
          : current.filter((item) => item.product.id !== productId),
      )
      setCount(data.count)

      return data.isWishlisted
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
      throw requestError
    } finally {
      setPendingState(productId, false)
    }
  }, [isUpdating, setPendingState])

  const removeWishlistItem = useCallback(async (productId: string) => {
    if (!isAuthenticatedRef.current || isUpdating(productId)) {
      return
    }

    setPendingState(productId, true)
    setError(null)

    try {
      const data = await removeFromWishlist(productId)

      setItems((current) => current.filter((item) => item.product.id !== productId))
      setWishlistProductIds((current) => current.filter((id) => id !== productId))
      setCount(data.count)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError))
      throw requestError
    } finally {
      setPendingState(productId, false)
    }
  }, [isUpdating, setPendingState])

  const refreshWishlistStatus = useCallback(async (productIds: string[]) => {
    if (!isAuthenticatedRef.current) {
      return
    }

    const normalizedIds = [...new Set(productIds.filter(Boolean))]

    if (normalizedIds.length === 0) {
      return
    }

    try {
      const data = await getWishlistStatus(normalizedIds)

      if (!isAuthenticatedRef.current) {
        return
      }

      setWishlistProductIds((current) => {
        const nextIds = new Set(current)

        normalizedIds.forEach((productId) => {
          nextIds.delete(productId)
        })

        data.productIds.forEach((productId) => {
          nextIds.add(productId)
        })

        return [...nextIds]
      })
    } catch (requestError) {
      if (isAuthenticatedRef.current) {
        setError(getApiErrorMessage(requestError))
      }
    }
  }, [])

  useEffect(() => {
    if (isAuthLoading) {
      return
    }

    if (isAuthenticated) {
      void fetchWishlist()
      return
    }

    clearWishlist()
    setIsLoading(false)
  }, [isAuthenticated, isAuthLoading])

  const value = useMemo<WishlistContextValue>(
    () => ({
      items,
      wishlistProductIds,
      count,
      isLoading,
      error,
      fetchWishlist,
      toggleWishlistItem,
      removeWishlistItem,
      isWishlisted,
      isUpdating,
      refreshWishlistStatus,
      clearWishlist,
    }),
    [count, error, isLoading, items, pendingProductIds, wishlistProductIds],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
