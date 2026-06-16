'use client'

import { useState } from 'react'
import { OrderStatus } from '@prisma/client'
import { updateOrderStatus } from '@/actions/adminActions'

interface OrderStatusSelectProps {
  orderId: number
  initialStatus: OrderStatus
}

export default function OrderStatusSelect({ orderId, initialStatus }: OrderStatusSelectProps) {
  const [status, setStatus] = useState(initialStatus)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true)
    const result = await updateOrderStatus(orderId, newStatus)
    if (result.success) {
      setStatus(newStatus)
    } else {
      alert(result.error)
    }
    setIsUpdating(false)
  }

  return (
    <select
      value={status}
      disabled={isUpdating}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      className="p-2 border border-gray-300 rounded text-xs focus:ring-black"
    >
      {Object.values(OrderStatus).map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}
