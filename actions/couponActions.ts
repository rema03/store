'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function getUserCoupons() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return []

  return await prisma.userCoupon.findMany({
    where: {
      userId: parseInt(session.user.id),
      isUsed: false,
      coupon: {
        isActive: true,
        endsAt: { gte: new Date() },
      },
    },
    include: {
      coupon: true,
    },
  })
}
