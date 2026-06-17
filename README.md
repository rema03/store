# Jimin Store 프로젝트 보고서

Next.js App Router 기반으로 구현한 패션 쇼핑몰 풀스택 웹 애플리케이션입니다. 상품 탐색부터 회원 인증, 장바구니, 배송지, 쿠폰, Toss Payments 테스트 결제, 주문 내역, 리뷰, 위시리스트, 관리자 상품/주문 관리까지 커머스 서비스의 핵심 흐름을 하나의 프로젝트 안에서 구현했습니다.

## 1. 프로젝트 개요

이 프로젝트는 실제 쇼핑몰의 사용자 흐름과 운영자 관리 흐름을 함께 다루는 것을 목표로 합니다.

사용자는 상품을 둘러보고 장바구니에 담은 뒤 배송지와 쿠폰을 선택해 결제를 진행할 수 있습니다. 관리자는 별도 관리자 페이지에서 상품을 등록/수정/비활성화하고 주문 상태를 관리할 수 있습니다. 결제는 Toss Payments 테스트 API를 연동해 실제 승인 요청 흐름과 유사하게 구성했습니다.

### 서비스 주소

- 로컬 개발: `http://localhost:3000`
- 배포 도메인: `https://shop.jimindev.com`
- 관리자 페이지: `/admin`

### 테스트 계정

`npm run db:seed` 실행 후 사용할 수 있습니다.

| 역할 | 이메일 | 비밀번호 |
| --- | --- | --- |
| 관리자 | `admin@example.com` | `admin1234` |
| 일반 사용자 | `user@example.com` | `user1234` |

## 2. 개발 목표

- 패션 커머스의 기본 사용자 경험 구현
- Next.js App Router와 Server Actions 기반 풀스택 구조 학습
- Prisma ORM을 이용한 관계형 데이터 모델링
- NextAuth Credentials Provider를 이용한 로그인/권한 처리
- Toss Payments 테스트 결제 승인 API 연동
- Docker, PostgreSQL, Caddy를 이용한 AWS 배포 구조 구성
- 관리자 기능과 사용자 기능을 한 프로젝트 안에서 분리 구현

## 3. 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Frontend | Next.js 14, React 18, TypeScript |
| UI | DevUp UI, CSS-in-JS styled API, lucide-react |
| Backend | Next.js Route Handlers, Server Actions |
| 인증 | NextAuth Credentials Provider, JWT Session |
| Database | PostgreSQL, Prisma ORM |
| Form/Validation | React Hook Form, Zod |
| Payment | Toss Payments SDK, Toss Payments Confirm API |
| Infra | Docker, Docker Compose, Caddy, AWS EC2 |

## 4. 주요 기능

### 사용자 기능

- 회원가입 및 로그인
- 상품 목록 조회
- 상품 카테고리 필터
- 상품 검색
- 가격순/최신순 정렬
- 상품 상세 조회
- 장바구니 추가, 수량 변경, 삭제
- 위시리스트 추가/해제
- 배송지 등록 및 기본 배송지 관리
- 쿠폰 적용
- Toss Payments 테스트 결제
- 주문 내역 조회
- 구매 상품 리뷰 작성

### 관리자 기능

- 관리자 대시보드
- 전체 상품 수, 결제 완료 주문 수, 회원 수, 매출 합계 조회
- 상품 등록
- 상품 수정
- 상품 비활성화 방식의 삭제 처리
- 이미지 업로드
- 전체 주문 조회
- 주문 상태 변경

### 결제 테스트 기능

시드 데이터에 `결제 테스트용 100원 티셔츠`를 추가했습니다. Toss Payments 테스트 결제를 부담 없이 확인할 수 있도록 만든 상품입니다.

## 5. 화면 및 라우트 구성

