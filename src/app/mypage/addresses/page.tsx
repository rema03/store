import { getAddresses } from '@/actions/addressActions'
import Link from 'next/link'
import AddressList from '@/components/user/AddressList'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { styled } from '@devup-ui/react'

const Page = styled('div')({
  background: '#fbf8f2',
})

const Shell = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: ['42px 20px 80px', '64px 20px 110px'],
})

const Head = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '18px',
  marginBottom: '30px',
})

const Title = styled('h1')({
  color: '#171512',
  fontSize: ['36px', '54px'],
  fontWeight: 950,
  letterSpacing: '-0.055em',
})

const AddLink = styled(Link)({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '46px',
  padding: '0 16px',
  borderRadius: '14px',
  background: '#171512',
  color: '#fff',
  fontSize: '14px',
  fontWeight: 900,
})

export default async function AddressesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/mypage/addresses')

  const addresses = await getAddresses()

  return (
    <Page>
      <Shell>
        <Head>
          <Title>배송지 관리</Title>
          <AddLink href="/mypage/addresses/new">새 배송지 추가</AddLink>
        </Head>

        <AddressList initialAddresses={addresses} />
      </Shell>
    </Page>
  )
}
