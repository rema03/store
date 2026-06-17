'use client'

import { useState } from 'react'
import { deleteAddress, setDefaultAddress } from '@/actions/addressActions'
import { styled } from '@devup-ui/react'

interface Address {
  id: number
  receiverName: string
  phone: string
  zipCode: string
  address1: string
  address2: string | null
  isDefault: boolean
}

const Grid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr', '1fr 1fr'],
  gap: '18px',
})

const Empty = styled('div')({
  gridColumn: '1 / -1',
  display: 'grid',
  placeItems: 'center',
  minHeight: '220px',
  border: '1px dashed #d9cec0',
  borderRadius: '24px',
  background: '#fff',
  color: '#8c7d6d',
  fontWeight: 800,
})

const Card = styled('div')({
  padding: '20px',
  border: '1px solid #e8e0d5',
  borderRadius: '22px',
  background: '#fff',
})

const DefaultCard = styled('div')({
  padding: '20px',
  border: '1px solid #171512',
  borderRadius: '22px',
  background: '#fff',
})

const Head = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '16px',
  marginBottom: '14px',
})

const Receiver = styled('span')({
  color: '#171512',
  fontSize: '18px',
  fontWeight: 950,
})

const Badge = styled('span')({
  marginLeft: '8px',
  padding: '4px 7px',
  borderRadius: '999px',
  background: '#171512',
  color: '#fff',
  fontSize: '10px',
  fontWeight: 900,
})

const Actions = styled('div')({
  display: 'flex',
  gap: '10px',
})

const TextButton = styled('button')({
  border: 0,
  background: 'transparent',
  color: '#8c7d6d',
  fontSize: '12px',
  fontWeight: 900,
  cursor: 'pointer',
  _hover: {
    color: '#171512',
  },
})

const DeleteButton = styled(TextButton)({
  _hover: {
    color: '#b91c1c',
  },
})

const AddressText = styled('p')({
  color: '#5f554b',
  fontSize: '14px',
  lineHeight: 1.7,
})

export default function AddressList({ initialAddresses }: { initialAddresses: Address[] }) {
  const [addresses, setAddresses] = useState(initialAddresses)

  const handleDelete = async (id: number) => {
    if (!confirm('배송지를 삭제하시겠습니까?')) return
    const result = await deleteAddress(id)
    if (result.success) {
      setAddresses(addresses.filter(a => a.id !== id))
    }
  }

  const handleSetDefault = async (id: number) => {
    const result = await setDefaultAddress(id)
    if (result.success) {
      setAddresses(addresses.map(a => ({
        ...a,
        isDefault: a.id === id
      })))
    }
  }

  return (
    <Grid>
      {addresses.length === 0 ? (
        <Empty>등록된 배송지가 없습니다.</Empty>
      ) : (
        addresses.map((addr) => {
          const AddressCard = addr.isDefault ? DefaultCard : Card
          return (
            <AddressCard key={addr.id}>
              <Head>
                <div>
                  <Receiver>{addr.receiverName}</Receiver>
                  {addr.isDefault && <Badge>기본</Badge>}
                </div>
                <Actions>
                  {!addr.isDefault && (
                    <TextButton onClick={() => handleSetDefault(addr.id)}>
                      기본배송지 설정
                    </TextButton>
                  )}
                  <DeleteButton onClick={() => handleDelete(addr.id)}>삭제</DeleteButton>
                </Actions>
              </Head>
              <AddressText>({addr.zipCode}) {addr.address1} {addr.address2}</AddressText>
              <AddressText>{addr.phone}</AddressText>
            </AddressCard>
          )
        })
      )}
    </Grid>
  )
}
