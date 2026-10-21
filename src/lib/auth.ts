import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export async function verifyJiminToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload
    return payload
  } catch (error) {
    return null
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get('jimin_token')?.value

  if (!token) {
    return null
  }

  const payload = await verifyJiminToken(token)
  if (!payload) {
    return null
  }

  return payload
}

export async function getOrCreateLocalUser(payload: any) {
  const email = (payload.email || '').toLowerCase().trim()
  if (!email) return null

  let user = await prisma.user.findUnique({
    where: { email },
  })

  const targetRole = payload.role === 'ADMIN' ? 'ADMIN' : 'USER'
  const targetName = payload.name || payload.username || 'User'

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password: '',
        name: targetName,
        role: targetRole,
      },
    })
  } else if (user.name !== targetName || user.role !== targetRole) {
    // 동기화: 중앙 SSO에서 이름이나 권한이 변경된 경우 로컬 DB에 반영
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: targetName,
        role: targetRole,
      },
    })
  }

  return user
}


export async function getAuthUser() {
  const jwtUser = await getCurrentUser()
  if (!jwtUser) {
    return null
  }

  const localUser = await getOrCreateLocalUser(jwtUser)
  if (!localUser) {
    return null
  }

  return {
    ...localUser,
    id: localUser.id.toString(),
  }

}

// Deprecated, do not use
export const authOptions = {}

// For compatibility
export async function getServerSession() {
  const user = await getAuthUser()
  if (!user) return null
  return { user }
}