| 경로 | 설명 |
| --- | --- |
| `/` | 메인 홈 |
| `/products` | 상품 목록, 카테고리 필터, 검색/정렬 |
| `/products/[id]` | 상품 상세 |
| `/cart` | 장바구니 |
| `/checkout` | 주문/결제 |
| `/checkout/success` | 결제 성공 처리 |
| `/checkout/fail` | 결제 실패 화면 |
| `/orders` | 주문 내역 |
| `/wishlist` | 위시리스트 |
| `/mypage` | 마이페이지 |
| `/mypage/addresses` | 배송지 목록 |
| `/mypage/addresses/new` | 배송지 등록 |
| `/login` | 로그인 |
| `/register` | 회원가입 |
| `/admin` | 관리자 대시보드 |
| `/admin/products` | 관리자 상품 목록 |
| `/admin/products/new` | 상품 등록 |
| `/admin/products/[id]/edit` | 상품 수정 |
| `/admin/orders` | 관리자 주문 관리 |
| `/api/auth/[...nextauth]` | NextAuth API |
| `/api/payments/confirm` | Toss 결제 승인 API |
| `/api/upload` | 관리자 이미지 업로드 API |

## 6. 프로젝트 구조

```text
store/
  prisma/
    schema.prisma                 # DB 모델 및 enum 정의
    seed.ts                       # 테스트 계정, 상품, 쿠폰, 배송지 시드

  src/
    actions/                      # Server Actions
      adminActions.ts             # 관리자 상품/주문 관리
      addressActions.ts           # 배송지 관리
      authActions.ts              # 회원가입
      cartActions.ts              # 장바구니
      couponActions.ts            # 쿠폰 조회
      orderActions.ts             # 주문 생성/조회
      productActions.ts           # 상품/카테고리 조회
      reviewActions.ts            # 리뷰
      wishlistActions.ts          # 위시리스트

    app/                          # Next.js App Router
      api/                        # Route Handlers
      admin/                      # 관리자 화면
      checkout/                   # 주문/결제 화면
      products/                   # 상품 목록/상세
      mypage/                     # 마이페이지/배송지

    components/                   # 화면별 UI 컴포넌트
      admin/
      cart/
      checkout/
      common/
      layout/
      product/
      review/
      user/

    lib/
      auth.ts                     # NextAuth 설정
      config.ts                   # 배송비, 업로드 크기, env helper
      prisma.ts                   # Prisma Client singleton
      utils.ts                    # 가격 포맷, 주문번호 생성 등
      validators.ts               # Zod schema

    types/                        # 타입 보강

  scripts/
    patch-devup-ui-next-plugin.mjs # DevUp UI 플러그인 패치
    start-standalone.mjs          # standalone 실행 보조 스크립트

  Dockerfile
  docker-entrypoint.sh
  next.config.mjs
  package.json
```

## 7. 데이터베이스 설계

Prisma ORM을 사용해 PostgreSQL에 데이터를 저장합니다. 로컬 Docker 실행 시 DB 데이터는 루트 `compose.yaml`의 Docker volume인 `store_db`에 저장됩니다.

### 주요 모델

| 모델 | 역할 |
| --- | --- |
| `User` | 회원 정보, 권한, 인증 기준 |
| `Product` | 상품명, 가격, 설명, 대표 이미지, 재고, 활성 상태 |
| `Category` | 상품 카테고리 |
| `ProductImage` | 상품 추가 이미지 |
| `CartItem` | 사용자별 장바구니 상품 |
| `Order` | 주문 번호, 금액, 결제 상태, 배송지 스냅샷 |
| `OrderItem` | 주문 당시 상품/수량/가격 |
| `Review` | 구매 상품 리뷰 |
| `Wishlist` | 관심 상품 |
| `Address` | 배송지 |
| `Coupon` | 쿠폰 정책 |
| `UserCoupon` | 사용자에게 발급된 쿠폰과 사용 여부 |
| `RecentView` | 최근 본 상품 |

### 주요 enum

| enum | 값 |
| --- | --- |
| `Role` | `USER`, `ADMIN` |
| `OrderStatus` | `PENDING`, `PAID`, `PREPARING`, `SHIPPING`, `COMPLETED`, `CANCELED`, `REFUNDED` |
| `PaymentStatus` | `READY`, `IN_PROGRESS`, `DONE`, `FAILED`, `CANCELED` |
| `DiscountType` | `FIXED`, `PERCENT` |

## 8. 핵심 처리 흐름

