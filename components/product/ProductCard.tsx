import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    imageUrl: string | null
    category: {
      name: string
    }
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-lg mb-4">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            이미지 없음
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm text-gray-500">{product.category.name}</p>
        <h3 className="text-base font-medium text-gray-900 truncate">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  )
}
