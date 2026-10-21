'use client'

import React from 'react'
import { styled } from '@/lib/styled'

const Card = styled('div')({
  width: '100%',
  maxWidth: '460px',
  padding: '34px',
  border: '1px solid #e8e0d5',
  borderRadius: '16px',
  background: '#fff',
  boxShadow: '0 24px 60px rgba(39,31,22,0.08)',
})

const Title = styled('h1')({
  marginBottom: '26px',
  color: '#000000',
  fontSize: '30px',
  fontWeight: 400,
  letterSpacing: '-0.04em',
  textAlign: 'center',
})

const Submit = styled('button')({
  width: '100%',
  height: '52px',
  border: 0,
  borderRadius: '16px',
  background: '#000000',
  color: '#fff',
  fontWeight: 400,
  cursor: 'pointer',
  _hover: {
    background: '#3a3128',
  },
})

const FooterText = styled('p')({
  marginTop: '22px',
  color: '#6f6256',
  fontSize: '14px',
  textAlign: 'center',
})

const FooterLink = styled('a')({
  color: '#000000',
  fontWeight: 400,
  cursor: 'pointer',
  textDecoration: 'underline',
})

export default function RegisterForm() {
  const accountsUrl =
    typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ACCOUNTS_URL
      ? process.env.NEXT_PUBLIC_ACCOUNTS_URL
      : 'https://accounts.jimindev.com'

  const handleSignup = () => {
    const appUrl = typeof window !== 'undefined' ? window.location.origin : ''
    window.location.href = `${accountsUrl}/signup?callbackUrl=${encodeURIComponent(appUrl)}`
  }

  const handleLogin = () => {
    const appUrl = typeof window !== 'undefined' ? window.location.origin : ''
    window.location.href = `${accountsUrl}/login?callbackUrl=${encodeURIComponent(appUrl)}`
  }

  return (
    <Card>
      <Title>회원가입</Title>

      <Submit type="button" onClick={handleSignup}>
        Jimin Accounts로 회원가입
      </Submit>

      <FooterText>
        이미 계정이 있으신가요?{' '}
        <FooterLink
          onClick={(e: React.MouseEvent) => {
            e.preventDefault()
            handleLogin()
          }}
        >
          로그인
        </FooterLink>
      </FooterText>
    </Card>
  )
}

