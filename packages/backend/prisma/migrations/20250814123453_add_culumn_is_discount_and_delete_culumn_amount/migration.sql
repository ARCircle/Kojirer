/*
  Warnings:

  - The primary key for the `don_customizes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amount` on the `don_customizes` table. All the data in the column will be lost.
  - The required column `id` was added to the `don_customizes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `is_discount` to the `don_customizes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "don_customizes" DROP CONSTRAINT "don_customizes_pkey",
DROP COLUMN "amount",
ADD COLUMN     "id" UUID NOT NULL,
ADD COLUMN     "is_discount" BOOLEAN NOT NULL,
ADD CONSTRAINT "don_customizes_pkey" PRIMARY KEY ("id");
