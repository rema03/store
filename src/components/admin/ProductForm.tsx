'use client'

import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '@/lib/validators'
import { createProduct, updateProduct } from '@/actions/adminActions'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import Image from 'next/image'
import type { Category, Product } from '@prisma/client'
import { styled } from '@devup-ui/react'

type ProductInput = z.infer<typeof productSchema>
type ProductFormInitialData = Pick<Product, 'id' | 'name' | 'price' | 'description' | 'categoryId' | 'stock' | 'imageUrl'>

interface ProductFormProps {
  initialData?: ProductFormInitialData
  categories: Category[]
}

const Form = styled('form')({
  display: 'grid',
  gap: '32px',
  maxWidth: '720px',
  border: '1px solid #ddd',
  borderRadius: '8px',
  background: '#fff',
  padding: '32px',
})

const Fields = styled('div')({
  display: 'grid',
  gap: '24px',
})

const Field = styled('div')({
  display: 'grid',
  gap: '8px',
})

const TwoColumn = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: '16px',
  _media: {
    '(max-width: 640px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

const Label = styled('label')({
  fontSize: '14px',
  fontWeight: 900,
})

const inputStyle = {
  width: '100%',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  background: '#fff',
  padding: '12px',
  outline: 'none',
  _focus: {
    borderColor: '#111',
  },
}

const Input = styled('input')(inputStyle)
const Select = styled('select')(inputStyle)
const Textarea = styled('textarea')({
  ...inputStyle,
  minHeight: '140px',
  resize: 'vertical',
})

const ErrorText = styled('p')({
  color: '#ef4444',
  fontSize: '12px',
})

const ImageRow = styled('div')({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '16px',
  _media: {
    '(max-width: 640px)': {
      flexDirection: 'column',
    },
  },
})

const Preview = styled('div')({
  position: 'relative',
  width: '128px',
  height: '160px',
  flexShrink: 0,
  overflow: 'hidden',
  border: '1px solid #ddd',
  borderRadius: '6px',
  background: '#f1f1f1',
})

const PreviewImage = styled(Image)({
  objectFit: 'cover',
})

const EmptyPreview = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  color: '#999',
  fontSize: '12px',
})

const ImageInputs = styled('div')({
  flex: 1,
  display: 'grid',
  gap: '8px',
})

const FileInput = styled('input')({
  width: '100%',
  color: '#666',
  fontSize: '14px',
})

const HelpText = styled('p')({
  color: '#888',
  fontSize: '12px',
})

const UploadingText = styled('p')({
  color: '#2563eb',
  fontSize: '12px',
})

const Actions = styled('div')({
  display: 'flex',
  gap: '16px',
  _media: {
    '(max-width: 640px)': {
      flexDirection: 'column',
    },
  },
})

const SecondaryButton = styled('button')({
  flex: 1,
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontWeight: 900,
  padding: '16px',
  transition: 'background 0.15s ease',
  _hover: {
    background: '#f7f7f7',
  },
})

const PrimaryButton = styled('button')({
  flex: 1,
  borderRadius: '6px',
  background: '#111',
  color: '#fff',
  fontWeight: 900,
  padding: '16px',
  transition: 'background 0.15s ease',
  _hover: {
    background: '#2a2a2a',
  },
  _disabled: {
    background: '#aaa',
    cursor: 'not-allowed',
  },
})

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          price: initialData.price,
          stock: initialData.stock,
          categoryId: initialData.categoryId,
          description: initialData.description ?? undefined,
          imageUrl: initialData.imageUrl ?? undefined,
        }
      : {
          stock: 0,
        },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (data.url) {
        setValue('imageUrl', data.url)
        setPreviewUrl(data.url)
      } else {
        alert('업로드에 실패했습니다.')
      }
    } catch (error) {
      alert('업로드 중 오류가 발생했습니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: ProductInput) => {
    setIsLoading(true)
    try {
      let result
      if (initialData) {
        result = await updateProduct(initialData.id, data)
      } else {
        result = await createProduct(data)
      }

      if (result.success) {
        alert(initialData ? '수정되었습니다.' : '등록되었습니다.')
        router.push('/admin/products')
      } else {
        alert(result.error)
      }
    } catch (error) {
      alert('오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Fields>
        <Field>
          <Label>상품명</Label>
          <Controller
            name="name"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <Input
                {...field}
                placeholder="상품 이름을 입력하세요"
              />
            )}
          />
          {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
        </Field>

        <TwoColumn>
          <Field>
            <Label>가격 (원)</Label>
            <Controller
              name="price"
              control={control}
              render={({ field: { ref, value, ...field } }) => (
                <Input
                  {...field}
                  value={value ?? ''}
                  type="number"
                />
              )}
            />
            {errors.price && <ErrorText>{errors.price.message}</ErrorText>}
          </Field>
          <Field>
            <Label>재고</Label>
            <Controller
              name="stock"
              control={control}
              render={({ field: { ref, value, ...field } }) => (
                <Input
                  {...field}
                  value={value ?? ''}
                  type="number"
                />
              )}
            />
            {errors.stock && <ErrorText>{errors.stock.message}</ErrorText>}
          </Field>
        </TwoColumn>

        <Field>
          <Label>카테고리</Label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field: { ref, value, ...field } }) => (
              <Select {...field} value={value ?? ''}>
                <option value="">카테고리 선택</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </Select>
            )}
          />
          {errors.categoryId && <ErrorText>{errors.categoryId.message}</ErrorText>}
        </Field>

        <Field>
          <Label>상품 이미지</Label>
          <ImageRow>
            <Preview>
              {previewUrl ? (
                <PreviewImage src={previewUrl} alt="Preview" fill />
              ) : (
                <EmptyPreview>No Image</EmptyPreview>
              )}
            </Preview>
            <ImageInputs>
              <FileInput
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <HelpText>이미지 파일을 직접 업로드하거나 아래에 URL을 입력하세요.</HelpText>
              <Controller
                name="imageUrl"
                control={control}
                render={({ field: { ref, value, ...field } }) => (
                  <Input
                    {...field}
                    value={value ?? ''}
                    placeholder="이미지 URL"
                  />
                )}
              />
            </ImageInputs>
          </ImageRow>
          {isUploading && <UploadingText>업로드 중...</UploadingText>}
        </Field>

        <Field>
          <Label>상품 설명</Label>
          <Controller
            name="description"
            control={control}
            render={({ field: { ref, value, ...field } }) => (
              <Textarea
                {...field}
                value={value ?? ''}
                rows={5}
                placeholder="상품 상세 설명을 입력하세요"
              />
            )}
          />
        </Field>
      </Fields>

      <Actions>
        <SecondaryButton
          type="button"
          onClick={() => router.back()}
        >
          취소
        </SecondaryButton>
        <PrimaryButton
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? '저장 중...' : initialData ? '수정하기' : '상품 등록'}
        </PrimaryButton>
      </Actions>
    </Form>
  )
}
