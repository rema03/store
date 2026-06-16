'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const categoryLinks = [
    { href: '/products?categoryName=아우터', label: '아우터' },
    { href: '/products?categoryName=상의', label: '상의' },
    { href: '/products?categoryName=하의', label: '하의' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container-max">
        <div className="flex justify-between items-center h-16 md:h-20">
          <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter">
            FASHION MALL
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-bold">
            <Link href="/products" className="hover:text-gray-500">전체 상품</Link>
            {categoryLinks.map((category) => (
              <Link key={category.href} href={category.href} className="hover:text-gray-500">
                {category.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/products" className="p-2" aria-label="상품 검색">
              <Search size={20} />
            </Link>
            <Link href="/cart" className="p-2 relative">
              <ShoppingCart size={20} />
            </Link>
            <Link href="/wishlist" className="p-2 hidden sm:block"><Heart size={20} /></Link>
            
            {session ? (
              <div className="group relative">
                <button className="p-2 flex items-center gap-1 font-bold text-sm">
                  <User size={20} />
                </button>
                <div className="absolute right-0 top-full w-48 bg-white border border-gray-100 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all rounded-md overflow-hidden">
                  <div className="p-4 border-b border-gray-50">
                    <p className="text-xs text-gray-500">Logged in as</p>
                    <p className="font-bold truncate">{session.user?.name}</p>
                  </div>
                  <Link href="/mypage" className="block px-4 py-2 text-sm hover:bg-gray-50">마이페이지</Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50">주문내역</Link>
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-blue-600 hover:bg-gray-50 font-bold border-t border-gray-50">관리자 대시보드</Link>
                  )}
                  <button 
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 border-t border-gray-50"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="p-2 text-sm font-bold uppercase tracking-widest">Login</Link>
            )}
            
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden border-t border-gray-100 py-4">
            <div className="grid grid-cols-2 gap-2 text-sm font-bold">
              <Link href="/products" onClick={() => setIsMenuOpen(false)} className="rounded border border-gray-200 px-4 py-3">
                전체 상품
              </Link>
              {categoryLinks.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded border border-gray-200 px-4 py-3"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
