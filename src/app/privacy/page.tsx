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

export default function PrivacyPage() {
  return (
    <Page>
      <Title>Privacy Policy</Title>
      <Card>
        <p>Jimin Store는 통합 계정(Jimin Accounts) 인증 정보와 주문·배송 처리에 필요한 최소한의 개인정보만을 수집·이용합니다.</p>
        <p>수집된 배송지 및 주문 정보는 결제 확인, 상품 배송, 고객 지원 목적 외에는 사용되지 않으며 관련 법령에 따라 안전하게 관리됩니다.</p>
        <p>개인정보 관련 문의: jjm4216@gmail.com</p>
      </Card>
    </Page>
  )
}
