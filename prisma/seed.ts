import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Bisamart Goods' },
    { name: 'Buah Segar' },
    { name: 'Sayur Segar' },
    { name: 'Ayam & Unggas' },
    { name: 'Bisamart Kitchen' },
    { name: 'Minuman' },
    { name: 'Snack' },
    { name: 'Telur, Tahu, & Tempe' },
    { name: 'Makanan Beku' },
    { name: 'Seafood' },
    { name: 'Bahan Masak & Bumbu' },
    { name: 'Daging Beku' },
    { name: 'Susu & Olahan Susu' },
    { name: 'Sarapan' },
    { name: 'Perawatan Diri' },
    { name: 'Kebutuhan Cuci Baju' },
    { name: 'Biskuit' },
    { name: 'Kebutuhan Ibu & Bayi' },
    { name: 'Produk 21+' },
    { name: 'Gas dan Air Galon' },
    { name: 'Es Krim' },
    { name: 'Obat-obatan' },
    { name: 'Kebersihan Badan' },
    { name: 'Kebutuhan Dapur' },
    { name: 'Tepung & Bahan Kue' },
    { name: 'Perawatan Mulut' },
    { name: 'Makanan & susu bayi' },
    { name: 'Perawatan Hewan' },
    { name: 'Alat Kesehatan' },
    { name: 'Vitamin' },
    { name: 'Shampoo & Conditioner' },
    { name: 'Cokelat' },
    { name: 'Alat Tulis Kantor' },
    { name: 'Skincare' },
    { name: 'Elektronik' },
    { name: 'Permen' },
    { name: 'Peralatan Dapur' },
    { name: 'Tata Rumah' },
    { name: 'Fashion Aksesories' },
    { name: 'Kebersihan Wajah' },
    { name: 'Perlengkapan Pakaian' },
    { name: 'Perlengkapan Pesta' },
    { name: 'Make Up' },
    { name: 'Peralatan Ibu & Bayi' },
    { name: 'Otomotif' },
    { name: 'Mainan & Hobi' },
    { name: 'Perlengkapan Ibadah' },
    { name: 'Olahraga' },
    { name: 'Menu Praktis' },
    { name: 'Travel' },
    { name: 'HP & Gadget' },
    { name: 'Kids Selection' },
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
