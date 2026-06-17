import Link from 'next/link'
import { styled } from '@devup-ui/react'

const Page = styled('div')({
  width: '100%',
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '160px 24px',
  textAlign: 'center',
})

const Icon = styled('div')({
  marginBottom: '24px',
  color: '#ef4444',
  fontSize: '60px',
  lineHeight: 1,
})

const Title = styled('h1')({
  marginBottom: '16px',
  fontSize: '30px',
  fontWeight: 900,
})

const Message = styled('p')({
  marginBottom: '8px',
  color: '#666',
})

const Code = styled('p')({
  marginBottom: '48px',
  color: '#888',
  fontSize: '14px',
})

const Actions = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '16px',
})

const PrimaryLink = styled(Link)({
  borderRadius: '6px',
  background: '#111',
  color: '#fff',
  fontWeight: 900,
  padding: '12px 32px',
  transition: 'background 0.15s ease',
  _hover: {
    background: '#2a2a2a',
  },
})

const SecondaryLink = styled(Link)({
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontWeight: 900,
  padding: '12px 32px',
  transition: 'background 0.15s ease',
  _hover: {
    background: '#f7f7f7',
  },
})

export default function FailPage({
  searchParams,
}: {
  searchParams: { message?: string; code?: string }
}) {
  return (
    <Page>
      <Icon>✕</Icon>
      <Title>결제에 실패했습니다</Title>
      <Message>{searchParams.message || '알 수 없는 오류가 발생했습니다.'}</Message>
      <Code>에러 코드: {searchParams.code || 'UNKNOWN'}</Code>
      
      <Actions>
        <PrimaryLink href="/checkout">
          다시 결제하기
        </PrimaryLink>
        <SecondaryLink href="/cart">
          장바구니로 이동
        </SecondaryLink>
      </Actions>
    </Page>
  )
}
