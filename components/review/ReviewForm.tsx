'use client'

import { useState } from 'react'
import { createReview } from '@/actions/reviewActions'

interface ReviewFormProps {
  productId: number
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (content.length < 10) return alert('리뷰는 최소 10자 이상 작성해주세요.')

    setIsSubmitting(true)
    const result = await createReview({ productId, rating, content })
    
    if (result.success) {
      alert('리뷰가 등록되었습니다.')
      setContent('')
      setRating(5)
    } else {
      alert(result.error)
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg space-y-4">
      <h3 className="font-bold">리뷰 작성하기</h3>
      
      <div>
        <label className="block text-sm text-gray-500 mb-2">별점</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl ${star <= rating ? 'text-black' : 'text-gray-300'}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-500 mb-2">내용 (최소 10자)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-200 rounded-md focus:ring-black"
          placeholder="상품에 대한 솔직한 후기를 남겨주세요."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-6 py-2 bg-black text-white font-bold rounded-md hover:bg-gray-800 disabled:bg-gray-400"
      >
        {isSubmitting ? '등록 중...' : '리뷰 등록'}
      </button>
    </form>
  )
}
