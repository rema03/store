'use client'

import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { updateCartItemQuantity, removeFromCart } from '@/actions/cartActions'
import { useState } from 'react'
import { styled } from '@devup-ui/react'

interface CartItemRowProps {
  item: {
    id: number
    quantity: number
    product: {
      id: number
      name: string
      price: number
      imageUrl: string | null
    }
  }
}

const Row = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['88px 1fr', '112px 1fr'],
  gap: ['14px', '20px'],
  padding: '18px',
  border: '1px solid #e8e0d5',
  borderRadius: '24px',
  background: '#fff',
})

const Media = styled('div')({
  position: 'relative',
  aspectRatio: '3 / 4',
  overflow: 'hidden',
  borderRadius: '16px',
  background: '#efe7dc',
})

const Placeholder = styled('div')({
  height: '100%',
  display: 'grid',
  placeItems: 'center',
  color: '#9a8d7f',
  fontSize: '12px',
  fontWeight: 800,
})

const Body = styled('div')({
  display: 'grid',
  gap: '14px',
})

const Top = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
})

const Name = styled('h3')({
  color: '#171512',
  fontSize: '16px',
  fontWeight: 900,
})

const Price = styled('p')({
  color: '#6f6256',
  fontSize: '14px',
})

const Total = styled('p')({
  color: '#171512',
  fontWeight: 950,
  whiteSpace: 'nowrap',
})

const Bottom = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
})

const Quantity = styled('div')({
  display: 'inline-flex',
  alignItems: 'center',
  overflow: 'hidden',
  border: '1px solid #e1d7ca',
  borderRadius: '14px',
})

const QuantityButton = styled('button')({
  width: '34px',
  height: '34px',
  border: 0,
  background: '#fff',
  cursor: 'pointer',
  _disabled: {
    opacity: 0.35,
    cursor: 'not-allowed',
  },
})

const QuantityValue = styled('span')({
  minWidth: '38px',
  borderLeft: '1px solid #e1d7ca',
  borderRight: '1px solid #e1d7ca',
  textAlign: 'center',
  fontWeight: 850,
})

const RemoveButton = styled('button')({
  border: 0,
  background: 'transparent',
  color: '#9a3412',
  fontSize: '13px',
  fontWeight: 850,
  cursor: 'pointer',
})

export default function CartItemRow({ item }: CartItemRowProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    setIsUpdating(true)
    const result = await updateCartItemQuantity(item.id, newQuantity)
    if (result?.error) alert(result.error)
    setIsUpdating(false)
  }

  const handleRemove = async () => {
    if (confirm('장바구니에서 삭제하시겠습니까?')) {
      await removeFromCart(item.id)
    }
  }

  return (
    <Row>
      <Media>
        {item.product.imageUrl ? (
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            fill
            sizes="112px"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <Placeholder>No Image</Placeholder>
        )}
      </Media>

      <Body>
        <Top>
          <div>
            <Name>{item.product.name}</Name>
            <Price>{formatPrice(item.product.price)}</Price>
          </div>
          <Total>{formatPrice(item.product.price * item.quantity)}</Total>
        </Top>
        <Bottom>
          <Quantity>
            <QuantityButton
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
            >
              -
            </QuantityButton>
            <QuantityValue>{item.quantity}</QuantityValue>
            <QuantityButton
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
            >
              +
            </QuantityButton>
          </Quantity>

          <RemoveButton type="button" onClick={handleRemove}>
            삭제
          </RemoveButton>
        </Bottom>
      </Body>
    </Row>
  )
}
