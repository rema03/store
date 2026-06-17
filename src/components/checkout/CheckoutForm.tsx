'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { createOrder } from '@/actions/orderActions'
import { loadTossPayments } from '@tosspayments/payment-sdk'
import { getShippingFee } from '@/lib/config'
import type { Address, CartItem, Coupon, Product, UserCoupon } from '@prisma/client'
import { styled } from '@devup-ui/react'

type CheckoutCartItem = CartItem & {
  product: Product
}

type CheckoutUserCoupon = UserCoupon & {
  coupon: Coupon
}

interface CheckoutFormProps {
  cartItems: CheckoutCartItem[]
  addresses: Address[]
  coupons: CheckoutUserCoupon[]
}

const Layout = styled('div')({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 360px',
  gap: '48px',
  _media: {
    '(max-width: 960px)': {
      gridTemplateColumns: '1fr',
    },
  },
})

const MainColumn = styled('div')({
  display: 'grid',
  gap: '48px',
})

const Section = styled('section')({
  display: 'grid',
  gap: '24px',
})

const SectionTitle = styled('h2')({
  fontSize: '20px',
  fontWeight: 900,
})

const EmptyBox = styled('div')({
  border: '2px dashed #ddd',
  borderRadius: '8px',
  padding: '32px',
  textAlign: 'center',
})

const MutedText = styled('p')({
  color: '#666',
})

const LinkButton = styled(Link)({
  display: 'inline-block',
  marginTop: '16px',
  color: '#111',
  fontWeight: 800,
  textDecoration: 'underline',
})

const AddressList = styled('div')({
  display: 'grid',
  gap: '16px',
})

const AddressOption = styled('label')({
  display: 'block',
  borderRadius: '8px',
  cursor: 'pointer',
  padding: '16px',
  transition: 'border-color 0.15s ease, background 0.15s ease',
})

const AddressContent = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
})

const RadioInput = styled('input')({
  width: '16px',
  height: '16px',
  accentColor: '#111',
})

const AddressInfo = styled('div')({
  display: 'grid',
  gap: '4px',
})

const NameRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

const Name = styled('span')({
  fontWeight: 900,
})

const Badge = styled('span')({
  borderRadius: '4px',
  background: '#e5e7eb',
  fontSize: '10px',
  padding: '2px 6px',
})

const SmallMuted = styled('p')({
  color: '#666',
  fontSize: '14px',
})

const Select = styled('select')({
  width: '100%',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  background: '#fff',
  padding: '12px',
  outline: 'none',
  _focus: {
    borderColor: '#111',
  },
})

const ItemList = styled('div')({
  borderTop: '1px solid #eee',
  borderBottom: '1px solid #eee',
})

const ItemRow = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  borderTop: '1px solid #eee',
  padding: '16px 0',
})

const ItemMeta = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
})

const Thumb = styled('div')({
  position: 'relative',
  width: '64px',
  height: '80px',
  flexShrink: 0,
  overflow: 'hidden',
  borderRadius: '6px',
  background: '#f1f1f1',
})

const CoverImage = styled(Image)({
  objectFit: 'cover',
})

const ProductName = styled('p')({
  fontSize: '14px',
  fontWeight: 700,
})

const Quantity = styled('p')({
  color: '#666',
  fontSize: '12px',
})

const Price = styled('p')({
  fontSize: '14px',
  fontWeight: 900,
  whiteSpace: 'nowrap',
})

const SummaryAside = styled('aside')({
  minWidth: 0,
})

const SummaryBox = styled('div')({
  position: 'sticky',
  top: '96px',
  display: 'grid',
  gap: '24px',
  borderRadius: '8px',
  background: '#f7f7f7',
  padding: '24px',
})

const SummaryTitle = styled('h2')({
  fontSize: '18px',
  fontWeight: 900,
})

const SummaryRows = styled('div')({
  display: 'grid',
  gap: '16px',
})

const SummaryRow = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '16px',
  fontSize: '14px',
})

const SummaryLabel = styled('span')({
  color: '#666',
})

const Discount = styled('span')({
  color: '#dc2626',
})

const TotalRow = styled(SummaryRow)({
  borderTop: '1px solid #ddd',
  paddingTop: '16px',
  fontSize: '16px',
  fontWeight: 900,
})

const TotalPrice = styled('span')({
  color: '#111',
  fontSize: '20px',
})

const PayButton = styled('button')({
  width: '100%',
  borderRadius: '6px',
  background: '#111',
  color: '#fff',
  fontWeight: 900,
  letterSpacing: '0.08em',
  padding: '16px',
  textTransform: 'uppercase',
  transition: 'background 0.15s ease, opacity 0.15s ease',
  _hover: {
    background: '#2a2a2a',
  },
  _disabled: {
    background: '#aaa',
    cursor: 'not-allowed',
  },
})

const PaymentError = styled('p')({
  color: '#dc2626',
  fontSize: '13px',
  fontWeight: 700,
  lineHeight: 1.5,
  whiteSpace: 'pre-wrap',
})

