import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getUserOrders } from '@/actions/orderActions'
import { formatPrice, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { styled } from '@devup-ui/react'

const Page = styled('div')({
  background: '#fbf8f2',
  minHeight: '100vh',
})

const Shell = styled('div')({
  maxWidth: '1000px',
  margin: '0 auto',
  padding: ['42px 20px 80px', '64px 20px 110px'],
})

const Header = styled('header')({
  marginBottom: '42px',
})

const Title = styled('h1')({
  color: '#171512',
  fontSize: ['32px', '48px'],
  fontWeight: 950,
  letterSpacing: '-0.04em',
})

const Subtitle = styled('p')({
  marginTop: '12px',
  color: '#7e7468',
  fontSize: '16px',
})

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr', '260px 1fr'],
  gap: '42px',
  alignItems: 'start',
})

const Nav = styled('nav')({
  display: 'grid',
  gap: '12px',
})

const NavLink = styled(Link)({
  display: 'block',
  padding: '16px 20px',
  borderRadius: '16px',
  background: '#fff',
  border: '1px solid #e8e0d5',
  color: '#171512',
  fontSize: '15px',
  fontWeight: 850,
  _hover: {
    background: '#f5efe6',
  },
})

const ActiveNav = styled(NavLink)({
  background: '#171512',
  color: '#fff',
  borderColor: '#171512',
  _hover: {
    background: '#171512',
  },
})

const Content = styled('div')({
  display: 'grid',
  gap: '28px',
})

const SectionTitle = styled('h2')({
  marginBottom: '18px',
  color: '#171512',
  fontSize: '20px',
  fontWeight: 950,
})

const OrderCard = styled('div')({
  padding: '24px',
  borderRadius: '24px',
  background: '#fff',
  border: '1px solid #e8e0d5',
  boxShadow: '0 12px 35px rgba(39, 31, 22, 0.05)',
})

const OrderHeader = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: '18px',
  borderBottom: '1px solid #f3eee6',
  marginBottom: '18px',
})

const OrderNum = styled('p')({
  color: '#8e8377',
  fontSize: '13px',
  fontWeight: 800,
})

const OrderStatus = styled('span')({
  padding: '6px 12px',
  borderRadius: '999px',
  background: '#f5efe6',
  color: '#5c5248',
  fontSize: '12px',
  fontWeight: 900,
})

const OrderItem = styled('div')({
  display: 'flex',
  gap: '18px',
  alignItems: 'center',
})

const ItemInfo = styled('div')({
  flex: 1,
})

const ItemName = styled('p')({
  color: '#171512',
  fontSize: '16px',
  fontWeight: 850,
})

const ItemPrice = styled('p')({
  marginTop: '4px',
  color: '#6f6256',
  fontSize: '14px',
  fontWeight: 800,
})

const EmptyState = styled('div')({
  padding: '80px 20px',
  textAlign: 'center',
  background: '#fff',
  border: '1px dashed #d9cec0',
  borderRadius: '28px',
  color: '#8c7d6d',
  fontSize: '15px',
  fontWeight: 850,
})

export default async function MyPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    redirect('/login')
  }

  const orders = await getUserOrders()

  return (
    <Page>
      <Shell>
        <Header>
          <Title>마이페이지</Title>
          <Subtitle>{session.user.name}님, 안녕하세요!</Subtitle>
        </Header>

        <Grid>
          <Nav>
            <ActiveNav href="/mypage">주문 내역</ActiveNav>
            <NavLink href="/mypage/addresses">배송지 관리</NavLink>
            <NavLink href="/wishlist">관심 상품</NavLink>
          </Nav>

          <Content>
            <SectionTitle>최근 주문 내역</SectionTitle>
            {orders.length === 0 ? (
              <EmptyState>주문 내역이 없습니다.</EmptyState>
            ) : (
              orders.map((order) => (
                <OrderCard key={order.id}>
                  <OrderHeader>
                    <div>
                      <OrderNum>주문번호: {order.orderNumber}</OrderNum>
                      <p style={{ fontSize: '12px', color: '#aaa', marginTop: '4px' }}>
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <OrderStatus>{order.status}</OrderStatus>
                  </OrderHeader>
                  <OrderItem>
                    <ItemInfo>
                      <ItemName>
                        {order.items[0]?.product.name}
                        {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                      </ItemName>
                      <ItemPrice>{formatPrice(order.finalPrice)}</ItemPrice>
                    </ItemInfo>
                    <Link 
                      href={`/orders/${order.id}`}
                      style={{ fontSize: '13px', fontWeight: 900, color: '#171512' }}
                    >
                      상세보기 →
                    </Link>
                  </OrderItem>
                </OrderCard>
              ))
            )}
          </Content>
        </Grid>
      </Shell>
    </Page>
  )
}
