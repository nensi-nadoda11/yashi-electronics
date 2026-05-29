import { Prisma } from '@prisma/client'
import { prisma } from '../../db/prisma'
import type { ProductFilters, ProductSortOption } from './product.types'

type ProductListRow = {
  id: string
  slug: string
  sku: string
  name: string
  shortDescription: string | null
  description: string | null
  mrp: Prisma.Decimal | number | string
  sellingPrice: Prisma.Decimal | number | string
  discountPrice: Prisma.Decimal | number | string | null
  effectivePrice: Prisma.Decimal | number | string
  gstPercentage: Prisma.Decimal | number | string
  stockQuantity: number
  isFeatured: boolean
  createdAt: Date
  updatedAt: Date
  categoryId: string
  categoryName: string
  categorySlug: string
  brandId: string | null
  brandName: string | null
  brandSlug: string | null
  primaryImageId: string | null
  primaryImageUrl: string | null
  primaryImageAltText: string | null
  primaryImageSortOrder: number | null
}

type CountRow = {
  total: bigint | number
}

const buildWhereSql = (filters: ProductFilters) => {
  const whereClauses: Prisma.Sql[] = [
    Prisma.sql`p."isActive" = true`,
    Prisma.sql`c."isActive" = true`,
    Prisma.sql`(b.id IS NULL OR b."isActive" = true)`,
  ]

  if (filters.search) {
    const searchTerm = `%${filters.search}%`
    whereClauses.push(
      Prisma.sql`(
        p."name" ILIKE ${searchTerm}
        OR p."sku" ILIKE ${searchTerm}
        OR COALESCE(p."shortDescription", '') ILIKE ${searchTerm}
        OR COALESCE(p."description", '') ILIKE ${searchTerm}
        OR c."name" ILIKE ${searchTerm}
        OR COALESCE(b."name", '') ILIKE ${searchTerm}
      )`,
    )
  }

  if (filters.category) {
    whereClauses.push(Prisma.sql`c."slug" = ${filters.category}`)
  }

  if (filters.brandSlugs.length > 0) {
    whereClauses.push(Prisma.sql`b."slug" IN (${Prisma.join(filters.brandSlugs)})`)
  }

  if (filters.minPrice !== undefined) {
    whereClauses.push(
      Prisma.sql`COALESCE(p."discountPrice", p."sellingPrice") >= ${filters.minPrice}`,
    )
  }

  if (filters.maxPrice !== undefined) {
    whereClauses.push(
      Prisma.sql`COALESCE(p."discountPrice", p."sellingPrice") <= ${filters.maxPrice}`,
    )
  }

  if (filters.stock === 'out_of_stock') {
    whereClauses.push(Prisma.sql`p."stockQuantity" <= 0`)
  }

  if (filters.stock === 'low_stock') {
    whereClauses.push(Prisma.sql`p."stockQuantity" BETWEEN 1 AND 5`)
  }

  if (filters.stock === 'in_stock') {
    whereClauses.push(Prisma.sql`p."stockQuantity" > 5`)
  }

  return Prisma.sql`WHERE ${Prisma.join(whereClauses, ' AND ')}`
}

const buildOrderBySql = (sort: ProductSortOption) => {
  switch (sort) {
    case 'price_low_to_high':
      return Prisma.sql`COALESCE(p."discountPrice", p."sellingPrice") ASC, p."name" ASC`
    case 'price_high_to_low':
      return Prisma.sql`COALESCE(p."discountPrice", p."sellingPrice") DESC, p."name" ASC`
    case 'name_az':
      return Prisma.sql`p."name" ASC`
    case 'name_za':
      return Prisma.sql`p."name" DESC`
    case 'discount_high_to_low':
      return Prisma.sql`
        CASE
          WHEN p."mrp" <= COALESCE(p."discountPrice", p."sellingPrice") THEN 0
          ELSE ROUND((((p."mrp" - COALESCE(p."discountPrice", p."sellingPrice")) / p."mrp") * 100), 0)
        END DESC,
        p."createdAt" DESC
      `
    case 'newest':
    default:
      return Prisma.sql`p."createdAt" DESC`
  }
}

