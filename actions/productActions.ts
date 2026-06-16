'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Prisma } from '@prisma/client'

export async function getProducts(params: {
  categoryId?: number
  search?: string
  sort?: string
}) {
  const { categoryId, search, sort } = params

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
  if (sort === 'price_asc') orderBy = { price: 'asc' }
  if (sort === 'price_desc') orderBy = { price: 'desc' }

  try {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        ...(categoryId ? { categoryId } : {}),
        ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      },
      include: {
        category: true,
      },
      orderBy,
    })

    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductById(id: number) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
        reviews: {
          include: {
            user: {
              select: { name: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    return product
  } catch (error) {
    console.error('Error fetching product by id:', error)
    return null
  }
}

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    })
    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function recordRecentView(productId: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return

  const userId = parseInt(session.user.id)

  try {
    await prisma.recentView.upsert({
      where: { userId_productId: { userId, productId } },
      update: { viewedAt: new Date() },
      create: { userId, productId }
    })
  } catch (error) {
    console.error('Error recording recent view:', error)
  }
}

export async function getRecentViews() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  return await prisma.recentView.findMany({
    where: { userId: parseInt(session.user.id) },
    include: { product: { include: { category: true } } },
    orderBy: { viewedAt: 'desc' },
    take: 20
  })
}
