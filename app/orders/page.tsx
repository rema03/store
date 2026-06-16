import { getUserOrders } from '@/actions/orderActions'
import { formatPrice } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

export default async function OrdersPage() {
  const orders = await getUserOrders()

  return (
    <div className="container-max py-12">
      <h1 className="text-3xl font-bold mb-8">주문 내역</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-6">주문 내역이 없습니다.</p>
          <Link href="/products" className="inline-block px-8 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors">
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-8 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">주문일자</p>
                    <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">주문번호</p>
                    <p className="font-bold">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">총 결제금액</p>
                    <p className="font-bold">{formatPrice(order.finalPrice)}</p>
                  </div>
                </div>
                <div className="bg-white px-3 py-1 border border-gray-200 rounded text-sm font-bold">
                  {order.status}
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-20 relative bg-gray-100 rounded overflow-hidden">
                        {item.product.imageUrl && <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{formatPrice(item.price)} | {item.quantity}개</p>
                      </div>
                    </div>
                    <Link href={`/products/${item.productId}`} className="text-sm font-bold border border-gray-300 px-4 py-2 rounded hover:bg-gray-50">
                      상품보기
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
