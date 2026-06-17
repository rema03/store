import { getAdminProductById } from '@/actions/adminActions'
import { getCategories } from '@/actions/productActions'
import ProductForm from '@/components/admin/ProductForm'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import { styled } from '@devup-ui/react'

interface EditProductPageProps {
  params: {
    id: string
  }
}

const Page = styled('div')({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '48px 24px',
})

const Header = styled('div')({
  marginBottom: '32px',
})

const Title = styled('h1')({
  fontSize: '30px',
  fontWeight: 900,
})

const Description = styled('p')({
  marginTop: '8px',
  color: '#666',
})

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
    <Page>
      <Header>
        <Title>상품 수정</Title>
        <Description>상품 정보를 수정합니다.</Description>
      </Header>

      <ProductForm initialData={product} categories={categories} />
    </Page>
  )
}
