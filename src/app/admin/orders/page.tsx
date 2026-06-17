import { getAllOrders } from '@/actions/adminActions'
import { formatPrice } from '@/lib/utils'
import OrderStatusSelect from '@/components/admin/OrderStatusSelect'
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
  transition: 'background 0.15s ease',
  _hover: {
    background: '#fafafa',
  },
})

const Td = styled('td')({
  padding: '16px 24px',
  fontSize: '14px',
})

const TdBold = styled(Td)({
  fontWeight: 900,
})

const TdMuted = styled(Td)({
  color: '#666',
})

const Email = styled('p')({
  color: '#888',
  fontSize: '12px',
})

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  return (
    <Page>
      <Title>주문 관리</Title>

      <TableWrap>
        <Table>
          <Thead>
            <tr>
              <Th>주문번호</Th>
              <Th>주문자</Th>
              <Th>금액</Th>
              <Th>상태</Th>
              <Th>날짜</Th>
            </tr>
          </Thead>
          <tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <TdBold>{order.orderNumber}</TdBold>
                <Td>
                  <p>{order.user.name}</p>
                  <Email>{order.user.email}</Email>
                </Td>
                <TdBold>{formatPrice(order.finalPrice)}</TdBold>
                <Td>
                  <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                </Td>
                <TdMuted>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TdMuted>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Page>
  )
}
