-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "KurirStatus" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "MerchantStatus" AS ENUM ('BUKA', 'TUTUP', 'TAHAN');

-- CreateEnum
CREATE TYPE "StatusPayment" AS ENUM ('PAID', 'PENDING', 'FAILED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_order" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pending_order" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cancel_order" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "ktp" TEXT NOT NULL,
    "ktp_url" TEXT NOT NULL,
    "place_of_birth" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "address_ktp" TEXT NOT NULL,
    "self_photo" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "saving_book_url" TEXT,
    "status" "MerchantStatus" NOT NULL DEFAULT 'TUTUP',
    "merchant_address" TEXT NOT NULL,
    "merchant_name" TEXT NOT NULL,
    "category_merchant" TEXT NOT NULL,
    "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_earning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_order" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pending_order" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cancel_order" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "couriers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address_ktp" TEXT NOT NULL,
    "ktp" TEXT NOT NULL,
    "ktp_url" TEXT NOT NULL,
    "selfie_with_sim_url" TEXT NOT NULL,
    "profile_url" TEXT NOT NULL,
    "vehicle_brand" TEXT NOT NULL,
    "vehicle_color" TEXT NOT NULL,
    "vehicle_speed" INTEGER NOT NULL,
    "registration_number" TEXT NOT NULL,
    "license_plate" TEXT NOT NULL,
    "license_url" TEXT NOT NULL,
    "status" "KurirStatus" NOT NULL DEFAULT 'OFFLINE',
    "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_earning" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_rides" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "pending_rides" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cancel_rides" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "token" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "couriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "address_line" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merchant_operating_hours" (
    "id" TEXT NOT NULL,
    "merchant_id" TEXT NOT NULL,
    "day_of_week" TEXT NOT NULL,
    "is_24_hours" BOOLEAN NOT NULL DEFAULT false,
    "open_time" TEXT NOT NULL,
    "close_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merchant_operating_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "coupon_code" TEXT NOT NULL,
    "name" TEXT,
    "discount_amount" DOUBLE PRECISION NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "usage_limit" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "netto" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,
    "merchant_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "coupon_id" TEXT NOT NULL,
    "charge" DOUBLE PRECISION NOT NULL,
    "pickup_name" TEXT NOT NULL,
    "destination_name" TEXT NOT NULL,
    "distance" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "sub_total" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_method" TEXT NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL,
    "status" "StatusPayment" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "merchants_email_key" ON "merchants"("email");

-- CreateIndex
CREATE UNIQUE INDEX "merchants_phone_number_key" ON "merchants"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "couriers_email_key" ON "couriers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "couriers_phone_number_key" ON "couriers"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merchant_operating_hours" ADD CONSTRAINT "merchant_operating_hours_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_merchant_id_fkey" FOREIGN KEY ("merchant_id") REFERENCES "merchants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
