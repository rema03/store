'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function getSession() {
  return await getServerSession(authOptions)
}

export async function createReview(data: { productId: number, rating: number, content: string }) {
  const session = await getSession()
  if (!session?.user) return { error: '로그인이 필요합니다.' }

  const userId = parseInt(session.user.id)

  try {
    const hasPurchased = await prisma.order.findFirst({
      where: {
        userId,
        status: { in: ['PAID', 'COMPLETED', 'SHIPPING', 'PREPARING'] },
        items: { some: { productId: data.productId } }
      }
    })

    if (!hasPurchased) {
      return { error: '상품을 구매한 고객만 리뷰를 작성할 수 있습니다.' }
    }

    const existingReview = await prisma.review.findUnique({
      where: { userId_productId: { userId, productId: data.productId } }
    })

    if (existingReview) {
      return { error: '이미 이 상품에 대한 리뷰를 작성하셨습니다.' }
    }

    await prisma.review.create({
      data: {
        userId,
        productId: data.productId,
        rating: data.rating,
        content: data.content,
      }
    })

    revalidatePath(`/products/${data.productId}`)
    return { success: true }
  } catch (error) {
    return { error: '리뷰 등록에 실패했습니다.' }
  }
}

export async function deleteReview(id: number, productId: number) {
  const session = await getSession()
  if (!session?.user) return { error: '로그인이 필요합니다.' }

  try {
    const review = await prisma.review.findUnique({ where: { id } })
    if (!review || (review.userId !== parseInt(session.user.id) && session.user.role !== 'ADMIN')) {
      return { error: '권한이 없습니다.' }
    }

    await prisma.review.delete({ where: { id } })
    revalidatePath(`/products/${productId}`)
    return { success: true }
  } catch (error) {
    return { error: '리뷰 삭제에 실패했습니다.' }
  }
}
