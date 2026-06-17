import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
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

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr', 'repeat(2, minmax(0, 1fr))', 'repeat(4, minmax(0, 1fr))'],
  gap: '18px',
})

const Stat = styled('section')({
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
  padding: '24px',
})

const Label = styled('p')({
  color: '#666',
  fontSize: '13px',
  fontWeight: 800,
})

const Value = styled('p')({
  marginTop: '10px',
  fontSize: '26px',
  fontWeight: 950,
})

export default async function AdminStatisticsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/')

  const [paidOrders, pendingOrders, productCount, userCount, sales] = await Promise.all([
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { finalPrice: true },
    }),
  ])

  const stats = [
    { label: '결제 완료 주문', value: `${paidOrders}건` },
    { label: '결제 대기 주문', value: `${pendingOrders}건` },
    { label: '등록 상품', value: `${productCount}개` },
    { label: '회원 수', value: `${userCount}명` },
    { label: '총 매출', value: formatPrice(sales._sum.finalPrice ?? 0) },
  ]

  return (
    <Page>
      <Title>통계</Title>
      <Grid>
        {stats.map((item) => (
          <Stat key={item.label}>
            <Label>{item.label}</Label>
            <Value>{item.value}</Value>
          </Stat>
        ))}
      </Grid>
    </Page>
  )
}
