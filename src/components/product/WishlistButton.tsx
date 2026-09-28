'use client'

import { useState } from 'react'
import { toggleWishlist } from '@/actions/wishlistActions'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { styled } from '@/lib/styled'

interface WishlistButtonProps {
  productId: number
  isInitiallyAdded: boolean
}

const WishButton = styled('button')({
  width: '56px',
  height: '56px',
  display: 'grid',
  placeItems: 'center',
  border: '1px solid #e8e0d5',
  borderRadius: '16px',
  background: '#fff',
  color: '#8c7d6d',
  cursor: 'pointer',
  _hover: {
    borderColor: '#000000',
  },
  _disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
})

const WishButtonActive = styled('button')({
  width: '56px',
  height: '56px',
  display: 'grid',
  placeItems: 'center',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: '16px',
  background: '#000000',
  color: '#fff',
  cursor: 'pointer',
  _disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
})

export default function WishlistButton({ productId, isInitiallyAdded }: WishlistButtonProps) {
  const [isAdded, setIsAdded] = useState(isInitiallyAdded)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    const result = await toggleWishlist(productId)
    
    if (result.error) {
      if (result.error === '로그인이 필요합니다.') {
        router.push('/login')
      } else {
        alert(result.error)
      }
    } else {
      setIsAdded(result.isAdded!)
    }
    setIsLoading(false)
  }

  const ButtonComponent = isAdded ? WishButtonActive : WishButton

  return (
    <ButtonComponent
      onClick={handleToggle}
      disabled={isLoading}
    >
      <Heart size={20} fill={isAdded ? 'currentColor' : 'none'} />
    </ButtonComponent>
  )
}
