import { getAllOrders } from '@/actions/adminActions'
import { formatPrice } from '@/lib/utils'
import OrderStatusSelect from '@/components/admin/OrderStatusSelect'

export default async function AdminOrdersPage() {
  const orders = await getAllOrders()

  return (
    <div className="container-max py-12">
      <h1 className="text-3xl font-bold mb-8">주문 관리</h1>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-bold text-sm">주문번호</th>
              <th className="px-6 py-4 font-bold text-sm">주문자</th>
              <th className="px-6 py-4 font-bold text-sm">금액</th>
              <th className="px-6 py-4 font-bold text-sm">상태</th>
              <th className="px-6 py-4 font-bold text-sm">날짜</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{order.orderNumber}</td>
                <td className="px-6 py-4 text-sm">
                  <p>{order.user.name}</p>
                  <p className="text-xs text-gray-400">{order.user.email}</p>
                </td>
                <td className="px-6 py-4 text-sm font-bold">{formatPrice(order.finalPrice)}</td>
                <td className="px-6 py-4 text-sm">
                  <OrderStatusSelect orderId={order.id} initialStatus={order.status} />
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
