import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Providers from '@/components/common/Providers'

export const metadata: Metadata = {
  title: 'Jimin Store - 패션 쇼핑몰',
  description: 'Jimin Store fashion shopping experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0 }}>
        <Providers>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <main style={{ flex: 1 }}>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
