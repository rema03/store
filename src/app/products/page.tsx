import { getProducts, getCategories } from '@/actions/productActions'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'
import { styled } from '@devup-ui/react'

interface ProductsPageProps {
  searchParams: {
    category?: string
    categoryName?: string
    search?: string
    sort?: string
  }
}

const Page = styled('div')({
  background: '#fbf8f2',
})

const Shell = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: ['42px 20px 80px', '64px 20px 110px'],
})

const Hero = styled('section')({
  display: 'grid',
  gridTemplateColumns: ['1fr', '1fr auto'],
  gap: '22px',
  alignItems: 'end',
  marginBottom: '34px',
})

const Eyebrow = styled('p')({
  marginBottom: '10px',
  color: '#8c7d6d',
  fontSize: '12px',
  fontWeight: 900,
  letterSpacing: '0.14em',
})

const Title = styled('h1')({
  color: '#171512',
  fontSize: ['40px', '64px'],
  fontWeight: 950,
  lineHeight: 0.98,
  letterSpacing: '-0.055em',
})

const Count = styled('p')({
  padding: '12px 16px',
  border: '1px solid #e8e0d5',
  borderRadius: '999px',
  background: '#fff',
  color: '#675d52',
  fontSize: '14px',
  fontWeight: 800,
})

const Layout = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr', '240px 1fr'],
  gap: ['30px', '42px'],
  alignItems: 'start',
})

const Sidebar = styled('aside')({
  position: ['static', 'sticky'],
  top: '104px',
  display: 'grid',
  gap: '18px',
})

const FilterBox = styled('div')({
  padding: '18px',
  border: '1px solid #e8e0d5',
  borderRadius: '22px',
  background: '#fff',
  boxShadow: '0 18px 45px rgba(39, 31, 22, 0.06)',
})

const FilterTitle = styled('h2')({
  marginBottom: '12px',
  color: '#171512',
  fontSize: '14px',
  fontWeight: 950,
})

const FilterList = styled('ul')({
  display: 'grid',
  gap: '8px',
  listStyle: 'none',
})

const FilterLink = styled(Link)({
  display: 'block',
  padding: '10px 12px',
  borderRadius: '13px',
  color: '#5c5147',
  fontSize: '14px',
  fontWeight: 800,
  _hover: {
    background: '#f5efe6',
    color: '#171512',
  },
})

const ActiveFilterLink = styled(Link)({
  display: 'block',
  padding: '10px 12px',
  borderRadius: '13px',
  background: '#171512',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 900,
})

const ProductGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr 1fr', 'repeat(3, 1fr)', 'repeat(4, 1fr)'],
  gap: ['28px 12px', '38px 18px'],
})

const Empty = styled('div')({
  display: 'grid',
  placeItems: 'center',
  minHeight: '320px',
  border: '1px dashed #d9cec0',
  borderRadius: '28px',
  background: '#fff',
  color: '#8c7d6d',
  fontSize: '15px',
  fontWeight: 800,
})

function buildSortHref(searchParams: ProductsPageProps['searchParams'], sort: string) {
  return `/products?${new URLSearchParams({
    ...searchParams,
    sort,
  }).toString()}`
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categories = await getCategories()
  const requestedCategoryId = searchParams.category ? parseInt(searchParams.category) : undefined
  const selectedCategory = requestedCategoryId
    ? categories.find((category) => category.id === requestedCategoryId)
    : categories.find((category) => category.name === searchParams.categoryName)
  const categoryId = selectedCategory?.id
  const products = await getProducts({
    categoryId,
    search: searchParams.search,
    sort: searchParams.sort,
  })

  return (
    <Page>
      <Shell>
        <Hero>
          <div>
            <Eyebrow>STORE CATALOG</Eyebrow>
            <Title>{selectedCategory?.name || '전체 상품'}</Title>
          </div>
          <Count>총 {products.length}개 상품</Count>
        </Hero>

        <Layout>
          <Sidebar>
            <FilterBox>
              <FilterTitle>카테고리</FilterTitle>
              <FilterList>
                <li>
                  {!categoryId ? (
                    <ActiveFilterLink href="/products">전체</ActiveFilterLink>
                  ) : (
                    <FilterLink href="/products">전체</FilterLink>
                  )}
                </li>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    {categoryId === cat.id ? (
                      <ActiveFilterLink href={`/products?category=${cat.id}`}>
                        {cat.name}
                      </ActiveFilterLink>
                    ) : (
                      <FilterLink href={`/products?category=${cat.id}`}>
                        {cat.name}
                      </FilterLink>
                    )}
                  </li>
                ))}
              </FilterList>
            </FilterBox>

            <FilterBox>
              <FilterTitle>정렬</FilterTitle>
              <FilterList>
                <li><FilterLink href={buildSortHref(searchParams, 'newest')}>최신순</FilterLink></li>
                <li><FilterLink href={buildSortHref(searchParams, 'price_asc')}>가격 낮은순</FilterLink></li>
                <li><FilterLink href={buildSortHref(searchParams, 'price_desc')}>가격 높은순</FilterLink></li>
              </FilterList>
            </FilterBox>
          </Sidebar>

          <main>
            {products.length === 0 ? (
              <Empty>검색 결과가 없습니다.</Empty>
            ) : (
              <ProductGrid>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductGrid>
            )}
          </main>
        </Layout>
      </Shell>
    </Page>
  )
}
