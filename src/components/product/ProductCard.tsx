import Link from 'next/link'
import Image from 'next/image'
import { styled } from '@devup-ui/react'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    imageUrl: string | null
    category: {
      name: string
    }
  }
}

const CardLink = styled(Link)({
  display: 'grid',
  gap: '14px',
})

const Media = styled('div')({
  position: 'relative',
  aspectRatio: '0.75',
  overflow: 'hidden',
  border: '1px solid #eee7dd',
  borderRadius: '22px',
  background: '#f3eee6',
  boxShadow: '0 18px 40px rgba(36, 29, 21, 0.08)',
})

const Placeholder = styled('div')({
  height: '100%',
  display: 'grid',
  placeItems: 'center',
  color: '#9a8d7f',
  fontSize: '13px',
  fontWeight: 800,
})

const Badge = styled('span')({
  position: 'absolute',
  left: '12px',
  top: '12px',
  zIndex: 1,
  padding: '7px 10px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.88)',
  color: '#2b241d',
  fontSize: '11px',
  fontWeight: 900,
  backdropFilter: 'blur(10px)',
})

const Info = styled('div')({
  display: 'grid',
  gap: '5px',
})

const Name = styled('h3')({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  color: '#181411',
  fontSize: '16px',
  fontWeight: 850,
})

const Price = styled('p')({
  color: '#493f35',
  fontSize: '15px',
  fontWeight: 900,
})

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <CardLink href={`/products/${product.id}`}>
      <Media>
        <Badge>{product.category.name}</Badge>
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            style={{ objectFit: 'cover', transition: 'transform 220ms ease' }}
          />
        ) : (
          <Placeholder>이미지 없음</Placeholder>
        )}
      </Media>
      <Info>
        <Name>{product.name}</Name>
        <Price>{formatPrice(product.price)}</Price>
      </Info>
    </CardLink>
  )
}
