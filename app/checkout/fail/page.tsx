import Link from 'next/link'

export default function FailPage({
  searchParams,
}: {
  searchParams: { message?: string; code?: string }
}) {
  return (
    <div className="container-max py-40 text-center">
      <div className="text-6xl text-red-500 mb-6">✕</div>
      <h1 className="text-3xl font-bold mb-4">결제에 실패했습니다</h1>
      <p className="text-gray-600 mb-2">{searchParams.message || '알 수 없는 오류가 발생했습니다.'}</p>
      <p className="text-sm text-gray-400 mb-12">에러 코드: {searchParams.code || 'UNKNOWN'}</p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/checkout"
          className="px-8 py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 transition-colors"
        >
          다시 결제하기
        </Link>
        <Link
          href="/cart"
          className="px-8 py-3 border border-gray-300 font-bold rounded-md hover:bg-gray-50 transition-colors"
        >
          장바구니로 이동
        </Link>
      </div>
    </div>
  )
}
