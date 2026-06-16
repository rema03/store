import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/')

  // 대시보드 통계 데이터 가져오기
  const [productCount, orderCount, userCount, totalSales] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.user.count(),
    prisma.order.aggregate({
      where: { status: 'PAID' },
      _sum: { finalPrice: true },
    }),
  ])

  const stats = [
    { name: '총 상품 수', value: productCount, href: '/admin/products' },
    { name: '총 주문 수(결제완료)', value: orderCount, href: '/admin/orders' },
    { name: '총 회원 수', value: userCount, href: '/admin/users' },
    { name: '총 매출액', value: formatPrice(totalSales._sum.finalPrice || 0), href: '/admin/statistics' },
  ]

  return (
    <div className="container-max py-12">
      <h1 className="text-3xl font-bold mb-8">관리자 대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-medium text-gray-500">{item.name}</p>
            <p className="text-2xl font-bold mt-2">{item.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold mb-4">빠른 관리</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/products/new" className="p-4 bg-gray-50 rounded text-center hover:bg-gray-100 font-medium">
              상품 등록
            </Link>
            <Link href="/admin/orders" className="p-4 bg-gray-50 rounded text-center hover:bg-gray-100 font-medium">
              주문 확인
            </Link>
            <Link href="/admin/coupons" className="p-4 bg-gray-50 rounded text-center hover:bg-gray-100 font-medium">
              쿠폰 생성
            </Link>
            <Link href="/" className="p-4 bg-gray-50 rounded text-center hover:bg-gray-100 font-medium">
              쇼핑몰 홈
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
