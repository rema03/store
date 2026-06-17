# 🛍️ Fashion Mall - 풀기능 패션 쇼핑몰

프로젝트 초기 구성이 완료되었습니다!  
이 프로젝트는 **Next.js + TypeScript + Tailwind CSS + Prisma + PostgreSQL + Toss Payments**로 구축된 풀기능 패션 쇼핑몰입니다.

## 📋 프로젝트 개요

### 주요 기능
- ✅ 상품 목록/상세/검색/필터/정렬
- ✅ 회원가입/로그인/로그아웃
- ✅ 장바구니 (담기/수량변경/삭제)
- ✅ 주문/결제 (Toss Payments)
- ✅ 리뷰/별점/찜하기
- ✅ 배송지 관리/쿠폰
- ✅ 최근 본 상품/추천 상품
- ✅ 관리자 대시보드/통계
- ✅ 반응형 UI (모바일 최적화)

## 🛠 기술 스택

### Frontend
- **Next.js 14** - App Router, Server Components
- **React 18** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS** - 스타일링

### Backend
- **Next.js Route Handler** - API 엔드포인트
- **Next.js Server Actions** - 서버 함수
- **Prisma ORM** - 데이터베이스 접근

### Database & Auth
- **PostgreSQL** - 관계형 데이터베이스
- **NextAuth.js** - 인증 (이메일/비밀번호)
- **bcryptjs** - 비밀번호 해싱

### Payment
- **Toss Payments API** - 결제 처리
- **Toss Payments SDK** - 결제창

### Image Storage
- **Cloudinary** 또는 **Supabase Storage** - 이미지 업로드

## 📁 폴더 구조

```
store/
├── app/
│   ├── layout.tsx              # 루트 레이아웃
│   ├── page.tsx                # 메인 페이지
│   ├── globals.css             # 전역 스타일
│   ├── products/               # 상품 페이지
│   ├── cart/                   # 장바구니
│   ├── checkout/               # 결제 페이지
│   ├── orders/                 # 주문 내역
│   ├── login/register/         # 인증 페이지
│   ├── mypage/                 # 마이페이지
│   ├── admin/                  # 관리자 페이지
│   └── api/                    # API 라우트
├── components/                 # 컴포넌트
│   ├── layout/                 # Header, Footer
│   ├── product/                # 상품 관련
│   ├── cart/                   # 장바구니
│   ├── checkout/               # 결제 관련
│   ├── order/                  # 주문 관련
│   ├── review/                 # 리뷰
│   ├── user/                   # 사용자
│   ├── admin/                  # 관리자
│   └── common/                 # 공통 컴포넌트
├── lib/
│   ├── prisma.ts               # Prisma 클라이언트 ✅
│   ├── validators.ts           # Zod 유효성 검사 ✅
│   ├── utils.ts                # 유틸리티 함수 ✅
│   ├── auth.ts                 # 인증 설정
│   ├── toss.ts                 # Toss Payments API
│   └── upload.ts               # 이미지 업로드
├── actions/                    # Server Actions
│   ├── productActions.ts
│   ├── cartActions.ts
│   ├── orderActions.ts
│   ├── authActions.ts
│   ├── reviewActions.ts
│   ├── wishlistActions.ts
│   ├── couponActions.ts
│   ├── addressActions.ts
│   └── adminActions.ts
├── prisma/
│   ├── schema.prisma           # 데이터베이스 스키마 ✅
│   └── seed.ts                 # 시드 데이터 ✅
├── public/
│   └── images/                 # 이미지 디렉토리
├── .env.example                # 환경 변수 예시 ✅
├── .env.local                  # 개발 환경 변수 ✅
├── package.json                # 패키지 설정 ✅
├── tsconfig.json               # TypeScript 설정 ✅
├── devup.json                  # DevUp UI 테마 설정
├── next.config.ts              # Next.js 설정 ✅
└── README.md                   # 이 파일
```

## 🚀 시작 가이드

### 1. 환경 설정

`.env.local` 파일이 이미 생성되었습니다. 필요시 수정하세요:

```bash
# 데이터베이스 설정
DATABASE_URL="postgresql://user:password@localhost:5432/fashion_mall"

# 인증
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Toss Payments (테스트 키)
TOSS_CLIENT_KEY="test_ck_..."
TOSS_SECRET_KEY="test_sk_..."

# 이미지 업로드 (Cloudinary)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 2. 데이터베이스 설정

PostgreSQL을 설치하고 다음 명령을 실행하세요:

```bash
# 1. 데이터베이스 마이그레이션
npm run db:migrate

