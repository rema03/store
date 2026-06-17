import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { styled } from '@devup-ui/react'

const Page = styled('div')({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '48px 24px',
})

const Title = styled('h1')({
  marginBottom: '32px',
  fontSize: '30px',
  fontWeight: 900,
})

const StatsGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: '24px',
  marginBottom: '48px',
  _media: {
    '(max-width: 960px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '(max-width: 560px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

const StatCard = styled(Link)({
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
  padding: '24px',
  transition: 'box-shadow 0.15s ease, transform 0.15s ease',
  _hover: {
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
    transform: 'translateY(-2px)',
  },
})

const StatName = styled('p')({
  color: '#666',
  fontSize: '14px',
  fontWeight: 700,
})

const StatValue = styled('p')({
  marginTop: '8px',
  fontSize: '24px',
  fontWeight: 900,
})

const PanelGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '32px',
  _media: {
    '(max-width: 860px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

const Panel = styled('section')({
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
  padding: '24px',
})

const PanelTitle = styled('h2')({
  marginBottom: '16px',
  fontSize: '20px',
  fontWeight: 900,
})

const QuickGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '16px',
})

const QuickLink = styled(Link)({
  borderRadius: '6px',
  background: '#f7f7f7',
  padding: '16px',
  textAlign: 'center',
  fontWeight: 800,
  transition: 'background 0.15s ease',
  _hover: {
    background: '#eee',
  },
})

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/')

  // 대시보드 통계 데이터 가져오기
  const [productCount, orderCount, userCount, totalSales] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { finalPrice: true },
    }),
  ])

  const stats = [
    { name: '총 상품 수', value: productCount, href: '/admin/products' },
    { name: '총 주문 수(결제완료)', value: orderCount, href: '/admin/orders' },
    { name: '총 회원 수', value: userCount, href: '/admin/users' },
    { name: '총 매출액', value: formatPrice(totalSales._sum.finalPrice || 0), href: '/admin/statistics' },
  ]

  return (
    <Page>
      <Title>관리자 대시보드</Title>
      
      <StatsGrid>
        {stats.map((item) => (
          <StatCard
            key={item.name}
            href={item.href}
          >
            <StatName>{item.name}</StatName>
            <StatValue>{item.value}</StatValue>
          </StatCard>
        ))}
      </StatsGrid>

      <PanelGrid>
        <Panel>
          <PanelTitle>빠른 관리</PanelTitle>
          <QuickGrid>
            <QuickLink href="/admin/products/new">
              상품 등록
            </QuickLink>
            <QuickLink href="/admin/orders">
              주문 확인
            </QuickLink>
            <QuickLink href="/admin/coupons">
              쿠폰 생성
            </QuickLink>
            <QuickLink href="/">
              쇼핑몰 홈
            </QuickLink>
          </QuickGrid>
        </Panel>
      </PanelGrid>
    </Page>
  )
}
