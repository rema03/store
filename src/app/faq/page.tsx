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

const List = styled('div')({
  display: 'grid',
  gap: '16px',
})

const Item = styled('section')({
  padding: '24px',
  border: '1px solid #e5e7eb',
  borderRadius: '16px',
  background: '#ffffff',
})

const Question = styled('h2')({
  marginBottom: '8px',
  fontSize: '18px',
  fontWeight: 600,
})

const Answer = styled('p')({
  color: '#4b5563',
  fontSize: '15px',
  lineHeight: 1.7,
})

export default function FaqPage() {
  const faqs = [
    {
      q: '배송 기간은 얼마나 걸리나요?',
      a: '결제 완료 후 평일 기준 1~3일 이내 출고되며, 지역에 따라 출고 후 1~2일 내 수령하실 수 있습니다.',
    },
    {
      q: '교환 및 반품 신청은 어떻게 하나요?',
      a: '상품 수령 후 7일 이내에 주문 내역 확인 후 고객센터(jjm4216@gmail.com)로 문의해 주세요.',
    },
    {
      q: '무료배송 기준은 어떻게 되나요?',
      a: '기본 무료배송 기준 금액 이상 구매 시 배송비가 무료로 자동 적용됩니다.',
    },
  ]

  return (
    <Page>
      <Title>FAQ &amp; Returns</Title>
      <List>
        {faqs.map((faq) => (
          <Item key={faq.q}>
            <Question>{faq.q}</Question>
            <Answer>{faq.a}</Answer>
          </Item>
        ))}
      </List>
    </Page>
  )
}
