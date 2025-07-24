/*
  Warnings:

  - The primary key for the `dons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `abura` on the `dons` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `dons` table. All the data in the column will be lost.
  - You are about to drop the column `karame` on the `dons` table. All the data in the column will be lost.
  - You are about to drop the column `ninniku` on the `dons` table. All the data in the column will be lost.
  - You are about to drop the column `size_id` on the `dons` table. All the data in the column will be lost.
  - You are about to drop the column `sns_followed` on the `dons` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `dons` table. All the data in the column will be lost.
  - You are about to drop the column `yasai` on the `dons` table. All the data in the column will be lost.
  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the `adding` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `options` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `size_prices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sizes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `topping_prices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `toppings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `update_datetime` to the `dons` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `dons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `order_id` on the `dons` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "adding" DROP CONSTRAINT "adding_don_id_fkey";

-- DropForeignKey
ALTER TABLE "adding" DROP CONSTRAINT "adding_topping_id_fkey";

-- DropForeignKey
ALTER TABLE "dons" DROP CONSTRAINT "dons_order_id_fkey";

-- DropForeignKey
ALTER TABLE "dons" DROP CONSTRAINT "dons_size_id_fkey";

-- DropForeignKey
ALTER TABLE "size_prices" DROP CONSTRAINT "size_prices_size_id_fkey";

-- DropForeignKey
ALTER TABLE "topping_prices" DROP CONSTRAINT "topping_prices_topping_id_fkey";

-- AlterTable
ALTER TABLE "dons" DROP CONSTRAINT "dons_pkey",
DROP COLUMN "abura",
DROP COLUMN "created_at",
DROP COLUMN "karame",
DROP COLUMN "ninniku",
DROP COLUMN "size_id",
DROP COLUMN "sns_followed",
DROP COLUMN "updated_at",
DROP COLUMN "yasai",
ADD COLUMN     "create_datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "update_datetime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "order_id",
ADD COLUMN     "order_id" UUID NOT NULL,
ALTER COLUMN "status" SET DEFAULT 1,
ADD CONSTRAINT "dons_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "orders" DROP CONSTRAINT "orders_pkey",
DROP COLUMN "created_at",
ADD COLUMN     "create_datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "num_sns_followed" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "adding";

-- DropTable
DROP TABLE "options";

-- DropTable
DROP TABLE "size_prices";

-- DropTable
DROP TABLE "sizes";

-- DropTable
DROP TABLE "topping_prices";

-- DropTable
DROP TABLE "toppings";

-- CreateTable
CREATE TABLE "don_customizes" (
    "don_id" UUID NOT NULL,
    "customize_id" UUID NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "don_customizes_pkey" PRIMARY KEY ("don_id","customize_id")
);

-- CreateTable
CREATE TABLE "customizes" (
    "id" UUID NOT NULL,
    "label" VARCHAR NOT NULL,
    "available" BOOLEAN DEFAULT true,

    CONSTRAINT "customizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customize_prices" (
    "customize_id" UUID NOT NULL,
    "price" INTEGER NOT NULL,
    "since" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customize_prices_pkey" PRIMARY KEY ("customize_id","since")
);

-- AddForeignKey
ALTER TABLE "dons" ADD CONSTRAINT "dons_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "don_customizes" ADD CONSTRAINT "don_customizes_customize_id_fkey" FOREIGN KEY ("customize_id") REFERENCES "customizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "don_customizes" ADD CONSTRAINT "don_customizes_don_id_fkey" FOREIGN KEY ("don_id") REFERENCES "dons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customize_prices" ADD CONSTRAINT "customize_prices_customize_id_fkey" FOREIGN KEY ("customize_id") REFERENCES "customizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
