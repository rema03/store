import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { requireEnv } from '@/lib/config'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { paymentKey, orderId, amount } = await req.json()

  if (typeof paymentKey !== 'string' || typeof orderId !== 'string' || typeof amount !== 'number') {
    return NextResponse.json({ error: '잘못된 결제 요청입니다.' }, { status: 400 })
  }

  try {
    // 1. DB에서 주문 조회 및 검증
    const order = await prisma.order.findUnique({
      where: { tossOrderId: orderId },
      include: { items: true },
    })

    if (!order) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
    }

    if (order.userId !== parseInt(session.user.id)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    if (order.finalPrice !== amount) {
      return NextResponse.json({ error: '결제 금액이 일치하지 않습니다.' }, { status: 400 })
    }

    if (order.status !== 'PENDING') {
      return NextResponse.json({ error: '이미 처리된 주문입니다.' }, { status: 400 })
    }

    // 2. Toss Payments 승인 API 호출
    const secretKey = requireEnv('TOSS_SECRET_KEY')
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
    // 재고와 쿠폰은 createOrder 시점에 이미 선점(차감/사용처리)되었으므로 
    // 여기서는 주문 상태만 최종적으로 PAID로 변경하고 장바구니를 비웁니다.
    await prisma.$transaction(async (tx) => {
      const orderUpdate = await tx.order.updateMany({
        where: { 
          id: order.id, 
          status: 'PENDING' 
        },
        data: {
          status: 'PAID',
          paymentKey,
          paymentMethod: result.method || 'CARD',
          paymentStatus: 'DONE',
        },
      })

      if (orderUpdate.count !== 1) {
        throw new Error('ALREADY_PROCESSED')
      }

      // 3.1 장바구니 비우기
      await tx.cartItem.deleteMany({
        where: { userId: parseInt(session.user.id) },
      })
    })

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error('Confirm API error:', error)
    const message = error instanceof Error ? error.message : ''
    
    if (message === 'ALREADY_PROCESSED') {
      return NextResponse.json({ error: '이미 처리된 주문입니다.' }, { status: 400 })
    }
    
    return NextResponse.json({ error: '서버 오류가 발생했습니다. 고객센터에 문의해주세요.' }, { status: 500 })
  }
}
