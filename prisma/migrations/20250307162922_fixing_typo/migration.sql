/*
  Warnings:

  - You are about to drop the column `self_photo_photo` on the `merchants` table. All the data in the column will be lost.
  - Added the required column `self_photo` to the `merchants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "merchants" DROP COLUMN "self_photo_photo",
ADD COLUMN     "self_photo" TEXT NOT NULL;
