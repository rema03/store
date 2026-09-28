import { getProducts, getCategories } from '@/actions/productActions'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'
import Image from 'next/image'
import { styled } from '@/lib/styled'

export const dynamic = 'force-dynamic'

const heroImage = 'https://images.unsplash.com/photo-1491904768633-2b7e3e7fede5?q=80&w=2400'

const categoryImages = [
  'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000', // headphone/tech
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000', // sneaker
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000', // watch
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000', // audio
]

const storyImages = [
  'https://images.unsplash.com/photo-1449247613801-ab06418e2861?q=80&w=1200', // premium lifestyle
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000', // architecture/clean
]

const Page = styled('div')({
  background: '#fafafa',
})

const Hero = styled('section')({
  position: 'relative',
  minHeight: ['680px', '820px'],
  overflow: 'hidden',
  background: '#111',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const HeroImageWrapper = styled('div')({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  opacity: 0.6,
})

const HeroContent = styled('div')({
  position: 'relative',
  zIndex: 2,
  maxWidth: '900px',
  margin: '0 auto',
  padding: ['0 24px', '0 40px'],
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const Eyebrow = styled('p')({
  marginBottom: '24px',
  color: 'rgba(255,255,255,0.8)',
  fontSize: '14px',
  fontWeight: 600,
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
})

const HeroTitle = styled('h1')({
  color: '#ffffff',
  fontSize: ['48px', '82px'],
  fontWeight: 800,
  lineHeight: 1.05,
  letterSpacing: '-0.04em',
  textShadow: '0 20px 40px rgba(0,0,0,0.4)',
})

const HeroText = styled('p')({
  maxWidth: '600px',
  marginTop: '32px',
  color: 'rgba(255,255,255,0.9)',
  fontSize: ['18px', '22px'],
  lineHeight: 1.6,
  fontWeight: 400,
})

const HeroActions = styled('div')({
  display: 'flex',
  flexDirection: ['column', 'row'],
  gap: '16px',
  marginTop: '48px',
})

const PrimaryLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '56px',
  padding: '0 32px',
  borderRadius: '999px',
  background: '#ffffff',
  color: '#111111',
  fontSize: '16px',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  _hover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 10px 25px rgba(255,255,255,0.2)',
  },
})

const SecondaryLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '56px',
  padding: '0 32px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.2)',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 600,
  transition: 'all 0.3s ease',
  _hover: {
    background: 'rgba(255,255,255,0.2)',
    transform: 'translateY(-2px)',
  },
})

const Section = styled('section')({
  maxWidth: '1280px',
  margin: '0 auto',
  padding: ['80px 24px', '120px 40px'],
})

const SectionHeader = styled('div')({
  display: 'flex',
  alignItems: ['flex-start', 'flex-end'],
  justifyContent: 'space-between',
  flexDirection: ['column', 'row'],
  gap: '16px',
  marginBottom: '48px',
})

const SectionTitle = styled('h2')({
  color: '#111111',
  fontSize: ['32px', '48px'],
  fontWeight: 800,
  letterSpacing: '-0.04em',
})

const SectionSub = styled('p')({
  marginTop: '12px',
  color: '#666666',
  fontSize: '18px',
})

const TextLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: '#111111',
  fontSize: '16px',
  fontWeight: 600,
  transition: 'opacity 0.2s',
  _hover: {
    opacity: 0.7,
  },
})

const CategoryGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr', 'repeat(4, 1fr)'],
  gap: ['16px', '24px'],
})

const CategoryCard = styled(Link)({
  position: 'relative',
  minHeight: ['280px', '400px'],
  overflow: 'hidden',
  borderRadius: '24px',
  background: '#ffffff',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  _hover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
  },
})

const CategoryShade = styled('div')({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.6) 100%)',
})

const CategoryName = styled('span')({
  position: 'absolute',
  left: '24px',
  bottom: '24px',
  zIndex: 2,
  color: '#ffffff',
  fontSize: ['24px', '28px'],
  fontWeight: 700,
  letterSpacing: '-0.02em',
})

const ProductGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr 1fr', 'repeat(4, 1fr)'],
  gap: ['32px 16px', '48px 24px'],
})

