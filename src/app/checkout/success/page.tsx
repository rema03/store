import { Suspense } from 'react'
import PaymentSuccess from '@/components/checkout/PaymentSuccess'
import { styled } from '@devup-ui/react'

const Page = styled('div')({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '80px 24px',
})

const Fallback = styled('div')({
  display: 'grid',
  justifyItems: 'center',
  gap: '16px',
  padding: '80px 0',
  textAlign: 'center',
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

export default function SuccessPage() {
  return (
    <Page>
      <Suspense fallback={
        <Fallback>
          <Spinner />
          <Message>페이지를 불러오는 중입니다...</Message>
        </Fallback>
      }>
        <PaymentSuccess />
      </Suspense>
    </Page>
  )
}
