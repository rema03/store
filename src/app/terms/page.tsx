import { styled } from '@/lib/styled'

const Page = styled('div')({
  maxWidth: '880px',
  margin: '0 auto',
  padding: '64px 24px 96px',
})

const Title = styled('h1')({
  marginBottom: '24px',
  fontSize: '32px',
  fontWeight: 700,
})

const Card = styled('div')({
  display: 'grid',
  gap: '16px',
  padding: '28px',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  background: '#ffffff',
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: 1.8,
})

export default function TermsPage() {
  return (
    <Page>
      <Title>Terms of Service</Title>
      <Card>
        <p>본 서비스는 Jimin Store 온라인 쇼핑몰 이용 약관에 따라 운영됩니다.</p>
        <p>결제 대기(PENDING) 주문은 일정 시간 내 결제가 완료되지 않을 경우 자동 취소될 수 있으며, 선점된 재고와 쿠폰은 복구됩니다.</p>
        <p>서비스 이용 관련 문의: jjm4216@gmail.com</p>
      </Card>
    </Page>
  )
}
