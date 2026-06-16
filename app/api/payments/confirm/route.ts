import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { paymentKey, orderId, amount } = await req.json()

  try {
    // 1. DB에서 주문 조회 및 검증
    const order = await prisma.order.findUnique({
      where: { tossOrderId: orderId },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
    }

    if (order.finalPrice !== amount) {
      return NextResponse.json({ error: '결제 금액이 일치하지 않습니다.' }, { status: 400 })
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json({ error: '이미 처리된 주문입니다.' }, { status: 400 })
    }

    // 2. Toss Payments 승인 API 호출
    const secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_develop123456'
    const basicToken = Buffer.from(`${secretKey}:`).toString('base64')

    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('Toss confirm error:', result)
      return NextResponse.json({ error: result.message || '결제 승인에 실패했습니다.' }, { status: response.status })
    }

    // 3. 결제 성공 처리 (Transaction)
    await prisma.$transaction(async (tx) => {
      // 주문 상태 변경
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paymentKey,
          paymentMethod: result.method || 'CARD',
          paymentStatus: 'DONE',
        },
      })

      // 재고 감소 및 장바구니 비우기
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        })
      }

      await tx.cartItem.deleteMany({
        where: { userId: parseInt(session.user.id) },
      })
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('Confirm API error:', error)
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
