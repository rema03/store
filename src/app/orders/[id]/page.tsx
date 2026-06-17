import { getOrderById } from '@/actions/orderActions'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { styled } from '@devup-ui/react'

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

const Page = styled('div')({
  width: '100%',
  maxWidth: '960px',
  margin: '0 auto',
  padding: '48px 24px',
})

const BackLink = styled(Link)({
  display: 'inline-flex',
  marginBottom: '24px',
  color: '#666',
  fontSize: '14px',
  fontWeight: 800,
})

const Title = styled('h1')({
  marginBottom: '28px',
  fontSize: '30px',
  fontWeight: 900,
})

const Panel = styled('section')({
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
  padding: ['20px', '28px'],
})

const MetaGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr', 'repeat(2, minmax(0, 1fr))'],
  gap: '16px',
  marginBottom: '28px',
})

const Label = styled('p')({
  color: '#777',
  fontSize: '12px',
  fontWeight: 800,
})

const Value = styled('p')({
  marginTop: '5px',
  fontSize: '15px',
  fontWeight: 900,
})

const SectionTitle = styled('h2')({
  margin: '28px 0 16px',
  fontSize: '18px',
  fontWeight: 900,
})

const ItemList = styled('div')({
  display: 'grid',
  gap: '12px',
})

const Item = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  borderTop: '1px solid #eee',
  paddingTop: '12px',
})

const Thumb = styled('div')({
  position: 'relative',
  width: '64px',
  height: '80px',
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: '6px',
  background: '#f1f1f1',
})

const ItemBody = styled('div')({
  flex: 1,
})

const ItemName = styled(Link)({
  fontWeight: 900,
})

const Muted = styled('p')({
  marginTop: '5px',
  color: '#777',
  fontSize: '13px',
})

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const orderId = Number(params.id)
  if (!Number.isInteger(orderId)) notFound()

  const order = await getOrderById(orderId)
  if (!order) notFound()

  return (
    <Page>
      <BackLink href="/orders">← 주문 내역으로</BackLink>
      <Title>주문 상세</Title>
      <Panel>
        <MetaGrid>
          <div>
            <Label>주문번호</Label>
            <Value>{order.orderNumber}</Value>
          </div>
          <div>
            <Label>주문 상태</Label>
            <Value>{order.status}</Value>
          </div>
          <div>
            <Label>결제 금액</Label>
            <Value>{formatPrice(order.finalPrice)}</Value>
          </div>
          <div>
            <Label>주문일</Label>
            <Value>{new Date(order.createdAt).toLocaleDateString()}</Value>
          </div>
        </MetaGrid>

        <SectionTitle>배송지</SectionTitle>
        <Value>{order.receiverName} / {order.receiverPhone}</Value>
        <Muted>
          ({order.zipCode}) {order.address1} {order.address2 ?? ''}
        </Muted>

        <SectionTitle>주문 상품</SectionTitle>
        <ItemList>
          {order.items.map((item) => (
            <Item key={item.id}>
              <Thumb>
                {item.product.imageUrl && (
                  <Image
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    fill
                    sizes="64px"
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </Thumb>
              <ItemBody>
                <ItemName href={`/products/${item.productId}`}>{item.product.name}</ItemName>
                <Muted>{item.quantity}개 · {formatPrice(item.price)}</Muted>
              </ItemBody>
              <Value>{formatPrice(item.price * item.quantity)}</Value>
            </Item>
          ))}
        </ItemList>
      </Panel>
    </Page>
  )
}
