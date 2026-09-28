'use client'

import Link from 'next/link'
import { ShoppingCart, Heart, User, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { styled } from '@/lib/styled'
import { useJiminSession } from '@/lib/session'

const SiteHeader = styled('header')({
  position: 'sticky',
  top: 0,
  zIndex: 50,
  borderBottom: '1px solid #e8e5df',
  background: 'rgba(255, 255, 255, 0.92)',
  backdropFilter: 'blur(18px)',
})

const HeaderInner = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px',
})

const HeaderRow = styled('div')({
  height: ['64px', '76px'],
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '20px',
})

const Brand = styled(Link)({
  fontSize: ['20px', '24px'],
  fontWeight: 400,
  letterSpacing: '-0.02em',
})

const DesktopNav = styled('nav')({
  display: ['none', 'flex'],
  alignItems: 'center',
  gap: '8px',
  padding: '6px',
  border: '1px solid #eee9df',
  borderRadius: '16px',
  background: '#f8f5ef',
})

const NavLink = styled(Link)({
  padding: '9px 14px',
  borderRadius: '16px',
  fontSize: '13px',
  fontWeight: 400,
  color: '#3f3a33',
  _hover: {
    background: '#000000',
    color: '#fff',
  },
})

const ActionGroup = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: ['4px', '8px'],
})

const IconLink = styled(Link)({
  width: '40px',
  height: '40px',
  display: 'grid',
  placeItems: 'center',
  borderRadius: '16px',
  color: '#171717',
  _hover: {
    background: '#f2eee6',
  },
})

const LoginLink = styled(Link)({
  padding: '11px 14px',
  borderRadius: '16px',
  border: '1px solid rgba(0,0,0,0.08)',
  color: '#000000',
  fontSize: '12px',
  fontWeight: 400,
  letterSpacing: '0.08em',
  _hover: {
    background: '#000000',
    color: '#fff',
  },
})

const MenuButton = styled('button')({
  width: '40px',
  height: '40px',
  display: ['grid', 'none'],
  placeItems: 'center',
  border: 0,
  borderRadius: '16px',
  background: '#000000',
  color: '#fff',
  cursor: 'pointer',
})

const UserMenuWrap = styled('div')({
  position: 'relative',
})

const UserButton = styled('button')({
  width: '40px',
  height: '40px',
  display: 'grid',
  placeItems: 'center',
  border: 0,
  borderRadius: '16px',
  background: '#000000',
  color: '#fff',
  cursor: 'pointer',
})

const UserDropdown = styled('div')({
  position: 'absolute',
  right: 0,
  top: 'calc(100% + 12px)',
  width: '210px',
  overflow: 'hidden',
  border: '1px solid #e7e1d7',
  borderRadius: '16px',
  background: '#fff',
  boxShadow: '0 24px 50px rgba(22, 18, 14, 0.14)',
  opacity: 0,
  visibility: 'hidden',
  transform: 'translateY(-6px)',
  transition: '160ms ease',
  _groupHover: {
    opacity: 1,
    visibility: 'visible',
    transform: 'translateY(0)',
  },
})

const DropdownHead = styled('div')({
  padding: '16px',
  borderBottom: '1px solid #f0ece5',
})

const Muted = styled('p')({
  fontSize: '12px',
  color: '#8a8176',
})

const StrongLine = styled('p')({
  marginTop: '3px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontWeight: 400,
})

const DropdownLink = styled(Link)({
  display: 'block',
  padding: '12px 16px',
  fontSize: '14px',
  fontWeight: 400,
  _hover: {
    background: '#faf7f0',
  },
})

const SignOutButton = styled('button')({
  width: '100%',
  padding: '12px 16px',
  border: 0,
  borderTop: '1px solid #f0ece5',
  background: '#fff',
  color: '#000000',
  textAlign: 'left',
  fontSize: '14px',
  fontWeight: 400,
  cursor: 'pointer',
  _hover: {
    background: '#fff7ed',
  },
})

const MobileNav = styled('nav')({
  display: ['block', 'none'],
  padding: '0 0 16px',
})

const MobileGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
})

const MobileLink = styled(Link)({
  padding: '14px',
  border: '1px solid #eee9df',
  borderRadius: '16px',
  background: '#fbf8f2',
  fontSize: '14px',
  fontWeight: 400,
})

export default function Header() {
  const { session } = useJiminSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const categoryLinks = [
    { href: '/products?categoryName=아우터', label: '아우터' },
    { href: '/products?categoryName=상의', label: '상의' },
    { href: '/products?categoryName=하의', label: '하의' },
  ]

  const handleSignOut = () => {
    const accountsUrl =
      process.env.NEXT_PUBLIC_ACCOUNTS_URL || 'https://accounts.jimindev.com'
    const callbackUrl = encodeURIComponent(
      process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    )
    window.location.href = `${accountsUrl}/logout?callbackUrl=${callbackUrl}`
  }

  return (
    <SiteHeader>
      <HeaderInner>
        <HeaderRow>
          <Brand href="/">Jimin Store</Brand>

          <DesktopNav>
            <NavLink href="/products">전체 상품</NavLink>
            {categoryLinks.map((category) => (
              <NavLink key={category.href} href={category.href}>
                {category.label}
              </NavLink>
            ))}
          </DesktopNav>

          <ActionGroup>
            <IconLink href="/products" aria-label="상품 검색">
              <Search size={19} />
            </IconLink>
            <IconLink href="/cart" aria-label="장바구니">
              <ShoppingCart size={19} />
            </IconLink>
            <IconLink href="/wishlist" aria-label="위시리스트">
              <Heart size={19} />
            </IconLink>

            {session ? (
              <UserMenuWrap role="group">
                <UserButton
                  aria-label="사용자 메뉴"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <User size={19} />
                </UserButton>
                <UserDropdown style={{
                  opacity: isMenuOpen ? 1 : 0,
                  visibility: isMenuOpen ? 'visible' : 'hidden',
                  transform: isMenuOpen ? 'translateY(0)' : 'translateY(-6px)',
                }}>
                  <DropdownHead>
                    <Muted>Logged in as</Muted>
                    <StrongLine>{session.user?.name}</StrongLine>
                  </DropdownHead>
                  <DropdownLink href="/mypage" onClick={() => setIsMenuOpen(false)}>마이페이지</DropdownLink>
                  <DropdownLink href="/orders" onClick={() => setIsMenuOpen(false)}>주문내역</DropdownLink>
                  {session.user?.role === 'ADMIN' && (
                    <DropdownLink href="/admin" onClick={() => setIsMenuOpen(false)}>관리자 대시보드</DropdownLink>
                  )}
                  <SignOutButton onClick={handleSignOut}>로그아웃</SignOutButton>
                </UserDropdown>
              </UserMenuWrap>
            ) : (
              <LoginLink href="/login">LOGIN</LoginLink>
            )}

            <MenuButton
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </MenuButton>
          </ActionGroup>
        </HeaderRow>

        {isMenuOpen && (
          <MobileNav>
            <MobileGrid>
              <MobileLink href="/products" onClick={() => setIsMenuOpen(false)}>
                전체 상품
              </MobileLink>
              {categoryLinks.map((category) => (
                <MobileLink
                  key={category.href}
                  href={category.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.label}
                </MobileLink>
              ))}
            </MobileGrid>
          </MobileNav>
        )}
      </HeaderInner>
    </SiteHeader>
  )
}
