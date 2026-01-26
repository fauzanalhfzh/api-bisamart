-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "address_id" INTEGER,
ADD COLUMN     "shipping_cost" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
