'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { addressSchema } from '@/lib/validators'
import { addAddress } from '@/actions/addressActions'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { styled } from '@devup-ui/react'

type AddressInput = z.infer<typeof addressSchema>

const Form = styled('form')({
  display: 'grid',
  gap: '24px',
  maxWidth: '600px',
})

const Field = styled('div')({
  display: 'grid',
  gap: '8px',
})

const Label = styled('label')({
  color: '#5f554b',
  fontSize: '14px',
  fontWeight: 850,
})

const Input = styled('input')({
  width: '100%',
  height: '52px',
  padding: '0 16px',
  border: '1px solid #ded3c6',
  borderRadius: '16px',
  outline: 0,
  color: '#171512',
  fontSize: '15px',
  boxSizing: 'border-box',
  _focus: {
    borderColor: '#171512',
    boxShadow: '0 0 0 3px rgba(23,21,18,0.08)',
  },
})

const ErrorText = styled('p')({
  color: '#b91c1c',
  fontSize: '12px',
  fontWeight: 700,
})

const CheckboxLabel = styled('label')({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 800,
  color: '#171512',
})

const Actions = styled('div')({
  display: 'flex',
  gap: '12px',
  marginTop: '12px',
})

const SubmitButton = styled('button')({
  flex: 1,
  height: '56px',
  border: 0,
  borderRadius: '18px',
  background: '#171512',
  color: '#fff',
  fontSize: '15px',
  fontWeight: 950,
  cursor: 'pointer',
  _hover: {
    background: '#3a3128',
  },
  _disabled: {
    background: '#b8aea1',
    cursor: 'not-allowed',
  },
})

const CancelButton = styled('button')({
  height: '56px',
  padding: '0 24px',
  border: '1px solid #e8e0d5',
  borderRadius: '18px',
  background: '#fff',
  color: '#5c5147',
  fontSize: '15px',
  fontWeight: 900,
  cursor: 'pointer',
  _hover: {
    background: '#fbf8f2',
  },
})

export default function AddressForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      receiverName: '',
      phone: '',
      zipCode: '',
      address1: '',
      address2: '',
      isDefault: false,
    },
  })

  const onSubmit = async (data: AddressInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await addAddress(data)
      if ('error' in result) {
        setError(result.error ?? '배송지 등록 중 오류가 발생했습니다.')
      } else {
        router.push('/mypage/addresses')
        router.refresh()
      }
    } catch (err) {
      setError('배송지 등록 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Field>
        <Label>수령인 이름</Label>
        <Controller
          name="receiverName"
          control={control}
          render={({ field: { ref, ...field } }) => <Input {...field} placeholder="이름을 입력하세요" />}
        />
        {errors.receiverName && <ErrorText>{errors.receiverName.message}</ErrorText>}
      </Field>

      <Field>
        <Label>휴대폰 번호</Label>
        <Controller
          name="phone"
          control={control}
          render={({ field: { ref, ...field } }) => <Input {...field} placeholder="010-0000-0000" />}
        />
        {errors.phone && <ErrorText>{errors.phone.message}</ErrorText>}
      </Field>

      <Field>
        <Label>우편번호</Label>
        <Controller
          name="zipCode"
          control={control}
          render={({ field: { ref, ...field } }) => <Input {...field} placeholder="12345" />}
        />
        {errors.zipCode && <ErrorText>{errors.zipCode.message}</ErrorText>}
      </Field>

      <Field>
        <Label>주소</Label>
        <Controller
          name="address1"
          control={control}
          render={({ field: { ref, ...field } }) => <Input {...field} placeholder="기본 주소" />}
        />
        {errors.address1 && <ErrorText>{errors.address1.message}</ErrorText>}
      </Field>

      <Field>
        <Label>상세 주소 (선택)</Label>
        <Controller
          name="address2"
          control={control}
          render={({ field: { ref, value, ...rest } }) => (
            <Input {...rest} value={value || ''} placeholder="나머지 주소" />
          )}
        />
        {errors.address2 && <ErrorText>{errors.address2.message}</ErrorText>}
      </Field>

      <Field>
        <Controller
          name="isDefault"
          control={control}
          render={({ field: { value, onChange } }) => (
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#171512' }}
              />
              기본 배송지로 설정
            </CheckboxLabel>
          )}
        />
      </Field>

      {error && <ErrorText>{error}</ErrorText>}

      <Actions>
        <CancelButton type="button" onClick={() => router.back()}>취소</CancelButton>
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? '등록 중...' : '배송지 등록하기'}
        </SubmitButton>
      </Actions>
    </Form>
  )
}
