'use client'

import { useState } from 'react'
import { deleteProduct } from '@/actions/adminActions'
import { useRouter } from 'next/navigation'

interface DeleteProductButtonProps {
  productId: number
}

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
    <button
      type="button"
      disabled={isDeleting}
      onClick={handleDelete}
      className="text-red-600 hover:underline text-sm disabled:opacity-50"
    >
      {isDeleting ? '삭제 중' : '삭제'}
    </button>
  )
}
