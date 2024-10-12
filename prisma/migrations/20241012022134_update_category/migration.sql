/*
  Warnings:

  - You are about to drop the `_category_product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_category_product" DROP CONSTRAINT "_category_product_A_fkey";

-- DropForeignKey
ALTER TABLE "_category_product" DROP CONSTRAINT "_category_product_B_fkey";

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "description" DROP NOT NULL;

-- DropTable
DROP TABLE "_category_product";

-- CreateTable
CREATE TABLE "pivot_productcategory" (
    "product_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "pivot_productcategory_pkey" PRIMARY KEY ("product_id","category_id")
);

-- AddForeignKey
ALTER TABLE "pivot_productcategory" ADD CONSTRAINT "pivot_productcategory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_productcategory" ADD CONSTRAINT "pivot_productcategory_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