export const findProducts = async (filters: ProductFilters) => {
  const whereSql = buildWhereSql(filters)
  const orderBySql = buildOrderBySql(filters.sort)
  const offset = (filters.page - 1) * filters.limit

  const [rows, countRows] = await Promise.all([
    prisma.$queryRaw<ProductListRow[]>(Prisma.sql`
      SELECT
        p.id,
        p.slug,
        p."sku",
        p.name,
        p."shortDescription",
        p.description,
        p.mrp,
        p."sellingPrice",
        p."discountPrice",
        COALESCE(p."discountPrice", p."sellingPrice") AS "effectivePrice",
        p."gstPercentage",
        p."stockQuantity",
        p."isFeatured",
        p."createdAt",
        p."updatedAt",
        c.id AS "categoryId",
        c.name AS "categoryName",
        c.slug AS "categorySlug",
        b.id AS "brandId",
        b.name AS "brandName",
        b.slug AS "brandSlug",
        img.id AS "primaryImageId",
        img."imageUrl" AS "primaryImageUrl",
        img."altText" AS "primaryImageAltText",
        img."sortOrder" AS "primaryImageSortOrder"
      FROM "Product" p
      INNER JOIN "Category" c ON c.id = p."categoryId"
      LEFT JOIN "Brand" b ON b.id = p."brandId"
      LEFT JOIN LATERAL (
        SELECT
          pi.id,
          pi."imageUrl",
          pi."altText",
          pi."sortOrder"
        FROM "ProductImage" pi
        WHERE pi."productId" = p.id
        ORDER BY pi."sortOrder" ASC, pi."createdAt" ASC
        LIMIT 1
      ) img ON TRUE
      ${whereSql}
      ORDER BY ${orderBySql}
      LIMIT ${filters.limit}::int
      OFFSET ${offset}::int
    `),
    prisma.$queryRaw<CountRow[]>(Prisma.sql`
      SELECT COUNT(*)::bigint AS total
      FROM "Product" p
      INNER JOIN "Category" c ON c.id = p."categoryId"
      LEFT JOIN "Brand" b ON b.id = p."brandId"
      ${whereSql}
    `),
  ])

  return {
    rows,
    total: Number(countRows[0]?.total ?? 0),
  }
}

export const findProductBySlug = async (slug: string) => {
  return prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
      category: {
        isActive: true,
      },
      OR: [
        { brandId: null },
        {
          brand: {
            isActive: true,
          },
        },
      ],
    },
    include: {
      category: true,
      brand: true,
      images: {
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
      specifications: {
        orderBy: [{ createdAt: 'asc' }, { name: 'asc' }],
      },
    },
  })
}

export const findRelatedProducts = async (categoryId: string, productId: string) => {
  return prisma.product.findMany({
    where: {
      categoryId,
      id: {
        not: productId,
      },
      isActive: true,
      category: {
        isActive: true,
      },
      OR: [
        { brandId: null },
        {
          brand: {
            isActive: true,
          },
        },
      ],
    },
    include: {
      category: true,
      brand: true,
      images: {
        take: 1,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      },
    },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    take: 4,
  })
}

export const findActiveCategories = async () => {
  const [categories, productCounts] = await Promise.all([
    prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.product.groupBy({
      by: ['categoryId'],
      where: {
        isActive: true,
        category: {
          isActive: true,
        },
        OR: [
          { brandId: null },
          {
            brand: {
              isActive: true,
            },
          },
        ],
      },
      _count: {
        _all: true,
      },
    }),
  ])

  const countsMap = new Map(productCounts.map((entry) => [entry.categoryId, entry._count._all]))

  return categories.map((category) => ({
    ...category,
    productCount: countsMap.get(category.id) ?? 0,
  }))
}

export const findActiveBrands = async () => {
  const [brands, productCounts] = await Promise.all([
    prisma.brand.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: 'asc',
      },
    }),
    prisma.product.groupBy({
      by: ['brandId'],
      where: {
        isActive: true,
        brandId: {
          not: null,
        },
        category: {
          isActive: true,
        },
        brand: {
          isActive: true,
        },
      },
      _count: {
        _all: true,
      },
    }),
  ])

  const countsMap = new Map(
    productCounts
      .filter((entry): entry is typeof entry & { brandId: string } => entry.brandId !== null)
      .map((entry) => [entry.brandId, entry._count._all]),
  )

  return brands.map((brand) => ({
    ...brand,
    productCount: countsMap.get(brand.id) ?? 0,
  }))
}
