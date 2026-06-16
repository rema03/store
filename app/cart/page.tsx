import { getCartItems } from '@/actions/cartActions'
import CartItemRow from '@/components/cart/CartItemRow'
import CartSummary from '@/components/cart/CartSummary'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

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
    <div className="container-max py-12">
      <h1 className="text-3xl font-bold mb-8">장바구니</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-6">장바구니가 비어 있습니다.</p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors"
          >
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* List of Items */}
          <div className="lg:col-span-2">
            <div className="border-t border-gray-200">
              {cartItems.map((item) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <CartSummary totalPrice={totalPrice} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
