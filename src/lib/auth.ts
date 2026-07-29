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
  const cookieStore = cookies()
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
  let user = await prisma.user.findUnique({
    where: { email: payload.email },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: payload.email,
        password: '',
        name: payload.name || payload.username || 'Unknown',
        role: payload.role || 'USER',
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
