import { getProducts } from '@/actions/productActions'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import DeleteProductButton from '@/components/admin/DeleteProductButton'
import { styled } from '@devup-ui/react'

const Page = styled('div')({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '48px 24px',
})

const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  marginBottom: '32px',
  _media: {
    '(max-width: 640px)': {
      alignItems: 'stretch',
      flexDirection: 'column',
    },
  },
})

const Title = styled('h1')({
  fontSize: '30px',
  fontWeight: 900,
})

const CreateLink = styled(Link)({
  borderRadius: '6px',
  background: '#111',
  color: '#fff',
  fontWeight: 900,
  padding: '12px 24px',
  textAlign: 'center',
  transition: 'background 0.15s ease',
  _hover: {
    background: '#2a2a2a',
  },
})

const TableWrap = styled('div')({
  overflowX: 'auto',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
})

const Table = styled('table')({
  width: '100%',
  minWidth: '760px',
  borderCollapse: 'collapse',
  textAlign: 'left',
})

const Thead = styled('thead')({
  borderBottom: '1px solid #ddd',
  background: '#f7f7f7',
})

const Th = styled('th')({
  padding: '16px 24px',
  fontSize: '14px',
  fontWeight: 900,
})

const ThRight = styled(Th)({
  textAlign: 'right',
})

const Tr = styled('tr')({
  borderTop: '1px solid #ddd',
  transition: 'background 0.15s ease',
  _hover: {
    background: '#fafafa',
  },
})

const Td = styled('td')({
  padding: '16px 24px',
  fontSize: '14px',
})

const TdMuted = styled(Td)({
  color: '#666',
})

const TdBold = styled(Td)({
  fontWeight: 900,
})

const TdActions = styled(Td)({
  textAlign: 'right',
})

const ProductCell = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
})

const Thumb = styled('div')({
  position: 'relative',
  width: '48px',
  height: '64px',
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: '6px',
  background: '#f1f1f1',
})

const ProductImage = styled(Image)({
  objectFit: 'cover',
})

const ProductName = styled('span')({
  fontWeight: 700,
})

const EditLink = styled(Link)({
  marginRight: '16px',
  color: '#2563eb',
  fontSize: '14px',
  _hover: {
    textDecoration: 'underline',
  },
})

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/')

  const products = await getProducts({})

  return (
    <Page>
      <Header>
        <Title>상품 관리</Title>
        <CreateLink href="/admin/products/new">
          새 상품 등록
        </CreateLink>
      </Header>

      <TableWrap>
        <Table>
          <Thead>
            <tr>
              <Th>상품</Th>
              <Th>카테고리</Th>
              <Th>가격</Th>
              <Th>재고</Th>
              <ThRight>관리</ThRight>
            </tr>
          </Thead>
          <tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>
                  <ProductCell>
                    <Thumb>
                      {product.imageUrl && <ProductImage src={product.imageUrl} alt={product.name} fill />}
                    </Thumb>
                    <ProductName>{product.name}</ProductName>
                  </ProductCell>
                </Td>
                <TdMuted>{product.category.name}</TdMuted>
                <TdBold>{formatPrice(product.price)}</TdBold>
                <Td>{product.stock}개</Td>
                <TdActions>
                  <EditLink href={`/admin/products/${product.id}/edit`}>수정</EditLink>
                  <DeleteProductButton productId={product.id} />
                </TdActions>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableWrap>
    </Page>
  )
}
