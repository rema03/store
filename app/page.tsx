import { getProducts, getCategories } from '@/actions/productActions'
import ProductCard from '@/components/product/ProductCard'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts({}),
    getCategories()
  ])

  const newArrivals = products.slice(0, 8)

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full bg-gray-900 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1441984908747-d4121882c9b6?q=80&w=2000"
          alt="Main Banner"
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 drop-shadow-2xl">
            THE NEW<br />COLLECTION
          </h1>
          <p className="text-lg md:text-2xl font-medium mb-12 opacity-90 max-w-2xl leading-relaxed">
            당신의 무드를 완성하는 감각적인 패션 큐레이션.<br className="hidden md:block" />
            2024년 여름, 새로운 스타일을 발견하세요.
          </p>
          <Link
            href="/products"
            className="px-12 py-5 bg-white text-black font-bold text-sm uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all duration-300 rounded-full"
          >
            Explore Now
          </Link>
        </div>
      </section>

      {/* Category Grid */}
      <section className="container-max py-24">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-xs font-black tracking-[0.4em] text-gray-400 uppercase mb-4 text-center">Shop by Category</h2>
          <div className="h-1 w-12 bg-black"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat, index) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}`}
              className="relative group aspect-[4/5] bg-gray-100 overflow-hidden rounded-2xl"
            >
              <Image
                src={`https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&sig=${index}`} // 임시 카테고리 이미지
                alt={cat.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-white tracking-tighter uppercase drop-shadow-lg">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container-max py-10">
        <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-8">
          <div>
            <h2 className="text-4xl font-black tracking-tighter uppercase">New Arrivals</h2>
            <p className="text-gray-400 mt-2 font-bold text-sm tracking-widest uppercase">Weekly Fresh Items</p>
          </div>
          <Link href="/products" className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest">
            View All 
            <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {newArrivals.map((product) => (
            <div key={product.id} className="fade-in-up">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Brand Story / Promo Section */}
      <section className="bg-black py-32 mt-20 text-white overflow-hidden relative">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10 z-10">
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
              MORE THAN<br />JUST FASHION
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
              우리는 단순한 옷을 파는 것이 아니라, 당신만의 이야기를 담을 수 있는 스타일을 만듭니다. 
              지속 가능한 소재와 변하지 않는 가치를 담은 컬렉션을 지금 경험해보세요.
            </p>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-3xl font-black">10K+</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Customers</p>
              </div>
              <div className="h-10 w-[1px] bg-gray-800 self-center"></div>
              <div className="text-center">
                <p className="text-3xl font-black">500+</p>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Styles</p>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] w-full lg:h-[600px] group">
            <div className="absolute top-0 right-0 w-4/5 h-[80%] rounded-3xl overflow-hidden border-8 border-gray-900 shadow-2xl z-0">
              <Image
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000"
                alt="Story 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-3/5 h-[60%] rounded-3xl overflow-hidden border-8 border-black shadow-2xl z-10 group-hover:scale-105 transition-transform duration-500">
              <Image
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1000"
                alt="Story 2"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
