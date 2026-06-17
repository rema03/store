import AddressForm from '@/components/user/AddressForm'
import { styled } from '@devup-ui/react'

const Page = styled('div')({
  background: '#fbf8f2',
  minHeight: '100vh',
})

const Shell = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: ['42px 20px 80px', '64px 20px 110px'],
})

const Title = styled('h1')({
  marginBottom: '34px',
  color: '#171512',
  fontSize: ['36px', '54px'],
  fontWeight: 950,
  letterSpacing: '-0.055em',
})

export default function NewAddressPage() {
  return (
    <Page>
      <Shell>
        <Title>새 배송지 추가</Title>
        <AddressForm />
      </Shell>
    </Page>
  )
}
