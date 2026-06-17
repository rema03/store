'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '@/lib/validators'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { z } from 'zod'
import { styled } from '@devup-ui/react'

type LoginInput = z.infer<typeof loginSchema>

const Card = styled('div')({
  width: '100%',
  maxWidth: '440px',
  padding: '34px',
  border: '1px solid #e8e0d5',
  borderRadius: '28px',
  background: '#fff',
  boxShadow: '0 24px 60px rgba(39,31,22,0.08)',
})

const Title = styled('h1')({
  marginBottom: '26px',
  color: '#171512',
  fontSize: '30px',
  fontWeight: 950,
  letterSpacing: '-0.04em',
  textAlign: 'center',
})

const Form = styled('form')({
  display: 'grid',
  gap: '18px',
})

const Field = styled('div')({
  display: 'grid',
  gap: '8px',
})

const Label = styled('label')({
  color: '#5f554b',
  fontSize: '13px',
  fontWeight: 850,
})

const Input = styled('input')({
  width: '100%',
  height: '48px',
  padding: '0 14px',
  border: '1px solid #ded3c6',
  borderRadius: '14px',
  outline: 0,
  color: '#171512',
  fontSize: '15px',
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

const Submit = styled('button')({
  width: '100%',
  height: '52px',
  border: 0,
  borderRadius: '16px',
  background: '#171512',
  color: '#fff',
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

const FooterText = styled('p')({
  marginTop: '22px',
  color: '#6f6256',
  fontSize: '14px',
  textAlign: 'center',
})

const FooterLink = styled(Link)({
  color: '#171512',
  fontWeight: 900,
})

export default function LoginForm() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    }
  })

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        router.push('/')
        router.refresh()
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <Title>로그인</Title>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Field>
          <Label>이메일</Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input 
                {...field}
                type="email" 
                placeholder="example@email.com" 
              />
            )}
          />
          {errors.email && <ErrorText>{errors.email.message}</ErrorText>}
        </Field>

        <Field>
          <Label>비밀번호</Label>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input 
                {...field}
                type="password" 
                placeholder="비밀번호 입력" 
              />
            )}
          />
          {errors.password && <ErrorText>{errors.password.message}</ErrorText>}
        </Field>

        {error && <ErrorText>{error}</ErrorText>}

        <Submit type="submit" disabled={isLoading}>
          {isLoading ? '로그인 중...' : '로그인'}
        </Submit>
      </Form>

      <FooterText>
        계정이 없으신가요? <FooterLink href="/register">회원가입</FooterLink>
      </FooterText>
    </Card>
  )
}
