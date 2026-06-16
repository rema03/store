'use client'

import { useState } from 'react'
import { addToCart } from '@/actions/cartActions'
import { useRouter } from 'next/navigation'

interface AddToCartButtonProps {
  productId: number
  stock: number
}

export default function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleAddToCart = async () => {
    setIsLoading(true)
    const result = await addToCart(productId, 1)

    if (result.error) {
      if (result.error === '로그인이 필요합니다.') {
        if (confirm('로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?')) {
          router.push('/login')
        }
      } else {
        alert(result.error)
      }
    } else {
      if (confirm('상품이 장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?')) {
        router.push('/cart')
      }
    }
    setIsLoading(false)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading || stock === 0}
      className="w-full py-4 bg-black text-white font-bold rounded-md hover:bg-gray-800 disabled:bg-gray-400 transition-colors uppercase tracking-widest"
    >
      {isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  )
}
