import type { ReactNode } from 'react'
import { createContext, useEffect, useMemo, useState } from 'react'
import { AxiosError } from 'axios'
import { setUnauthorizedHandler } from '../../lib/api-client'
import {
  getCurrentSession,
  loginCustomer as loginCustomerRequest,
  logoutCustomer as logoutCustomerRequest,
  registerCustomer as registerCustomerRequest,
} from './auth.api'
import type {
  AuthState,
  Customer,
  LoginCustomerPayload,
  RegisterCustomerPayload,
} from './auth.types'

type AuthContextValue = AuthState & {
  login: (payload: LoginCustomerPayload) => Promise<Customer>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  register: (payload: RegisterCustomerPayload) => Promise<Customer>
}

const initialState: AuthState = {
  customer: null,
  isAuthenticated: false,
  isLoading: true,
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialState)

  const clearAuthState = () => {
    setAuthState({
      customer: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const applyCustomer = (customer: Customer) => {
    setAuthState({
      customer,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  const refreshSession = async () => {
    try {
      const response = await getCurrentSession()

      if (response.success && response.data?.customer) {
        applyCustomer(response.data.customer)
        return
      }

      clearAuthState()
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        clearAuthState()
        return
      }

      clearAuthState()
    }
  }

  useEffect(() => {
    setUnauthorizedHandler(clearAuthState)
    void refreshSession()

    return () => {
      setUnauthorizedHandler(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...authState,
      async login(payload) {
        const response = await loginCustomerRequest(payload)

        if (!response.success || !response.data?.customer) {
          throw new Error(response.message)
        }

        applyCustomer(response.data.customer)
        return response.data.customer
      },
      async register(payload) {
        const response = await registerCustomerRequest(payload)

        if (!response.success || !response.data?.customer) {
          throw new Error(response.message)
        }

        applyCustomer(response.data.customer)
        return response.data.customer
      },
      async logout() {
        try {
          await logoutCustomerRequest()
        } finally {
          clearAuthState()
        }
      },
      refreshSession,
    }),
    [authState],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