const Story = styled('section')({
  background: '#ffffff',
  padding: ['80px 0', '140px 0'],
})

const StoryInner = styled('div')({
  maxWidth: '1280px',
  margin: '0 auto',
  padding: ['0 24px', '0 40px'],
  display: 'grid',
  gridTemplateColumns: ['1fr', '1fr 1.2fr'],
  gap: ['60px', '100px'],
  alignItems: 'center',
})

const StoryTitle = styled('h2')({
  fontSize: ['40px', '64px'],
  fontWeight: 800,
  lineHeight: 1.1,
  letterSpacing: '-0.04em',
  color: '#111111',
})

const StoryText = styled('p')({
  marginTop: '32px',
  color: '#666666',
  fontSize: '18px',
  lineHeight: 1.7,
})

const StoryMedia = styled('div')({
  position: 'relative',
  minHeight: ['400px', '640px'],
})

const StoryImageLarge = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '85%',
  height: '85%',
  overflow: 'hidden',
  borderRadius: '32px',
  boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
})

const StoryImageSmall = styled('div')({
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '50%',
  height: '50%',
  overflow: 'hidden',
  borderRadius: '24px',
  border: '8px solid #ffffff',
  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
})

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts({}),
    getCategories()
  ])

  const newArrivals = products.slice(0, 8)

  return (
    <Page>
      <Hero>
        <HeroImageWrapper>
          <Image
            src={heroImage}
            alt="Premium curated collection"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', filter: 'brightness(0.8)' }}
          />
        </HeroImageWrapper>
        <HeroContent>
          <Eyebrow>New Collection</Eyebrow>
          <HeroTitle>Experience the Excellence</HeroTitle>
          <HeroText>
            엄선된 프리미엄 아이템, 당신의 일상에 특별함을 더합니다.
            타협하지 않는 퀄리티와 모던한 감각을 지금 바로 만나보세요.
          </HeroText>
          <HeroActions>
            <PrimaryLink href="/products">컬렉션 보기</PrimaryLink>
            <SecondaryLink href="#categories">카테고리 탐색</SecondaryLink>
          </HeroActions>
        </HeroContent>
      </Hero>

      <Section id="categories">
        <SectionHeader>
          <div>
            <SectionTitle>Curated Categories</SectionTitle>
            <SectionSub>라이프스타일을 업그레이드할 카테고리를 선택하세요.</SectionSub>
          </div>
        </SectionHeader>
        <CategoryGrid>
          {categories.slice(0, 4).map((cat, index) => (
            <CategoryCard key={cat.id} href={`/products?category=${cat.id}`}>
              <Image
                src={categoryImages[index % categoryImages.length]}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
              <CategoryShade />
              <CategoryName>{cat.name}</CategoryName>
            </CategoryCard>
          ))}
        </CategoryGrid>
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <SectionTitle>Latest Exclusives</SectionTitle>
            <SectionSub>가장 먼저 만나보는 신상품 라인업.</SectionSub>
          </div>
          <TextLink href="/products">전체 상품 보기 &rarr;</TextLink>
        </SectionHeader>
        <ProductGrid>
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductGrid>
      </Section>

      <Story>
        <StoryInner>
          <div>
            <StoryTitle>Designed for<br/>Modern Life.</StoryTitle>
            <StoryText>
              우리는 트렌드를 넘어 변하지 않는 가치를 추구합니다.
              최고의 소재와 세심한 디테일, 미니멀한 디자인 철학을 바탕으로
              당신의 모든 순간을 빛나게 해줄 특별한 제품만을 제안합니다.
            </StoryText>
          </div>
          <StoryMedia>
            <StoryImageLarge>
              <Image
                src={storyImages[0]}
                alt="Premium lifestyle"
                fill
                sizes="50vw"
                style={{ objectFit: 'cover' }}
              />
            </StoryImageLarge>
            <StoryImageSmall>
              <Image
                src={storyImages[1]}
                alt="Minimalist design"
                fill
                sizes="30vw"
                style={{ objectFit: 'cover' }}
              />
            </StoryImageSmall>
          </StoryMedia>
        </StoryInner>
      </Story>
    </Page>
  )
}
