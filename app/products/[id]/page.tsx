import { getProductById, recordRecentView } from '@/actions/productActions'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/product/AddToCartButton'
import ReviewForm from '@/components/review/ReviewForm'
import WishlistButton from '@/components/product/WishlistButton'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const session = await getServerSession(authOptions)
  const product = await getProductById(parseInt(params.id))

  if (!product) {
    notFound()
  }

  // Record recent view if user is logged in
  if (session?.user) {
    recordRecentView(product.id)
  }

  const isWishlisted = session?.user 
    ? !!(await prisma.wishlist.findUnique({
        where: { 
          userId_productId: { 
            userId: parseInt(session.user.id), 
            productId: product.id 
          } 
        }
      }))
    : false

  return (
    <div className="container-max py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left - Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                이미지 없음
              </div>
            )}
          </div>
          
          {/* Detail Images */}
          {product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img) => (
                <div key={img.id} className="relative aspect-[3/4] bg-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={img.url}
                    alt={`${product.name} detail`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right - Product Info */}
        <div className="flex flex-col space-y-8">
          <div>
            <p className="text-gray-500 mb-2">{product.category.name}</p>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
          </div>

          <div className="border-t border-b border-gray-100 py-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">
              Description
            </h2>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {product.description || '상품 설명이 없습니다.'}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">재고 상태</span>
              <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {product.stock > 0 ? `재고 있음 (${product.stock}개)` : '품절'}
              </span>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <AddToCartButton productId={product.id} stock={product.stock} />
              </div>
              <WishlistButton productId={product.id} isInitiallyAdded={isWishlisted} />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 border-t border-gray-200 pt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">리뷰 ({product.reviews.length})</h2>
        </div>

        {session?.user && (
          <div className="mb-12">
            <ReviewForm productId={product.id} />
          </div>
        )}

        {product.reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg">
            첫 번째 리뷰를 작성해보세요!
          </p>
        ) : (
          <div className="space-y-8">
            {product.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="font-bold">{review.user.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < review.rating ? 'text-black text-lg' : 'text-gray-200 text-lg'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
