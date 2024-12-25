/*
  Warnings:

  - You are about to drop the column `merchant_address` on the `merchants` table. All the data in the column will be lost.
  - Added the required column `address_line` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postal_code` to the `merchants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `merchants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "merchants" DROP COLUMN "merchant_address",
ADD COLUMN     "address_line" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "latitude" TEXT NOT NULL,
ADD COLUMN     "longitude" TEXT NOT NULL,
ADD COLUMN     "postal_code" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
