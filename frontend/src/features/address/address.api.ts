import { apiClient } from '../../lib/api-client'
import type { ApiResponse } from '../../types/api'
import type {
  AddressListResponse,
  AddressResponse,
  AddressUpsertPayload,
} from './address.types'

export async function getAddresses() {
  const response = await apiClient.get<ApiResponse<AddressListResponse>>('/addresses')

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch addresses')
  }

  return response.data.data
}

export async function getAddressById(addressId: string) {
  const response = await apiClient.get<ApiResponse<AddressResponse>>(`/addresses/${addressId}`)

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to fetch address')
  }

  return response.data.data.address
}

export async function createAddress(payload: AddressUpsertPayload) {
  const response = await apiClient.post<ApiResponse<AddressResponse>>('/addresses', payload)

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to save address')
  }

  return response.data.data.address
}

export async function updateAddress(addressId: string, payload: AddressUpsertPayload) {
  const response = await apiClient.patch<ApiResponse<AddressResponse>>(
    `/addresses/${addressId}`,
    payload,
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to update address')
  }

  return response.data.data.address
}

export async function deleteAddress(addressId: string) {
  const response = await apiClient.delete<ApiResponse<undefined>>(`/addresses/${addressId}`)

  if (!response.data.success) {
    throw new Error(response.data.message || 'Unable to delete address')
  }
}

export async function setDefaultAddress(addressId: string) {
  const response = await apiClient.patch<ApiResponse<AddressResponse>>(
    `/addresses/${addressId}/default`,
  )

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.message || 'Unable to set default address')
  }

  return response.data.data.address
}
