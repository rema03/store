import Link from 'next/link'
import { styled } from '@/lib/styled'

const FooterShell = styled('footer')({
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  background: '#fafafa',
  color: '#111111',
  fontFamily: "'Pretendard', sans-serif",
})

const FooterInner = styled('div')({
  maxWidth: '1280px',
  margin: '0 auto',
  padding: ['64px 24px 32px', '80px 40px 40px'],
})

const FooterGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr', '2fr 1fr 1fr 1fr'],
  gap: ['48px', '64px'],
})

const BrandSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

const Brand = styled('h2')({
  fontSize: ['24px', '28px'],
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: '#111111',
})

const Description = styled('p')({
  maxWidth: '320px',
  color: '#666666',
  fontSize: '15px',
  lineHeight: 1.6,
  fontWeight: 400,
})

const ColumnTitle = styled('h3')({
  marginBottom: '20px',
  color: '#111111',
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
})

const FooterText = styled('p')({
  color: '#666666',
  fontSize: '15px',
  lineHeight: 1.8,
  fontWeight: 400,
})

const LinkList = styled('ul')({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  listStyle: 'none',
  padding: 0,
  margin: 0,
})

const FooterLink = styled(Link)({
  color: '#666666',
  fontSize: '15px',
  fontWeight: 500,
  transition: 'color 0.2s ease',
  _hover: {
    color: '#111111',
  },
})

const Bottom = styled('div')({
  display: 'flex',
  flexDirection: ['column', 'row'],
  justifyContent: 'space-between',
  alignItems: ['flex-start', 'center'],
  gap: '16px',
  marginTop: '80px',
  paddingTop: '32px',
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  color: '#999999',
  fontSize: '14px',
  fontWeight: 400,
})

const LegalLinks = styled('div')({
  display: 'flex',
  gap: '24px',
})

export default function Footer() {
  return (
    <FooterShell>
      <FooterInner>
        <FooterGrid>
          <BrandSection>
            <Brand>Jimin Store</Brand>
            <Description>
              본질에 충실한 프리미엄 라이프스타일 큐레이션. 
              최고의 퀄리티와 변하지 않는 모던함을 제안합니다.
            </Description>
          </BrandSection>
          
          <div>
            <ColumnTitle>Shop</ColumnTitle>
            <LinkList>
              <li><FooterLink href="/products">All Products</FooterLink></li>
              <li><FooterLink href="/products?category=new">New Arrivals</FooterLink></li>
              <li><FooterLink href="/products?category=best">Best Sellers</FooterLink></li>
            </LinkList>
          </div>

          <div>
            <ColumnTitle>Support</ColumnTitle>
            <LinkList>
              <li><FooterLink href="/orders">Order Tracking</FooterLink></li>
              <li><FooterLink href="/mypage">My Account</FooterLink></li>
              <li><FooterLink href="/faq">FAQ & Returns</FooterLink></li>
            </LinkList>
          </div>

          <div>
            <ColumnTitle>Contact</ColumnTitle>
            <LinkList>
              <li><FooterText>jjm4216@gmail.com</FooterText></li>
              <li><FooterText>Mon - Fri, 10am - 6pm</FooterText></li>
            </LinkList>
          </div>
        </FooterGrid>
        
        <Bottom>
          <span>
            © 2026 Jimin Store. All rights reserved.
          </span>
          <LegalLinks>
            <FooterLink href="/privacy" style={{ fontSize: '13px' }}>Privacy Policy</FooterLink>
            <FooterLink href="/terms" style={{ fontSize: '13px' }}>Terms of Service</FooterLink>
          </LegalLinks>
        </Bottom>
      </FooterInner>
    </FooterShell>
  )
}
