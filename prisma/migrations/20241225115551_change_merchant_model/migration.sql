/*
  Warnings:

  - You are about to drop the column `self_photo` on the `merchants` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `self_photo_url` to the `merchants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_order_id_fkey";

-- AlterTable
ALTER TABLE "merchants" DROP COLUMN "self_photo",
ADD COLUMN     "self_photo_url" TEXT NOT NULL;

-- DropTable
DROP TABLE "Payment";

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_method" TEXT NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL,
    "status" "StatusPayment" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
