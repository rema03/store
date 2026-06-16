'use server'

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function getSession() {
  return await getServerSession(authOptions)
}

export async function getAddresses() {
  const session = await getSession()
  if (!session?.user) return []

  return await prisma.address.findMany({
    where: { userId: parseInt(session.user.id) },
    orderBy: { isDefault: 'desc' },
  })
}

export async function addAddress(formData: any) {
  const session = await getSession()
  if (!session?.user) return { error: '로그인이 필요합니다.' }

  const userId = parseInt(session.user.id)

  try {
    if (formData.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      })
    }

    const address = await prisma.address.create({
      data: {
        userId,
        receiverName: formData.receiverName,
        phone: formData.phone,
        zipCode: formData.zipCode,
        address1: formData.address1,
        address2: formData.address2,
        isDefault: formData.isDefault || false,
      },
    })

    revalidatePath('/mypage/addresses')
    return { success: true, address }
  } catch (error) {
    return { error: '배송지 등록에 실패했습니다.' }
  }
}

export async function deleteAddress(id: number) {
  const session = await getSession()
  if (!session?.user) return { error: 'Unauthorized' }

  try {
    await prisma.address.delete({
      where: { id, userId: parseInt(session.user.id) }
    })
    revalidatePath('/mypage/addresses')
    return { success: true }
  } catch (error) {
    return { error: '삭제 실패' }
  }
}

export async function setDefaultAddress(id: number) {
  const session = await getSession()
  if (!session?.user) return { error: 'Unauthorized' }

  const userId = parseInt(session.user.id)

  try {
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      }),
      prisma.address.update({
        where: { id },
        data: { isDefault: true }
      })
    ])
    revalidatePath('/mypage/addresses')
    return { success: true }
  } catch (error) {
    return { error: '설정 실패' }
  }
}
