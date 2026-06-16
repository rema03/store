import { Suspense } from 'react'
import PaymentSuccess from '@/components/checkout/PaymentSuccess'

export default function SuccessPage() {
  return (
    <div className="container-max py-20">
      <Suspense fallback={
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">페이지를 불러오는 중입니다...</p>
        </div>
      }>
        <PaymentSuccess />
      </Suspense>
    </div>
  )
}
