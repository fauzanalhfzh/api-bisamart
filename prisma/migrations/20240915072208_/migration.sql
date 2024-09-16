-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('MOBIL', 'MOTOR');

-- CreateEnum
CREATE TYPE "StatusDriver" AS ENUM ('INACTIVE', 'ACTIVE');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_rides" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "token" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driver" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "ktp" TEXT NOT NULL,
    "address_ktp" TEXT NOT NULL,
    "ktp_img" TEXT NOT NULL,
    "vehicle_type" "VehicleType" NOT NULL DEFAULT 'MOTOR',
    "sim" TEXT NOT NULL,
    "sim_img" TEXT NOT NULL,
    "selfie_with_sim" TEXT NOT NULL,
    "vehicle_brand" TEXT NOT NULL,
    "vehicle_color" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "profile_img" TEXT NOT NULL,
    "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_earning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_rides" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pending_rides" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cancel_rides" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" "StatusDriver" NOT NULL DEFAULT 'INACTIVE',
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
    "current_location_name" TEXT NOT NULL,
    "destination_location_name" TEXT NOT NULL,
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
