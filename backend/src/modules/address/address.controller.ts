import type { RequestHandler } from 'express'
import { asyncHandler } from '../../utils/async-handler'
import { successResponse } from '../../utils/api-response'
import { addressService } from './address.service'

export const getAddressesController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await addressService.getCustomerAddresses(request.customer!.id)
  response.status(200).json(successResponse('Addresses fetched successfully', data))
})

export const getAddressController: RequestHandler = asyncHandler(async (request, response) => {
  const addressId = typeof request.params.addressId === 'string' ? request.params.addressId : ''
  const data = await addressService.getCustomerAddressById(request.customer!.id, addressId)
  response.status(200).json(successResponse('Address fetched successfully', data))
})

export const createAddressController: RequestHandler = asyncHandler(async (request, response) => {
  const data = await addressService.createAddress({
    customerId: request.customer!.id,
    fullName: request.body.fullName,
    mobile: request.body.mobile,
    addressLine1: request.body.addressLine1,
    addressLine2: request.body.addressLine2,
    city: request.body.city,
    state: request.body.state,
    pincode: request.body.pincode,
    landmark: request.body.landmark,
    isDefault: request.body.isDefault,
  })

  response.status(201).json(successResponse('Address created successfully', data))
})

export const updateAddressController: RequestHandler = asyncHandler(async (request, response) => {
  const addressId = typeof request.params.addressId === 'string' ? request.params.addressId : ''
  const data = await addressService.updateAddress({
    customerId: request.customer!.id,
    addressId,
    fullName: request.body.fullName,
    mobile: request.body.mobile,
    addressLine1: request.body.addressLine1,
    addressLine2: request.body.addressLine2,
    city: request.body.city,
    state: request.body.state,
    pincode: request.body.pincode,
    landmark: request.body.landmark,
    isDefault: request.body.isDefault,
  })

  response.status(200).json(successResponse('Address updated successfully', data))
})

export const deleteAddressController: RequestHandler = asyncHandler(async (request, response) => {
  const addressId = typeof request.params.addressId === 'string' ? request.params.addressId : ''
  await addressService.deleteAddress({
    customerId: request.customer!.id,
    addressId,
  })

  response.status(200).json(successResponse('Address deleted successfully'))
})

export const setDefaultAddressController: RequestHandler = asyncHandler(async (request, response) => {
  const addressId = typeof request.params.addressId === 'string' ? request.params.addressId : ''
  const data = await addressService.setDefaultAddress({
    customerId: request.customer!.id,
    addressId,
  })

  response.status(200).json(successResponse('Default address updated successfully', data))
})
