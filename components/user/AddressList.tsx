'use client'

import { useState } from 'react'
import { deleteAddress, setDefaultAddress } from '@/actions/addressActions'

interface Address {
  id: number
  receiverName: string
  phone: string
  zipCode: string
  address1: string
  address2: string | null
  isDefault: boolean
}

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {addresses.length === 0 ? (
        <div className="md:col-span-2 text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-gray-500 font-medium">등록된 배송지가 없습니다.</p>
        </div>
      ) : (
        addresses.map((addr) => (
          <div key={addr.id} className={`p-6 border rounded-lg ${addr.isDefault ? 'border-black' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="font-bold text-lg">{addr.receiverName}</span>
                {addr.isDefault && (
                  <span className="ml-2 px-2 py-0.5 bg-black text-white text-[10px] rounded">기본</span>
                )}
              </div>
              <div className="flex gap-4 text-xs font-bold text-gray-400">
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr.id)} className="hover:text-black">기본배송지 설정</button>
                )}
                <button onClick={() => handleDelete(addr.id)} className="hover:text-red-500">삭제</button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">({addr.zipCode}) {addr.address1} {addr.address2}</p>
            <p className="text-sm text-gray-600">{addr.phone}</p>
          </div>
        ))
      )}
    </div>
  )
}
