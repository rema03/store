'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { createOrder } from '@/actions/orderActions'
import { loadTossPayments } from '@tosspayments/payment-sdk'

interface CheckoutFormProps {
  cartItems: any[]
  addresses: any[]
  coupons: any[]
}

export default function CheckoutForm({ cartItems, addresses, coupons }: CheckoutFormProps) {
  const [selectedAddressId, setSelectedAddressId] = useState(addresses.find(a => a.isDefault)?.id || addresses[0]?.id)
  const [selectedCouponId, setSelectedCouponId] = useState<number | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_develop123456'

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shippingFee = totalPrice >= 50000 ? 0 : 3000
  
  let discountAmount = 0
  if (selectedCouponId) {
    const coupon = coupons.find(c => c.id === selectedCouponId)?.coupon
    if (coupon) {
      if (coupon.discountType === 'PERCENT') {
        discountAmount = Math.floor((totalPrice * coupon.discountValue) / 100)
        if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount)
      } else {
        discountAmount = coupon.discountValue
      }
    }
  }
  
  const finalPrice = totalPrice - discountAmount + shippingFee

  const handleOrder = async () => {
    if (!selectedAddressId) return alert('배송지를 선택해주세요.')
    
    setIsSubmitting(true)
    
    try {
      // 1. 서버에 주문 생성 요청
      const result = await createOrder({
        addressId: selectedAddressId,
        userCouponId: selectedCouponId,
        cartItemIds: cartItems.map(item => item.id),
      })

      if ('error' in result) {
        alert(result.error)
        setIsSubmitting(false)
        return
      }

      if (!result.tossOrderId) {
        alert('결제 주문번호 생성에 실패했습니다.')
        setIsSubmitting(false)
        return
      }

      // 2. Toss Payments 결제창 띄우기
      const tossPayments = await loadTossPayments(clientKey)
      
      await tossPayments.requestPayment('카드', {
        amount: result.finalPrice,
        orderId: result.tossOrderId,
        orderName: cartItems.length > 1 
          ? `${cartItems[0].product.name} 외 ${cartItems.length - 1}건`
          : cartItems[0].product.name,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      })
    } catch (error) {
      console.error('Payment error:', error)
      alert('결제 준비 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-12">
        {/* Address Selection */}
        <section>
          <h2 className="text-xl font-bold mb-6">배송지 정보</h2>
          {addresses.length === 0 ? (
            <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
              <p className="text-gray-500 mb-4">등록된 배송지가 없습니다.</p>
              <button className="text-black font-bold underline">새 배송지 추가</button>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedAddressId === addr.id ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="h-4 w-4 text-black focus:ring-black border-gray-300"
                    />
                    <div className="ml-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{addr.receiverName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded">기본</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">({addr.zipCode}) {addr.address1} {addr.address2}</p>
                      <p className="text-sm text-gray-600">{addr.phone}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </section>

        {/* Coupon Selection */}
        <section>
          <h2 className="text-xl font-bold mb-6">쿠폰 할인</h2>
          <select
            value={selectedCouponId || ''}
            onChange={(e) => setSelectedCouponId(e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-black focus:border-black"
          >
            <option value="">쿠폰 선택 안 함</option>
            {coupons.map((c) => (
              <option key={c.id} value={c.id}>
                {c.coupon.name} ({c.coupon.discountType === 'PERCENT' ? `${c.coupon.discountValue}%` : formatPrice(c.coupon.discountValue)} 할인)
              </option>
            ))}
          </select>
        </section>

        {/* Order Items Review */}
        <section>
          <h2 className="text-xl font-bold mb-6">주문 상품</h2>
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
            {cartItems.map((item) => (
              <div key={item.id} className="py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden relative">
                    {item.product.imageUrl && <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-500">수량: {item.quantity}개</p>
                  </div>
                </div>
                <p className="font-bold text-sm">{formatPrice(item.product.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Payment Summary Sidebar */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 bg-gray-50 rounded-lg p-6 space-y-6">
          <h2 className="text-lg font-bold">최종 결제 금액</h2>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">총 상품 금액</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">쿠폰 할인</span>
              <span className="text-red-600">-{formatPrice(discountAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">배송비</span>
              <span>{shippingFee === 0 ? '무료' : formatPrice(shippingFee)}</span>
            </div>
            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="text-base font-bold">결제 예정 금액</span>
              <span className="text-xl font-bold text-black">{formatPrice(finalPrice)}</span>
            </div>
          </div>

          <button
            onClick={handleOrder}
            disabled={isSubmitting || addresses.length === 0}
            className="w-full py-4 bg-black text-white font-bold rounded-md hover:bg-gray-800 disabled:bg-gray-400 transition-colors uppercase tracking-widest"
          >
            {isSubmitting ? 'Processing...' : '결제하기'}
          </button>
        </div>
      </div>
    </div>
  )
}
