-- CreateEnum
CREATE TYPE "AddressTag" AS ENUM ('RUMAH', 'KANTOR');

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "tag" "AddressTag" NOT NULL DEFAULT 'RUMAH';
