import { getAdminProductById } from '@/actions/adminActions'
import { getCategories } from '@/actions/productActions'
import ProductForm from '@/components/admin/ProductForm'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/')

  const productId = Number(params.id)
  if (!Number.isInteger(productId)) notFound()

  const [product, categories] = await Promise.all([
    getAdminProductById(productId),
    getCategories(),
  ])

  if (!product) notFound()

  return (
    <div className="container-max py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">상품 수정</h1>
        <p className="text-gray-500 mt-2">상품 정보를 수정합니다.</p>
      </div>

      <ProductForm initialData={product} categories={categories} />
    </div>
  )
}
