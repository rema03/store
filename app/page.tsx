import { getProducts, getCategories } from '@/actions/productActions'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'
import Image from 'next/image'
import { styled } from '@devup-ui/react'

export const dynamic = 'force-dynamic'

const heroImage =
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2200'

const categoryImages = [
  'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=1000',
  'https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=1000',
  'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000',
  'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1000',
]

const storyImages = [
  'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200',
  'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000',
]

const Page = styled('div')({
  background: '#fbf8f2',
})

const Hero = styled('section')({
  position: 'relative',
  minHeight: ['620px', '720px'],
  overflow: 'hidden',
  background: '#171512',
})

const HeroOverlay = styled('div')({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  background:
    'linear-gradient(90deg, rgba(16,13,10,0.78) 0%, rgba(16,13,10,0.42) 48%, rgba(16,13,10,0.12) 100%)',
})

const HeroContent = styled('div')({
  position: 'relative',
  zIndex: 2,
  maxWidth: '1200px',
  minHeight: ['620px', '720px'],
  margin: '0 auto',
  padding: ['72px 20px', '92px 20px'],
  display: 'flex',
  alignItems: 'center',
})

const HeroCopy = styled('div')({
  maxWidth: '720px',
})

const Eyebrow = styled('p')({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '18px',
  padding: '8px 12px',
  border: '1px solid rgba(255,255,255,0.22)',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.1)',
  color: '#fff',
  fontSize: '12px',
  fontWeight: 900,
  letterSpacing: '0.12em',
  backdropFilter: 'blur(10px)',
})

const HeroTitle = styled('h1')({
  color: '#fff',
  fontSize: ['58px', '96px'],
  fontWeight: 950,
  lineHeight: 0.92,
  letterSpacing: '-0.065em',
})

const HeroText = styled('p')({
  maxWidth: '560px',
  marginTop: '26px',
  color: 'rgba(255,255,255,0.82)',
  fontSize: ['17px', '20px'],
  lineHeight: 1.7,
})

const HeroActions = styled('div')({
  display: 'flex',
  flexDirection: ['column', 'row'],
  gap: '12px',
  marginTop: '34px',
})

const PrimaryLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '52px',
  padding: '0 22px',
  borderRadius: '16px',
  background: '#fff',
  color: '#171512',
  fontSize: '14px',
  fontWeight: 900,
  _hover: {
    background: '#f0e7d8',
  },
})

const SecondaryLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '52px',
  padding: '0 22px',
  border: '1px solid rgba(255,255,255,0.42)',
  borderRadius: '16px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 900,
  _hover: {
    background: 'rgba(255,255,255,0.12)',
  },
})

const Section = styled('section')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: ['64px 20px', '96px 20px'],
})

const SectionHeader = styled('div')({
  display: 'flex',
  alignItems: ['flex-start', 'flex-end'],
  justifyContent: 'space-between',
  flexDirection: ['column', 'row'],
  gap: '18px',
  marginBottom: '28px',
})

const SectionTitle = styled('h2')({
  color: '#171512',
  fontSize: ['30px', '46px'],
  fontWeight: 950,
  letterSpacing: '-0.045em',
})

const SectionSub = styled('p')({
  marginTop: '8px',
  color: '#7e7468',
  fontSize: '15px',
})

const TextLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  color: '#171512',
  fontSize: '14px',
  fontWeight: 900,
})

const CategoryGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr 1fr', 'repeat(4, 1fr)'],
  gap: ['12px', '18px'],
})

const CategoryCard = styled(Link)({
  position: 'relative',
  minHeight: ['220px', '330px'],
  overflow: 'hidden',
  borderRadius: '24px',
  background: '#ebe3d7',
  boxShadow: '0 20px 45px rgba(36, 29, 21, 0.08)',
})

const CategoryShade = styled('div')({
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  background: 'linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.55))',
})

const CategoryName = styled('span')({
  position: 'absolute',
  left: '18px',
  bottom: '18px',
  zIndex: 2,
  color: '#fff',
  fontSize: ['22px', '28px'],
  fontWeight: 950,
  letterSpacing: '-0.04em',
})

const ProductGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr 1fr', 'repeat(4, 1fr)'],
  gap: ['28px 12px', '38px 18px'],
})

