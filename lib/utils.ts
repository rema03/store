import { DiscountType } from '@prisma/client'

// Price formatting
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    minimumFractionDigits: 0,
  }).format(price)
}

// Order number generation
export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = crypto.randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase()
  return `ORD-${timestamp.slice(-8)}-${random}`
}

// Toss Order ID generation
export const generateTossOrderId = (): string => {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 32)
}

// Calculate discount
export const calculateDiscount = (
  discountType: DiscountType,
  discountValue: number,
  amount: number,
  maxDiscount?: number | null,
): number => {
  let discount = 0

  if (discountType === 'FIXED') {
    discount = discountValue
  } else if (discountType === 'PERCENT') {
    discount = Math.floor(amount * (discountValue / 100))
  }

  if (maxDiscount && discount > maxDiscount) {
    discount = maxDiscount
  }

  return discount
}

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8
}

// Truncate text
export const truncateText = (text: string, length: number): string => {
  return text.length > length ? text.substring(0, length) + '...' : text
}
