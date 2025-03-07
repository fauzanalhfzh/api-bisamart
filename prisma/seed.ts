import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  const categories = [
    { name: 'Makanan & Minuman' },
    { name: 'Sembako & Kebutuhan Harian' },
    { name: 'Kesehatan & Kecantikan' },
    { name: 'Elektronik & Aksesoris' },
    { name: 'Fashion' },
    { name: 'Peralatan Rumah Tangga' },
    { name: 'Hobi & Hiburan' },
    { name: 'Otomotif' },
    { name: 'Produk Lokal & UMKM' },
  ];

  for (const category of categories) {
    await prisma.producCategory.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
      },
    });
  }
  console.log('✅ Category seeding completed.');
}

async function seedMerchantCategories() {
  const merchantCategories = [
    { name: 'Groceries & Retail' },
    { name: 'F&B (Food & Beverages)' },
    { name: 'Kesehatan & Kecantikan' },
    { name: 'Rumah & Gaya Hidup' },
    { name: 'Elektronik & Aksesoris' },
    { name: 'Fashion & Aksesoris' },
  ];

  for (const category of merchantCategories) {
    await prisma.merchantCategory.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
      },
    });
  }
  console.log('✅ Merchant Category seeding completed.');
}

async function main() {
  await seedCategories();
  await seedMerchantCategories();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
