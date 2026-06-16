'use client'

import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { updateCartItemQuantity, removeFromCart } from '@/actions/cartActions'
import { useState } from 'react'

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
    <div className="flex items-center py-6 border-b border-gray-100 last:border-0">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        {item.product.imageUrl ? (
          <Image
            src={item.product.imageUrl}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-50 text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3>{item.product.name}</h3>
            <p className="ml-4">{formatPrice(item.product.price * item.quantity)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">{formatPrice(item.product.price)}</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-30"
            >
              -
            </button>
            <span className="px-4 py-1 border-x border-gray-300 min-w-[40px] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating}
              className="px-2 py-1 hover:bg-gray-100 disabled:opacity-30"
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="font-medium text-gray-500 hover:text-red-600 underline"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
