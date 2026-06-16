# 코딩 에이전트용 프롬프트: 풀기능 패션 쇼핑몰 웹사이트 제작

## 0. 핵심 요청

나만의 패션 쇼핑몰 웹사이트를 제작한다.  
전체 분위기는 **무신사 + 네이버 스마트스토어 + 개인 브랜드 쇼핑몰** 느낌으로 만든다.

이번 프로젝트는 단순 MVP가 아니라, 아래 추가 기능까지 모두 포함한 **풀기능 커머스 웹사이트**를 목표로 한다.

- 상품 목록
- 상품 상세
- 검색
- 카테고리 필터
- 정렬
- 회원가입
- 로그인
- 로그아웃
- 장바구니
- 주문
- Toss Payments 결제 연동
- 결제 성공/실패 처리
- 주문 상태 관리
- 리뷰
- 별점
- 찜하기
- 쿠폰
- 배송지 관리
- 상품 이미지 업로드
- 관리자 상품 관리
- 관리자 주문 관리
- 관리자 회원 관리
- 관리자 쿠폰 관리
- 관리자 매출 통계
- 최근 본 상품
- 추천 상품
- 반응형 UI

---

## 1. 사용 기술 스택

다음 기술 스택으로 개발한다.

## Frontend

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js Route Handler
- Next.js Server Actions
- Prisma ORM

## Database

- PostgreSQL

## Authentication

- Auth.js 또는 NextAuth.js
- 이메일/비밀번호 로그인
- 사용자 권한 구분

## Payment

- Toss Payments API
- Toss Payments JavaScript SDK
- Toss Payments Payment Widget 또는 결제창 방식 사용
- 테스트 키 기반으로 먼저 구현
- 서버에서 결제 승인 처리
- 클라이언트 결제 결과를 절대 그대로 신뢰하지 말 것

## Image Upload

- 초기 구현은 Cloudinary 또는 Supabase Storage 중 하나를 선택해서 구현
- 상품 이미지는 URL만 DB에 저장
- 실제 이미지 파일은 외부 스토리지에 저장

## Deployment Target

- Vercel 배포 가능 구조
- DB는 Supabase 또는 Neon PostgreSQL 사용 가능 구조

---

## 2. 디자인 방향

전체적인 UI는 패션 커머스 느낌으로 제작한다.

## 디자인 키워드

- 무신사 느낌
- 블랙/화이트 중심
- 깔끔한 상품 카드
- 큰 상품 이미지
- 넓은 여백
- 반응형 레이아웃
- 모바일 쇼핑몰 느낌
- 관리자 페이지는 대시보드 느낌

## 필수 UI 요소

- 상단 헤더
- 로고
- 검색창
- 카테고리 메뉴
- 로그인/마이페이지/장바구니/찜 버튼
- 메인 배너
- 신상품 섹션
- 인기상품 섹션
- 추천상품 섹션
- 최근 본 상품 섹션
- 푸터

---

## 3. 사용자 권한

사용자 권한은 다음과 같이 나눈다.

```txt
USER
ADMIN
```

## USER 권한

- 상품 조회
- 상품 검색
- 장바구니 사용
- 주문
- 결제
- 리뷰 작성
- 찜하기
- 쿠폰 사용
- 배송지 관리
- 주문 내역 조회

## ADMIN 권한

- 상품 등록/수정/삭제
- 주문 상태 변경
- 회원 목록 조회
- 리뷰 관리
- 쿠폰 생성/수정/삭제
- 매출 통계 조회
- 상품 재고 관리

일반 사용자가 관리자 페이지에 접근하면 접근 차단한다.

---

## 4. 주요 페이지 구조

다음 페이지를 구현한다.

