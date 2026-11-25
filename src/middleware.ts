import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const protectedPaths = ['/cart', '/checkout', '/mypage', '/admin', '/orders', '/wishlist']
const DEV_JWT_SECRET = 'dev-jwt-secret-change-in-production'

function getMiddlewareJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim()
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable must be set in production.')
    }
    return DEV_JWT_SECRET
  }
  return secret
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath) {
    const token = request.cookies.get('jimin_token')?.value

    let isValid = false
    let role: unknown
    if (token) {
      try {
        const secret = new TextEncoder().encode(getMiddlewareJwtSecret())
        const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })
        isValid = true
        role = payload.role
      } catch {
        // Invalid token or missing JWT_SECRET
      }
    }

    if (!isValid) {
      const accountsUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL || 'http://accounts.localhost'
      const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL
      let fullUrl: string
      if (appBaseUrl) {
        fullUrl = `${appBaseUrl.replace(/\/$/, '')}${pathname}${search}`
      } else {
        const proto = request.headers.get('x-forwarded-proto') || (request.url.startsWith('https') ? 'https' : 'http')
        const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000'
        fullUrl = `${proto}://${host}${pathname}${search}`
      }

      const callbackUrl = encodeURIComponent(fullUrl)
      const redirectResponse = NextResponse.redirect(`${accountsUrl}/login?callbackUrl=${callbackUrl}`)

      // 유효하지 않은 토큰 쿠키 정리 (호스트 전용 및 설정된 상위 도메인 쿠키 삭제)
      if (token) {
        redirectResponse.cookies.delete('jimin_token')
        const cookieDomain = process.env.COOKIE_DOMAIN?.trim()
        if (cookieDomain && cookieDomain !== 'none' && cookieDomain !== 'localhost' && cookieDomain !== '.localhost') {
          redirectResponse.cookies.delete({
            name: 'jimin_token',
            domain: cookieDomain,
            path: '/',
          })
        }
      }

      return redirectResponse
    }

    if (pathname.startsWith('/admin') && role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
