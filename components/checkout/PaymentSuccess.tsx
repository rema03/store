'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { styled } from '@devup-ui/react'

const Shell = styled('div')({
  padding: '80px 16px',
  textAlign: 'center',
})

const Stack = styled('div')({
  display: 'grid',
  justifyItems: 'center',
  gap: '24px',
})

const LoadingStack = styled(Stack)({
  gap: '16px',
})

const Spinner = styled('div')({
  width: '48px',
  height: '48px',
  borderRadius: '999px',
  border: '2px solid #e5e7eb',
  borderBottomColor: '#111',
  animation: 'spin 0.8s linear infinite',
})

const Message = styled('p')({
  color: '#666',
})

const LoadingMessage = styled('p')({
  fontSize: '18px',
  fontWeight: 700,
})

const Icon = styled('div')({
  fontSize: '60px',
  lineHeight: 1,
})

const Title = styled('h1')({
  fontSize: '30px',
  fontWeight: 900,
})

const ActionRow = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '16px',
  paddingTop: '32px',
})

const PrimaryLink = styled(Link)({
  borderRadius: '6px',
  background: '#111',
  color: '#fff',
  fontWeight: 800,
  padding: '12px 32px',
  transition: 'background 0.15s ease',
  _hover: {
    background: '#2a2a2a',
  },
})

const SecondaryLink = styled(Link)({
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontWeight: 800,
  padding: '12px 32px',
  transition: 'background 0.15s ease',
  _hover: {
    background: '#f7f7f7',
  },
})

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
    <Shell>
      {status === 'loading' && (
        <LoadingStack>
          <Spinner />
          <LoadingMessage>{message}</LoadingMessage>
        </LoadingStack>
      )}

      {status === 'success' && (
        <Stack>
          <Icon style={{ color: '#22c55e' }}>✓</Icon>
          <Title>결제 완료!</Title>
          <Message>{message}</Message>
          <ActionRow>
            <PrimaryLink href="/orders">
              주문 내역 보기
            </PrimaryLink>
            <SecondaryLink href="/products">
              쇼핑 계속하기
            </SecondaryLink>
          </ActionRow>
        </Stack>
      )}

      {status === 'error' && (
        <Stack>
          <Icon style={{ color: '#ef4444' }}>✕</Icon>
          <Title>결제 실패</Title>
          <Message>{message}</Message>
          <ActionRow>
            <PrimaryLink href="/checkout">
              다시 시도하기
            </PrimaryLink>
          </ActionRow>
        </Stack>
      )}
    </Shell>
  )
}
