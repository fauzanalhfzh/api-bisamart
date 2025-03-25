-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('PICKUP', 'DELIVERY', 'BOTH');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "delivery_method" "DeliveryMethod" NOT NULL DEFAULT 'DELIVERY';
