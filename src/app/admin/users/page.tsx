import { prisma } from '@/lib/prisma'
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
  minWidth: '720px',
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

const Strong = styled('p')({
  fontWeight: 900,
})

const Muted = styled('p')({
  marginTop: '4px',
  color: '#777',
  fontSize: '12px',
})

const Badge = styled('span')({
  display: 'inline-flex',
  borderRadius: '999px',
  background: '#f2eee6',
  padding: '6px 10px',
  color: '#171512',
  fontSize: '12px',
  fontWeight: 900,
})

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/')

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
          wishlist: true,
        },
      },
    },
  })

  return (
    <Page>
      <Title>회원 관리</Title>
      <TableWrap>
        <Table>
          <Thead>
            <tr>
              <Th>회원</Th>
              <Th>권한</Th>
              <Th>주문</Th>
              <Th>리뷰</Th>
              <Th>관심 상품</Th>
              <Th>가입일</Th>
            </tr>
          </Thead>
          <tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <Strong>{user.name}</Strong>
                  <Muted>{user.email}</Muted>
                </Td>
                <Td><Badge>{user.role}</Badge></Td>
                <Td>{user._count.orders}건</Td>
                <Td>{user._count.reviews}건</Td>
                <Td>{user._count.wishlist}개</Td>
                <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Page>
  )
}
