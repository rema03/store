'use client'

import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

interface CartSummaryProps {
  totalPrice: number
}

export default function CartSummary({ totalPrice }: CartSummaryProps) {
  const shippingFee = totalPrice >= 50000 ? 0 : 3000
  const finalPrice = totalPrice + shippingFee

  return (
    <div className="bg-gray-50 rounded-lg p-6 lg:p-8 space-y-6">
      <h2 className="text-lg font-bold">주문 요약</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">총 상품 금액</span>
          <span className="font-medium">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">배송비</span>
          <span className="font-medium">
            {shippingFee === 0 ? '무료' : formatPrice(shippingFee)}
          </span>
        </div>
        {shippingFee > 0 && (
          <p className="text-xs text-gray-400 text-right">
            50,000원 이상 구매 시 무료배송
          </p>
        )}
        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <span className="text-base font-bold">결제 예정 금액</span>
          <span className="text-xl font-bold text-black">{formatPrice(finalPrice)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block w-full py-4 bg-black text-white text-center font-bold rounded-md hover:bg-gray-800 transition-colors"
      >
        주문하기
      </Link>

      <div className="text-center">
        <Link href="/products" className="text-sm text-gray-500 hover:underline">
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  )
}
