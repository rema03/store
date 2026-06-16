import { getProducts, getCategories } from '@/actions/productActions'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'

interface ProductsPageProps {
  searchParams: {
    category?: string
    categoryName?: string
    search?: string
    sort?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const categories = await getCategories()
  const requestedCategoryId = searchParams.category ? parseInt(searchParams.category) : undefined
  const selectedCategory = requestedCategoryId
    ? categories.find((category) => category.id === requestedCategoryId)
    : categories.find((category) => category.name === searchParams.categoryName)
  const categoryId = selectedCategory?.id
  const products = await getProducts({
    categoryId,
    search: searchParams.search,
    sort: searchParams.sort,
  })

  return (
    <div className="container-max py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar - Filters */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h2 className="text-lg font-bold mb-4">카테고리</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className={`block text-sm ${
                    !categoryId ? 'font-bold text-black' : 'text-gray-600'
                  }`}
                >
                  전체
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.id}`}
                    className={`block text-sm ${
                      categoryId === cat.id ? 'font-bold text-black' : 'text-gray-600'
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">정렬</h2>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...searchParams,
                    sort: 'newest',
                  }).toString()}`}
                  className="block text-sm text-gray-600"
                >
                  최신순
                </Link>
              </li>
              <li>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...searchParams,
                    sort: 'price_asc',
                  }).toString()}`}
                  className="block text-sm text-gray-600"
                >
                  가격 낮은순
                </Link>
              </li>
              <li>
                <Link
                  href={`/products?${new URLSearchParams({
                    ...searchParams,
                    sort: 'price_desc',
                  }).toString()}`}
                  className="block text-sm text-gray-600"
                >
                  가격 높은순
                </Link>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content - Product Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {selectedCategory?.name || '전체 상품'}
            </h1>
            <p className="text-sm text-gray-500">총 {products.length}개 상품</p>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
