import Link from 'next/link'
import { styled } from '@devup-ui/react'

const FooterShell = styled('footer')({
  borderTop: '1px solid #e8e2d8',
  background: '#171512',
  color: '#fff',
})

const FooterInner = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: ['48px 20px 28px', '72px 20px 34px'],
})

const FooterGrid = styled('div')({
  display: 'grid',
  gridTemplateColumns: ['1fr', '1.4fr 0.8fr 0.8fr'],
  gap: ['32px', '56px'],
})

const Brand = styled('h2')({
  fontSize: ['26px', '36px'],
  fontWeight: 950,
  letterSpacing: '-0.04em',
})

const Description = styled('p')({
  maxWidth: '420px',
  marginTop: '16px',
  color: '#b8aea1',
  fontSize: '15px',
  lineHeight: 1.8,
})

const ColumnTitle = styled('h3')({
  marginBottom: '14px',
  color: '#f4ede2',
  fontSize: '12px',
  fontWeight: 900,
  letterSpacing: '0.12em',
})

const FooterText = styled('p')({
  color: '#b8aea1',
  fontSize: '14px',
  lineHeight: 1.8,
})

const LinkList = styled('ul')({
  display: 'grid',
  gap: '10px',
  listStyle: 'none',
})

const FooterLink = styled(Link)({
  color: '#b8aea1',
  fontSize: '14px',
  _hover: {
    color: '#fff',
  },
})

const Bottom = styled('div')({
  display: 'flex',
  flexDirection: ['column', 'row'],
  justifyContent: 'space-between',
  gap: '12px',
  marginTop: '54px',
  paddingTop: '22px',
  borderTop: '1px solid rgba(255,255,255,0.1)',
  color: '#8e857a',
  fontSize: '12px',
})

export default function Footer() {
  return (
    <FooterShell>
      <FooterInner>
        <FooterGrid>
          <div>
            <Brand>FASHION MALL</Brand>
            <Description>
              감각적인 셀렉션과 단정한 쇼핑 경험을 함께 제안합니다.
              오래 입을 수 있는 스타일을 더 쉽게 고를 수 있도록 큐레이션합니다.
            </Description>
          </div>
          <div>
            <ColumnTitle>CS CENTER</ColumnTitle>
            <FooterText>1234-5678</FooterText>
            <FooterText>10:00 - 18:00</FooterText>
            <FooterText>Weekend Off</FooterText>
          </div>
          <div>
            <ColumnTitle>QUICK LINKS</ColumnTitle>
            <LinkList>
              <li><FooterLink href="/products">전체 상품</FooterLink></li>
              <li><FooterLink href="/orders">주문내역</FooterLink></li>
              <li><FooterLink href="/mypage">마이페이지</FooterLink></li>
            </LinkList>
          </div>
        </FooterGrid>
        <Bottom>
          <span>© 2026 Fashion Mall. All rights reserved.</span>
          <span>shop.jimindev.com</span>
        </Bottom>
      </FooterInner>
    </FooterShell>
  )
}
