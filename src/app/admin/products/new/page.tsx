import { getCategories } from '@/actions/productActions'
import ProductForm from '@/components/admin/ProductForm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { styled } from '@devup-ui/react'

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

export default async function NewProductPage() {
  const session = await getServerSession(authOptions)
  
  if (session?.user?.role !== 'ADMIN') {
    redirect('/')
  }

  const categories = await getCategories()

  return (
    <Page>
      <Header>
        <Title>새 상품 등록</Title>
        <Description>새로운 상품 정보를 입력하여 쇼핑몰에 게시합니다.</Description>
      </Header>
      
      <ProductForm categories={categories} />
    </Page>
  )
}
