'use client'

import { useState } from 'react'
import { toggleWishlist } from '@/actions/wishlistActions'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'

interface WishlistButtonProps {
  productId: number
  isInitiallyAdded: boolean
}

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

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-full border transition-colors ${
        isAdded ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
      }`}
    >
      <Heart size={20} fill={isAdded ? 'currentColor' : 'none'} />
    </button>
  )
}
