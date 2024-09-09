-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOBIL', 'MOTOR');

-- CreateEnum
CREATE TYPE "StatusDriver" AS ENUM ('INACTIVE', 'ACTIVE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "phone_number" VARCHAR(20) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_rides" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "token" VARCHAR(100),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "ktp" VARCHAR(50) NOT NULL,
    "address_ktp" VARCHAR(100) NOT NULL,
    "ktp_img" TEXT NOT NULL,
    "vehicle_type" "VehicleType" NOT NULL DEFAULT 'MOTOR',
    "sim" VARCHAR(50) NOT NULL,
    "sim_img" TEXT NOT NULL,
    "selfie_with_sim" TEXT NOT NULL,
    "vehicle_brand" VARCHAR(30) NOT NULL,
    "vehicle_color" VARCHAR(30) NOT NULL,
    "license_plate" VARCHAR(30) NOT NULL,
    "registration_number" VARCHAR(30) NOT NULL,
    "profil_img" TEXT NOT NULL,
    "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_earning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_rides" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pending_rides" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cancel_rides" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "StatusDriver" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "token" VARCHAR(100),

    CONSTRAINT "driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "driver_id" INTEGER NOT NULL,
    "charge" DOUBLE PRECISION NOT NULL,
    "current_location_name" VARCHAR(30) NOT NULL,
    "destination_location_name" VARCHAR(30) NOT NULL,
    "distance" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "rating" DOUBLE PRECISION,
    "cratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_number_key" ON "user"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "driver_phone_number_key" ON "driver"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "driver_email_key" ON "driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "driver_ktp_key" ON "driver"("ktp");

-- CreateIndex
CREATE UNIQUE INDEX "driver_sim_key" ON "driver"("sim");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
