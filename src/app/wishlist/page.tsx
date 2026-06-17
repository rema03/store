import { getWishlistItems } from '@/actions/wishlistActions'
import ProductCard from '@/components/product/ProductCard'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { styled } from '@devup-ui/react'

const Page = styled('div')({
  background: '#fbf8f2',
})

const Shell = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: ['42px 20px 80px', '64px 20px 110px'],
})

const Title = styled('h1')({
  marginBottom: '30px',
  color: '#171512',
  fontSize: ['40px', '64px'],
  fontWeight: 950,
  letterSpacing: '-0.055em',
})

const Empty = styled('div')({
  display: 'grid',
  placeItems: 'center',
  minHeight: '260px',
  border: '1px dashed #d9cec0',
  borderRadius: '28px',
  background: '#fff',
  color: '#8c7d6d',
  fontWeight: 800,
})

const ProductGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr 1fr', 'repeat(3, 1fr)', 'repeat(4, 1fr)'],
  gap: ['28px 12px', '38px 18px'],
})

export default async function WishlistPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/wishlist')

  const wishlistItems = await getWishlistItems()

  return (
    <Page>
      <Shell>
        <Title>찜한 상품</Title>

        {wishlistItems.length === 0 ? (
          <Empty>찜한 상품이 없습니다.</Empty>
        ) : (
          <ProductGrid>
            {wishlistItems.map((item) => (
              <ProductCard key={item.id} product={item.product} />
            ))}
          </ProductGrid>
        )}
      </Shell>
    </Page>
  )
}
