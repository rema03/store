'use client'

import { JiminSessionProvider } from '@/lib/session'

export default function Providers({ children }: { children: React.ReactNode }) {
  return <JiminSessionProvider>{children}</JiminSessionProvider>
}
