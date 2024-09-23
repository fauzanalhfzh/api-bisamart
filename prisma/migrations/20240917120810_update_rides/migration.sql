/*
  Warnings:

  - You are about to drop the column `cratedAt` on the `rides` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `rides` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `rides` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `distance` on the `rides` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "rides" DROP COLUMN "cratedAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
DROP COLUMN "distance",
ADD COLUMN     "distance" DOUBLE PRECISION NOT NULL;
