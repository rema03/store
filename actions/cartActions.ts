'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function getSession() {
  return await getServerSession(authOptions)
}

export async function getCartItems() {
  const session = await getSession()
  if (!session?.user) return []

  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: parseInt(session.user.id) },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    return items
  } catch (error) {
    console.error('Error fetching cart:', error)
    return []
  }
}

export async function addToCart(productId: number, quantity: number = 1) {
  const session = await getSession()
  if (!session?.user) return { error: '로그인이 필요합니다.' }

  const userId = parseInt(session.user.id)

  try {
    // 재고 확인
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return { error: '상품을 찾을 수 없습니다.' }
    if (product.stock < quantity) return { error: '재고가 부족합니다.' }

    // 이미 장바구니에 있는지 확인
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    })

    if (existingItem) {
      // 수량 업데이트
      const newQuantity = existingItem.quantity + quantity
      if (product.stock < newQuantity) return { error: '재고가 부족합니다.' }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      })
    } else {
      // 신규 추가
      await prisma.cartItem.create({
        data: { userId, productId, quantity },
      })
    }

    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    console.error('Add to cart error:', error)
    return { error: '장바구니 담기에 실패했습니다.' }
  }
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  if (quantity < 1) return { error: '최소 수량은 1개입니다.' }

  try {
    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: { product: true },
    })

    if (!cartItem) return { error: '항목을 찾을 수 없습니다.' }
    if (cartItem.product.stock < quantity) return { error: '재고가 부족합니다.' }

    await prisma.cartItem.update({
      where: { id },
      data: { quantity },
    })

    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    return { error: '수량 변경에 실패했습니다.' }
  }
}

export async function removeFromCart(id: number) {
  try {
    await prisma.cartItem.delete({ where: { id } })
    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    return { error: '삭제에 실패했습니다.' }
  }
}

export async function clearCart() {
  const session = await getSession()
  if (!session?.user) return

  try {
    await prisma.cartItem.deleteMany({
      where: { userId: parseInt(session.user.id) },
    })
    revalidatePath('/cart')
  } catch (error) {
    console.error('Clear cart error:', error)
  }
}
