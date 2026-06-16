import { z } from 'zod'

// User validation
export const registerSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
})

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
})

// Product validation
export const productSchema = z.object({
  name: z.string().min(1, '상품명은 필수입니다'),
  price: z.coerce.number().positive('가격은 0보다 커야 합니다'),
  description: z.string().optional(),
  categoryId: z.coerce.number().positive('카테고리는 필수입니다'),
  stock: z.coerce.number().min(0, '재고는 0 이상이어야 합니다'),
  imageUrl: z.string().optional(),
})

// Cart validation
export const cartItemSchema = z.object({
  productId: z.coerce.number().positive('상품은 필수입니다'),
  quantity: z.coerce.number().min(1, '수량은 1 이상이어야 합니다'),
})

// Review validation
export const reviewSchema = z.object({
  productId: z.coerce.number().positive('상품은 필수입니다'),
  rating: z.coerce.number().min(1).max(5, '별점은 1~5점입니다'),
  content: z.string().min(10, '리뷰는 최소 10자 이상이어야 합니다'),
})

// Address validation
export const addressSchema = z.object({
  receiverName: z.string().min(1, '수령인명은 필수입니다'),
  phone: z.string().min(1, '전화번호는 필수입니다'),
  zipCode: z.string().min(1, '우편번호는 필수입니다'),
  address1: z.string().min(1, '주소는 필수입니다'),
  address2: z.string().optional(),
  isDefault: z.boolean().optional().default(false),
})

// Coupon validation
export const couponSchema = z.object({
  code: z.string().min(1, '쿠폰 코드는 필수입니다'),
  name: z.string().min(1, '쿠폰명은 필수입니다'),
  discountType: z.enum(['FIXED', 'PERCENT']),
  discountValue: z.coerce.number().positive('할인값은 0보다 커야 합니다'),
  minOrderPrice: z.coerce.number().min(0, '최소 주문 금액은 0 이상이어야 합니다'),
  maxDiscount: z.coerce.number().optional(),
})
