import { Prisma } from '@prisma/client'
import { AppError } from '../../utils/app-error'
import { prisma } from '../../db/prisma'
import { addressRepository } from './address.repository'
import type {
  AddressListResponse,
  AddressResponse,
  CreateAddressInput,
  DeleteAddressInput,
  CustomerAddress,
  SetDefaultAddressInput,
  UpdateAddressInput,
} from './address.types'

const mapAddress = (address: {
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
  createdAt: Date
  updatedAt: Date
}): CustomerAddress => ({
  id: address.id,
  customerId: address.customerId,
  fullName: address.fullName,
  mobile: address.mobile,
  addressLine1: address.addressLine1,
  addressLine2: address.addressLine2,
  city: address.city,
  state: address.state,
  pincode: address.pincode,
  landmark: address.landmark,
  isDefault: address.isDefault,
  createdAt: address.createdAt.toISOString(),
  updatedAt: address.updatedAt.toISOString(),
})

const mapMutationError = (error: unknown) => {
  if (error instanceof AppError) {
    throw error
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      throw new AppError('Address not found', 404)
    }

    if (error.code === 'P2002') {
      throw new AppError('Unable to save address right now. Please try again.', 409)
    }
  }

  throw error
}

const buildAddressData = (input: CreateAddressInput | UpdateAddressInput) => ({
  customerId: input.customerId,
  fullName: input.fullName.trim(),
  mobile: input.mobile.trim(),
  addressLine1: input.addressLine1.trim(),
  addressLine2: input.addressLine2?.trim() ?? null,
  city: input.city.trim(),
  state: input.state.trim(),
  pincode: input.pincode.trim(),
  landmark: input.landmark?.trim() ?? null,
})

export const addressService = {
  async getCustomerAddresses(customerId: string): Promise<AddressListResponse> {
    const addresses = await addressRepository.findCustomerAddresses(customerId)

    return {
      addresses: addresses.map(mapAddress),
      count: addresses.length,
    }
  },

  async getCustomerAddressById(
    customerId: string,
    addressId: string,
  ): Promise<AddressResponse> {
    const address = await addressRepository.findCustomerAddressById(customerId, addressId)

    if (!address) {
      throw new AppError('Address not found', 404)
    }

    return {
      address: mapAddress(address),
    }
  },

  async createAddress(input: CreateAddressInput): Promise<AddressResponse> {
    try {
      const address = await prisma.$transaction(async (transaction) => {
        const addressCount = await addressRepository.countCustomerAddresses(
          input.customerId,
          transaction,
        )
        const shouldBeDefault = input.isDefault === true || addressCount === 0

        if (shouldBeDefault) {
          await addressRepository.clearCustomerDefaults(input.customerId, transaction)
        }

        return addressRepository.createAddress(
          {
            ...buildAddressData(input),
            isDefault: shouldBeDefault,
          },
          transaction,
        )
      })

      return {
        address: mapAddress(address),
      }
    } catch (error) {
      mapMutationError(error)
      throw error
    }
  },

  async updateAddress(input: UpdateAddressInput): Promise<AddressResponse> {
    try {
      const address = await prisma.$transaction(async (transaction) => {
        const existingAddress = await addressRepository.findCustomerAddressById(
          input.customerId,
          input.addressId,
          transaction,
        )

        if (!existingAddress) {
          throw new AppError('Address not found', 404)
        }

        const shouldSetDefault = input.isDefault === true
        const nextIsDefault =
          typeof input.isDefault === 'boolean' ? input.isDefault : existingAddress.isDefault

        if (shouldSetDefault) {
          await addressRepository.clearCustomerDefaults(input.customerId, transaction)
        }

        return addressRepository.updateAddress(
          input.addressId,
          {
            ...buildAddressData(input),
            isDefault: nextIsDefault,
          },
          transaction,
        )
      })

      return {
        address: mapAddress(address),
      }
    } catch (error) {
      mapMutationError(error)
      throw error
    }
  },

  async deleteAddress(input: DeleteAddressInput): Promise<void> {
    try {
      await prisma.$transaction(async (transaction) => {
        const existingAddress = await addressRepository.findCustomerAddressById(
          input.customerId,
          input.addressId,
          transaction,
        )

        if (!existingAddress) {
          throw new AppError('Address not found', 404)
        }

        await addressRepository.deleteAddress(input.addressId, transaction)

        if (!existingAddress.isDefault) {
          return
        }

        const newestRemainingAddress = await addressRepository.findNewestCustomerAddress(
          input.customerId,
          transaction,
        )

        if (newestRemainingAddress) {
          await addressRepository.updateAddress(
            newestRemainingAddress.id,
            {
              isDefault: true,
            },
            transaction,
          )
        }
      })
    } catch (error) {
      mapMutationError(error)
      throw error
    }
  },

  async setDefaultAddress(input: SetDefaultAddressInput): Promise<AddressResponse> {
    try {
      const address = await prisma.$transaction(async (transaction) => {
        const existingAddress = await addressRepository.findCustomerAddressById(
          input.customerId,
          input.addressId,
          transaction,
        )

        if (!existingAddress) {
          throw new AppError('Address not found', 404)
        }

        await addressRepository.clearCustomerDefaults(input.customerId, transaction)

        return addressRepository.updateAddress(
          input.addressId,
          {
            isDefault: true,
          },
          transaction,
        )
      })

      return {
        address: mapAddress(address),
      }
    } catch (error) {
      mapMutationError(error)
      throw error
    }
  },
}
