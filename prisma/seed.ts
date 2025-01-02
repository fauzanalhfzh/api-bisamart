import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
      },
    });
  }

  console.log('Categories seeding completed.');
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
