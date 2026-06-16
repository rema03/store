'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function PaymentSuccess() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('결제를 승인 중입니다...')
  const searchParams = useSearchParams()

  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setStatus('error')
      setMessage('결제 정보가 부족합니다.')
      return
    }

    const confirmPayment = async () => {
      try {
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: parseInt(amount),
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage('결제가 성공적으로 완료되었습니다!')
        } else {
          setStatus('error')
          setMessage(data.error || '결제 승인에 실패했습니다.')
        }
      } catch (err) {
        setStatus('error')
        setMessage('서버와의 통신 중 오류가 발생했습니다.')
      }
    }

    confirmPayment()
  }, [paymentKey, orderId, amount])

  return (
    <div className="text-center py-20 px-4">
      {status === 'loading' && (
        <div className="space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="text-lg font-medium">{message}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="space-y-6">
          <div className="text-6xl text-green-500">✓</div>
          <h1 className="text-3xl font-bold">결제 완료!</h1>
          <p className="text-gray-600">{message}</p>
          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/orders"
              className="px-8 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors"
            >
              주문 내역 보기
            </Link>
            <Link
              href="/products"
              className="px-8 py-3 border border-gray-300 font-bold rounded-md hover:bg-gray-50 transition-colors"
            >
              쇼핑 계속하기
            </Link>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-6">
          <div className="text-6xl text-red-500">✕</div>
          <h1 className="text-3xl font-bold">결제 실패</h1>
          <p className="text-gray-600">{message}</p>
          <div className="pt-8">
            <Link
              href="/checkout"
              className="px-8 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors"
            >
              다시 시도하기
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
