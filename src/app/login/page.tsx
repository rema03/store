import { redirect } from 'next/navigation'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  const accountsUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL || 'http://accounts.localhost:3000'
  const callbackUrl = searchParams.callbackUrl || (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000')
  redirect(`${accountsUrl}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
}
