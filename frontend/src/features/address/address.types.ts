export type Address = {
  id: string
  customerId: string
  fullName: string
  mobile: string
  addressLine1: string
  addressLine2: string | null
  city: string
  state: string
  pincode: string
  landmark: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export type AddressListResponse = {
  addresses: Address[]
  count: number
}

export type AddressResponse = {
  address: Address
}

export type AddressUpsertPayload = {
  fullName: string
  mobile: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  landmark?: string
  isDefault?: boolean
}

export type AddressFormValues = {
  fullName: string
  mobile: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  pincode: string
  landmark: string
  isDefault: boolean
}

export type AddressFormErrors = Partial<Record<keyof AddressFormValues, string | undefined>>

export type AddressContextState = {
  addresses: Address[]
  selectedAddress: Address | null
  defaultAddress: Address | null
  count: number
  loading: boolean
  error: string | null
  isMutating: boolean
}
