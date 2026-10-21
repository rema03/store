import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const protectedPaths = ['/cart', '/checkout', '/mypage', '/admin', '/orders', '/wishlist']

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

      // 유효하지 않은 토큰 쿠키 정리 (호스트 전용 및 상위 도메인 쿠키 삭제)
      if (token) {
        redirectResponse.cookies.delete('jimin_token')
        const cookieDomain = process.env.COOKIE_DOMAIN || '.jimindev.com'
        redirectResponse.cookies.delete({
          name: 'jimin_token',
          domain: cookieDomain,
          path: '/',
        })
      }

      return redirectResponse
    }

  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
