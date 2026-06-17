'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { cartItemSchema } from '@/lib/validators'

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
  const validated = cartItemSchema.safeParse({ productId, quantity })
  if (!validated.success) return { error: '유효하지 않은 장바구니 정보입니다.' }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. 상품 정보 및 재고 확인 (tx 내에서 조회)
      const product = await tx.product.findUnique({ 
        where: { id: validated.data.productId } 
      })
      
      if (!product) throw new Error('PRODUCT_NOT_FOUND')
      if (!product.isActive) throw new Error('PRODUCT_INACTIVE')

      // 2. 이미 장바구니에 있는지 확인
      const existingItem = await tx.cartItem.findUnique({
        where: {
          userId_productId: { userId, productId: validated.data.productId },
        },
      })

      const totalNeeded = (existingItem?.quantity || 0) + validated.data.quantity
      if (product.stock < totalNeeded) throw new Error('INSUFFICIENT_STOCK')

      if (existingItem) {
        await tx.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: totalNeeded },
        })
      } else {
        await tx.cartItem.create({
          data: {
            userId,
            productId: validated.data.productId,
            quantity: validated.data.quantity,
          },
        })
      }
      return { success: true }
    })

    revalidatePath('/cart')
    return result
  } catch (error) {
    console.error('Add to cart error:', error)
    const message = error instanceof Error ? error.message : ''
    if (message === 'PRODUCT_NOT_FOUND') return { error: '상품을 찾을 수 없습니다.' }
    if (message === 'PRODUCT_INACTIVE') return { error: '판매 중인 상품이 아닙니다.' }
    if (message === 'INSUFFICIENT_STOCK') return { error: '재고가 부족합니다.' }
    return { error: '장바구니 담기에 실패했습니다.' }
  }
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  const validated = cartItemSchema.pick({ quantity: true }).safeParse({ quantity })
  if (!validated.success) return { error: '최소 수량은 1개입니다.' }
  const session = await getSession()
  if (!session?.user) return { error: '로그인이 필요합니다.' }

  const userId = parseInt(session.user.id)

  try {
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId },
      include: { product: true },
    })

    if (!cartItem) return { error: '항목을 찾을 수 없습니다.' }
    if (!cartItem.product.isActive) return { error: '판매 중인 상품이 아닙니다.' }
    if (cartItem.product.stock < validated.data.quantity) return { error: '재고가 부족합니다.' }

    await prisma.cartItem.update({
      where: { id },
      data: { quantity: validated.data.quantity },
    })

    revalidatePath('/cart')
    return { success: true }
  } catch (error) {
    return { error: '수량 변경에 실패했습니다.' }
  }
}

export async function removeFromCart(id: number) {
  const session = await getSession()
  if (!session?.user) return { error: '로그인이 필요합니다.' }

  try {
    await prisma.cartItem.delete({
      where: { id, userId: parseInt(session.user.id) },
    })
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
