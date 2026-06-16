'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/lib/validators'
import { register } from '@/actions/authActions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'

type RegisterInput = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await register(data)
      if (result.error) {
        setError(result.error)
      } else {
        alert('회원가입이 완료되었습니다. 로그인해주세요.')
        router.push('/login')
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold text-center mb-8">회원가입</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
          <input
            {...registerField('name')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            placeholder="홍길동"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
          <input
            {...registerField('email')}
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            placeholder="example@email.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
          <input
            {...registerField('password')}
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black"
            placeholder="8자 이상 입력"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-black text-white font-bold rounded-md hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? '처리 중...' : '가입하기'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        이미 계정이 있으신가요?{' '}
        <Link href="/login" className="text-black font-bold hover:underline">
          로그인
        </Link>
      </div>
    </div>
  )
}