```txt
/
메인 페이지

/products
상품 목록 페이지

/products/[id]
상품 상세 페이지

/search
검색 결과 페이지

/cart
장바구니 페이지

/checkout
주문/결제 페이지

/checkout/success
Toss Payments 결제 성공 처리 페이지

/checkout/fail
Toss Payments 결제 실패 처리 페이지

/orders
내 주문 내역 페이지

/orders/[id]
주문 상세 페이지

/wishlist
찜한 상품 페이지

/recent
최근 본 상품 페이지

/login
로그인 페이지

/register
회원가입 페이지

/mypage
마이페이지

/mypage/addresses
배송지 관리 페이지

/mypage/coupons
내 쿠폰 페이지

/admin
관리자 대시보드

/admin/products
관리자 상품 목록

/admin/products/new
관리자 상품 등록

/admin/products/[id]/edit
관리자 상품 수정

/admin/orders
관리자 주문 관리

/admin/users
관리자 회원 관리

/admin/reviews
관리자 리뷰 관리

/admin/coupons
관리자 쿠폰 관리

/admin/statistics
관리자 매출 통계
```

---

## 5. 데이터베이스 모델 요구사항

Prisma schema는 아래 모델들을 포함해야 한다.

## User

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)

  cartItems CartItem[]
  orders    Order[]
  reviews   Review[]
  wishlist  Wishlist[]
  addresses Address[]
  coupons   UserCoupon[]
  recentViews RecentView[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Product

```prisma
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  price       Int
  description String?
  imageUrl    String?
  categoryId  Int
  stock       Int
  isActive    Boolean  @default(true)

  category    Category @relation(fields: [categoryId], references: [id])
  cartItems   CartItem[]
  orderItems  OrderItem[]
  reviews     Review[]
  wishlist    Wishlist[]
  recentViews RecentView[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Category

```prisma
model Category {
  id        Int       @id @default(autoincrement())
  name      String    @unique
  products  Product[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

## CartItem

```prisma
model CartItem {
  id        Int      @id @default(autoincrement())
  userId    Int
  productId Int
  quantity  Int

  user      User     @relation(fields: [userId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId])
}
```

## Order

```prisma
model Order {
  id              Int         @id @default(autoincrement())
  userId          Int
  orderNumber     String      @unique
  totalPrice      Int
  discountAmount  Int         @default(0)
  finalPrice      Int
  status          OrderStatus @default(PENDING)

  paymentKey      String?
  paymentMethod   String?
  paymentStatus   PaymentStatus @default(READY)
  tossOrderId     String?     @unique

  receiverName    String
  receiverPhone   String
  zipCode         String
  address1        String
  address2        String?
  deliveryMemo    String?

  user            User        @relation(fields: [userId], references: [id])
  items           OrderItem[]

  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}
```

## OrderItem

```prisma
model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  productId Int
  quantity  Int
  price     Int

  order     Order   @relation(fields: [orderId], references: [id])
  product   Product @relation(fields: [productId], references: [id])
}
```

## Review

```prisma
model Review {
  id        Int      @id @default(autoincrement())
  userId    Int
  productId Int
  rating    Int
  content   String
  imageUrl   String?

  user      User     @relation(fields: [userId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([userId, productId])
}
```

## Wishlist

```prisma
model Wishlist {
  id        Int      @id @default(autoincrement())
  userId    Int
  productId Int

  user      User     @relation(fields: [userId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])

  createdAt DateTime @default(now())

  @@unique([userId, productId])
}
```

## Address

```prisma
model Address {
  id           Int      @id @default(autoincrement())
  userId       Int
  receiverName String
  phone        String
  zipCode      String
  address1     String
  address2     String?
  isDefault    Boolean  @default(false)

  user         User     @relation(fields: [userId], references: [id])

  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

## Coupon

```prisma
model Coupon {
  id             Int      @id @default(autoincrement())
  code           String   @unique
  name           String
  discountType   DiscountType
  discountValue  Int
  minOrderPrice  Int      @default(0)
  maxDiscount    Int?
  startsAt       DateTime
  endsAt         DateTime
  isActive       Boolean  @default(true)

  userCoupons    UserCoupon[]

  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

## UserCoupon

```prisma
model UserCoupon {
  id        Int      @id @default(autoincrement())
  userId    Int
  couponId  Int
  isUsed    Boolean  @default(false)
  usedAt    DateTime?

  user      User     @relation(fields: [userId], references: [id])
  coupon    Coupon   @relation(fields: [couponId], references: [id])

  createdAt DateTime @default(now())

  @@unique([userId, couponId])
}
```

## RecentView

```prisma
model RecentView {
  id        Int      @id @default(autoincrement())
  userId    Int
  productId Int

  user      User     @relation(fields: [userId], references: [id])
  product   Product  @relation(fields: [productId], references: [id])

  viewedAt  DateTime @default(now())

  @@unique([userId, productId])
}
```

## Enums

```prisma
enum Role {
  USER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  PREPARING
  SHIPPING
  COMPLETED
  CANCELED
  REFUNDED
}

enum PaymentStatus {
  READY
  IN_PROGRESS
  DONE
  FAILED
  CANCELED
}

enum DiscountType {
  FIXED
  PERCENT
}
```

---

## 6. Toss Payments 결제 연동 요구사항

Toss Payments를 사용해서 실제 결제 흐름을 구현한다.  
개발 단계에서는 반드시 테스트 키를 사용한다.

## 6-1. 환경 변수

`.env`에 다음 값을 둔다.

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

NEXTAUTH_SECRET="replace-this-secret"
NEXTAUTH_URL="http://localhost:3000"

TOSS_CLIENT_KEY="test_ck_..."
TOSS_SECRET_KEY="test_sk_..."
TOSS_SUCCESS_URL="http://localhost:3000/checkout/success"
TOSS_FAIL_URL="http://localhost:3000/checkout/fail"

CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""
```

절대 클라이언트에 `TOSS_SECRET_KEY`가 노출되면 안 된다.

## 6-2. 결제 전체 흐름

다음 흐름으로 구현한다.

```txt
1. 사용자가 장바구니에서 주문하기 클릭
2. /checkout 페이지로 이동
3. 배송지, 쿠폰, 최종 금액 확인
4. 서버에서 Order 생성
5. Order의 tossOrderId 생성
6. 클라이언트에서 Toss Payments 결제창 또는 결제위젯 실행
7. 결제 인증 완료 후 /checkout/success로 이동
8. success 페이지에서 paymentKey, orderId, amount를 받음
9. 서버 API /api/payments/confirm 호출
10. 서버에서 DB의 주문 금액과 Toss amount 비교
11. 금액이 같으면 Toss Payments 결제 승인 API 호출
12. 승인 성공 시 Order 상태를 PAID로 변경
13. PaymentStatus를 DONE으로 변경
14. 주문 상품 재고 감소
15. 장바구니 비우기
16. 주문 상세 페이지로 이동
```

## 6-3. 보안 조건

결제 구현 시 반드시 다음을 지킨다.

- 클라이언트에서 넘어온 amount를 그대로 믿지 말 것
- 서버에서 DB에 저장된 주문 finalPrice와 amount를 비교할 것
- Toss Secret Key는 서버에서만 사용할 것
- 결제 승인 전 주문 상태가 PENDING인지 확인할 것
- 이미 승인된 주문은 중복 승인하지 말 것
- 재고 부족 시 결제 승인 전에 막을 것
- 결제 승인 실패 시 주문 상태를 FAILED 또는 CANCELED로 처리할 것
- 결제 성공 후 DB 업데이트는 transaction으로 처리할 것

## 6-4. API Route 예시

다음 API를 구현한다.

```txt
POST /api/payments/confirm
```

요청 body:

```json
{
  "paymentKey": "string",
  "orderId": "string",
  "amount": 10000
}
```

서버 처리:

```txt
1. 로그인 사용자 확인
2. tossOrderId로 주문 조회
3. 주문 소유자 확인
4. 주문 finalPrice와 amount 비교
5. Toss Payments confirm API 호출
6. 결제 성공 응답 확인
7. DB transaction 실행
8. 주문 상태 PAID 변경
9. paymentKey 저장
10. paymentMethod 저장
11. paymentStatus DONE 변경
12. 재고 감소
13. 장바구니 비우기
14. 성공 응답 반환
```

## 6-5. Toss Payments Confirm API 주의사항

Toss Payments의 결제 승인 API는 서버에서 secret key로 호출한다.

구현 시 다음을 참고한다.

```txt
POST https://api.tosspayments.com/v1/payments/confirm
Authorization: Basic base64(TOSS_SECRET_KEY + ":")
Content-Type: application/json
```

요청 body:

```json
{
  "paymentKey": "paymentKey",
  "orderId": "tossOrderId",
  "amount": 10000
}
```

성공 응답이 오면 결제가 최종 승인된 것으로 처리한다.

---

## 7. 상품 기능

다음 기능을 구현한다.

- 상품 전체 조회
- 상품 상세 조회
- 상품 등록
- 상품 수정
- 상품 삭제
- 상품 비활성화
- 상품 검색
- 카테고리 필터
- 최신순 정렬
- 가격 낮은순 정렬
- 가격 높은순 정렬
- 인기순 정렬
- 평균 별점 표시
- 리뷰 개수 표시
- 재고 상태 표시

---

## 8. 회원 기능

다음 기능을 구현한다.

- 회원가입
- 로그인
- 로그아웃
- 현재 사용자 조회
- 비밀번호 해시 처리
- 관리자 권한 확인
- 마이페이지
- 내 주문 조회
- 내 리뷰 조회
- 내 쿠폰 조회
- 내 배송지 조회

비밀번호는 bcrypt 또는 argon2로 해시 처리한다.

---

## 9. 장바구니 기능

다음 기능을 구현한다.

- 장바구니 담기
- 장바구니 목록 조회
- 수량 증가
- 수량 감소
- 상품 삭제
- 장바구니 비우기
- 총 상품 금액 계산
- 쿠폰 적용 전 금액 표시
- 재고보다 많은 수량 선택 방지

---

## 10. 주문 기능

다음 기능을 구현한다.

- 주문 생성
- 주문 상세 조회
- 주문 내역 조회
- 주문 상태 표시
- 결제 전 주문 상태 PENDING
- 결제 성공 시 PAID
- 관리자 주문 상태 변경
- 주문 취소
- 결제 실패 처리

---

## 11. 리뷰 기능

다음 기능을 구현한다.

- 구매한 상품에만 리뷰 작성 가능
- 상품당 사용자 1명은 리뷰 1개만 작성 가능
- 별점 1~5점
- 리뷰 내용 작성
- 리뷰 이미지 선택 가능
- 리뷰 수정
- 리뷰 삭제
- 상품 상세 페이지에서 리뷰 목록 표시
- 상품 목록에서 평균 별점 표시
- 관리자 리뷰 삭제 가능

---

## 12. 찜하기 기능

다음 기능을 구현한다.

- 상품 찜하기
- 찜 취소
- 찜 목록 조회
- 상품 카드에 찜 여부 표시
- 로그인하지 않은 사용자는 찜하기 시 로그인 페이지로 이동

---

## 13. 쿠폰 기능

다음 기능을 구현한다.

## 쿠폰 종류

```txt
FIXED: 정액 할인
PERCENT: 정률 할인
```

## 사용자 기능

- 보유 쿠폰 조회
- 주문 시 쿠폰 적용
- 최소 주문 금액 확인
- 최대 할인 금액 확인
- 사용 기간 확인
- 사용 완료 처리

## 관리자 기능

- 쿠폰 생성
- 쿠폰 수정
- 쿠폰 삭제
- 쿠폰 활성화/비활성화
- 사용자에게 쿠폰 지급

---

## 14. 배송지 기능

다음 기능을 구현한다.

- 배송지 등록
- 배송지 수정
- 배송지 삭제
- 기본 배송지 설정
- 주문 페이지에서 배송지 선택
- 직접 입력 가능

기본 배송지는 사용자당 하나만 가능하게 한다.

---

## 15. 최근 본 상품 기능

다음 기능을 구현한다.

- 로그인 사용자가 상품 상세 페이지를 보면 RecentView에 저장
- 같은 상품을 다시 보면 viewedAt 갱신
- 최근 본 상품 페이지 구현
- 메인 페이지에 최근 본 상품 일부 표시
- 최대 20개까지만 유지

---

## 16. 추천 상품 기능

복잡한 추천 알고리즘이 아니라 간단한 규칙 기반 추천으로 구현한다.

추천 기준:

- 같은 카테고리 상품
- 최근 본 상품과 같은 카테고리
- 리뷰 평점 높은 상품
- 주문 수가 많은 상품

상품 상세 페이지 하단에 추천 상품을 표시한다.

---

## 17. 관리자 기능

관리자 페이지는 대시보드 형태로 만든다.

## 관리자 상품 관리

- 상품 목록 조회
- 상품 등록
- 상품 수정
- 상품 삭제
- 상품 비활성화
- 재고 수정
- 이미지 업로드

## 관리자 주문 관리

- 전체 주문 조회
- 주문 상세 조회
- 주문 상태 변경
- 주문 취소 처리
- 결제 상태 확인

## 관리자 회원 관리

- 회원 목록 조회
- 회원 상세 조회
- 회원 권한 변경
- 회원 주문 내역 조회

## 관리자 리뷰 관리

- 리뷰 목록 조회
- 부적절한 리뷰 삭제

## 관리자 쿠폰 관리

- 쿠폰 생성
- 쿠폰 수정
- 쿠폰 비활성화
- 사용자에게 쿠폰 지급

## 관리자 통계

다음 통계를 표시한다.

- 총 매출
- 오늘 매출
- 이번 달 매출
- 총 주문 수
- 오늘 주문 수
- 회원 수
- 상품 수
- 인기 상품 TOP 5
- 카테고리별 매출
- 최근 주문 목록

통계는 처음에는 DB 집계 쿼리로 구현한다.

---

## 18. 이미지 업로드

상품 등록/수정 페이지에서 이미지를 업로드할 수 있게 한다.

구현 방식:

```txt
1. 클라이언트에서 이미지 선택
2. 서버 API 또는 Server Action으로 업로드 요청
3. Cloudinary 또는 Supabase Storage에 이미지 저장
4. 반환된 이미지 URL을 Product.imageUrl에 저장
```

조건:

- 이미지 파일만 허용
- 파일 크기 제한
- 업로드 실패 시 에러 표시
- 이미지 미리보기 제공

---

## 19. 검색과 필터

상품 목록 페이지에서 다음을 구현한다.

- 상품명 검색
- 카테고리 필터
- 가격 범위 필터
- 최신순 정렬
- 가격 낮은순
- 가격 높은순
- 인기순
- 평점순

검색 조건은 URL query string에 반영한다.

예시:

```txt
/products?keyword=후드&category=상의&sort=price_asc
```

---

## 20. 상태 처리

모든 페이지에서 다음 상태를 처리한다.

- 로딩 상태
- 빈 데이터 상태
- 에러 상태
- 권한 없음 상태
- 로그인 필요 상태

예시:

```txt
상품이 없습니다.
장바구니가 비어 있습니다.
로그인이 필요합니다.
관리자만 접근할 수 있습니다.
결제 승인에 실패했습니다.
재고가 부족합니다.
```

---

## 21. 유효성 검사

폼 유효성 검사를 구현한다.

추천:

- zod 사용

검사 항목:

## 회원가입

- 이메일 형식
- 비밀번호 8자 이상
- 이름 필수

## 상품

- 상품명 필수
- 가격 0보다 큼
- 재고 0 이상
- 카테고리 필수
- 설명 선택

## 장바구니

- 수량 1 이상
- 재고 이하

## 리뷰

- 별점 1~5
- 내용 필수

## 쿠폰

- 코드 필수
- 할인값 0보다 큼
- 기간 유효성
- 최소 주문 금액 0 이상

## 배송지

- 수령인 필수
- 전화번호 필수
- 우편번호 필수
- 주소 필수

---

## 22. 컴포넌트 구조

다음 컴포넌트를 만든다.

```txt
components/
  layout/
    Header.tsx
    Footer.tsx
    Container.tsx

  product/
    ProductCard.tsx
    ProductGrid.tsx
    ProductDetail.tsx
    ProductForm.tsx
    ProductImageUpload.tsx
    ProductReviewList.tsx
    RecommendedProducts.tsx

  cart/
    CartItemRow.tsx
    CartSummary.tsx

  checkout/
    CheckoutForm.tsx
    PaymentButton.tsx
    CouponSelect.tsx
    AddressSelect.tsx

  order/
    OrderSummary.tsx
    OrderStatusBadge.tsx
    OrderItemList.tsx

  review/
    ReviewForm.tsx
    ReviewCard.tsx
    RatingStars.tsx

  user/
    LoginForm.tsx
    RegisterForm.tsx
    AddressForm.tsx
    CouponList.tsx

  admin/
    AdminSidebar.tsx
    AdminHeader.tsx
    AdminStatsCard.tsx
    AdminProductTable.tsx
    AdminOrderTable.tsx
    AdminUserTable.tsx
    AdminCouponForm.tsx

  common/
    SearchBar.tsx
    CategoryFilter.tsx
    SortSelect.tsx
    EmptyState.tsx
    ErrorMessage.tsx
    LoadingSpinner.tsx
    Pagination.tsx
```

---

## 23. 폴더 구조

다음 구조를 기준으로 구현한다.

```txt
src/
  app/
    page.tsx
    products/
      page.tsx
      [id]/
        page.tsx
    search/
      page.tsx
    cart/
      page.tsx
    checkout/
      page.tsx
      success/
        page.tsx
      fail/
        page.tsx
    orders/
      page.tsx
      [id]/
        page.tsx
    wishlist/
      page.tsx
    recent/
      page.tsx
    login/
      page.tsx
    register/
      page.tsx
    mypage/
      page.tsx
      addresses/
        page.tsx
      coupons/
        page.tsx
    admin/
      page.tsx
      products/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
      orders/
        page.tsx
      users/
        page.tsx
      reviews/
        page.tsx
      coupons/
        page.tsx
      statistics/
        page.tsx
    api/
      payments/
        confirm/
          route.ts
      upload/
        route.ts

  components/
  lib/
    prisma.ts
    auth.ts
    validators.ts
    toss.ts
    upload.ts
    utils.ts
  actions/
    productActions.ts
    cartActions.ts
    orderActions.ts
    authActions.ts
    reviewActions.ts
    wishlistActions.ts
    couponActions.ts
    addressActions.ts
    adminActions.ts

prisma/
  schema.prisma
  seed.ts
```

---

## 24. 개발 순서

반드시 아래 순서로 진행한다.

## 1단계: 기본 세팅

- Next.js 프로젝트 생성
- TypeScript 설정
- Tailwind CSS 설정
- 기본 레이아웃
- Header/Footer
- 환경 변수 예시 파일 작성

## 2단계: DB 세팅

- Prisma 설치
- PostgreSQL 연결
- schema.prisma 작성
- migration 실행
- seed 데이터 작성

## 3단계: 인증

- 회원가입
- 로그인
- 로그아웃
- 현재 사용자 확인
- 관리자 권한 확인

## 4단계: 상품

- 상품 목록
- 상품 상세
- 상품 검색
- 상품 필터
- 상품 정렬
- 상품 이미지 업로드

## 5단계: 장바구니

- 장바구니 담기
- 수량 변경
- 삭제
- 총액 계산

## 6단계: 배송지/쿠폰

- 배송지 등록/수정/삭제
- 기본 배송지
- 쿠폰 조회
- 쿠폰 적용

## 7단계: 주문 생성

- checkout 페이지
- Order 생성
- OrderItem 생성
- 최종 결제 금액 계산
- tossOrderId 생성

## 8단계: Toss Payments 결제

- 클라이언트 결제창 또는 결제위젯 구현
- success 페이지 구현
- fail 페이지 구현
- /api/payments/confirm 구현
- 서버 금액 검증
- 결제 승인 API 호출
- 주문 상태 업데이트
- 재고 감소
- 장바구니 비우기

## 9단계: 리뷰/찜/최근 본 상품

- 리뷰 작성/수정/삭제
- 별점 표시
- 찜하기/찜 취소
- 최근 본 상품 저장
- 추천 상품 표시

## 10단계: 관리자

- 관리자 대시보드
- 상품 관리
- 주문 관리
- 회원 관리
- 리뷰 관리
- 쿠폰 관리
- 통계

## 11단계: 마무리

- 반응형 UI
- 에러 처리
- 로딩 처리
- 빈 상태 처리
- README 작성
- 배포 가이드 작성

---

## 25. Seed 데이터

초기 seed 데이터를 만든다.

## 관리자 계정

```txt
email: admin@example.com
password: admin1234
role: ADMIN
```

비밀번호는 반드시 해시 처리한다.

## 일반 사용자 계정

```txt
email: user@example.com
password: user1234
role: USER
```

## 카테고리

```txt
아우터
상의
하의
신발
가방
액세서리
```

## 상품

최소 20개 이상의 더미 상품을 만든다.

상품명 예시:

```txt
오버핏 후드티
미니멀 블랙 자켓
와이드 데님 팬츠
베이직 반팔 티셔츠
레더 크로스백
화이트 스니커즈
니트 가디건
트레이닝 조거팬츠
옥스포드 셔츠
캔버스 토트백
```

## 쿠폰

```txt
WELCOME10
신규 회원 10% 할인

FREE5000
5,000원 할인
```

---

## 26. README 요구사항

README.md에는 반드시 다음 내용을 포함한다.

```txt
프로젝트 소개
기술 스택
주요 기능
폴더 구조
환경 변수 설정 방법
DB migration 방법
seed 실행 방법
Toss Payments 테스트 키 설정 방법
개발 서버 실행 방법
관리자 계정 정보
일반 사용자 테스트 계정 정보
결제 테스트 방법
배포 방법
추후 개선할 기능
```

---

## 27. 완료 조건

다음이 모두 가능해야 한다.

- 메인 페이지 표시
- 상품 목록 표시
- 상품 상세 표시
- 상품 검색 가능
- 카테고리 필터 가능
- 상품 정렬 가능
- 회원가입 가능
- 로그인 가능
- 로그아웃 가능
- 장바구니 담기 가능
- 장바구니 수량 변경 가능
- 배송지 등록 가능
- 쿠폰 적용 가능
- 주문 생성 가능
- Toss Payments 테스트 결제 가능
- 결제 성공 시 주문 상태 PAID 변경
- 결제 실패 시 실패 페이지 표시
- 결제 성공 후 재고 감소
- 결제 성공 후 장바구니 비우기
- 주문 내역 조회 가능
- 리뷰 작성 가능
- 찜하기 가능
- 최근 본 상품 표시
- 추천 상품 표시
- 관리자 상품 등록/수정/삭제 가능
- 관리자 주문 상태 변경 가능
- 관리자 쿠폰 생성 가능
- 관리자 통계 표시 가능
- 모바일 화면에서 레이아웃 깨지지 않음
- README만 보고 실행 가능

---

## 28. 코딩 에이전트에게 주는 최종 지시

위 요구사항을 바탕으로 **Next.js + TypeScript + Tailwind CSS + Prisma + PostgreSQL + Toss Payments API** 기반의 풀기능 패션 쇼핑몰을 구현해라.

작업 시 다음을 반드시 지켜라.

1. 먼저 전체 폴더 구조와 설치 명령어를 제시한다.
2. Prisma schema를 완성하고 migration이 가능하게 만든다.
3. seed 데이터를 작성한다.
4. 인증 기능을 먼저 구현한다.
5. 상품 기능을 구현한다.
6. 장바구니와 주문 기능을 구현한다.
7. Toss Payments 결제 연동을 구현한다.
8. 리뷰, 찜, 쿠폰, 배송지, 최근 본 상품, 추천 상품 기능을 구현한다.
9. 관리자 페이지와 통계를 구현한다.
10. 각 단계별로 실행 가능한 코드를 제공한다.
11. 에러가 날 수 있는 부분은 미리 설명하고 해결 방법을 적는다.
12. 보안상 민감한 키는 절대 클라이언트 코드에 노출하지 않는다.
13. 클라이언트에서 받은 결제 금액을 절대 신뢰하지 말고 서버 DB 금액과 검증한다.
14. 최종적으로 로컬에서 실행 가능한 상태로 완성한다.
15. README까지 작성한다.
