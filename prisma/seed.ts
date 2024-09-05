import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [];

  for (let i = 1; i <= 10; i++) {
    products.push({
      name: `Test Product ${i}`,
      description: `Description for test product ${i}`,
      price: Math.floor(Math.random() * 1000) + 1, // Random price between 1 and 1000
      stock: Math.floor(Math.random() * 100), // Random stock between 0 and 99
    });
  }

  await prisma.product.createMany({
    data: products,
  });

  const user = [];

  for (let i = 1; i <= 2; i++) {
    user.push({
      email: `user${i}@gmail.com`,
      password: '1234',
      role: 'user',
      name: `User ${i}`,
    });
  }

  await prisma.user.createMany({
    data: user,
  });

  for (let i = 1; i <= 2; i++) {
    const user = await prisma.user.create({
      data: {
        email: `affiliate${i}@gmail.com`,
        password: '1234',
        role: 'affiliate',
        name: `Affiliate ${i}`,
      },
    });

    await prisma.affiliate.create({
      data: {
        userId: user.id,
      },
    });
  }

  console.log('Seeded 30 products');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
