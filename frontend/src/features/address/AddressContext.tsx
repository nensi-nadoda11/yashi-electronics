import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getApiErrorMessage } from '../../lib/api-client'
import { useAuth } from '../auth/useAuth'
import {
  createAddress as createAddressRequest,
  deleteAddress as deleteAddressRequest,
  getAddresses,
  setDefaultAddress as setDefaultAddressRequest,
  updateAddress as updateAddressRequest,
} from './address.api'
import type { Address, AddressContextState, AddressUpsertPayload } from './address.types'

type AddressContextValue = AddressContextState & {
  fetchAddresses: () => Promise<void>
  addAddress: (payload: AddressUpsertPayload) => Promise<Address>
  editAddress: (addressId: string, payload: AddressUpsertPayload) => Promise<Address>
  removeAddress: (addressId: string) => Promise<void>
  setDefault: (addressId: string) => Promise<Address>
  selectAddress: (addressId: string) => void
  clearAddressState: () => void
}

const initialState: AddressContextState = {
  addresses: [],
  selectedAddress: null,
  defaultAddress: null,
  count: 0,
  loading: false,
  error: null,
  isMutating: false,
}

export const AddressContext = createContext<AddressContextValue | undefined>(undefined)

export function AddressProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>(initialState.addresses)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [count, setCount] = useState(initialState.count)
  const [loading, setLoading] = useState(initialState.loading)
  const [error, setError] = useState<string | null>(initialState.error)
  const [isMutating, setIsMutating] = useState(initialState.isMutating)
  const isAuthenticatedRef = useRef(isAuthenticated)
  const selectedAddressIdRef = useRef<string | null>(selectedAddressId)

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated
  }, [isAuthenticated])

  useEffect(() => {
    selectedAddressIdRef.current = selectedAddressId
  }, [selectedAddressId])

  const clearAddressState = useCallback(() => {
    setAddresses([])
    setSelectedAddressId(null)
    selectedAddressIdRef.current = null
    setCount(0)
    setLoading(false)
    setError(null)
    setIsMutating(false)
  }, [])

  const applyAddresses = useCallback((nextAddresses: Address[]) => {
    setAddresses(nextAddresses)
    setCount(nextAddresses.length)
    setError(null)
    setSelectedAddressId((currentSelectedAddressId) => {
      if (currentSelectedAddressId && nextAddresses.some((address) => address.id === currentSelectedAddressId)) {
        return currentSelectedAddressId
      }

      return nextAddresses.find((address) => address.isDefault)?.id ?? nextAddresses[0]?.id ?? null
    })
  }, [])

  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticatedRef.current) {
      clearAddressState()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getAddresses()

      if (!isAuthenticatedRef.current) {
        return
      }

      applyAddresses(data.addresses)
    } catch (requestError) {
      if (isAuthenticatedRef.current) {
        setError(getApiErrorMessage(requestError))
      }
    } finally {
      if (isAuthenticatedRef.current) {
        setLoading(false)
      }
    }
  }, [applyAddresses, clearAddressState])

  const addAddress = useCallback(
    async (payload: AddressUpsertPayload) => {
      if (!isAuthenticatedRef.current || isMutating) {
        throw new Error('Unable to save address right now')
      }

      setIsMutating(true)
      setError(null)

      try {
        const address = await createAddressRequest(payload)
        const shouldFocusNewAddress =
          address.isDefault || selectedAddressIdRef.current === null

        await fetchAddresses()

        if (shouldFocusNewAddress) {
          setSelectedAddressId(address.id)
        }

        return address
      } catch (requestError) {
        setError(getApiErrorMessage(requestError))
        throw requestError
      } finally {
        setIsMutating(false)
      }
    },
    [fetchAddresses, isMutating],
  )

  const editAddress = useCallback(
    async (addressId: string, payload: AddressUpsertPayload) => {
      if (!isAuthenticatedRef.current || isMutating) {
        throw new Error('Unable to update address right now')
      }

      setIsMutating(true)
      setError(null)

      try {
        const address = await updateAddressRequest(addressId, payload)
        const shouldFocusEditedAddress =
          payload.isDefault === true || selectedAddressIdRef.current === null

        await fetchAddresses()

        if (shouldFocusEditedAddress) {
          setSelectedAddressId(address.id)
        }

        return address
      } catch (requestError) {
        setError(getApiErrorMessage(requestError))
        throw requestError
      } finally {
        setIsMutating(false)
      }
    },
    [fetchAddresses, isMutating],
  )

  const removeAddress = useCallback(
    async (addressId: string) => {
      if (!isAuthenticatedRef.current || isMutating) {
        throw new Error('Unable to delete address right now')
      }

      setIsMutating(true)
      setError(null)

      try {
        await deleteAddressRequest(addressId)
        await fetchAddresses()
      } catch (requestError) {
        setError(getApiErrorMessage(requestError))
        throw requestError
      } finally {
        setIsMutating(false)
      }
    },
    [fetchAddresses, isMutating],
  )

  const setDefault = useCallback(
    async (addressId: string) => {
      if (!isAuthenticatedRef.current || isMutating) {
        throw new Error('Unable to update default address right now')
      }

      setIsMutating(true)
      setError(null)

      try {
        const address = await setDefaultAddressRequest(addressId)
        await fetchAddresses()
        setSelectedAddressId(address.id)
        return address
      } catch (requestError) {
        setError(getApiErrorMessage(requestError))
        throw requestError
      } finally {
        setIsMutating(false)
      }
    },
    [fetchAddresses, isMutating],
  )

  useEffect(() => {
    if (isAuthLoading) {
      return
    }

    if (isAuthenticated) {
      void fetchAddresses()
      return
    }

    clearAddressState()
  }, [clearAddressState, fetchAddresses, isAuthLoading, isAuthenticated])

  const defaultAddress = useMemo(
    () => addresses.find((address) => address.isDefault) ?? null,
    [addresses],
  )

  const selectedAddress = useMemo(() => {
    if (selectedAddressId) {
      return addresses.find((address) => address.id === selectedAddressId) ?? null
    }

    return defaultAddress ?? addresses[0] ?? null
  }, [addresses, defaultAddress, selectedAddressId])

  const value = useMemo<AddressContextValue>(
    () => ({
      addresses,
      selectedAddress,
      defaultAddress,
      count,
      loading,
      error,
      isMutating,
      fetchAddresses,
      addAddress,
      editAddress,
      removeAddress,
      setDefault,
      selectAddress: setSelectedAddressId,
      clearAddressState,
    }),
    [
      addAddress,
      addresses,
      clearAddressState,
      count,
      defaultAddress,
      editAddress,
      error,
      fetchAddresses,
      isMutating,
      loading,
      removeAddress,
      selectedAddress,
      setDefault,
    ],
  )

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>
}