const Story = styled('section')({
  background: '#171512',
  color: '#fff',
})

const StoryInner = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: ['72px 20px', '110px 20px'],
  display: 'grid',
  gridTemplateColumns: ['1fr', '0.9fr 1.1fr'],
  gap: ['42px', '72px'],
  alignItems: 'center',
})

const StoryTitle = styled('h2')({
  fontSize: ['42px', '66px'],
  fontWeight: 950,
  lineHeight: 0.98,
  letterSpacing: '-0.055em',
})

const StoryText = styled('p')({
  maxWidth: '520px',
  marginTop: '24px',
  color: '#beb3a5',
  fontSize: '17px',
  lineHeight: 1.8,
})

const StoryStats = styled('div')({
  display: 'flex',
  gap: '24px',
  marginTop: '32px',
})

const StatValue = styled('p')({
  fontSize: '34px',
  fontWeight: 950,
})

const StatLabel = styled('p')({
  marginTop: '4px',
  color: '#8e857a',
  fontSize: '12px',
  fontWeight: 800,
  letterSpacing: '0.12em',
})

const StoryMedia = styled('div')({
  position: 'relative',
  minHeight: ['420px', '580px'],
})

const StoryImageLarge = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  width: '82%',
  height: '78%',
  overflow: 'hidden',
  border: '8px solid #26211c',
  borderRadius: '28px',
})

const StoryImageSmall = styled('div')({
  position: 'absolute',
  left: 0,
  bottom: 0,
  width: '58%',
  height: '56%',
  overflow: 'hidden',
  border: '8px solid #171512',
  borderRadius: '28px',
  boxShadow: '0 25px 60px rgba(0,0,0,0.34)',
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
        <Image
          src={heroImage}
          alt="Fashion store display"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
        <HeroOverlay />
        <HeroContent>
          <HeroCopy>
            <Eyebrow>SEASON CURATION</Eyebrow>
            <HeroTitle>THE NEW COLLECTION</HeroTitle>
            <HeroText>
              당신의 무드를 완성하는 감각적인 패션 큐레이션.
              매일 입기 좋은 스타일을 더 단정하고 빠르게 만나보세요.
            </HeroText>
            <HeroActions>
              <PrimaryLink href="/products">상품 보러가기</PrimaryLink>
              <SecondaryLink href="#categories">카테고리 보기</SecondaryLink>
            </HeroActions>
          </HeroCopy>
        </HeroContent>
      </Hero>

      <Section id="categories">
        <SectionHeader>
          <div>
            <SectionTitle>Shop by Category</SectionTitle>
            <SectionSub>자주 찾는 카테고리를 빠르게 둘러보세요.</SectionSub>
          </div>
        </SectionHeader>
        <CategoryGrid>
          {categories.slice(0, 4).map((cat, index) => (
            <CategoryCard key={cat.id} href={`/products?category=${cat.id}`}>
              <Image
                src={categoryImages[index % categoryImages.length]}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
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
            <SectionTitle>New Arrivals</SectionTitle>
            <SectionSub>방금 업데이트된 신상품을 확인해보세요.</SectionSub>
          </div>
          <TextLink href="/products">전체 보기 →</TextLink>
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
            <StoryTitle>More than just fashion</StoryTitle>
            <StoryText>
              우리는 단순한 옷을 파는 것이 아니라, 당신만의 이야기를 담을 수 있는 스타일을 만듭니다.
              지속 가능한 소재와 변하지 않는 가치를 담은 컬렉션을 경험해보세요.
            </StoryText>
            <StoryStats>
              <div>
                <StatValue>10K+</StatValue>
                <StatLabel>CUSTOMERS</StatLabel>
              </div>
              <div>
                <StatValue>500+</StatValue>
                <StatLabel>STYLES</StatLabel>
              </div>
            </StoryStats>
          </div>
          <StoryMedia>
            <StoryImageLarge>
              <Image
                src={storyImages[0]}
                alt="Curated fashion rack"
                fill
                sizes="50vw"
                style={{ objectFit: 'cover' }}
              />
            </StoryImageLarge>
            <StoryImageSmall>
              <Image
                src={storyImages[1]}
                alt="Leather bag detail"
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
