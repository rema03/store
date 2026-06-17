import { getUserOrders } from '@/actions/orderActions'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { styled } from '@devup-ui/react'

const Page = styled('div')({
  background: '#fbf8f2',
})

const Shell = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: ['42px 20px 80px', '64px 20px 110px'],
})

const Title = styled('h1')({
  marginBottom: '30px',
  color: '#171512',
  fontSize: ['40px', '64px'],
  fontWeight: 950,
  letterSpacing: '-0.055em',
})

const Empty = styled('div')({
  display: 'grid',
  placeItems: 'center',
  gap: '18px',
  minHeight: '300px',
  border: '1px dashed #d9cec0',
  borderRadius: '28px',
  background: '#fff',
  color: '#8c7d6d',
  fontWeight: 800,
})

const ShopLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '48px',
  padding: '0 18px',
  borderRadius: '14px',
  background: '#171512',
  color: '#fff',
  fontWeight: 900,
})

const OrderList = styled('div')({
  display: 'grid',
  gap: '20px',
})

const OrderCard = styled('article')({
  overflow: 'hidden',
  border: '1px solid #e8e0d5',
  borderRadius: '26px',
  background: '#fff',
  boxShadow: '0 18px 45px rgba(39,31,22,0.06)',
})

const OrderHead = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: '18px',
  padding: '20px',
  background: '#f5efe6',
})

const MetaGrid = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  gap: ['16px', '34px'],
})

const MetaLabel = styled('p')({
  marginBottom: '4px',
  color: '#8c7d6d',
  fontSize: '12px',
  fontWeight: 800,
})

const MetaValue = styled('p')({
  color: '#171512',
  fontSize: '14px',
  fontWeight: 900,
})

const Status = styled('div')({
  alignSelf: 'start',
  padding: '8px 12px',
  border: '1px solid #e0d5c8',
  borderRadius: '999px',
  background: '#fff',
  color: '#171512',
  fontSize: '12px',
  fontWeight: 950,
})

const Items = styled('div')({
  display: 'grid',
})

const ItemRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  padding: '18px 20px',
  borderTop: '1px solid #f0e9df',
})

const ProductInfo = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
})

const ProductImage = styled('div')({
  position: 'relative',
  width: '64px',
  height: '80px',
  overflow: 'hidden',
  borderRadius: '14px',
  background: '#efe7dc',
})

const ProductName = styled('p')({
  color: '#171512',
  fontWeight: 900,
})

const ProductMeta = styled('p')({
  marginTop: '4px',
  color: '#8c7d6d',
  fontSize: '13px',
})

const ProductLink = styled(Link)({
  padding: '10px 13px',
  border: '1px solid #e0d5c8',
  borderRadius: '13px',
  color: '#171512',
  fontSize: '13px',
  fontWeight: 900,
})

export default async function OrdersPage() {
  const orders = await getUserOrders()

  return (
    <Page>
      <Shell>
        <Title>주문 내역</Title>

        {orders.length === 0 ? (
          <Empty>
            <p>주문 내역이 없습니다.</p>
            <ShopLink href="/products">쇼핑하러 가기</ShopLink>
          </Empty>
        ) : (
          <OrderList>
            {orders.map((order) => (
              <OrderCard key={order.id}>
                <OrderHead>
                  <MetaGrid>
                    <div>
                      <MetaLabel>주문일자</MetaLabel>
                      <MetaValue>{new Date(order.createdAt).toLocaleDateString()}</MetaValue>
                    </div>
                    <div>
                      <MetaLabel>주문번호</MetaLabel>
                      <MetaValue>{order.orderNumber}</MetaValue>
                    </div>
                    <div>
                      <MetaLabel>총 결제금액</MetaLabel>
                      <MetaValue>{formatPrice(order.finalPrice)}</MetaValue>
                    </div>
                  </MetaGrid>
                  <Status>{order.status}</Status>
                </OrderHead>
                <Items>
                  {order.items.map((item) => (
                    <ItemRow key={item.id}>
                      <ProductInfo>
                        <ProductImage>
                          {item.product.imageUrl && (
                            <Image
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              fill
                              sizes="64px"
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                        </ProductImage>
                        <div>
                          <ProductName>{item.product.name}</ProductName>
                          <ProductMeta>{formatPrice(item.price)} | {item.quantity}개</ProductMeta>
                        </div>
                      </ProductInfo>
                      <ProductLink href={`/products/${item.productId}`}>상품보기</ProductLink>
                    </ItemRow>
                  ))}
                </Items>
              </OrderCard>
            ))}
          </OrderList>
        )}
      </Shell>
    </Page>
  )
}