export default function CheckoutForm({ cartItems, addresses, coupons }: CheckoutFormProps) {
  const [selectedAddressId, setSelectedAddressId] = useState(addresses.find(a => a.isDefault)?.id || addresses[0]?.id)
  const [selectedCouponId, setSelectedCouponId] = useState<number | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY

  const totalPrice = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shippingFee = getShippingFee(totalPrice)
  
  let discountAmount = 0
  if (selectedCouponId) {
    const coupon = coupons.find(c => c.id === selectedCouponId)?.coupon
    if (coupon) {
      if (coupon.discountType === 'PERCENT') {
        discountAmount = Math.floor((totalPrice * coupon.discountValue) / 100)
        if (coupon.maxDiscount) discountAmount = Math.min(discountAmount, coupon.maxDiscount)
      } else {
        discountAmount = coupon.discountValue
      }
    }
  }
  
  const finalPrice = totalPrice - discountAmount + shippingFee

  const handleOrder = async () => {
    if (!selectedAddressId) return alert('배송지를 선택해주세요.')
    
    setIsSubmitting(true)
    setPaymentError(null)
    
    try {
      if (!clientKey) {
        setPaymentError('결제 클라이언트 키가 설정되지 않았습니다.')
        setIsSubmitting(false)
        return
      }

      // 1. 서버에 주문 생성 요청
      const result = await createOrder({
        addressId: selectedAddressId,
        userCouponId: selectedCouponId,
        cartItemIds: cartItems.map(item => item.id),
      })

      if ('error' in result) {
        setPaymentError(result.error)
        setIsSubmitting(false)
        return
      }

      if (!result.tossOrderId) {
        setPaymentError('결제 주문번호 생성에 실패했습니다.')
        setIsSubmitting(false)
        return
      }

      // 2. Toss Payments 결제창 띄우기
      const tossPayments = await loadTossPayments(clientKey)
      
      await tossPayments.requestPayment('카드', {
        amount: result.finalPrice,
        orderId: result.tossOrderId,
        orderName: cartItems.length > 1 
          ? `${cartItems[0].product.name} 외 ${cartItems.length - 1}건`
          : cartItems[0].product.name,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      })
    } catch (error) {
      console.error('Payment error:', error)
      const message = error instanceof Error ? error.message : '알 수 없는 오류'
      setPaymentError(`결제 준비 중 오류가 발생했습니다.\n${message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Layout>
      <MainColumn>
        <Section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SectionTitle>배송지 정보</SectionTitle>
            {addresses.length > 0 && (
              <Link href="/mypage/addresses" style={{ fontSize: '13px', color: '#666', textDecoration: 'underline' }}>
                배송지 관리
              </Link>
            )}
          </div>
          {addresses.length === 0 ? (
            <EmptyBox>
              <MutedText>등록된 배송지가 없습니다.</MutedText>
              <LinkButton href="/mypage/addresses/new">새 배송지 추가</LinkButton>
            </EmptyBox>
          ) : (
            <AddressList>
              {addresses.map((addr) => (
                <AddressOption
                  key={addr.id}
                  style={{
                    background: selectedAddressId === addr.id ? '#f7f7f7' : '#fff',
                    border: `1px solid ${selectedAddressId === addr.id ? '#111' : '#ddd'}`,
                  }}
                >
                  <AddressContent>
                    <RadioInput
                      type="radio"
                      name="address"
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                    />
                    <AddressInfo>
                      <NameRow>
                        <Name>{addr.receiverName}</Name>
                        {addr.isDefault && <Badge>기본</Badge>}
                      </NameRow>
                      <SmallMuted>({addr.zipCode}) {addr.address1} {addr.address2}</SmallMuted>
                      <SmallMuted>{addr.phone}</SmallMuted>
                    </AddressInfo>
                  </AddressContent>
                </AddressOption>
              ))}
            </AddressList>
          )}
        </Section>

        <Section>
          <SectionTitle>쿠폰 할인</SectionTitle>
          <Select
            value={selectedCouponId || ''}
            onChange={(e) => setSelectedCouponId(e.target.value ? parseInt(e.target.value) : undefined)}
          >
            <option value="">쿠폰 선택 안 함</option>
            {coupons.map((c) => (
              <option key={c.id} value={c.id}>
                {c.coupon.name} ({c.coupon.discountType === 'PERCENT' ? `${c.coupon.discountValue}%` : formatPrice(c.coupon.discountValue)} 할인)
              </option>
            ))}
          </Select>
        </Section>

        <Section>
          <SectionTitle>주문 상품</SectionTitle>
          <ItemList>
            {cartItems.map((item) => (
              <ItemRow key={item.id}>
                <ItemMeta>
                  <Thumb>
                    {item.product.imageUrl && <CoverImage src={item.product.imageUrl} alt={item.product.name} fill />}
                  </Thumb>
                  <div>
                    <ProductName>{item.product.name}</ProductName>
                    <Quantity>수량: {item.quantity}개</Quantity>
                  </div>
                </ItemMeta>
                <Price>{formatPrice(item.product.price * item.quantity)}</Price>
              </ItemRow>
            ))}
          </ItemList>
        </Section>
      </MainColumn>

      <SummaryAside>
        <SummaryBox>
          <SummaryTitle>최종 결제 금액</SummaryTitle>
          <SummaryRows>
            <SummaryRow>
              <SummaryLabel>총 상품 금액</SummaryLabel>
              <span>{formatPrice(totalPrice)}</span>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>쿠폰 할인</SummaryLabel>
              <Discount>-{formatPrice(discountAmount)}</Discount>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>배송비</SummaryLabel>
              <span>{shippingFee === 0 ? '무료' : formatPrice(shippingFee)}</span>
            </SummaryRow>
            <TotalRow>
              <span>결제 예정 금액</span>
              <TotalPrice>{formatPrice(finalPrice)}</TotalPrice>
            </TotalRow>
          </SummaryRows>

          <PayButton
            onClick={handleOrder}
            disabled={isSubmitting || addresses.length === 0}
          >
            {isSubmitting ? 'Processing...' : '결제하기'}
          </PayButton>
          {paymentError && <PaymentError>{paymentError}</PaymentError>}
        </SummaryBox>
      </SummaryAside>
    </Layout>
  )
}
