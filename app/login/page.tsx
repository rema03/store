import LoginForm from '@/components/user/LoginForm'
import { styled } from '@devup-ui/react'

const AuthPage = styled('div')({
  minHeight: 'calc(100vh - 260px)',
  display: 'grid',
  placeItems: 'center',
  padding: '64px 20px',
  background: '#fbf8f2',
})

export default function LoginPage() {
  return (
    <AuthPage>
      <LoginForm />
    </AuthPage>
  )
}
