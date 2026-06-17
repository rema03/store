'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { calculateDiscount, generateOrderNumber, generateTossOrderId } from '@/lib/utils'
import { getShippingFee } from '@/lib/config'

export async function createOrder(data: {
  addressId: number
  userCouponId?: number
  cartItemIds: number[]
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return { error: '로그인이 필요합니다.' }

  const userId = parseInt(session.user.id)

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. 장바구니 아이템 확인 (tx 내에서 조회)
      const cartItems = await tx.cartItem.findMany({
        where: { id: { in: data.cartItemIds }, userId },
        include: { product: true },
      })

      if (cartItems.length === 0) throw new Error('주문할 상품이 없습니다.')
      if (cartItems.length !== new Set(data.cartItemIds).size) {
        throw new Error('장바구니 정보를 다시 확인해주세요.')
      }

      // 1.1 재고 차감 (선점형)
      for (const item of cartItems) {
        if (!item.product.isActive) throw new Error(`${item.product.name}은(는) 현재 판매 중이 아닙니다.`)
        
        const stockUpdate = await tx.product.updateMany({
          where: { 
            id: item.productId, 
            stock: { gte: item.quantity } 
          },
          data: { stock: { decrement: item.quantity } }
        })

        if (stockUpdate.count !== 1) {
          throw new Error(`${item.product.name}의 재고가 부족합니다.`)
        }
      }

      // 2. 금액 계산
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
      
      let discountAmount = 0
      let userCouponId: number | undefined
      if (data.userCouponId) {
        // 2.1 쿠폰 확인 및 사용 처리 (선점형)
        const userCouponUpdate = await tx.userCoupon.updateMany({
          where: {
            id: data.userCouponId,
            userId,
            isUsed: false,
            coupon: {
              isActive: true,
              startsAt: { lte: new Date() },
              endsAt: { gte: new Date() },
              minOrderPrice: { lte: totalPrice }
            },
          },
          data: { isUsed: true, usedAt: new Date() }
        })

        if (userCouponUpdate.count !== 1) {
          throw new Error('사용할 수 없는 쿠폰이거나 최소 주문 금액을 충족하지 못했습니다.')
        }

        const userCoupon = await tx.userCoupon.findUnique({
          where: { id: data.userCouponId },
          include: { coupon: true }
        })

        if (userCoupon) {
          discountAmount = calculateDiscount(
            userCoupon.coupon.discountType,
            userCoupon.coupon.discountValue,
            totalPrice,
            userCoupon.coupon.maxDiscount,
          )
          userCouponId = userCoupon.id
        }
      }

      const finalPrice = totalPrice - discountAmount + getShippingFee(totalPrice)

      // 3. 배송지 정보 가져오기
      const address = await tx.address.findFirst({ where: { id: data.addressId, userId } })
      if (!address) throw new Error('배송지 정보가 없습니다.')

      // 4. 주문 생성
      const order = await tx.order.create({
        data: {
          userId,
          orderNumber: generateOrderNumber(),
          totalPrice,
          discountAmount,
          finalPrice,
          status: 'PENDING',
          tossOrderId: generateTossOrderId(),
          userCouponId,
          receiverName: address.receiverName,
          receiverPhone: address.phone,
          zipCode: address.zipCode,
          address1: address.address1,
          address2: address.address2,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
      })

      return { success: true, orderId: order.id, finalPrice: order.finalPrice, tossOrderId: order.tossOrderId }
    })
  } catch (error) {
    console.error('Order creation error:', error)
    return { error: error instanceof Error ? error.message : '주문 생성에 실패했습니다.' }
  }
}

export async function getOrderById(id: number) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null

  return await prisma.order.findUnique({
    where: { id, userId: parseInt(session.user.id) },
    include: {
      items: {
        include: { product: true },
      },
    },
  })
}

export async function getUserOrders() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  return await prisma.order.findMany({
    where: { userId: parseInt(session.user.id) },
    include: {
      items: { include: { product: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}
