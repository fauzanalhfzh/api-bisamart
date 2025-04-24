/*
  Warnings:

  - The primary key for the `password_reset_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `password_reset_token` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `promo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `promo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[code]` on the table `promo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "password_reset_token" DROP CONSTRAINT "password_reset_token_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "password_reset_token_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "promo" DROP CONSTRAINT "promo_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "promo_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Cart" (
    "id" SERIAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "note" TEXT,
    "customer_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promo_code_key" ON "promo"("code");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
