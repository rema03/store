import { getAddresses } from '@/actions/addressActions'
import Link from 'next/link'
import AddressList from '@/components/user/AddressList'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AddressesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login?callbackUrl=/mypage/addresses')

  const addresses = await getAddresses()

  return (
    <div className="container-max py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">배송지 관리</h1>
        <Link 
          href="/mypage/addresses/new" 
          className="px-6 py-2 bg-black text-white font-bold rounded hover:bg-gray-800"
        >
          새 배송지 추가
        </Link>
      </div>

      <AddressList initialAddresses={addresses} />
    </div>
  )
}
