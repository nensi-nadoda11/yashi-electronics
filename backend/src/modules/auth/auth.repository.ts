import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'
import type { SafeCustomer } from './auth.types'

const safeCustomerSelect = {
  id: true,
  fullName: true,
  email: true,
  mobile: true,
  isActive: true,
  lastLoginAt: true,
} satisfies Prisma.CustomerSelect

const authCustomerSelect = {
  id: true,
  fullName: true,
  email: true,
  mobile: true,
  passwordHash: true,
  isActive: true,
  resetPasswordTokenHash: true,
  resetPasswordExpiresAt: true,
  lastLoginAt: true,
} satisfies Prisma.CustomerSelect

export type AuthCustomerRecord = Prisma.CustomerGetPayload<{
  select: typeof authCustomerSelect
}>

export class AuthRepository {
  async findSafeCustomerById(id: string): Promise<SafeCustomer | null> {
    return prisma.customer.findUnique({
      where: { id },
      select: safeCustomerSelect,
    })
  }

  async findAuthCustomerById(id: string): Promise<AuthCustomerRecord | null> {
    return prisma.customer.findUnique({
      where: { id },
      select: authCustomerSelect,
    })
  }

  async findAuthCustomerByEmail(email: string): Promise<AuthCustomerRecord | null> {
    return prisma.customer.findUnique({
      where: { email },
      select: authCustomerSelect,
    })
  }

  async findSafeCustomerByEmail(email: string): Promise<SafeCustomer | null> {
    return prisma.customer.findUnique({
      where: { email },
      select: safeCustomerSelect,
    })
  }

  async findSafeCustomerByMobile(mobile: string): Promise<SafeCustomer | null> {
    return prisma.customer.findUnique({
      where: { mobile },
      select: safeCustomerSelect,
    })
  }

  async findAuthCustomerByIdentifier(identifier: {
    email: string | null
    mobile: string | null
  }): Promise<AuthCustomerRecord | null> {
    if (identifier.email) {
      return prisma.customer.findUnique({
        where: { email: identifier.email },
        select: authCustomerSelect,
      })
    }

    if (identifier.mobile) {
      return prisma.customer.findUnique({
        where: { mobile: identifier.mobile },
        select: authCustomerSelect,
      })
    }

    return null
  }

  async createCustomer(input: {
    email: string
    fullName: string
    mobile: string | null
    passwordHash: string
  }): Promise<SafeCustomer> {
    return prisma.customer.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        mobile: input.mobile,
        passwordHash: input.passwordHash,
      },
      select: safeCustomerSelect,
    })
  }

  async updateLastLoginAt(id: string, lastLoginAt: Date): Promise<SafeCustomer> {
    return prisma.customer.update({
      where: { id },
      data: { lastLoginAt },
      select: safeCustomerSelect,
    })
  }

  async setPasswordResetToken(
    id: string,
    resetPasswordTokenHash: string,
    resetPasswordExpiresAt: Date,
  ): Promise<void> {
    await prisma.customer.update({
      where: { id },
      data: {
        resetPasswordTokenHash,
        resetPasswordExpiresAt,
      },
    })
  }

  async updatePasswordAndClearResetToken(id: string, passwordHash: string): Promise<void> {
    await prisma.customer.update({
      where: { id },
      data: {
        passwordHash,
        resetPasswordTokenHash: null,
        resetPasswordExpiresAt: null,
      },
    })
  }
}

export const authRepository = new AuthRepository()
