'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from '@/lib/auth'

import { productSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'
import { OrderStatus } from '@prisma/client'
import { z } from 'zod'

const orderStatusSchema = z.nativeEnum(OrderStatus)

async function checkAdmin() {
  const session = await getServerSession()
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('관리자 권한이 필요합니다.')
  }
}

type ProductInput = z.infer<typeof productSchema>

export async function createProduct(data: ProductInput) {
  await checkAdmin()
  
  const validated = productSchema.parse(data)

  try {
    const product = await prisma.product.create({
      data: {
        name: validated.name,
        price: validated.price,
        description: validated.description,
        imageUrl: validated.imageUrl,
        categoryId: validated.categoryId,
        stock: validated.stock,
      },
    })
    revalidatePath('/products')
    revalidatePath('/admin/products')
    return { success: true, productId: product.id }
  } catch (error) {
    return { error: '상품 등록에 실패했습니다.' }
  }
}

export async function updateProduct(id: number, data: ProductInput) {
  await checkAdmin()
  const validated = productSchema.parse(data)

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: validated.name,
        price: validated.price,
        description: validated.description,
        imageUrl: validated.imageUrl,
        categoryId: validated.categoryId,
        stock: validated.stock,
      },
    })
    revalidatePath(`/products/${id}`)
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    return { error: '상품 수정에 실패했습니다.' }
  }
}

export async function deleteProduct(id: number) {
  await checkAdmin()
  try {
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    })
    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true }
  } catch (error) {
    return { error: '상품 삭제에 실패했습니다.' }
  }
}

export async function getAdminProductById(id: number) {
  await checkAdmin()
  return await prisma.product.findUnique({
    where: { id },
  })
}

export async function getAllOrders() {
  await checkAdmin()
  return await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function updateOrderStatus(id: number, status: OrderStatus) {
  await checkAdmin()
  if (!Number.isInteger(id) || id <= 0) {
    return { error: '유효하지 않은 주문 ID입니다.' }
  }
  const parsedStatus = orderStatusSchema.safeParse(status)
  if (!parsedStatus.success) {
    return { error: '유효하지 않은 주문 상태입니다.' }
  }

  const nextStatus = parsedStatus.data
  const isCancelingOrRefunding = nextStatus === 'CANCELED' || nextStatus === 'REFUNDED'

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    })

    if (!existingOrder) {
      return { error: '주문을 찾을 수 없습니다.' }
    }

    const wasCanceledOrRefunded = existingOrder.status === 'CANCELED' || existingOrder.status === 'REFUNDED'

    if (
      isCancelingOrRefunding &&
      !wasCanceledOrRefunded &&
      existingOrder.paymentStatus === 'DONE' &&
      existingOrder.paymentKey &&
      process.env.TOSS_SECRET_KEY
    ) {
      const basicToken = Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString('base64')
      const cancelResponse = await fetch(
        `https://api.tosspayments.com/v1/payments/${encodeURIComponent(existingOrder.paymentKey)}/cancel`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${basicToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cancelReason: nextStatus === 'REFUNDED' ? '관리자 환불 처리' : '관리자 주문 취소',
          }),
          signal: AbortSignal.timeout(15000),
        }
      )

      if (!cancelResponse.ok) {
        const cancelResult = await cancelResponse.json().catch(() => ({}))
        return { error: cancelResult.message || 'Toss 결제 취소에 실패했습니다.' }
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id },
        data: {
          status: nextStatus,
          ...(isCancelingOrRefunding ? { paymentStatus: 'CANCELED' } : {}),
        },
      })

      if (isCancelingOrRefunding && !wasCanceledOrRefunded) {
        for (const item of existingOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          })
        }

        if (existingOrder.userCouponId) {
          await tx.userCoupon.updateMany({
            where: { id: existingOrder.userCouponId, isUsed: true },
            data: { isUsed: false, usedAt: null },
          })
        }
      }
    })

    revalidatePath('/admin/orders')
    revalidatePath('/orders')
    revalidatePath('/products')
    return { success: true }
  } catch (error) {
    console.error('Update order status error:', error)
    return { error: '상태 변경에 실패했습니다.' }
  }
}