### 주문/결제 흐름

```mermaid
flowchart TD
  A["사용자: 장바구니에서 결제하기"] --> B["배송지/쿠폰 선택"]
  B --> C["createOrder Server Action"]
  C --> D["재고 차감 및 쿠폰 선점"]
  D --> E["PENDING 주문 생성"]
  E --> F["Toss Payments 결제창 호출"]
  F --> G["/checkout/success 리다이렉트"]
  G --> H["/api/payments/confirm"]
  H --> I["Toss 승인 API 호출"]
  I --> J["주문 상태 PAID 변경"]
  J --> K["장바구니 비우기"]
```

주문 생성 시점에는 `PENDING` 상태의 주문을 만들고, 결제 승인 API가 성공하면 `PAID` 상태로 변경합니다. 사용자 주문 내역에서는 `PENDING` 주문을 제외해 결제 취소 또는 결제 이탈 주문이 일반 주문 내역에 노출되지 않도록 처리했습니다.

### 인증/권한 흐름

```mermaid
flowchart TD
  A["로그인 폼"] --> B["NextAuth Credentials Provider"]
  B --> C["Prisma로 사용자 조회"]
  C --> D["bcryptjs 비밀번호 검증"]
  D --> E["JWT session 생성"]
  E --> F["session.user.role 저장"]
  F --> G{"관리자 권한 필요?"}
  G -->|예| H["role이 ADMIN인지 확인"]
  G -->|아니오| I["일반 사용자 기능 접근"]
```

관리자 페이지와 관리자 Server Action은 세션의 `role`이 `ADMIN`인지 확인한 뒤 실행됩니다.

## 9. 환경 변수

로컬 개발은 `.env.local`을 사용합니다. 실제 값은 git에 올리지 않고, 형식은 `.env.example`을 기준으로 맞춥니다.

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

배포 환경에서는 루트 `.env`의 `STORE_*` 변수를 사용합니다.

| 변수 | 설명 |
| --- | --- |
| `STORE_POSTGRES_DB` | PostgreSQL DB 이름 |
| `STORE_POSTGRES_USER` | PostgreSQL 사용자 |
| `STORE_POSTGRES_PASSWORD` | PostgreSQL 비밀번호 |
| `STORE_NEXTAUTH_SECRET` | NextAuth 암호화 secret |
| `STORE_NEXTAUTH_URL` | 배포 URL |
| `STORE_NEXT_PUBLIC_TOSS_CLIENT_KEY` | Toss Payments 클라이언트 키 |
| `STORE_TOSS_SECRET_KEY` | Toss Payments secret 키 |
| `STORE_NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD` | 무료배송 기준 금액 |
| `STORE_NEXT_PUBLIC_SHIPPING_FEE` | 기본 배송비 |
| `STORE_MAX_UPLOAD_BYTES` | 이미지 업로드 최대 크기 |
| `STORE_DB_PUSH` | 컨테이너 시작 시 `prisma db push` 실행 여부 |

## 10. 로컬 실행 방법

### 1. 패키지 설치

```bash
npm install
```

### 2. Prisma Client 생성

```bash
npm run db:generate
```

### 3. DB schema 반영

```bash
npm run db:push
```

### 4. 시드 데이터 생성

```bash
npm run db:seed
```

### 5. 개발 서버 실행

```bash
npm run dev
```

접속 주소는 `http://localhost:3000`입니다.

## 11. 주요 npm 명령어

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | Next.js 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | Next standalone 서버 실행 |
| `npm run lint` | Next lint 실행 |
| `npm run db:generate` | Prisma Client 생성 |
| `npm run db:push` | Prisma schema를 DB에 반영 |
| `npm run db:seed` | 테스트 데이터 생성 |
| `npm run db:migrate` | Prisma migration 생성/적용 |

## 12. Docker 및 배포 구조

이 프로젝트는 루트 `/Users/jimin/web_service`의 `compose.yaml`에 포함되어 배포됩니다.

### 배포 구조

```mermaid
flowchart LR
  A["사용자 브라우저"] --> B["AWS EC2"]
  B --> C["Caddy :80/:443"]
  C --> D["store container :3000"]
  D --> E["store-db PostgreSQL :5432"]
  D --> F["Toss Payments API"]
```

