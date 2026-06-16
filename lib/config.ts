export const FREE_SHIPPING_THRESHOLD = Number(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD ?? 50000)
export const SHIPPING_FEE = Number(process.env.NEXT_PUBLIC_SHIPPING_FEE ?? 3000)
export const MAX_UPLOAD_BYTES = Number(process.env.MAX_UPLOAD_BYTES ?? 5 * 1024 * 1024)

export const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
])

export function getShippingFee(totalPrice: number): number {
  return totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}

export function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} 환경변수가 설정되지 않았습니다.`)
  }
  return value
}
