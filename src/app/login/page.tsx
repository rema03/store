import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default function LoginPage({
  searchParams,
}: {
  searchParams: { callbackUrl?: string }
}) {
  const headersList = headers()
  const proto = headersList.get('x-forwarded-proto') || 'http'
  const host = headersList.get('host') || 'localhost:3000'
  const fallbackUrl = `${proto}://${host}`

  const accountsUrl = process.env.NEXT_PUBLIC_ACCOUNTS_URL || 'http://accounts.localhost:3000'
  const callbackUrl = searchParams.callbackUrl || (process.env.NEXT_PUBLIC_APP_URL || fallbackUrl)
  redirect(`${accountsUrl}/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
}
