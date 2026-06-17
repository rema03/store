# Store Agent Notes

이 문서는 다음 에이전트가 `store` 프로젝트를 빠르게 이해하고 안전하게 이어서 작업하기 위한 메모입니다.

## 저장소 인식

- `/Users/jimin/web_service/store`는 루트 `/Users/jimin/web_service`와 별도의 git repo입니다.
- 루트 repo의 `git status`에는 store 내부 코드 변경이 보이지 않을 수 있습니다. store 작업 전에는 반드시 `cd /Users/jimin/web_service/store` 기준으로 확인하세요.
- `node_modules`, `.next`, `df`는 생성물입니다. 코드 검색 시 제외하는 편이 좋습니다.

```bash
git status --short
rg --files -g '!node_modules' -g '!.next' -g '!df'
```

## 앱 개요

패션 쇼핑몰 풀스택 앱입니다. App Router 페이지와 Server Actions를 중심으로 구현되어 있습니다.

- 인증: `src/lib/auth.ts`, NextAuth Credentials, JWT session
- DB: `src/lib/prisma.ts`, `prisma/schema.prisma`
- 검증: `src/lib/validators.ts`, Zod schemas
- 정책값: `src/lib/config.ts`
- 포맷/주문번호/할인 계산: `src/lib/utils.ts`

## 핵심 도메인 모델

Prisma schema의 주요 모델은 다음과 같습니다.

- `User`: 이메일 로그인, `USER`/`ADMIN` role
- `Product`, `Category`, `ProductImage`: 상품/카테고리/상세 이미지
- `CartItem`: 사용자 장바구니, `(userId, productId)` unique
- `Order`, `OrderItem`: 주문, Toss 주문 ID, 결제 상태, 배송지 스냅샷
- `Coupon`, `UserCoupon`: 사용자별 쿠폰 발급/사용
- `Review`: 구매자 리뷰, `(userId, productId)` unique
- `Wishlist`, `RecentView`: 관심 상품, 최근 본 상품

## 주요 흐름

### 상품

- 목록/상세 조회: `src/actions/productActions.ts`
- 상품 목록 페이지: `src/app/products/page.tsx`
- 상품 상세 페이지: `src/app/products/[id]/page.tsx`
- 카드/상세 액션: `src/components/product/*`

상품 목록은 `isActive: true`만 노출합니다. 관리자 상품 삭제는 실제 삭제가 아니라 `isActive=false` 처리입니다.

### 장바구니

- Server Actions: `src/actions/cartActions.ts`
- UI: `src/app/cart/page.tsx`, `src/components/cart/*`

장바구니 추가/수량 변경 시 현재 재고를 확인합니다. 실제 재고 차감은 주문 생성 시점입니다.

### 주문과 결제

- 주문 생성: `src/actions/orderActions.ts`
- 체크아웃 UI: `src/app/checkout/page.tsx`, `src/components/checkout/CheckoutForm.tsx`
- 결제 승인 API: `src/app/api/payments/confirm/route.ts`
- 성공 처리 UI: `src/components/checkout/PaymentSuccess.tsx`
- 실패 페이지: `src/app/checkout/fail/page.tsx`

현재 주문 생성 시점에 재고와 쿠폰을 선점합니다.

1. `createOrder`가 장바구니 항목을 조회합니다.
2. 각 상품 재고를 `updateMany(... stock >= quantity)`로 차감합니다.
3. 쿠폰이 있으면 `UserCoupon.isUsed=true`로 바꿉니다.
4. `PENDING` 주문과 주문 상품을 생성합니다.
5. 클라이언트가 Toss 결제창을 띄웁니다.
6. 성공 URL에서 `/api/payments/confirm`을 호출합니다.
7. Toss 승인 성공 후 주문을 `PAID`로 변경하고 장바구니를 비웁니다.

중요 위험: 실패/이탈한 `PENDING` 주문의 재고와 쿠폰을 복구하는 로직이 아직 없습니다. 결제/주문을 건드릴 때 최우선으로 고려하세요.

### 관리자

- Server Actions: `src/actions/adminActions.ts`
- 대시보드: `src/app/admin/page.tsx`
- 상품 관리: `src/app/admin/products/*`
- 주문 관리: `src/app/admin/orders/page.tsx`
- 상태 선택 컴포넌트: `src/components/admin/OrderStatusSelect.tsx`

관리자 권한은 Server Action 내부의 `checkAdmin()`과 일부 페이지의 session role 체크로 보호합니다.

현재 `updateOrderStatus`는 주문 status만 변경합니다. 취소/환불 상태로 바꿀 때 결제 취소, 재고 복구, 쿠폰 복구는 수행하지 않습니다.

### 이미지 업로드

- API: `src/app/api/upload/route.ts`
- UI: `src/components/admin/ProductForm.tsx`

관리자만 업로드할 수 있습니다. MIME 타입과 크기를 검사한 뒤 `public/uploads`에 저장합니다. 운영 컨테이너에서는 파일 영속성 전략이 필요합니다.

## 환경 변수

로컬:

- `.env.local`
- `DATABASE_URL`은 macOS 개발에서 `127.0.0.1:5433` 권장
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`, `TOSS_SECRET_KEY`는 Toss 테스트 키 사용

루트 compose:

- 루트 `.env` 또는 `.env.example`의 `STORE_*` 변수가 `compose.yaml`에서 store 서비스로 주입됩니다.
- `store-db` 포트를 외부에 열 때는 운영 노출 여부를 반드시 확인하세요.

## 검증 명령

```bash
npm run lint
npx tsc --noEmit
npm run build
```

최근 확인 결과:

- `npm run lint` 통과
- `npx tsc --noEmit` 실패: `src/components/user/AddressForm.tsx`에서 `setError(result.error)` 타입 오류

해당 오류는 `result.error`가 `string | undefined`로 추론되기 때문입니다. 예시는 다음과 같습니다.

```ts
setError(result.error ?? '배송지 등록 중 오류가 발생했습니다.')
```

## 작업 시 주의

- DevUp UI가 `df/` 생성물을 만듭니다. `next.config.mjs`에서 `**/df/**`를 watch ignore하고 있으니 유지하세요.
- `Controller` 패턴이 일부 폼에서 쓰입니다. DevUp styled input과 React Hook Form ref 전달 문제가 있으면 `Controller`를 우선 고려하세요.
- 결제 금액은 클라이언트 계산값을 신뢰하지 않고 서버 주문의 `finalPrice`와 비교합니다.
- `TOSS_SECRET_KEY`, `NEXTAUTH_SECRET`, DB 비밀번호 같은 값은 답변이나 문서에 실제 운영값을 노출하지 마세요.
- `.env.local`은 로컬 개발용이며 git에 올리지 않습니다.
- 코드 변경 후 store repo 기준으로 `git status --short`를 확인하세요.

## 우선 개선 후보

1. `PENDING` 주문 만료/취소 복구 로직 추가
2. 관리자 취소/환불 시 Toss 취소 및 재고/쿠폰 복구
3. `AddressForm` 타입 오류 수정
4. 업로드 파일 영속성 또는 Cloudinary/Supabase Storage 연동
5. 프로덕션 배포용 Prisma migration 전략 정리
