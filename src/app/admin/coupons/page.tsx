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

const TableWrap = styled('div')({
  overflowX: 'auto',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
})

const Table = styled('table')({
  width: '100%',
  minWidth: '760px',
  borderCollapse: 'collapse',
  textAlign: 'left',
})

const Thead = styled('thead')({
  borderBottom: '1px solid #ddd',
  background: '#f7f7f7',
})

const Th = styled('th')({
  padding: '16px 24px',
  fontSize: '14px',
  fontWeight: 900,
})

const Tr = styled('tr')({
  borderTop: '1px solid #ddd',
})

const Td = styled('td')({
  padding: '16px 24px',
  fontSize: '14px',
})

const Code = styled('code')({
  borderRadius: '6px',
  background: '#f2eee6',
  padding: '5px 8px',
  fontWeight: 900,
})

function formatDiscount(type: string, value: number, maxDiscount: number | null) {
  if (type === 'PERCENT') {
    return maxDiscount ? `${value}% 최대 ${formatPrice(maxDiscount)}` : `${value}%`
  }

  return formatPrice(value)
}

export default async function AdminCouponsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/')

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { userCoupons: true },
      },
    },
  })

  return (
    <Page>
      <Title>쿠폰 관리</Title>
      <TableWrap>
        <Table>
          <Thead>
            <tr>
              <Th>코드</Th>
              <Th>쿠폰명</Th>
              <Th>할인</Th>
              <Th>최소 주문</Th>
              <Th>발급 수</Th>
              <Th>상태</Th>
            </tr>
          </Thead>
          <tbody>
            {coupons.map((coupon) => (
              <Tr key={coupon.id}>
                <Td><Code>{coupon.code}</Code></Td>
                <Td>{coupon.name}</Td>
                <Td>{formatDiscount(coupon.discountType, coupon.discountValue, coupon.maxDiscount)}</Td>
                <Td>{formatPrice(coupon.minOrderPrice)}</Td>
                <Td>{coupon._count.userCoupons}개</Td>
                <Td>{coupon.isActive ? '활성' : '비활성'}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Page>
  )
}
