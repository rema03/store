import { getCartItems } from '@/actions/cartActions'
import { getAddresses } from '@/actions/addressActions'
import { getUserCoupons } from '@/actions/couponActions'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import { getServerSession } from '@/lib/auth'

import { redirect } from 'next/navigation'
import { styled } from '@/lib/styled'

const Page = styled('div')({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '48px 24px',
})

const Title = styled('h1')({
  marginBottom: '48px',
  fontSize: '30px',
  fontWeight: 400,
})

export default async function CheckoutPage() {
  const session = await getServerSession()
  if (!session) {
    redirect('/login?callbackUrl=/checkout')
  }

  const [cartItems, addresses, coupons] = await Promise.all([
    getCartItems(),
    getAddresses(),
    getUserCoupons(),
  ])

  if (cartItems.length === 0) {
    redirect('/cart')
  }

  return (
    <Page>
      <Title>주문/결제</Title>
      <CheckoutForm
        cartItems={cartItems}
        addresses={addresses}
        coupons={coupons}
      />
    </Page>
  )
}
