/*
  Warnings:

  - A unique constraint covering the columns `[ktp]` on the table `merchants` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "merchants_ktp_key" ON "merchants"("ktp");
