import { getCartItems } from '@/actions/cartActions'
import CartItemRow from '@/components/cart/CartItemRow'
import CartSummary from '@/components/cart/CartSummary'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
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

const CartLayout = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr', '1fr 360px'],
  gap: ['28px', '42px'],
  alignItems: 'start',
})

const List = styled('div')({
  display: 'grid',
  gap: '14px',
})

const Sticky = styled('div')({
  position: ['static', 'sticky'],
  top: '104px',
})

export default async function CartPage() {
  const session = await getServerSession(authOptions)
  if (!session) {
    redirect('/login?callbackUrl=/cart')
  }

  const cartItems = await getCartItems()
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  return (
    <Page>
      <Shell>
        <Title>장바구니</Title>

        {cartItems.length === 0 ? (
          <Empty>
            <p>장바구니가 비어 있습니다.</p>
            <ShopLink href="/products">쇼핑하러 가기</ShopLink>
          </Empty>
        ) : (
          <CartLayout>
            <List>
              {cartItems.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </List>
            <Sticky>
              <CartSummary totalPrice={totalPrice} />
            </Sticky>
          </CartLayout>
        )}
      </Shell>
    </Page>
  )
}
