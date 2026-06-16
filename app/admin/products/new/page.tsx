import { getCategories } from '@/actions/productActions'
import ProductForm from '@/components/admin/ProductForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function NewProductPage() {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== 'ADMIN') {
    redirect('/')
  }

  const categories = await getCategories()

  return (
    <div className="container-max py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">새 상품 등록</h1>
        <p className="text-gray-500 mt-2">새로운 상품 정보를 입력하여 쇼핑몰에 게시합니다.</p>
      </div>
      
      <ProductForm categories={categories} />
    </div>
  )
}
