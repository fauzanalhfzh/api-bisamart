/*
  Warnings:

  - Changed the type of `day_of_week` on the `merchant_operating_hours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU');

-- AlterTable
ALTER TABLE "merchant_operating_hours" DROP COLUMN "day_of_week",
ADD COLUMN     "day_of_week" "DayOfWeek" NOT NULL,
ALTER COLUMN "open_time" DROP NOT NULL,
ALTER COLUMN "close_time" DROP NOT NULL;
