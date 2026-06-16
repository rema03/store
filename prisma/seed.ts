import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.userCoupon.deleteMany()
  await prisma.coupon.deleteMany()
  await prisma.recentView.deleteMany()
  await prisma.wishlist.deleteMany()
  await prisma.review.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.address.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const adminHash = await bcryptjs.hash('admin1234', 10)
  const userHash = await bcryptjs.hash('user1234', 10)

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: adminHash,
      name: 'Admin User',
      role: 'ADMIN',
    },
  })

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userHash,
      name: 'Test User',
      role: 'USER',
    },
  })

  console.log('✓ Users created')

  // Create categories
  await prisma.category.createMany({
    data: [
      { name: '아우터' },
      { name: '상의' },
      { name: '하의' },
      { name: '신발' },
      { name: '가방' },
      { name: '액세서리' },
    ],
  })

  const catOutermost = await prisma.category.findFirst({ where: { name: '아우터' } })
  const catTop = await prisma.category.findFirst({ where: { name: '상의' } })
  const catBottom = await prisma.category.findFirst({ where: { name: '하의' } })
  const catShoes = await prisma.category.findFirst({ where: { name: '신발' } })
  const catBag = await prisma.category.findFirst({ where: { name: '가방' } })
  const catAccess = await prisma.category.findFirst({ where: { name: '액세서리' } })

  console.log('✓ Categories created')

  // Create products
  const products = await prisma.product.createMany({
    data: [
      // Outwear
      {
        name: '미니멀 블랙 자켓',
        price: 89000,
        description: '시간 없이 입을 수 있는 기본 검은 재킷',
        categoryId: catOutermost?.id || 1,
        imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=900',
        stock: 50,
      },
      {
        name: '오버핏 후드티',
        price: 59000,
        description: '편하고 스타일리시한 오버핏 후드티',
        categoryId: catTop?.id || 2,
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=900',
        stock: 100,
      },
      {
        name: '니트 가디건',
        price: 79000,
        description: '부드러운 뉴트럼 톤의 니트 가디건',
        categoryId: catOutermost?.id || 1,
        imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=900',
        stock: 40,
      },
      {
        name: '데님 진 재킷',
        price: 89000,
        description: '클래식한 블루 데님 재킷',
        categoryId: catOutermost?.id || 1,
        imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=900',
        stock: 35,
      },
      // Tops
      {
        name: '베이직 반팔 티셔츠',
        price: 29000,
        description: '모든 코디에 잘 어울리는 기본 반팔',
        categoryId: catTop?.id || 2,
        imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=900',
        stock: 200,
      },
      {
        name: '옥스포드 셔츠',
        price: 69000,
        description: '깔끔한 실루엣의 옥스포드 셔츠',
        categoryId: catTop?.id || 2,
        imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=900',
        stock: 60,
      },
      {
        name: '크롭 탱크톱',
        price: 39000,
        description: '여름철 필수 크롭 탱크톱',
        categoryId: catTop?.id || 2,
        imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=900',
        stock: 80,
      },
      {
        name: '롱슬리브 티셔츠',
        price: 45000,
        description: '베이직하면서도 트렌디한 롱슬리브',
        categoryId: catTop?.id || 2,
        imageUrl: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=900',
        stock: 90,
      },
      // Bottoms
      {
        name: '와이드 데님 팬츠',
        price: 79000,
        description: '편안한 와이드 핏 데님 팬츠',
        categoryId: catBottom?.id || 3,
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=900',
        stock: 70,
      },
      {
        name: '트레이닝 조거팬츠',
        price: 59000,
        description: '활동성 좋은 검은 조거팬츠',
        categoryId: catBottom?.id || 3,
        imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=900',
        stock: 85,
      },
      {
        name: '화이트 슬랙스',
        price: 69000,
        description: '정장한 라인의 화이트 슬랙스',
        categoryId: catBottom?.id || 3,
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=900',
        stock: 55,
      },
      {
        name: '미니 스커트',
        price: 59000,
        description: '세련된 블랙 미니 스커트',
        categoryId: catBottom?.id || 3,
        imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=900',
        stock: 40,
      },
      // Shoes
      {
        name: '화이트 스니커즈',
        price: 99000,
        description: '모든 옷과 매치되는 클래식 화이트 스니커',
        categoryId: catShoes?.id || 4,
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=900',
        stock: 120,
      },
      {
        name: '검은 로퍼',
        price: 119000,
        description: '직장과 캐주얼 모두 어울리는 로퍼',
        categoryId: catShoes?.id || 4,
        imageUrl: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?q=80&w=900',
        stock: 50,
      },
      {
        name: '부츠',
        price: 149000,
        description: '겨울 필수 부츠',
        categoryId: catShoes?.id || 4,
        imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=900',
        stock: 30,
      },
      // Bags
      {
        name: '레더 크로스백',
        price: 149000,
        description: '고급스러운 레더 크로스백',
        categoryId: catBag?.id || 5,
        imageUrl: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=900',
        stock: 25,
      },
      {
        name: '캔버스 토트백',
        price: 69000,
        description: '일상 용품을 담을 수 있는 큰 토트백',
        categoryId: catBag?.id || 5,
        imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=900',
        stock: 60,
      },
      {
        name: '백팩',
        price: 89000,
        description: '기능성과 스타일을 겸비한 백팩',
        categoryId: catBag?.id || 5,
        imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=900',
        stock: 45,
      },
      // Accessories
      {
        name: '캐시미어 스카프',
        price: 79000,
        description: '부드러운 캐시미어 스카프',
        categoryId: catAccess?.id || 6,
        imageUrl: 'https://images.unsplash.com/photo-1601244005535-a48d21d951ac?q=80&w=900',
        stock: 40,
      },
      {
        name: '선글라스',
        price: 89000,
        description: '자외선 차단 선글라스',
        categoryId: catAccess?.id || 6,
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=900',
        stock: 50,
      },
      {
        name: '모자',
        price: 45000,
        description: '베이직 검은 모자',
        categoryId: catAccess?.id || 6,
        imageUrl: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=900',
        stock: 100,
      },
    ],
  })

  console.log(`✓ ${products.count} Products created`)

  // Create coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        name: '신규 회원 10% 할인',
        discountType: 'PERCENT',
        discountValue: 10,
        minOrderPrice: 0,
        maxDiscount: 50000,
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'FREE5000',
        name: '5,000원 할인',
        discountType: 'FIXED',
        discountValue: 5000,
        minOrderPrice: 30000,
        maxDiscount: 5000,
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    ],
  })

  console.log('✓ Coupons created')

  // Create address for user
  await prisma.address.create({
    data: {
      userId: user.id,
      receiverName: 'Test User',
      phone: '010-1234-5678',
      zipCode: '12345',
      address1: '서울시 강남구 테헤란로 123',
      address2: '아파트 101호',
      isDefault: true,
    },
  })

  console.log('✓ Address created')

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
