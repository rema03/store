'use client'

import { useState } from 'react'
import { createReview } from '@/actions/reviewActions'
import { styled } from '@devup-ui/react'

interface ReviewFormProps {
  productId: number
}

const Form = styled('form')({
  display: 'grid',
  gap: '16px',
  padding: '24px',
  borderRadius: '8px',
  background: '#f7f7f7',
})

const Title = styled('h3')({
  fontWeight: 800,
})

const Field = styled('div')({
  display: 'grid',
  gap: '8px',
})

const Label = styled('label')({
  color: '#666',
  fontSize: '14px',
})

const StarGroup = styled('div')({
  display: 'flex',
  gap: '8px',
})

const StarButton = styled('button')({
  fontSize: '24px',
  lineHeight: 1,
  transition: 'color 0.15s ease',
})

const Textarea = styled('textarea')({
  width: '100%',
  minHeight: '96px',
  resize: 'vertical',
  border: '1px solid #ddd',
  borderRadius: '6px',
  padding: '12px',
  background: '#fff',
  outline: 'none',
  _focus: {
    borderColor: '#111',
  },
})

const SubmitButton = styled('button')({
  justifySelf: 'start',
  borderRadius: '6px',
  background: '#111',
  color: '#fff',
  fontWeight: 800,
  padding: '10px 24px',
  transition: 'background 0.15s ease, opacity 0.15s ease',
  _hover: {
    background: '#2a2a2a',
  },
  _disabled: {
    background: '#aaa',
    cursor: 'not-allowed',
  },
})

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
    <Form onSubmit={handleSubmit}>
      <Title>리뷰 작성하기</Title>
      
      <Field>
        <Label>별점</Label>
        <StarGroup>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarButton
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{ color: star <= rating ? '#111' : '#d1d5db' }}
            >
              ★
            </StarButton>
          ))}
        </StarGroup>
      </Field>

      <Field>
        <Label>내용 (최소 10자)</Label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="상품에 대한 솔직한 후기를 남겨주세요."
        />
      </Field>

      <SubmitButton
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? '등록 중...' : '리뷰 등록'}
      </SubmitButton>
    </Form>
  )
}
