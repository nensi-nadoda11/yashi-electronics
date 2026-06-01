export type CustomerAddress = {
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
  addresses: CustomerAddress[]
  count: number
}

export type AddressResponse = {
  address: CustomerAddress
}

export type CreateAddressInput = {
  customerId: string
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

export type UpdateAddressInput = CreateAddressInput & {
  addressId: string
}

export type DeleteAddressInput = {
  customerId: string
  addressId: string
}

export type SetDefaultAddressInput = DeleteAddressInput
