import type { Address, AddressFormErrors, AddressFormValues, AddressUpsertPayload } from './address.types'

const indianMobileRegex = /^[6-9]\d{9}$/
const indianPincodeRegex = /^\d{6}$/

const normalizeText = (value: string) => value.trim()
const normalizeOptionalText = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export const createEmptyAddressFormValues = (address?: Address | null): AddressFormValues => ({
  fullName: address?.fullName ?? '',
  mobile: address?.mobile ?? '',
  addressLine1: address?.addressLine1 ?? '',
  addressLine2: address?.addressLine2 ?? '',
  city: address?.city ?? '',
  state: address?.state ?? '',
  pincode: address?.pincode ?? '',
  landmark: address?.landmark ?? '',
  isDefault: address?.isDefault ?? false,
})

export const normalizeAddressPayload = (values: AddressFormValues): AddressUpsertPayload => {
  const fullName = normalizeText(values.fullName)
  const mobile = values.mobile.replace(/\D/g, '')
  const addressLine1 = normalizeText(values.addressLine1)
  const addressLine2 = normalizeOptionalText(values.addressLine2)
  const city = normalizeText(values.city)
  const state = normalizeText(values.state)
  const pincode = normalizeText(values.pincode)
  const landmark = normalizeOptionalText(values.landmark)

  return {
    fullName,
    mobile,
    addressLine1,
    ...(addressLine2 ? { addressLine2 } : {}),
    city,
    state,
    pincode,
    ...(landmark ? { landmark } : {}),
    isDefault: values.isDefault,
  }
}

export const validateAddressForm = (values: AddressFormValues) => {
  const payload = normalizeAddressPayload(values)
  const errors: AddressFormErrors = {}

  if (payload.fullName.length < 2) {
    errors.fullName = 'Full name must be at least 2 characters'
  }

  if (!indianMobileRegex.test(payload.mobile)) {
    errors.mobile = 'Please enter a valid 10 digit Indian mobile number'
  }

  if (payload.addressLine1.length === 0) {
    errors.addressLine1 = 'Address line 1 is required'
  }

  if (payload.city.length === 0) {
    errors.city = 'City is required'
  }

  if (payload.state.length === 0) {
    errors.state = 'State is required'
  }

  if (!indianPincodeRegex.test(payload.pincode)) {
    errors.pincode = 'Please enter a valid 6 digit pincode'
  }

  return {
    payload,
    errors,
    isValid: Object.keys(errors).length === 0,
  }
}
