import { Prisma, PrismaClient } from '@prisma/client'
import { prisma } from '../../db/prisma'

type DbClient = PrismaClient | Prisma.TransactionClient

const addressOrderBy = [
  { isDefault: 'desc' as const },
  { createdAt: 'desc' as const },
]

export type CustomerAddressRecord = Prisma.CustomerAddressGetPayload<{}>

const getClient = (client: DbClient = prisma) => client

export const addressRepository = {
  findCustomerAddresses(customerId: string, client: DbClient = prisma) {
    return getClient(client).customerAddress.findMany({
      where: { customerId },
      orderBy: addressOrderBy,
    })
  },

  findCustomerAddressById(customerId: string, addressId: string, client: DbClient = prisma) {
    return getClient(client).customerAddress.findFirst({
      where: {
        id: addressId,
        customerId,
      },
    })
  },

  findNewestCustomerAddress(customerId: string, client: DbClient = prisma) {
    return getClient(client).customerAddress.findFirst({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
    })
  },

  countCustomerAddresses(customerId: string, client: DbClient = prisma) {
    return getClient(client).customerAddress.count({
      where: { customerId },
    })
  },

  createAddress(
    input: Prisma.CustomerAddressUncheckedCreateInput,
    client: DbClient = prisma,
  ) {
    return getClient(client).customerAddress.create({
      data: input,
    })
  },

  updateAddress(
    addressId: string,
    input: Prisma.CustomerAddressUncheckedUpdateInput,
    client: DbClient = prisma,
  ) {
    return getClient(client).customerAddress.update({
      where: { id: addressId },
      data: input,
    })
  },

  deleteAddress(addressId: string, client: DbClient = prisma) {
    return getClient(client).customerAddress.delete({
      where: { id: addressId },
    })
  },

  clearCustomerDefaults(customerId: string, client: DbClient = prisma) {
    return getClient(client).customerAddress.updateMany({
      where: { customerId },
      data: { isDefault: false },
    })
  },
}
