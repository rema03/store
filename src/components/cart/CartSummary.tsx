'use client'

import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { styled } from '@devup-ui/react'

interface CartSummaryProps {
  totalPrice: number
}

const Summary = styled('div')({
  display: 'grid',
  gap: '20px',
  padding: '24px',
  border: '1px solid #e8e0d5',
  borderRadius: '26px',
  background: '#fff',
  boxShadow: '0 22px 55px rgba(39,31,22,0.08)',
})

const Title = styled('h2')({
  color: '#171512',
  fontSize: '20px',
  fontWeight: 950,
})

const Lines = styled('div')({
  display: 'grid',
  gap: '14px',
})

const Row = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  color: '#5f554b',
  fontSize: '14px',
})

const StrongRow = styled(Row)({
  paddingTop: '16px',
  borderTop: '1px solid #eee7dd',
  color: '#171512',
  fontSize: '16px',
  fontWeight: 950,
})

const Hint = styled('p')({
  color: '#9b8e80',
  fontSize: '12px',
  textAlign: 'right',
})

const CheckoutLink = styled(Link)({
  display: 'grid',
  placeItems: 'center',
  minHeight: '52px',
  borderRadius: '16px',
  background: '#171512',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 950,
})

const ContinueLink = styled(Link)({
  color: '#6f6256',
  fontSize: '14px',
  fontWeight: 800,
  textAlign: 'center',
})

export default function CartSummary({ totalPrice }: CartSummaryProps) {
  const shippingFee = totalPrice >= 50000 ? 0 : 3000
  const finalPrice = totalPrice + shippingFee

  return (
    <Summary>
      <Title>주문 요약</Title>

      <Lines>
        <Row>
          <span>총 상품 금액</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </Row>
        <Row>
          <span>배송비</span>
          <strong>{shippingFee === 0 ? '무료' : formatPrice(shippingFee)}</strong>
        </Row>
        {shippingFee > 0 && <Hint>50,000원 이상 구매 시 무료배송</Hint>}
        <StrongRow>
          <span>결제 예정 금액</span>
          <span>{formatPrice(finalPrice)}</span>
        </StrongRow>
      </Lines>

      <CheckoutLink href="/checkout">주문하기</CheckoutLink>
      <ContinueLink href="/products">쇼핑 계속하기</ContinueLink>
    </Summary>
  )
}
