import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = [];

  for (let i = 1; i <= 30; i++) {
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
