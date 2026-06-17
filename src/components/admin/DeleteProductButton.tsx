'use client'

import { useState } from 'react'
import { deleteProduct } from '@/actions/adminActions'
import { useRouter } from 'next/navigation'
import { styled } from '@devup-ui/react'

interface DeleteProductButtonProps {
  productId: number
}

const Button = styled('button')({
  color: '#dc2626',
  fontSize: '14px',
  transition: 'opacity 0.15s ease',
  _hover: {
    textDecoration: 'underline',
  },
  _disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
})

export default function DeleteProductButton({ productId }: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('상품을 삭제하시겠습니까?')) return

    setIsDeleting(true)
    const result = await deleteProduct(productId)
    setIsDeleting(false)

    if (result.success) {
      router.refresh()
      return
    }

    alert(result.error)
  }

  return (
    <Button
      type="button"
      disabled={isDeleting}
      onClick={handleDelete}
    >
      {isDeleting ? '삭제 중' : '삭제'}
    </Button>
  )
}
