import { getWishlistItems } from '@/actions/wishlistActions'
import ProductCard from '@/components/product/ProductCard'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/wishlist')

  const wishlistItems = await getWishlistItems()

  return (
    <div className="container-max py-12">
      <h1 className="text-3xl font-bold mb-8">찜한 상품</h1>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-6">찜한 상품이 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {wishlistItems.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  )
}
