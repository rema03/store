'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function getSession() {
  return await getServerSession(authOptions)
}

export async function toggleWishlist(productId: number) {
  const session = await getSession()
  if (!session?.user) return { error: '로그인이 필요합니다.' }

  const userId = parseInt(session.user.id)

  try {
    const existing = await prisma.wishlist.findUnique({
      where: { userId_productId: { userId, productId } }
    })

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id }
      })
    } else {
      await prisma.wishlist.create({
        data: { userId, productId }
      })
    }

    revalidatePath(`/products/${productId}`)
    revalidatePath('/wishlist')
    return { success: true, isAdded: !existing }
  } catch (error) {
    return { error: '처리 중 오류가 발생했습니다.' }
  }
}

export async function getWishlistItems() {
  const session = await getSession()
  if (!session?.user) return []

  return await prisma.wishlist.findMany({
    where: { userId: parseInt(session.user.id) },
    include: {
      product: { include: { category: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}
