import { getCartItems } from '@/actions/cartActions'
import { getAddresses } from '@/actions/addressActions'
import { getUserCoupons } from '@/actions/couponActions'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions)
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
    <div className="container-max py-12">
      <h1 className="text-3xl font-bold mb-12">주문/결제</h1>
      <CheckoutForm
        cartItems={cartItems}
        addresses={addresses}
        coupons={coupons}
      />
    </div>
  )
}