### Caddy 라우팅

`Caddyfile`에서 `shop.jimindev.com` 요청은 Docker 내부 네트워크의 `store:3000`으로 reverse proxy 됩니다.

```caddy
shop.jimindev.com {
  reverse_proxy store:3000
}
```

실제 파일에서는 `SHOP_DOMAIN` 환경 변수를 통해 도메인을 바꿀 수 있습니다.

### Docker image

스토어 서비스 이미지는 다음 이름으로 배포됩니다.

```text
rema03/jimin-store:latest
```

`Dockerfile`은 Next.js standalone output을 사용합니다. AWS에서 CSS/JS가 깨지지 않도록 빌드 후 다음 정적 리소스를 standalone 서버 위치로 복사합니다.

```dockerfile
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
```

### AWS에서 반영

```bash
docker compose pull store
docker compose up -d store caddy
```

### AWS 보안 그룹

외부 공개 포트는 다음만 필요합니다.

| 포트 | 용도 | 공개 범위 |
| --- | --- | --- |
| `80` | HTTP, Caddy 인증서 발급/리다이렉트 | 전체 |
| `443` | HTTPS 서비스 | 전체 |
| `22` | SSH | 본인 IP 권장 |

`3000`, `5432`, `5433`은 외부에 열 필요가 없습니다. `store`와 `store-db`는 Docker 내부 네트워크에서 통신합니다.

## 13. 현재 한계와 개선 방향

| 항목 | 현재 상태 | 개선 방향 |
| --- | --- | --- |
| 결제 취소 복구 | `PENDING` 주문은 주문 내역에서 제외되지만 재고/쿠폰 선점 복구 배치는 없음 | 만료된 `PENDING` 주문을 취소하고 재고/쿠폰을 복구하는 스케줄러 추가 |
| 관리자 주문 취소 | DB 주문 상태 변경 중심 | Toss 결제 취소 API, 재고 복구, 쿠폰 복구까지 트랜잭션화 |
| 이미지 업로드 | `public/uploads` 로컬 저장 | S3, Cloudinary, Supabase Storage 등 외부 스토리지 연결 |
| 테스트 | 수동 테스트 중심 | Playwright E2E, Server Action 단위 테스트 추가 |
| 재고 정책 | 주문 생성 시 선점 | 결제 승인 시점 차감 또는 선점 만료 정책 선택 |
| 접근성 | 기본 폼/버튼 구조 적용 | 키보드 이동, ARIA, 포커스 상태 점검 강화 |

## 14. 시드 데이터

시드 실행 시 다음 데이터가 생성됩니다.

- 관리자 계정 1개
- 일반 사용자 계정 1개
- 기본 배송지 1개
- 카테고리 6개: 아우터, 상의, 하의, 신발, 가방, 액세서리
- 상품 20개 이상
- Toss 테스트용 100원 상품
- 쿠폰 2개
  - `WELCOME10`: 신규 회원 10% 할인
  - `FREE5000`: 5,000원 할인

## 15. 프로젝트 의의

이 프로젝트는 단순 상품 목록 페이지가 아니라, 커머스 서비스에서 실제로 이어져야 하는 흐름을 끝까지 연결했다는 점에 의미가 있습니다.

회원은 상품 탐색부터 결제까지 진행할 수 있고, 관리자는 상품과 주문을 관리할 수 있습니다. 데이터 모델은 장바구니, 주문, 결제, 배송지, 쿠폰, 리뷰, 위시리스트처럼 커머스 도메인의 관계를 반영하며, 배포는 Docker와 Caddy를 통해 실제 도메인에서 접근 가능한 형태로 구성했습니다.

특히 Toss Payments 테스트 결제와 AWS 배포 과정에서 발생한 오류를 직접 수정하면서, 프론트엔드 화면 구현뿐 아니라 결제 승인, 서버 환경 변수, Docker image, reverse proxy, 정적 파일 서빙까지 전체 서비스 운영 흐름을 경험한 프로젝트입니다.
