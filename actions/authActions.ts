'use server'

import { prisma } from '@/lib/prisma'
import { registerSchema } from '@/lib/validators'
import bcryptjs from 'bcryptjs'

export async function register(formData: unknown) {
  const validatedFields = registerSchema.safeParse(formData)

  if (!validatedFields.success) {
    return { error: '유효하지 않은 입력값입니다.' }
  }

  const { email, password, name } = validatedFields.data

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: '이미 가입된 이메일입니다.' }
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'USER',
      },
    })

    return { success: '회원가입이 완료되었습니다.' }
  } catch (error) {
    console.error('Registration error:', error)
    return { error: '회원가입 중 오류가 발생했습니다.' }
  }
}
