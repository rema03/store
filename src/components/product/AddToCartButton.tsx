'use client'

import { useState } from 'react'
import { addToCart } from '@/actions/cartActions'
import { useRouter } from 'next/navigation'
import { styled } from '@devup-ui/react'

interface AddToCartButtonProps {
  productId: number
  stock: number
}

const CartButton = styled('button')({
  width: '100%',
  minHeight: '56px',
  border: 0,
  borderRadius: '16px',
  background: '#171512',
  color: '#fff',
  fontSize: '13px',
  fontWeight: 950,
  letterSpacing: '0.1em',
  cursor: 'pointer',
  _hover: {
    background: '#3a3128',
  },
  _disabled: {
    background: '#b8aea1',
    cursor: 'not-allowed',
  },
})

export default function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)
    const result = await addToCart(productId, 1)

    if ('error' in result && result.error) {
      if (result.error === '로그인이 필요합니다.') {
        if (confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?')) {
          router.push('/login')
        }
      } else {
        alert(result.error)
      }
    } else if ('success' in result && result.success) {
      if (confirm('상품이 장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?')) {
        router.push('/cart')
      }
    }
    setIsLoading(false)
  }

  return (
    <CartButton
      onClick={handleAddToCart}
      disabled={isLoading || stock === 0}
    >
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </CartButton>
  )
}
