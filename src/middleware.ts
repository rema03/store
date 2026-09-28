import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const protectedPaths = ['/cart', '/checkout', '/mypage', '/admin']

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtectedPath) {
    const token = request.cookies.get('jimin_token')?.value
    
    let isValid = false
    if (token) {
      try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret')
        await jwtVerify(token, secret)
        isValid = true
      } catch (error) {
        // Invalid token
      }
    }
    
    if (!isValid) {
      const accountsUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL || 'http://accounts.localhost'
      const proto = request.headers.get('x-forwarded-proto') || 'http'
      const callbackUrl = encodeURIComponent(`${proto}://${request.headers.get('host') || 'localhost:3000'}${pathname}${search}`)
      return NextResponse.redirect(`${accountsUrl}/login?callbackUrl=${callbackUrl}`)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
