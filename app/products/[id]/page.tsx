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
import { styled } from '@devup-ui/react'

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

const Page = styled('div')({
  background: '#fbf8f2',
})

const Shell = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: ['42px 20px 80px', '72px 20px 110px'],
})

const DetailGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr', '1.05fr 0.95fr'],
  gap: ['34px', '64px'],
  alignItems: 'start',
})

const Gallery = styled('div')({
  display: 'grid',
  gap: '16px',
})

const MainImage = styled('div')({
  position: 'relative',
  aspectRatio: '3 / 4',
  overflow: 'hidden',
  border: '1px solid #e9e0d5',
  borderRadius: '30px',
  background: '#efe7dc',
  boxShadow: '0 24px 60px rgba(39,31,22,0.10)',
})

const Placeholder = styled('div')({
  height: '100%',
  display: 'grid',
  placeItems: 'center',
  color: '#9a8d7f',
  fontWeight: 900,
})

const ThumbGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '12px',
})

const Thumb = styled('div')({
  position: 'relative',
  aspectRatio: '3 / 4',
  overflow: 'hidden',
  border: '1px solid #e9e0d5',
  borderRadius: '18px',
  background: '#efe7dc',
})

const Info = styled('div')({
  position: ['static', 'sticky'],
  top: '112px',
  display: 'grid',
  gap: '26px',
})

const Category = styled('p')({
  color: '#8c7d6d',
  fontSize: '13px',
  fontWeight: 900,
  letterSpacing: '0.12em',
})

const Title = styled('h1')({
  marginTop: '10px',
  color: '#171512',
  fontSize: ['38px', '56px'],
  fontWeight: 950,
  lineHeight: 1,
  letterSpacing: '-0.055em',
})

const Price = styled('p')({
  marginTop: '18px',
  color: '#2d261f',
  fontSize: '26px',
  fontWeight: 950,
})

const Panel = styled('div')({
  padding: '22px',
  border: '1px solid #e8e0d5',
  borderRadius: '24px',
  background: '#fff',
  boxShadow: '0 18px 45px rgba(39,31,22,0.06)',
})

const PanelTitle = styled('h2')({
  marginBottom: '12px',
  color: '#8c7d6d',
  fontSize: '12px',
  fontWeight: 950,
  letterSpacing: '0.14em',
})

const Description = styled('p')({
  color: '#544b42',
  fontSize: '15px',
  lineHeight: 1.8,
  whiteSpace: 'pre-line',
})

const StockRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '14px',
  color: '#5f554b',
  fontSize: '15px',
})

const StockValue = styled('span')({
  color: '#166534',
  fontWeight: 900,
})

const SoldOutValue = styled('span')({
  color: '#b91c1c',
  fontWeight: 900,
})

const ActionRow = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  gap: '12px',
})

const Reviews = styled('section')({
  marginTop: ['72px', '110px'],
  paddingTop: '42px',
  borderTop: '1px solid #e8e0d5',
})

const ReviewHead = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '26px',
})

const ReviewTitle = styled('h2')({
  color: '#171512',
  fontSize: ['28px', '36px'],
  fontWeight: 950,
  letterSpacing: '-0.04em',
})

const EmptyReview = styled('p')({
  display: 'grid',
  placeItems: 'center',
  minHeight: '180px',
  border: '1px dashed #d9cec0',
  borderRadius: '24px',
  background: '#fff',
  color: '#8c7d6d',
  fontWeight: 800,
})

const ReviewList = styled('div')({
  display: 'grid',
  gap: '18px',
})

const ReviewItem = styled('article')({
  padding: '22px',
  border: '1px solid #e8e0d5',
  borderRadius: '22px',
  background: '#fff',
})

const ReviewMeta = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '12px',
})

const ReviewName = styled('p')({
  color: '#171512',
  fontWeight: 900,
})

const ReviewDate = styled('p')({
  color: '#8c7d6d',
  fontSize: '13px',
})

const Stars = styled('div')({
  marginBottom: '12px',
  color: '#171512',
  fontSize: '18px',
  letterSpacing: '0.04em',
})

const ReviewContent = styled('p')({
  color: '#544b42',
  lineHeight: 1.7,
})

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const session = await getServerSession(authOptions)
  const product = await getProductById(parseInt(params.id))

  if (!product) {
    notFound()
  }

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
    <Page>
      <Shell>
        <DetailGrid>
          <Gallery>
            <MainImage>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <Placeholder>이미지 없음</Placeholder>
              )}
            </MainImage>

            {product.images.length > 0 && (
              <ThumbGrid>
                {product.images.map((img) => (
                  <Thumb key={img.id}>
                    <Image
                      src={img.url}
                      alt={`${product.name} detail`}
                      fill
                      sizes="120px"
                      style={{ objectFit: 'cover' }}
                    />
                  </Thumb>
                ))}
              </ThumbGrid>
            )}
          </Gallery>

          <Info>
            <div>
              <Category>{product.category.name}</Category>
              <Title>{product.name}</Title>
              <Price>{formatPrice(product.price)}</Price>
            </div>

            <Panel>
              <PanelTitle>DESCRIPTION</PanelTitle>
              <Description>{product.description || '상품 설명이 없습니다.'}</Description>
            </Panel>

            <Panel>
              <StockRow>
                <span>재고 상태</span>
                {product.stock > 0 ? (
                  <StockValue>재고 있음 ({product.stock}개)</StockValue>
                ) : (
                  <SoldOutValue>품절</SoldOutValue>
                )}
              </StockRow>
            </Panel>

            <ActionRow>
              <AddToCartButton productId={product.id} stock={product.stock} />
              <WishlistButton productId={product.id} isInitiallyAdded={isWishlisted} />
            </ActionRow>
          </Info>
        </DetailGrid>

        <Reviews>
          <ReviewHead>
            <ReviewTitle>리뷰 ({product.reviews.length})</ReviewTitle>
          </ReviewHead>

          {session?.user && (
            <Panel>
              <ReviewForm productId={product.id} />
            </Panel>
          )}

          {product.reviews.length === 0 ? (
            <EmptyReview>첫 번째 리뷰를 작성해보세요!</EmptyReview>
          ) : (
            <ReviewList>
              {product.reviews.map((review) => (
                <ReviewItem key={review.id}>
                  <ReviewMeta>
                    <ReviewName>{review.user.name}</ReviewName>
                    <ReviewDate>{new Date(review.createdAt).toLocaleDateString()}</ReviewDate>
                  </ReviewMeta>
                  <Stars>
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                    ))}
                  </Stars>
                  <ReviewContent>{review.content}</ReviewContent>
                </ReviewItem>
              ))}
            </ReviewList>
          )}
        </Reviews>
      </Shell>
    </Page>
  )
}
