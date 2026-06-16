import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { productSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'
import { OrderStatus } from '@prisma/client'

async function checkAdmin() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') {
    throw new Error('관리자 권한이 필요합니다.')
  }
}

export async function createProduct(data: any) {
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

export async function updateProduct(id: number, data: any) {
  await checkAdmin()
  const validated = productSchema.parse(data)

  try {
    await prisma.product.update({
      where: { id },
      data: validated,
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
    await prisma.product.delete({ where: { id } })
    revalidatePath('/admin/products')
    revalidatePath('/products')
    return { success: true }
  } catch (error) {
    return { error: '상품 삭제에 실패했습니다.' }
  }
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
  try {
    await prisma.order.update({
      where: { id },
      data: { status },
    })
    revalidatePath('/admin/orders')
    revalidatePath('/orders')
    return { success: true }
  } catch (error) {
    return { error: '상태 변경에 실패했습니다.' }
  }
}
