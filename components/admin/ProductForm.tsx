'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema } from '@/lib/validators'
import { createProduct, updateProduct } from '@/actions/adminActions'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import Image from 'next/image'

type ProductInput = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: any
  categories: any[]
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      isActive: true,
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
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-8 bg-white p-8 border border-gray-200 rounded-lg">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-bold mb-2">상품명</label>
          <input
            {...register('name')}
            className="w-full p-3 border border-gray-300 rounded focus:ring-black focus:border-black"
            placeholder="상품 이름을 입력하세요"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">가격 (원)</label>
            <input
              {...register('price')}
              type="number"
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">재고</label>
            <input
              {...register('stock')}
              type="number"
              className="w-full p-3 border border-gray-300 rounded"
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">카테고리</label>
          <select {...register('categoryId')} className="w-full p-3 border border-gray-300 rounded">
            <option value="">카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs mt-1">{errors.categoryId.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">상품 이미지</label>
          <div className="flex items-start gap-4">
            <div className="relative w-32 h-40 bg-gray-100 border border-gray-200 rounded overflow-hidden">
              {previewUrl ? (
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-gray-400">No Image</div>
              )}
            </div>
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
              />
              <p className="text-xs text-gray-400 mt-2">이미지 파일을 직접 업로드하거나 아래에 URL을 입력하세요.</p>
              <input
                {...register('imageUrl')}
                className="w-full mt-2 p-2 border border-gray-200 rounded text-sm"
                placeholder="이미지 URL"
              />
            </div>
          </div>
          {isUploading && <p className="text-xs text-blue-500 mt-1">업로드 중...</p>}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">상품 설명</label>
          <textarea
            {...register('description')}
            rows={5}
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="상품 상세 설명을 입력하세요"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-4 border border-gray-300 rounded font-bold hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-4 bg-black text-white rounded font-bold hover:bg-gray-800 disabled:bg-gray-400"
        >
          {isLoading ? '저장 중...' : initialData ? '수정하기' : '상품 등록'}
        </button>
      </div>
    </form>
  )
}
