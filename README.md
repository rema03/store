# Fashion Mall Store

Next.js 14 App Router 기반의 패션 커머스 애플리케이션입니다. 상품 탐색, 회원 인증, 장바구니, 주문/결제, 배송지, 리뷰, 위시리스트, 쿠폰, 관리자 상품/주문 관리를 하나의 풀스택 앱으로 제공합니다.

## 기술 스택

- Next.js 14, React 18, TypeScript
- DevUp UI (`@devup-ui/react`, `@devup-ui/next-plugin`)
- Prisma ORM, PostgreSQL
- NextAuth Credentials Provider
- Toss Payments SDK
- React Hook Form, Zod
- Docker standalone output

## 주요 기능

- 쇼핑: 홈, 상품 목록, 카테고리 필터, 검색, 가격 정렬, 상품 상세, 최근 본 상품
- 사용자: 회원가입, 로그인, 마이페이지, 배송지 등록/기본 배송지 설정
- 장바구니: 상품 추가, 수량 변경, 삭제, 재고 확인
- 주문/결제: 배송지 선택, 쿠폰 적용, Toss Payments 결제 승인, 주문 내역
- 리뷰: 구매 완료 사용자의 상품 리뷰 작성
- 위시리스트: 상품 관심 등록/해제
- 관리자: 상품 등록/수정/비활성화, 이미지 업로드, 주문 상태 변경, 간단 대시보드

## 프로젝트 구조

```text
store/
  prisma/
    schema.prisma        # User, Product, Order, Coupon 등 DB 모델
    seed.ts              # 테스트 계정, 카테고리, 상품, 쿠폰 시드
  src/
    actions/             # Server Actions: cart/order/admin/address/auth 등
    app/                 # App Router pages and API routes
    components/          # UI 컴포넌트
    lib/                 # auth, prisma, config, validators, utils
    types/               # NextAuth/bcrypt 타입 보강
  scripts/
    patch-devup-ui-next-plugin.mjs
    start-standalone.mjs
```

## 환경 변수

로컬 개발은 `.env.local`을 사용합니다. 이 파일은 git에 올리지 않습니다.

```env
DATABASE_URL="postgresql://store:store_password@127.0.0.1:5433/store"
NEXTAUTH_SECRET="local-store-development-secret-change-before-production"
NEXTAUTH_URL="http://localhost:3000"

NEXT_PUBLIC_TOSS_CLIENT_KEY="..."
TOSS_SECRET_KEY="..."
TOSS_SUCCESS_URL="http://localhost:3000/checkout/success"
TOSS_FAIL_URL="http://localhost:3000/checkout/fail"

NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD="50000"
NEXT_PUBLIC_SHIPPING_FEE="3000"
MAX_UPLOAD_BYTES="5242880"
```

루트 `compose.yaml`에서 실행할 때는 루트 `.env`에 `STORE_*` 변수들이 사용됩니다. 예시는 루트 `.env.example`을 참고하세요.

## 로컬 실행

```bash
npm install
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

접속 주소는 [http://localhost:3000](http://localhost:3000)입니다.

macOS 로컬에서 Docker PostgreSQL에 접속할 때는 `localhost`보다 `127.0.0.1`을 권장합니다. 현재 로컬 기본값은 `127.0.0.1:5433`입니다.

## 테스트 계정

`npm run db:seed` 실행 후 사용할 수 있습니다.

- 관리자: `admin@example.com` / `admin1234`
- 사용자: `user@example.com` / `user1234`

## 주요 명령어

- `npm run dev`: 개발 서버 실행
- `npm run build`: 프로덕션 빌드
- `npm run start`: standalone 서버 실행
- `npm run lint`: Next lint
- `npm run db:generate`: Prisma Client 생성
- `npm run db:push`: 현재 Prisma schema를 DB에 반영
- `npm run db:seed`: 테스트 데이터 생성
- `npm run db:migrate`: Prisma migrate dev

## 결제 흐름

1. 체크아웃 화면에서 배송지, 쿠폰, 장바구니 항목을 선택합니다.
2. `createOrder` Server Action이 `PENDING` 주문을 만들고, 현재 구현에서는 재고와 쿠폰을 주문 생성 시점에 선점합니다.
3. 클라이언트가 Toss Payments 결제창을 엽니다.
4. 성공 리다이렉트 후 `/api/payments/confirm`이 Toss 승인 API를 호출합니다.
5. 승인 성공 시 주문 상태를 `PAID`로 바꾸고 사용자의 장바구니를 비웁니다.

주의: 결제 실패/이탈 시 `PENDING` 주문의 재고와 쿠폰 선점을 복구하는 자동 작업은 아직 없습니다. 운영 전에는 만료된 `PENDING` 주문을 취소하고 재고/쿠폰을 복구하는 배치 또는 취소 API가 필요합니다.

## 업로드

관리자만 `/api/upload`를 사용할 수 있습니다. 허용 MIME 타입은 JPEG, PNG, WebP, GIF이며 기본 최대 크기는 5MB입니다. 현재 구현은 `public/uploads`에 로컬 파일로 저장합니다. 컨테이너/운영 환경에서 영속성이 필요하면 볼륨 또는 외부 스토리지를 연결해야 합니다.

## Docker

`Dockerfile`은 Next standalone output을 빌드합니다. 컨테이너 시작 시 `docker-entrypoint.sh`가 기본적으로 `npx prisma db push`를 실행합니다.

```bash
docker compose up --build store store-db
```

루트 `compose.yaml`은 `store` 서비스에 `DATABASE_URL`, NextAuth, Toss, 정책 관련 환경 변수를 주입합니다.

## 현재 확인된 주의사항

- `npx tsc --noEmit` 기준 `src/components/user/AddressForm.tsx`의 `setError(result.error)` 타입 오류가 남아 있습니다.
- 관리자 주문 상태 변경은 현재 DB status만 바꿉니다. `CANCELED`/`REFUNDED` 처리 시 Toss 취소, 재고 복구, 쿠폰 복구 로직은 별도로 추가해야 합니다.
- `next.config.mjs`는 이미지 최적화를 `unoptimized: true`로 둡니다. 외부 이미지 최적화 전략이 정해지면 재검토하세요.
- DevUp UI가 생성하는 `df/` 폴더는 webpack watch ignore 대상입니다.
