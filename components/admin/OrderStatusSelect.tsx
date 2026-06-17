'use client'

import { useState } from 'react'
import { OrderStatus } from '@prisma/client'
import { updateOrderStatus } from '@/actions/adminActions'
import { styled } from '@devup-ui/react'

interface OrderStatusSelectProps {
  orderId: number
  initialStatus: OrderStatus
}

const Select = styled('select')({
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  background: '#fff',
  fontSize: '12px',
  padding: '8px',
  outline: 'none',
  _focus: {
    borderColor: '#111',
  },
  _disabled: {
    opacity: 0.6,
  },
})

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
    <Select
      value={status}
      disabled={isUpdating}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
    >
      {Object.values(OrderStatus).map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </Select>
  )
}
