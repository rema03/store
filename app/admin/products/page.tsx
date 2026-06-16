import { getProducts } from '@/actions/productActions'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import DeleteProductButton from '@/components/admin/DeleteProductButton'

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/')

  const products = await getProducts({})

  return (
    <div className="container-max py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">상품 관리</h1>
        <Link
          href="/admin/products/new"
          className="bg-black text-white px-6 py-3 rounded-md font-bold hover:bg-gray-800"
        >
          새 상품 등록
        </Link>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-bold text-sm">상품</th>
              <th className="px-6 py-4 font-bold text-sm">카테고리</th>
              <th className="px-6 py-4 font-bold text-sm">가격</th>
              <th className="px-6 py-4 font-bold text-sm">재고</th>
              <th className="px-6 py-4 font-bold text-sm text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-gray-100 relative rounded">
                      {product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />}
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.category.name}</td>
                <td className="px-6 py-4 text-sm font-bold">{formatPrice(product.price)}</td>
                <td className="px-6 py-4 text-sm">{product.stock}개</td>
                <td className="px-6 py-4 text-right space-x-4">
                  <Link href={`/admin/products/${product.id}/edit`} className="text-blue-600 hover:underline text-sm">수정</Link>
                  <DeleteProductButton productId={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
