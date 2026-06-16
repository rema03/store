import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateOrderNumber } from '@/lib/utils'

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
      // 1. 장바구니 아이템 확인
      const cartItems = await tx.cartItem.findMany({
        where: { id: { in: data.cartItemIds }, userId },
        include: { product: true },
      })

      if (cartItems.length === 0) throw new Error('주문할 상품이 없습니다.')

      // 2. 금액 계산
      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      )
      
      let discountAmount = 0
      if (data.userCouponId) {
        const userCoupon = await tx.userCoupon.findFirst({
          where: { id: data.userCouponId, userId, isUsed: false },
          include: { coupon: true },
        })

        if (userCoupon) {
          if (userCoupon.coupon.discountType === 'PERCENT') {
            discountAmount = Math.floor((totalPrice * userCoupon.coupon.discountValue) / 100)
            if (userCoupon.coupon.maxDiscount) {
              discountAmount = Math.min(discountAmount, userCoupon.coupon.maxDiscount)
            }
          } else {
            discountAmount = userCoupon.coupon.discountValue
          }
        }
      }

      const finalPrice = totalPrice - discountAmount + (totalPrice >= 50000 ? 0 : 3000)

      // 3. 배송지 정보 가져오기
      const address = await tx.address.findUnique({ where: { id: data.addressId } })
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
          tossOrderId: Buffer.from(Date.now().toString()).toString('base64'), // 임시 ID
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
  } catch (error: any) {
    console.error('Order creation error:', error)
    return { error: error.message || '주문 생성에 실패했습니다.' }
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