# 또는 프로덕션 환경에서
npm run db:push

# 2. 시드 데이터 입력
npm run db:seed
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열어보세요.

## 👤 테스트 계정

### 관리자 계정
- **이메일**: admin@example.com
- **비밀번호**: admin1234

### 일반 사용자
- **이메일**: user@example.com
- **비밀번호**: user1234

## 💳 Toss Payments 테스트

### 테스트 결제 카드
- **카드번호**: 4330 1234 5678 9010
- **유효기간**: 12/26
- **CVC**: 123
- **비밀번호**: 00

[Toss Developers 문서](https://docs.tosspayments.com)에서 더 많은 테스트 카드를 확인할 수 있습니다.

## 📦 초기 구성 완료 체크리스트

### Phase 1: 기본 세팅 ✅
- [x] Next.js 프로젝트 생성
- [x] TypeScript 설정
- [x] Tailwind CSS 설정
- [x] 기본 레이아웃
- [x] 폴더 구조
- [x] 환경 변수 설정

### Phase 2: DB 세팅 ✅
- [x] Prisma 설치
- [x] schema.prisma 완성
- [x] Migration 파일 준비
- [x] Seed 데이터 작성

### Phase 3~10: 기능 구현 (예정)
- [ ] 인증 (회원가입/로그인)
- [ ] 상품 (목록/상세/검색)
- [ ] 장바구니
- [ ] 주문/결제
- [ ] 리뷰/찜/배송지/쿠폰
- [ ] 관리자 페이지
- [ ] 반응형 UI 완성

## 🔧 npm 명령어

```bash
npm run dev        # 개발 서버 실행
npm run build      # 프로덕션 빌드
npm start          # 프로덕션 서버 실행
npm run lint       # ESLint 실행

# 데이터베이스
npm run db:push    # Prisma schema를 DB에 적용
npm run db:generate # Prisma Client 재생성
npm run db:seed    # 시드 데이터 입력
npm run db:migrate # 마이그레이션 생성 및 실행
```

## 📝 주요 파일 설명

### prisma/schema.prisma
- User, Product, Category, Order 등 모든 데이터베이스 모델 정의
- 관계(Relationship) 설정
- Enum (Role, OrderStatus, PaymentStatus 등)

### lib/validators.ts
- Zod를 사용한 폼 유효성 검사
- registerSchema, loginSchema, productSchema 등

### lib/utils.ts
- formatPrice: 가격 포맷팅
- generateOrderNumber: 주문번호 생성
- calculateDiscount: 할인 계산

## 🔒 보안 주의사항

1. **TOSS_SECRET_KEY는 절대 클라이언트에 노출하면 안 됩니다** ❌
2. **클라이언트에서 받은 가격을 그대로 믿지 말고 서버 DB와 검증하세요** ✅
3. **.env.local 파일을 절대 git에 커밋하면 안 됩니다** ✅
4. **비밀번호는 bcryptjs로 해시 처리합니다** ✅

## 📚 다음 단계

1. **Phase 2: DB 세팅**
   ```bash
   npm run db:push
   npm run db:seed
   ```

2. **Phase 3: 인증 구현**
   - Auth.js/NextAuth.js 설정
   - 회원가입/로그인 페이지
   - 미들웨어 설정

3. **Phase 4: 상품 구현**
   - 상품 목록 페이지
   - 상품 상세 페이지
   - 검색/필터/정렬

4. 그 외 차근차근 계속 진행...

## ⚠️ 주의사항

- 데이터베이스 연결 없이는 마이그레이션을 실행할 수 없습니다
- PostgreSQL 9.6 이상 필요
- Node.js 16.x 이상 필요

## 📞 문제 해결

### "DATABASE_URL not found" 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인하세요

### "Prisma Client 오류"
```bash
npm run db:generate
```

### 포트 3000이 이미 사용 중
```bash
npm run dev -- -p 3001
```

## 🎯 배포

### Vercel 배포
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### 환경 변수 설정
Vercel 대시보드에서 모든 `.env.local` 변수를 설정해야 합니다.

### 데이터베이스 (클라우드)
- **Supabase**: PostgreSQL 호스팅
- **Neon**: PostgreSQL 호스팅

## 📖 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Prisma 공식 문서](https://www.prisma.io/docs)
- [DevUp UI](https://devup-ui.com)
- [NextAuth.js](https://next-auth.js.org)
- [Toss Payments](https://docs.tosspayments.com)

---

✨ **프로젝트 구성이 완료되었습니다!**  
이제 Phase 2 (DB 세팅)로 진행할 준비가 되었습니다.
